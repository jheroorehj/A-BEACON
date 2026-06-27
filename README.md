# A-BEACON

**작가의 등대가 되어주는 신진작가 큐레이션 및 AI 작품 탐색 플랫폼**

신진 예술가와 컬렉터를 연결하는 파인아트 플랫폼입니다. 자연어 기반 작품 탐색, 방 사진 AI 매칭, 작가-구매자 채팅 거래 시스템을 제공합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 작품 탐색 | 카테고리·태그 필터 + 자연어 AI 검색 |
| 방 사진 매칭 | 방 사진 업로드 시 어울리는 작품 추천 (Iamhero AI 연동) |
| 작가 지원실 | 작품 등록·수정·삭제, 프로필 관리, 자동 태그 생성 |
| 채팅 & 거래 | 구매자↔작가 실시간 메시지, 거래 상태 관리 |
| 관리자 대시보드 | 작품·작가·문의 통계 현황판 |

---

## 기술 스택

- **Frontend** — React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion
- **Backend** — Express.js (Node.js), 파일 기반 데이터 영속성 (`_server_data.json`)
- **AI** — Iamhero Flask 서버 연동 (방 사진 매칭), 규칙 기반 자연어 검색 fallback
- **폰트** — Pretendard

---

## 시작하기

### 사전 조건

- Node.js 20 이상

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env에서 필요한 값 입력

# 3. 개발 서버 실행 (프론트엔드 + 백엔드 통합)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 환경 변수

`.env.example` 참고

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `FLASK_URL` | Iamhero AI 서버 주소 | `http://localhost:5000` |
| `ALLOWED_ORIGINS` | CORS 허용 오리진 (쉼표 구분) | `http://localhost:5173,http://localhost:3000` |
| `VITE_API_BASE_URL` | 클라이언트 API 기본 URL (공란 시 상대경로) | `""` |

---

## 데모 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| 관리자 | `admin@a-beacon.art` | `admin1234` |
| 일반 컬렉터 | `user@a-beacon.art` | `user1234` |
| 작가 (김하늘) | `artist1@a-beacon.art` | `art11234` |
| 작가 (이민우) | `artist2@a-beacon.art` | `art21234` |
| 작가 (최다은) | `artist3@a-beacon.art` | `art31234` |

> 일반 회원가입도 가능합니다 (role: `user`).

---

## 프로젝트 구조

```
A-BEACON/
├── src/
│   ├── components/       # React 컴포넌트
│   │   ├── HomePage.tsx      # 랜딩 페이지
│   │   ├── LoginPage.tsx     # 로그인
│   │   ├── RegisterPage.tsx  # 회원가입
│   │   ├── BuyerExplore.tsx  # 작품 탐색 (구매자)
│   │   ├── ArtistManager.tsx # 작가 지원실
│   │   ├── ChatPage.tsx      # 채팅 & 거래
│   │   ├── DevDashboard.tsx  # 관리자 대시보드
│   │   └── Navbar.tsx        # 네비게이션
│   ├── services/
│   │   ├── api.ts        # API 클라이언트
│   │   └── auth.ts       # 인증 (Mock → 실제 인증으로 교체 가능)
│   ├── data.ts           # 초기 시드 데이터
│   ├── types.ts          # TypeScript 타입 정의
│   └── App.tsx           # 라우팅 & 전역 상태
├── server.ts             # Express 백엔드
├── public/fonts/         # Pretendard 폰트
└── _server_data.json     # 런타임 데이터 저장소 (gitignore)
```

---

## 인증 교체 가이드

현재 `src/services/auth.ts`는 localStorage 기반 Mock 인증입니다.
실제 인증 도입 시 이 파일만 교체하면 됩니다.

- `login()` → Firebase Auth / JWT 등으로 교체
- `register()` → 백엔드 회원가입 API로 교체
- `getSession()` → 토큰 검증 + 유저 정보 조회로 교체

---

## 관련 레포지터리

- [jheroorehj/iamhero](https://github.com/jheroorehj/iamhero) — 상위 프로젝트 (Iamhero AI 포함)
