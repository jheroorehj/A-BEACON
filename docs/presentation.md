# A-BEACON 서비스 소개 자료

> 신진 작가와 컬렉터를 잇는 AI 기반 아트 플랫폼

---

## 1. 서비스 소개

### 1-1. A-BEACON이란

**A-BEACON**은 아직 갤러리에 소속되지 않은 신진 작가들이 자신의 작품과 이야기를 직접 알리고, 컬렉터가 그 작품을 발견·구매할 수 있도록 연결하는 AI 기반 아트 플랫폼입니다.

> "좋은 작가는 세상이 알기 전에 먼저 발견되어야 합니다."  
> "갤러리에 들어가기 전에, 가격이 오르기 전에."

기존 미술 시장에서 신진 작가가 작품을 노출시키기 위해서는 갤러리 입점, 아트페어 참가 등 상당한 자본과 인맥이 필요했습니다. A-BEACON은 이 장벽을 낮추고, 작가가 자신의 작품과 서사를 직접 큐레이팅하여 자신을 PR할 수 있는 장을 만듭니다.

### 1-2. 타겟 사용자

| 역할 | 설명 |
|------|------|
| **작가 (Artist)** | 갤러리 미소속, 온라인 판로가 없는 신진 작가. 작품 등록, 프로필 구성, 거래 관리까지 직접 수행 |
| **컬렉터 (Collector)** | 부담 없이 신진 작가의 작품을 발견·수집하고자 하는 일반 사용자. AI 큐레이션으로 취향 기반 작품을 탐색 |

### 1-3. 핵심 가치 제안

- **작가**: 갤러리 없이 자신의 이야기와 작품을 개성 있게 소개할 수 있는 채널
- **컬렉터**: "세상이 알기 전에" 작품을 발견하는 경험 + AI가 내 공간과 감성에 맞는 작품을 추천
- **플랫폼**: 안전한 에스크로 기반 거래 구조로 양측의 신뢰 보장

---

## 2. 주요 기능

### 2-1. 컬렉터 기능

#### AI 텍스트 큐레이션
자연어로 감성, 공간, 원하는 분위기를 입력하면 AI가 작품을 추천합니다.

- "요즘 너무 지쳐있다. 조용하고 차분한 자연 풍경이 있는 그림이 필요해"
- "거실에 미니멀한 기하학적 작품 하나 두고 싶다"

#### AI 공간 매칭 (방 사진 + 기분 입력)
방 사진과 현재 기분/원하는 분위기를 함께 입력하면, 공간의 **색감·이미지·텍스트·태그**를 동시에 분석해 어울리는 작품 상위 3점을 추천합니다.

#### 공간 시뮬레이션 (Gemini AI)
추천받은 작품이 **실제 내 방 벽에 걸렸을 때의 모습**을 Gemini AI가 이미지로 생성합니다. 구매 전 공간에서 미리 확인 가능합니다.

#### 작가 갤러리
작품을 발견하듯 작가를 발견하는 탐색 경험. 각 작가의 대표 작품 이미지와 자신의 언어로 쓴 헤드라인·인용문이 에디토리얼 그리드로 배치됩니다.

#### 작품 탐색 & 위시리스트
카테고리(Painting / Sculpture / Photography / Media Art / Craft) 필터링, 작품 상세 모달, 관심 작품 저장

#### 채팅 & 거래
작품 문의 → 채팅 → 견적서 발행 → 에스크로 결제 → 배송 확인 → 잔금 정산까지 플랫폼 내에서 완결

### 2-2. 작가 기능

#### 작품 포트폴리오 관리
작품 이미지 URL 등록, 제목·설명·카테고리·태그·가격대 설정, 작품 수정/삭제

#### 작가 카드 빌더 (5가지 아키타입)
컬렉터 갤러리에 노출되는 자신만의 PR 카드를 직접 디자인합니다.

| 아키타입 | 설명 |
|----------|------|
| **Cover** | 풀블리드 이미지 + 하단 텍스트 오버레이 |
| **Editorial** | 이미지 55% / 텍스트 패널 45% 좌우 분할 |
| **Manifesto** | 굵은 타이포그래피 주도, 코너 소형 이미지 |
| **Portrait** | 이미지 30% / 인터뷰 Q&A 패널 70% |
| **Quote** | 대형 인용문 중앙 배치, 배경에 이미지 은은하게 |

각 카드는 배경색, 포인트 컬러, 텍스트 색, 헤드라인, 대표 인용문, 뱃지(학교/매체/연도)를 완전 커스텀할 수 있습니다.

#### 작가 프로필 블록 시스템
프로필 페이지를 블록 단위로 구성합니다.

| 블록 타입 | 내용 |
|-----------|------|
| `hero` | 작가 카드 전면 배치 |
| `statement` | 작가 노트 / 작업 철학 텍스트 |
| `interview` | Q&A 인터뷰 섹션 |
| `works` | 작품 그리드 (일반 / 매거진 스타일) |
| `quote_block` | 대형 인용구 배경 색상 블록 |
| `info` | 학교, 매체, 이메일 등 기본 정보 |

#### 채팅 & 거래 관리
수신된 문의 확인, 견적서 발송, 에스크로 상태 관리, 배송 정보 입력

---

## 3. 기술 구조

### 3-1. 서비스 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     사용자 브라우저                        │
│        React + TypeScript + Vite + TailwindCSS           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│           A-BEACON Express 서버  (Node.js / Port 3000)  │
│                                                         │
│  • 작품/작가 CRUD                                        │
│  • 채팅 & 견적서 & 에스크로 결제 관리                     │
│  • 사용자 인증 (세션)                                     │
│  • 룰베이스 검색 폴백                                     │
│  • Gemini API 프록시 (room-preview)                      │
│  • 데이터 영속: _server_data.json                        │
└──────────┬──────────────────────────────────────────────┘
           │ POST /api/recommend-json  │  POST /api/sync
           ▼                          ▼
┌────────────────────────────────────────────────────────┐
│       Iamhero AI 매칭 서버  (Flask / Python / Port 5001) │
│                                                        │
│  • 멀티모달 임베딩 & 코사인 유사도 기반 추천 엔진          │
│  • CLIP 이미지 임베딩                                   │
│  • E5 텍스트 임베딩                                     │
│  • KMeans 색상 추출                                     │
│  • 동적 가중치 조정 엔진                                 │
│  • 태그 매칭 & 설명 생성                                 │
└────────────────────────────────────────────────────────┘
           │
           ▼ (향후 연동 예정)
┌────────────────────────────────────────────────────────┐
│            3D 공간 재구성 파이프라인  (Python)            │
│                                                        │
│  • Apple Depth Pro (metric depth + focal length)       │
│  • Metric3D v2 ViT-Giant2 (depth + surface normals)   │
│  • 신뢰도 가중 depth fusion                             │
│  • RANSAC 평면 감지 (바닥/천장/벽)                      │
│  • Three.js 좌표계 scene.json 출력                      │
└────────────────────────────────────────────────────────┘
```

### 3-2. 시스템 아키텍처 (데이터 흐름)

```
[컬렉터] 텍스트 입력
    │
    ├─ Express /api/search ──→ localRuleBasedSearch()
    │     (Flask 미연결 시)      키워드 분해 → 태그 매칭 → 점수화
    │
    └─ Flask /api/recommend-json  (Flask 연결 시)
          ┌─────────────────────────────────────────┐
          │ 1. 텍스트 → multilingual-e5-base 임베딩 │
          │ 2. 방 사진 → CLIP ViT-B/32 임베딩       │
          │ 3. 방 사진 → KMeans 대표 색상 3개 추출   │
          │ 4. 텍스트 → 태그 프로파일 생성            │
          │ 5. 동적 가중치 결정 (쿼리 컨텍스트 분석)  │
          │ 6. 전 작품 대상 코사인 유사도 계산         │
          │ 7. 최종 점수 = w_text·S_text             │
          │              + w_img·S_img               │
          │              + w_color·S_color           │
          │              + w_tag·S_tag               │
          │ 8. 상위 3작품 + 이유 설명 반환            │
          └─────────────────────────────────────────┘
```

```
[컬렉터] 공간 시뮬레이션 요청
    │
    └─ Express /api/gemini/room-preview
          │
          ├─ 방 이미지(base64) + 작품 이미지 URL 수신
          ├─ 서버에서 작품 이미지 fetch → base64 변환
          ├─ Gemini 2.0 Flash Exp Image Generation 호출
          │    ∟ responseModalities: ["IMAGE", "TEXT"]
          │    ∟ 프롬프트: "방의 빈 벽에 작품이 실제로 걸린 모습 생성"
          └─ 생성된 이미지(base64) → 클라이언트 반환
```

### 3-3. AI 매칭 엔진 상세

#### 멀티모달 임베딩 구성

| 모달리티 | 모델 | 차원 | 역할 |
|----------|------|------|------|
| 텍스트 | `intfloat/multilingual-e5-base` | 768d | 사용자 감성·분위기 의미 추출 |
| 이미지 | `openai/clip-vit-base-patch32` | 512d | 방 사진 시각 특성 추출 |
| 색상 | KMeans (k=3) | 9d | 방의 지배색 RGB 3개 추출 |
| 태그 | 구조화 태그 사전 | — | 기분·공간·시각 요소 분류 |

#### 동적 가중치 조정 로직

기본 가중치: `text=0.45, image=0.25, tag=0.20, color=0.10`

사용자 입력 컨텍스트에 따라 가중치를 동적으로 조정합니다:

| 조건 | 조정 내용 |
|------|-----------|
| 입력 텍스트 40자 이상 | text +0.05, tag +0.05 |
| 색감 힌트 (따뜻한, 웜톤 등) | color +0.08, tag +0.02 |
| 기분 힌트 (차분, 편안 등) | tag +0.08, text +0.02 |
| 공간 힌트 (거실, 침실 등) | image +0.05, tag +0.03 |
| 시각 세부 힌트 (질감, 붓터치 등) | tag +0.06, text +0.03 |

조정 후 전체 합계로 정규화. 최솟값 0.05 보장.

#### 태그 스코어링

구조화 태그 매칭(70%)과 레거시 벡터 코사인(30%)을 혼합:

```
tag_score = 0.70 × structured_score + 0.30 × cosine(buyer_tag_vec, art_tag_vec)
            (매칭 태그 존재 시)
           = cosine(buyer_tag_vec, art_tag_vec)
            (매칭 없을 시 fallback)
```

태그 카테고리: 분위기, 공간, 시각 세부 요소, 피사체, 기법, 색감 등

#### 작품 벡터화 (DB 구성)

Flask 서버 기동 시 또는 `/api/sync` 요청 시 각 작품에 대해:

```python
artwork_vector = normalize(concat([
    text_vector,    # E5: 작품 설명 임베딩
    image_vector,   # CLIP: 작품 이미지 임베딩
    color_vector    # KMeans: 작품 지배색 / 255.0
]))
```

### 3-4. 프론트엔드 아키텍처

```
src/
├── App.tsx               # 라우팅, 전역 상태 (artworks, artists, session)
├── types.ts              # 전체 타입 정의
├── services/
│   └── api.ts            # REST API 클라이언트 (artworksApi, artistsApi,
│                         #   searchApi, inquiriesApi, roomMatchApi, geminiApi)
└── components/
    ├── HomePage.tsx       # 랜딩 페이지 (스냅스크롤 섹션)
    ├── BuyerExplore.tsx   # 컬렉터 탐색 (카탈로그 / 위시리스트 / 작가갤러리)
    ├── ArtistManager.tsx  # 작가 관리 (포트폴리오 / 카드빌더 / 채팅)
    ├── ArtistCardRender.tsx # 5가지 카드 아키타입 렌더러 (공유 컴포넌트)
    ├── ArtistProfile.tsx  # 작가 프로필 팝업 모달
    ├── ChatPage.tsx       # 채팅 & 거래 관리
    ├── LoginPage.tsx      # 로그인
    ├── RegisterPage.tsx   # 회원가입
    ├── Navbar.tsx         # 상단 네비게이션
    ├── Logo.tsx           # 로고 컴포넌트
    └── DevDashboard.tsx   # 관리자 대시보드
```

### 3-5. 핵심 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/artworks` | 전체 작품 목록 |
| POST | `/api/artworks` | 작품 등록 |
| PUT | `/api/artworks/:id` | 작품 수정 |
| DELETE | `/api/artworks/:id` | 작품 삭제 |
| GET | `/api/artists` | 전체 작가 목록 |
| GET/PUT | `/api/artists/:id` | 작가 프로필 조회/수정 |
| POST | `/api/search` | AI 텍스트 검색 |
| POST | `/api/room-match` | 방 사진 + 텍스트 AI 매칭 |
| POST | `/api/gemini/room-preview` | 공간 시뮬레이션 이미지 생성 |
| POST | `/api/inquiries` | 작품 문의 생성 |
| PUT | `/api/inquiries/:id/status` | 거래 상태 변경 |
| GET | `/api/chat/rooms` | 채팅방 목록 |
| POST | `/api/chat/:id/messages` | 메시지 전송 |
| PUT | `/api/chat/:id/messages/:msgId/estimate` | 견적서 수락/거절 |
| POST | `/api/payments` | 에스크로 결제 생성 |
| PUT | `/api/payments/:id/ship` | 배송 등록 |
| PUT | `/api/payments/:id/confirm` | 수령 확인 + 잔금 결제 |
| GET | `/api/admin/stats` | 관리자 통계 |

### 3-6. 거래 & 에스크로 흐름

```
문의 생성 (채팅방 자동 개설)
    │
    ├─ 채팅으로 협의
    │
    ▼
견적서 발송 (작가)
    │
    ├─ 견적 수락 (컬렉터)  또는  거절 → 재협의
    │
    ▼
에스크로 계약금 결제 (컬렉터)
    │  → 상태: deposit_held (계약금 보관 중)
    ▼
작품 발송 (작가)
    │  → 운송사, 송장번호 입력
    │  → 상태: shipped
    ▼
수령 확인 + 잔금 결제 (컬렉터)
    │  → 상태: released (전액 지급 완료)
    ▼
거래 완료
```

에스크로 상태 4단계: `deposit_held` → `shipped` → `released` / `refunded`

### 3-7. 데이터 모델 주요 구조

#### Artwork
```typescript
{
  id, title, artistId, artistName,
  image,          // 이미지 URL
  description,    // 작품 설명
  category,       // "Painting" | "Sculpture" | "Photography" | "Media Art" | "Craft"
  tags: string[],
  year, medium, dimensions, priceRange
}
```

#### Artist
```typescript
{
  id, name, avatar, bio, email,
  keywords: string[],
  interviewQuestions: { question, answer }[],
  card?: ArtistCard,           // 갤러리 노출 카드 설정
  profileBlocks?: ProfileBlock[] // 프로필 페이지 블록 구성
}
```

#### ArtistCard
```typescript
{
  archetype: "cover" | "editorial" | "manifesto" | "portrait" | "quote",
  image, headline, quote,
  bgColor, accentColor, textColor: "white" | "black",
  showBadges: { school, medium, year }
}
```

#### PaymentRecord (에스크로)
```typescript
{
  id, inquiryId, estimateNo,
  totalPrice, depositRate, depositAmount, finalAmount,
  escrowStatus: "deposit_held" | "shipped" | "released" | "refunded",
  trackingNumber, carrier,
  depositPaidAt, shippedAt, deliveredConfirmedAt, releasedAt
}
```

---

## 4. 기대 효과

### 4-1. 작가 관점

- **진입 장벽 제거**: 갤러리 없이 작품과 서사를 직접 큐레이팅하고 노출
- **안전한 거래**: 에스크로 구조로 미수금 리스크 없는 첫 거래 경험
- **자기 PR 통제권**: 카드 아키타입, 프로필 블록으로 자신의 브랜드 이미지를 직접 설계
- **컬렉터 직접 연결**: 중개 갤러리 수수료 없이 컬렉터와 1:1 채팅 가능

### 4-2. 컬렉터 관점

- **발견의 경험**: 작품을 발견하듯 작가를 발견 — "세상이 알기 전에 먼저"
- **AI 큐레이션**: 자연어와 공간 사진만으로 내 취향에 맞는 작품 추천
- **구매 결정 보조**: 공간 시뮬레이션으로 내 방에 작품이 걸린 모습을 미리 확인
- **신뢰 보장**: 에스크로 결제로 수령 전 작가에게 전액이 지급되지 않음

### 4-3. 시장 관점

- 기존 갤러리 중심 미술 시장에서 소외된 신진 작가 시장의 디지털화
- 텍스트·이미지·색상·태그 4개 모달리티 융합으로 기존 키워드 검색 대비 매칭 정확도 향상
- 공간 시뮬레이션으로 온라인 아트 구매의 가장 큰 심리적 장벽("실제로 어떻게 보일까?") 해소

---

## 5. 현재 한계

### 5-1. 기술적 한계

| 항목 | 현황 | 영향 |
|------|------|------|
| **데이터 영속성** | `_server_data.json` 단일 파일 | 서버 재시작 시 동기화 의존, 동시성 미지원 |
| **인증 시스템** | 세션 기반 경량 인증 | OAuth, JWT 등 프로덕션급 인증 미적용 |
| **AI 서버 의존성** | Flask AI 서버 미실행 시 룰베이스 폴백 | 멀티모달 추천 비활성화 |
| **CLIP 이미지 임베딩** | 방 사진 → 작품 이미지 직접 비교 | 방과 작품의 도메인 갭(domain gap) 존재 |
| **공간 시뮬레이션** | Gemini API 생성형 이미지 의존 | 작품 배치 위치·비율 정확도 보장 불가 |
| **벡터 DB** | 인메모리 + JSON 기반 | 작품 수 증가 시 검색 성능 저하 |

### 5-2. 서비스 한계

- 작가 검증 체계 없음 (누구나 작가로 가입 가능)
- 실제 결제 연동 미구현 (에스크로 UI만 구현, 실 PG 연결 없음)
- 배송 추적 자동화 미구현 (송장 번호 수동 입력)
- 모바일 최적화 일부 미완성

---

## 6. 향후 계획

### Phase 1 — 인프라 강화 (단기)

- PostgreSQL 또는 MongoDB 도입으로 데이터 영속성 고도화
- JWT + Refresh Token 기반 인증 시스템 도입
- 작품 이미지 S3/CDN 업로드 파이프라인 구축
- 실 PG 연동 (토스페이먼츠 등) 에스크로 결제 완성

### Phase 2 — AI 고도화 (중기)

- CLIP 이미지 임베딩을 **도메인 파인튜닝**된 아트 특화 모델로 교체
- Pinecone / Qdrant 등 **전용 벡터 DB** 도입으로 검색 속도 개선
- 컬렉터 행동 이력(조회, 위시리스트, 문의)을 반영한 **개인화 추천** 모델
- 다중 작품 동시 비교 공간 시뮬레이션

### Phase 3 — 2D → 3D 공간 배치 (핵심 미래 기술)

이미 파이프라인 프로토타입이 구현되어 있으며, 서비스 통합이 목표입니다.

#### 구현된 3D 파이프라인 (`backend/`)

```
방 사진 1장 입력
    │
    ├─ Step 1: Apple Depth Pro (apple/DepthPro-hf)
    │           → 픽셀별 metric depth(m) + focal length(px) 추정
    │
    ├─ Step 2: Metric3D v2 ViT-Giant2 (YvanYin/Metric3D)
    │           → metric depth(m) + surface normal(카메라 공간) 추정
    │
    ├─ Step 3: Depth Fusion
    │           → 두 모델 신뢰도 가중 블렌드 (Depth Pro 60% + Metric3D 40%)
    │           → 두 모델 차이 0.5m 이상 픽셀: Depth Pro 단독 사용
    │
    ├─ Step 4: 포인트 클라우드 생성 (Three.js 좌표계)
    │
    ├─ Step 5: 픽셀 분류 (서피스 노말 기반)
    │           → floor  (ny > cos20° ≈ 0.94)
    │           → ceiling(ny < -cos20°)
    │           → wall   (|ny| < cos70° ≈ 0.34)
    │
    ├─ Step 6: RANSAC per class + DBSCAN wall clustering
    │           → 각 면(바닥/천장/벽)의 평면 방정식 피팅
    │
    ├─ Step 7: 평면 코너 포인트 추출
    │
    └─ Step 8: scene.json 출력
                → 이미지 크기, 초점 거리, 각 평면 타입·신뢰도·코너 좌표 포함
```

#### 계획 중인 서비스 통합 — 작품 직접 배치 (AR-like)

```
사용자가 찍은 방 사진 업로드
    │
    ▼
3D 파이프라인 실행 → scene.json (벽면 위치·크기·법선 벡터)
    │
    ▼
Three.js 웹 뷰어에서 인터랙티브 배치
    ├─ 감지된 벽면에 작품 텍스처 자동 투영
    ├─ 드래그로 위치 이동
    ├─ 핀치/슬라이더로 크기 조절
    └─ 조명 방향에 따른 그림자·반사 시뮬레이션
    │
    ▼
"이 위치에 구매하기" → 바로 문의 & 거래 연결
```

이 기능은 **Gemini AI의 생성형 이미지 방식**(현재)과는 달리, 사용자가 원하는 위치에 직접 작품을 배치하고 실시간으로 확인하는 **인터랙티브 공간 배치**를 목표로 합니다.

현재 구현 완료된 기술 요소:
- `apple/DepthPro-hf` 기반 metric depth 추정 ✓
- `Metric3D v2 ViT-Giant2` 기반 depth + surface normal ✓
- 신뢰도 가중 depth fusion ✓
- RANSAC + DBSCAN 평면 감지 ✓
- Three.js 좌표계 scene.json 내보내기 ✓

남은 작업:
- Three.js 인터랙티브 뷰어 개발
- 작품 텍스처 투영 (호모그래피 기반)
- 3D Gaussian Splatting을 활용한 고품질 장면 재구성 (연구 단계)
- A-BEACON 프론트엔드 통합

---

## 7. 기술 스택 요약

| 레이어 | 기술 |
|--------|------|
| **프론트엔드** | React 18, TypeScript, Vite, TailwindCSS |
| **백엔드** | Node.js, Express, TypeScript |
| **AI 서버** | Python, Flask, Flask-CORS |
| **텍스트 임베딩** | `intfloat/multilingual-e5-base` (SentenceTransformer) |
| **이미지 임베딩** | `openai/clip-vit-base-patch32` (HuggingFace Transformers) |
| **색상 분석** | scikit-learn KMeans, OpenCV |
| **Depth 추정** | `apple/DepthPro-hf`, Metric3D v2 ViT-Giant2 |
| **생성형 AI** | Gemini 2.0 Flash Exp Image Generation |
| **데이터 저장** | JSON 파일 기반 (개발), PostgreSQL/MongoDB (예정) |
| **배포 환경** | 로컬 개발 (Port 3000), Cloud Run (예정) |
