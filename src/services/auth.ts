/**
 * A-BEACON 인증 서비스 (Mock)
 *
 * 실제 백엔드 인증 도입 시 이 파일만 교체하면 된다.
 * - login()    → Firebase Auth / NextAuth / JWT 등으로 교체
 * - register() → 백엔드 회원가입 API로 교체
 * - logout()   → 해당 서비스의 signOut 호출로 교체
 * - getSession() → 토큰 검증 + 유저 정보 조회로 교체
 */

import type { UserSession } from "../types";

const SESSION_KEY = "beacon_session";
const USERS_KEY = "beacon_users";

// ─── Mock 계정 DB (고정 시드) ─────────────────────────────────────────────────

interface MockUser {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  role: "admin" | "artist" | "user";
  artistId?: string;
}

/** 로컬스토리지에 저장되는 가입 유저 형태 — 일반 회원가입은 항상 "user" role */
interface StoredUser {
  uid: string;
  email: string;
  /** btoa로 인코딩된 비밀번호 — 실제 인증 도입 시 서버측 해싱으로 교체 */
  passwordHash: string;
  displayName: string;
  role: "user";
  createdAt: string;
}

export const MOCK_USERS: MockUser[] = [
  // ── 관리자 ──────────────────────────────────────────────────────────────────
  {
    uid: "admin_001",
    email: "admin@a-beacon.art",
    password: "admin1234",
    displayName: "플랫폼 관리자",
    role: "admin",
  },
  // ── 일반 고객 (컬렉터) ───────────────────────────────────────────────────────
  {
    uid: "user_001",
    email: "user@a-beacon.art",
    password: "user1234",
    displayName: "이용자",
    role: "user",
    // artistId 없음 — 순수 컬렉터 계정
  },
  // ── 작가 계정 (심사 통과, 고객 + 작가 기능 모두 접근 가능) ────────────────────
  {
    uid: "artist_001",
    email: "artist1@a-beacon.art",
    password: "art11234",
    displayName: "김하늘",
    role: "artist",
    artistId: "artist_1",
  },
  {
    uid: "artist_002",
    email: "artist2@a-beacon.art",
    password: "art21234",
    displayName: "이민우",
    role: "artist",
    artistId: "artist_2",
  },
  {
    uid: "artist_003",
    email: "artist3@a-beacon.art",
    password: "art31234",
    displayName: "최다은",
    role: "artist",
    artistId: "artist_3",
  },
];

// ─── 로컬스토리지 유저 헬퍼 ────────────────────────────────────────────────────

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

// ─── Auth 함수 ────────────────────────────────────────────────────────────────

/** 이메일 + 비밀번호 로그인. 실패 시 에러를 throw */
export function login(email: string, password: string): UserSession {
  const emailLower = email.toLowerCase().trim();

  // 1. 고정 Mock 계정 확인
  const mockUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === emailLower && u.password === password
  );
  if (mockUser) {
    const session: UserSession = {
      uid: mockUser.uid,
      email: mockUser.email,
      displayName: mockUser.displayName,
      role: mockUser.role,
      artistId: mockUser.artistId,
    };
    persistSession(session);
    return session;
  }

  // 2. 가입된 유저 확인
  const storedUsers = getStoredUsers();
  const storedUser = storedUsers.find(
    (u) => u.email.toLowerCase() === emailLower && u.passwordHash === btoa(password)
  );
  if (storedUser) {
    const session: UserSession = {
      uid: storedUser.uid,
      email: storedUser.email,
      displayName: storedUser.displayName,
      role: storedUser.role,
      // 일반 가입 유저는 artistId 없음
    };
    persistSession(session);
    return session;
  }

  throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
}

/** 회원가입. 일반 가입은 항상 "user" role — 작가 등록은 별도 심사 필요 */
export function register(email: string, password: string, displayName: string): UserSession {
  const emailLower = email.toLowerCase().trim();

  // 중복 이메일 체크 (mock + 저장된 유저)
  if (MOCK_USERS.some((u) => u.email.toLowerCase() === emailLower)) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }
  const storedUsers = getStoredUsers();
  if (storedUsers.some((u) => u.email.toLowerCase() === emailLower)) {
    throw new Error("이미 사용 중인 이메일입니다.");
  }

  const uid = `user_${Date.now()}`;

  const newUser: StoredUser = {
    uid,
    email: emailLower,
    passwordHash: btoa(password),
    displayName: displayName.trim(),
    role: "user",
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...storedUsers, newUser]);

  const session: UserSession = {
    uid,
    email: emailLower,
    displayName: displayName.trim(),
    role: "user",
  };
  persistSession(session);
  return session;
}

/** 로그아웃 – 세션 삭제 */
export function logout(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/** 저장된 세션 복원. 없거나 손상된 경우 null 반환 */
export function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserSession;
    if (!parsed.uid || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}
