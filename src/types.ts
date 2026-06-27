/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ArtCategory = "Painting" | "Sculpture" | "Photography" | "Media Art" | "Craft";

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  image: string;
  description: string;
  category: ArtCategory;
  tags: string[];
  year: number | string;
  medium: string;
  dimensions: string;
  priceRange: string;
  featured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  keywords: string[];
  interviewQuestions: { question: string; answer: string }[];
  email: string;
}

export type TradeStatus = "문의중" | "거래중" | "거래완료" | "취소";

export interface UserInquiry {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImage?: string;
  artistId: string;
  artistName: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  status: TradeStatus;
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface ChatMessage {
  id: string;
  inquiryId: string;
  senderEmail: string;
  senderName: string;
  senderRole: "artist" | "buyer" | "system";
  content: string;
  sentAt: string;
  /** "system": 거래 상태 변경 등 자동 생성 이벤트 메시지 */
  messageType?: "text" | "system";
}

export interface AISearchResult {
  tags: string[];
  matchedArtworkIds: string[];
  explanations: { [artworkId: string]: string };
}

// ─── 인증 & 세션 ──────────────────────────────────────────────────────────────

/**
 * 로그인 사용자 세션
 * - role 'admin': 개발자/관리자 대시보드만 접근
 * - role 'user' : 작가 모드 / 고객 모드 전환 가능
 */
export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "artist" | "user";
  /** artist role일 경우 연결된 작가 프로필 ID */
  artistId?: string;
}

// ─── 백엔드 연동을 위한 확장 타입 ────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface AdminStats {
  totalArtworks: number;
  totalArtists: number;
  totalInquiries: number;
  categoryCounts: Record<ArtCategory, number>;
}

export interface AppError {
  message: string;
  code?: string | number;
}
