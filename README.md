# A-BEACON

**작가의 등대가 되어주는 신진작가 큐레이션 및 AI 작품 탐색 플랫폼**

신진 예술가와 컬렉터를 연결하는 파인아트 플랫폼입니다. 자연어 기반 작품 탐색, 방 사진 AI 매칭, 작가-구매자 채팅 거래 시스템을 제공합니다.

---

## 아키텍처

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│   React Frontend (Vite)     │       │   Flask AI Server (port 5000) │
│   + Express Backend         │──────▶│   CLIP + Sentence-Transformers│
│   (Node.js, port 3000)      │◀──────│   멀티모달 추천 엔진          │
└─────────────────────────────┘       └──────────────────────────────┘
         서버 시작 시 /api/sync           방 사진 추천 /api/recommend-json
```

Express 서버가 시작될 때 Flask에 작품 목록을 자동 동기화하며, 방 사진 매칭 요청은 Flask 추천 엔진으로 프록시됩니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 작품 탐색 | 카테고리·태그 필터 + 자연어 규칙 기반 검색 |
| 방 사진 AI 매칭 | 방 사진 업로드 시 CLIP·색상·텍스트 점수 융합 추천 |
| 작가 지원실 | 작품 등록·수정·삭제, 프로필 관리, 자동 태그 생성 |
| 채팅 & 거래 | 구매자↔작가 실시간 메시지, 거래 상태 관리 |
| 관리자 대시보드 | 작품·작가·문의 통계 현황판 |

---

## 기술 스택

### Node.js 서버 (Express + React)
- **Frontend** — React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion
- **Backend** — Express.js, 파일 기반 데이터 영속성 (`_server_data.json`)
- **폰트** — Pretendard

### Flask AI 서버
- **프레임워크** — Flask 3, flask-cors
- **임베딩** — CLIP (이미지), sentence-transformers (텍스트)
- **추천 엔진** — 텍스트 60% + 이미지 30% + 색상 10% 코사인 유사도 융합
- **이미지 처리** — OpenCV, Pillow
- **ML** — PyTorch, scikit-learn, numpy

---

## 시작하기

### 사전 조건
- Node.js 20 이상
- Python 3.10 이상

### 1. Node.js 서버 (필수)

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행 (프론트 + 백엔드 통합)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 2. Flask AI 서버 (방 사진 매칭 기능 사용 시)

```bash
cd flask_server

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 의존성 설치 (PyTorch 포함, 수 분 소요)
pip install -r requirements.txt

# 서버 실행
python app_web.py
```

`http://localhost:5000` 에서 Flask 관리 대시보드 접속 가능.
Flask가 실행 중이지 않아도 Node.js 서버는 정상 동작합니다 (방 사진 기능만 비활성화).

### 프로덕션 빌드 (Node.js)

```bash
npm run build
npm start
```

---

## 환경 변수

`.env.example` 참고

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `FLASK_URL` | Flask AI 서버 주소 | `http://localhost:5000` |
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
│   ├── components/           # React 컴포넌트
│   │   ├── HomePage.tsx          # 랜딩 페이지
│   │   ├── LoginPage.tsx         # 로그인
│   │   ├── RegisterPage.tsx      # 회원가입
│   │   ├── BuyerExplore.tsx      # 작품 탐색 (구매자)
│   │   ├── ArtistManager.tsx     # 작가 지원실
│   │   ├── ChatPage.tsx          # 채팅 & 거래
│   │   ├── DevDashboard.tsx      # 관리자 대시보드
│   │   └── Navbar.tsx            # 네비게이션
│   ├── services/
│   │   ├── api.ts            # API 클라이언트
│   │   └── auth.ts           # 인증 (Mock → 실제 인증으로 교체 가능)
│   ├── data.ts               # 초기 시드 데이터
│   ├── types.ts              # TypeScript 타입 정의
│   └── App.tsx               # 라우팅 & 전역 상태
├── flask_server/
│   ├── app_web.py            # Flask 진입점 & API 라우트
│   ├── recommendation_engine.py  # 멀티모달 추천 엔진 (텍스트+이미지+색상)
│   ├── artwork_store.py      # 작품 CRUD & JSON 영속성
│   ├── artwork_profile.py    # 작품 임베딩 프로파일 빌더
│   ├── buyer_profile.py      # 구매자 프로파일 빌더
│   ├── clip_embedding.py     # CLIP 이미지 임베딩
│   ├── multimodal_embedding.py   # 멀티모달 임베딩 통합
│   ├── embedding.py          # 텍스트 임베딩 (sentence-transformers)
│   ├── color_match.py        # OpenCV 색상 분석
│   ├── explanation_engine.py # 추천 이유 생성
│   ├── vector_db.py          # 벡터 DB 빌드
│   ├── recommend_logs.py     # 추천 로그 관리
│   └── requirements.txt      # Python 의존성
├── server.ts                 # Express 백엔드
├── public/fonts/             # Pretendard 폰트
└── _server_data.json         # 런타임 데이터 저장소 (gitignore)
```

---

## Flask AI 서버 API

| 엔드포인트 | 메서드 | 설명 |
|------------|--------|------|
| `/api/sync` | POST | A-BEACON 작품 목록 수신 & 벡터화 등록 |
| `/api/recommend-json` | POST | 방 사진 + 텍스트 → 상위 3개 작품 추천 |
| `/api/health` | GET | 서버 상태 및 등록 작품 수 확인 |
| `/` | GET | 작품 관리 웹 UI |
| `/dashboard` | GET | 추천 통계 대시보드 |

---

## 인증 교체 가이드

현재 `src/services/auth.ts`는 localStorage 기반 Mock 인증입니다.
실제 인증 도입 시 이 파일만 교체하면 됩니다.

- `login()` → Firebase Auth / JWT 등으로 교체
- `register()` → 백엔드 회원가입 API로 교체
- `getSession()` → 토큰 검증 + 유저 정보 조회로 교체

---

## 관련 레포지터리

- [jheroorehj/iamhero](https://github.com/jheroorehj/iamhero) — 상위 프로젝트
