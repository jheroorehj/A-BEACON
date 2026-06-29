/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artist, Artwork } from "./types";

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: "artist_1",
    name: "김하늘 (Kim Ha-neul)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "강원대학교 서양화과 3학년에 재학 중인 화가 지망생입니다. 고향 춘천의 하늘, 호수, 계절의 변화에서 영감을 받아 풍경화를 그립니다. 아직 개인전 경험은 없지만 A-BEACON을 통해 처음으로 작품을 세상에 선보이고 있습니다. 언젠가 내 그림 한 장이 누군가의 일상을 위로하는 날을 꿈꿉니다.",
    keywords: ["따뜻한", "풍경", "서정", "자연", "하늘", "회화", "유화"],
    interviewQuestions: [
      {
        question: "그림을 시작하게 된 계기가 무엇인가요?",
        answer: "중학교 미술 시간에 처음으로 캔버스에 물감을 얹었을 때 느꼈던 그 두근거림이 아직도 생생합니다. 고향 춘천의 넓은 하늘을 담고 싶어서 붓을 잡게 됐어요. 지금도 가장 좋아하는 소재는 구름이에요."
      },
      {
        question: "학생 신분으로 작품을 판매하는 게 어색하지 않나요?",
        answer: "처음엔 부끄럽기도 했어요. 그런데 교수님이 '작품의 가치는 경력이 아니라 진심에서 온다'고 하셨어요. 제 그림이 누군가의 공간에서 작은 위로가 된다면 그것만으로도 충분합니다."
      }
    ],
    email: "sky_h_kim@gmail.com"
  },
  {
    id: "artist_2",
    name: "이민우 (Lee Min-woo)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "홍익대학교 조소과 석사과정 1년차입니다. 산업 폐자재와 금속 용접을 통해 유기체의 형태를 실험적으로 탐구합니다. 석사 논문 주제인 '도시 물성의 생태적 재해석'을 바탕으로 첫 개인전을 준비 중입니다. 버려진 고철 속에서 살아있는 생명체의 형상을 찾아냅니다.",
    keywords: ["금속", "용접", "유기체", "생태", "실험적", "조소", "설치"],
    interviewQuestions: [
      {
        question: "쓰다 버린 철재를 예술로 만드는 작업, 어디서 영감을 얻나요?",
        answer: "학교 앞 고물상을 지나다가 버려진 철근들이 햇빛에 반사되는 걸 봤어요. 그 순간 이 '죽은' 재료들이 살아있는 생명체의 세포처럼 보였어요. 박테리아, 아메바 같은 미시 세계의 유기체들이 제 조각의 출발점입니다."
      },
      {
        question: "석사생으로서 작품을 판매하는 경험은 어떤가요?",
        answer: "솔직히 말하면 생활비에도 도움이 되고요(웃음). 무엇보다 작품이 실제로 누군가에게 가는 경험 자체가 창작의 동력이 됩니다. 교수님 피드백보다 구매자 분들의 반응이 더 솔직하거든요."
      }
    ],
    email: "minwoo_lee_art@naver.com"
  },
  {
    id: "artist_3",
    name: "최다은 (Choi Da-eun)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "계원예술대학교 사진과를 갓 졸업한 신인 사진작가입니다. 졸업 후 1년째 반지하 작업실에서 혼자 필름을 현상하며 작업 중입니다. 밤의 도시와 빛의 잔상을 주로 담으며, 아직 공모전 수상 경력은 없지만 자신만의 감각을 조금씩 다듬어가고 있습니다.",
    keywords: ["필름", "야경", "빛", "몽환", "도시", "사진", "흑백"],
    interviewQuestions: [
      {
        question: "졸업 후 바로 독립 작업을 선택한 이유는?",
        answer: "보조 작가 자리가 있었는데, 다른 사람의 스타일을 따라가다 보면 제 눈이 흐려질 것 같았어요. 당장 돈이 안 되더라도 내 방식으로 1년을 버텨보자고 결심했습니다. 아직도 버티는 중이에요(웃음)."
      },
      {
        question: "필름 사진을 고집하는 이유가 있나요?",
        answer: "실수할 수 없다는 긴장감이요. 셔터를 누르기 전에 정말 많이 생각하게 돼요. 그 신중함이 사진에 남는다고 믿습니다. 디지털은 수백 장 찍고 고르지만 필름은 그 순간에 집중하게 만들어요."
      }
    ],
    email: "da_eun_photo@daum.net"
  },
  {
    id: "artist_4",
    name: "박지훈 (Park Ji-hoon)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "서울과학기술대학교 디자인학과를 졸업하고 혼자 미디어아트를 독학 중인 신인 작가입니다. 낮에는 웹 퍼블리셔로 일하며 밤에는 코드로 예술을 만듭니다. 알고리즘이 만들어내는 우연한 아름다움에 매료되어 있으며, 생성 예술의 가능성을 탐구하고 있습니다.",
    keywords: ["디지털", "알고리즘", "코딩", "생성예술", "추상", "색채", "미디어"],
    interviewQuestions: [
      {
        question: "낮에 일하면서 밤에 예술 작업을 하는 게 힘들지 않나요?",
        answer: "힘들죠. 근데 회사 일로 지쳐서 집에 와서 코드 한 줄 짜다 보면 뭔가 풀리는 느낌이에요. 낮의 스트레스가 오히려 작업의 연료가 되는 것 같습니다. 그래서 그런지 작품들이 좀 어둡고 날카롭다는 말을 많이 들어요."
      },
      {
        question: "미술 전공이 아닌데 예술가로 불리는 게 어색하지 않나요?",
        answer: "처음엔 어색했어요. 근데 코드도 붓이고, 화면도 캔버스잖아요. 오히려 '아트를 모르는' 시각이 제 작품에 신선함을 준다고 믿고 싶어요."
      }
    ],
    email: "jihoon_codes_art@gmail.com"
  },
  {
    id: "artist_5",
    name: "정서우 (Jung Seo-woo)",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    bio: "강원대학교 공예학과 석사과정 1년차입니다. 흙과 실, 금속 등 전통 공예 재료를 현대적 조형 언어로 재해석하는 작업을 합니다. 소형 오브제부터 대형 설치 조각까지 넘나들며 '살아있는 것의 촉감'을 만드는 일에 집중하고 있습니다.",
    keywords: ["공예", "설치", "오브제", "혼합재료", "동물", "실", "실험"],
    interviewQuestions: [
      {
        question: "도예에서 시작해 대형 설치 조각까지, 작업 영역이 넓어진 계기가 있나요?",
        answer: "석사 첫 학기에 지도 교수님이 '재료가 너를 가두게 하지 마라'고 하셨어요. 그 한마디에 흙 밖으로 나가보기로 했습니다. 지금은 털실, 금속 와이어, 비닐까지 뭐든 써요. 결국 제가 하고 싶은 건 '살아있는 것의 촉감'을 만드는 거니까요."
      },
      {
        question: "흰 털로 만든 코뿔소 같은 작품은 어떻게 구상하게 됐나요?",
        answer: "멸종위기 동물 다큐멘터리를 보다가 흰코뿔소 이야기에 한참을 울었어요. 그 이후로 이 동물들을 기억하는 작품을 만들고 싶었습니다. 털은 부드럽지만 그 속에 철재 뼈대가 있어요. 연약함과 강인함을 같이 담고 싶었거든요."
      }
    ],
    email: "seowoo_earth_art@gmail.com"
  }
];

export const INITIAL_ARTWORKS: Artwork[] = [
  // ── 회화 (Painting) ── artist_1 김하늘 ─────────────────────────────
  {
    id: "art_1",
    title: "물탑이 있는 여름 낮",
    artistId: "artist_1",
    artistName: "김하늘 (Kim Ha-neul)",
    image: "/photos/KakaoTalk_20260629_104428985_04.jpg",
    description: "고향 마을 언덕 위의 체커보드 무늬 급수탑을 배경으로 뭉게구름이 피어오르는 여름 한낮을 담았습니다. 화면 상단에 등장하는 수국 화분은 실제 창문 밖 화분을 그려 넣은 것으로, 일상과 풍경이 겹쳐지는 순간을 포착했습니다.",
    category: "Painting",
    tags: ["풍경화", "여름", "구름", "서정", "따뜻한", "하늘색"],
    year: 2025,
    medium: "Acrylic on Canvas",
    dimensions: "72.7 x 90.9 cm (30호)",
    priceRange: "₩1,200,000",
    featured: true,
  },
  {
    id: "art_2",
    title: "별빛 아래의 교감",
    artistId: "artist_1",
    artistName: "김하늘 (Kim Ha-neul)",
    image: "/photos/KakaoTalk_20260629_104428985_05.png",
    description: "별자리가 빛나는 밤하늘 아래 두 존재가 마주보며 무언가를 나누는 장면을 원형 구도로 담았습니다. 황금빛 광원에서 번져 나오는 입자들이 두 인물 주위를 감싸며 연결과 온기의 감각을 시각적으로 표현했습니다.",
    category: "Painting",
    tags: ["밤하늘", "별빛", "황금색", "따뜻한", "신비", "원형구도"],
    year: 2026,
    medium: "Acrylic on Canvas (Circle)",
    dimensions: "지름 80 cm",
    priceRange: "₩980,000",
  },
  {
    id: "art_3",
    title: "고요한 아침의 푸른 흔적",
    artistId: "artist_1",
    artistName: "김하늘 (Kim Ha-neul)",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80",
    description: "새벽안개 속에 흐려지는 깊은 산자락과 첫 이슬에 젖은 푸른 들판의 대기를 추상화했습니다. 겹겹이 쌓아 올린 하늘색 아크릴 위로 얇은 유화 오일을 덧발라 신비로운 아침의 공간감을 연출했습니다.",
    category: "Painting",
    tags: ["차분한", "푸른색", "아침안개", "풍경화", "치유", "자연"],
    year: 2026,
    medium: "Acrylic and Oil on Canvas",
    dimensions: "60.6 x 60.6 cm",
    priceRange: "₩850,000",
  },
  {
    id: "art_4",
    title: "노을빛 온기가 머무는 해안",
    artistId: "artist_1",
    artistName: "김하늘 (Kim Ha-neul)",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    description: "해가 질 무렵 바다 위에 번지는 짙은 감홍색과 부드러운 분홍빛 노을의 찬란한 순간을 그렸습니다. 두터운 나이프 터치로 파도의 거친 흰 포말을 입체적으로 강조하여 바다의 숨결이 손끝에 닿을 듯합니다.",
    category: "Painting",
    tags: ["따뜻한", "바다", "노을", "임파스토", "풍경화", "분홍"],
    year: 2025,
    medium: "Oil on Canvas",
    dimensions: "90.9 x 72.7 cm (30호)",
    priceRange: "₩1,400,000",
  },
  // ── 조소 (Sculpture) ── artist_2 이민우 ─────────────────────────────
  {
    id: "art_5",
    title: "박테리아 (클로즈업)",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985.jpg",
    description: "폐철재와 용접봉으로 미생물 박테리아의 내부 구조를 클로즈업으로 재현한 작품입니다. 철의 산화와 용접 열기가 빚어낸 무지갯빛 발색이 생물학적 세포막의 이리데센스를 연상시킵니다.",
    category: "Sculpture",
    tags: ["금속", "용접", "유기체", "미생물", "텍스처", "산화"],
    year: 2025,
    medium: "Welded Steel, Iron",
    dimensions: "40 x 40 cm (벽면 부조)",
    priceRange: "₩1,800,000",
    featured: true,
  },
  {
    id: "art_6",
    title: "부유하는 원들 (디테일)",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_01.jpg",
    description: "스테인리스 와이어를 구부려 크고 작은 타원형 고리들을 무한히 연결한 벽면 설치 작품의 세부 장면입니다. 빛에 따라 달라지는 그림자가 벽면에 또 다른 드로잉을 만들어냅니다.",
    category: "Sculpture",
    tags: ["와이어", "원형", "빛", "그림자", "미니멀", "설치"],
    year: 2026,
    medium: "Stainless Steel Wire",
    dimensions: "가변 설치 (약 80 x 100 cm)",
    priceRange: "₩2,200,000",
  },
  {
    id: "art_7",
    title: "박테리아 / Bacteria",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_02.jpg",
    description: "도시에서 수거한 폐철근과 고철판을 용접하여 거대한 유기체 세포의 형태를 구현했습니다. 하얀 벽면에 걸린 조각이 박테리아 배양 사진처럼 보이도록 전체 구성을 계획했습니다.",
    category: "Sculpture",
    tags: ["폐철재", "용접", "박테리아", "유기체", "벽면조각", "입체"],
    year: 2025,
    medium: "Welded Scrap Iron, Steel Rod",
    dimensions: "70 x 70 cm (벽면 부조)",
    priceRange: "₩3,500,000",
    featured: true,
  },
  {
    id: "art_8",
    title: "부유하는 원들 / Floating Circles",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_03.jpg",
    description: "수백 개의 와이어 고리가 서로를 붙잡으며 만들어내는 유기적인 덩어리를 표현한 대형 벽면 설치입니다. 가까이서 보면 각각의 불완전한 원이 보이고, 멀리서 보면 하나의 생명체처럼 보이는 이중성을 담고 있습니다.",
    category: "Sculpture",
    tags: ["와이어", "설치", "이중성", "덩어리", "금속선", "벽면"],
    year: 2026,
    medium: "Stainless Steel Wire",
    dimensions: "150 x 120 cm (벽면 설치)",
    priceRange: "₩4,800,000",
  },
  {
    id: "art_9",
    title: "불꽃 마스크 / Flame Mask",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_07.jpg",
    description: "구리 와이어와 철 파이프를 엮어 인간 얼굴을 형상화하고, 위로 치솟는 불꽃의 형태를 더한 마스크 조각입니다. 나무 원판 위에 마운팅되어 벽에 걸리는 형식으로 제작되었으며, 인간의 욕망과 상승 의지를 표현합니다.",
    category: "Sculpture",
    tags: ["구리", "마스크", "불꽃", "인체", "욕망", "혼합금속"],
    year: 2025,
    medium: "Copper Wire, Iron Pipe, Oak Board",
    dimensions: "35 x 28 x 60 (h) cm",
    priceRange: "₩2,900,000",
  },
  {
    id: "art_10",
    title: "으르렁 / Growl",
    artistId: "artist_2",
    artistName: "이민우 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_08.jpg",
    description: "폐차 부품에서 추출한 철재 띠를 엮고 용접하여 웅크린 채 으르렁대는 맹수의 형상을 만들었습니다. 속이 비어있는 구조임에도 전체적인 실루엣은 긴장감 있는 동물의 근육감을 그대로 전달합니다.",
    category: "Sculpture",
    tags: ["동물", "철재", "긴장감", "입체조각", "근육", "공간감"],
    year: 2026,
    medium: "Welded Steel Strip (Reclaimed Auto Parts)",
    dimensions: "90 x 40 x 55 (h) cm",
    priceRange: "₩5,500,000",
    featured: true,
  },
  // ── 공예/설치 (Craft) ── artist_5 정서우 ─────────────────────────────
  {
    id: "art_11",
    title: "어부의 꿈 / Fisher's Dream",
    artistId: "artist_5",
    artistName: "정서우 (Jung Seo-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_06.jpg",
    description: "은빛 비즈와 금속 핀으로 만든 물고기 골격 위에 하얀 실타래를 얹어 '잡혔지만 놓인' 역설적 순간을 표현했습니다. 검은 나무 상자 안에 배치하여 표본 박스처럼 보이는 연출로, 자연과 수집의 관계를 탐구합니다.",
    category: "Craft",
    tags: ["혼합재료", "물고기", "실", "비즈", "오브제", "설치"],
    year: 2025,
    medium: "Silver Beads, Metal Pin, Silk Thread, Wood Box",
    dimensions: "60 x 20 x 10 cm",
    priceRange: "₩1,100,000",
    featured: true,
  },
  {
    id: "art_12",
    title: "백색 야수 I (측면) / White Beast I",
    artistId: "artist_5",
    artistName: "정서우 (Jung Seo-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_09.jpg",
    description: "흰코뿔소의 멸종을 애도하며 제작한 대형 설치 조각입니다. 내부 철재 뼈대 위에 흰색 패더링 소재를 층층이 붙여 완성했으며, 발굽은 금속 소재를 그대로 노출하여 자연과 인공의 경계를 드러냅니다.",
    category: "Craft",
    tags: ["설치", "동물", "멸종위기", "흰색", "대형작품", "혼합재료"],
    year: 2026,
    medium: "Steel Frame, White Feathering Material, Mixed Media",
    dimensions: "180 x 80 x 120 (h) cm",
    priceRange: "₩8,000,000",
  },
  // ── 사진 (Photography) ── artist_3 최다은 ─────────────────────────────
  {
    id: "art_14",
    title: "빛의 이명 (Tinnitus of Luminescence)",
    artistId: "artist_3",
    artistName: "최다은 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80",
    description: "공장의 화려한 야간 전기 시설에서 분출되는 강렬한 형광 나트륨 불빛들을 과감하게 디포커싱한 실험적 파인아트 사진입니다. 망막 속에 찌르르하고 남는 밤의 에너지 잔상을 기록했습니다.",
    category: "Photography",
    tags: ["형형색색", "빛의번짐", "네온사인", "몽환적인", "밤시간", "장노출"],
    year: 2025,
    medium: "Archival Pigment Print on Hahnemühle Paper",
    dimensions: "110 x 85 cm (Edition 1 of 5)",
    priceRange: "₩1,200,000",
    featured: true,
  },
  {
    id: "art_15",
    title: "오후 세 시의 부재 (The Missing 15:00)",
    artistId: "artist_3",
    artistName: "최다은 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    description: "아무도 머물지 않는 화이트 톤의 단칸방 구석, 스탠드 등 하나가 켜져 있고 햇빛이 가늘게 문틈으로 부서지는 구도를 담은 고요 기류의 실내 사진입니다.",
    category: "Photography",
    tags: ["고요한", "정적인", "미니멀", "방안", "외로움", "자연광"],
    year: 2026,
    medium: "Silver Gelatin Print on Baryta Paper",
    dimensions: "80 x 80 cm (Edition 3 of 10)",
    priceRange: "₩950,000",
  },
  {
    id: "art_16",
    title: "새벽 세 시의 편의점",
    artistId: "artist_3",
    artistName: "최다은 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80",
    description: "새벽 세 시, 안개 속 도시의 불빛이 번져나오는 거리 풍경을 필름 카메라로 담았습니다. 도시의 불면과 도시인의 고독을 필름 특유의 입자감으로 포착한 사진 연작의 한 장면입니다.",
    category: "Photography",
    tags: ["도시", "새벽", "필름", "외로움", "빛", "야경"],
    year: 2026,
    medium: "35mm Film, Archival Pigment Print",
    dimensions: "60 x 40 cm (Edition 5 of 10)",
    priceRange: "₩680,000",
  },
  {
    id: "art_17",
    title: "안개가 삼킨 골목",
    artistId: "artist_3",
    artistName: "최다은 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80",
    description: "이른 아침 안개가 걷히기 전 골목길을 담은 장노출 필름 사진입니다. 가로등 불빛이 안개에 번지며 만들어내는 빛의 후광이 고요한 아름다움과 쓸쓸함을 동시에 자아냅니다.",
    category: "Photography",
    tags: ["안개", "골목", "장노출", "고요", "빛", "새벽"],
    year: 2025,
    medium: "Medium Format Film, Archival Pigment Print",
    dimensions: "90 x 70 cm (Edition 2 of 5)",
    priceRange: "₩1,050,000",
  },
  // ── 미디어 아트 (Media Art) ── artist_4 박지훈 ────────────────────────
  {
    id: "art_18",
    title: "염색체 알고리즘 07B (Generative Fluids)",
    artistId: "artist_4",
    artistName: "Park Ji-hoon (박지훈)",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
    description: "관람객의 수동적 제스처 신호를 유체 역학 그래픽 카드 소스 코드와 연동하여 실시간으로 흘러내리도록 제작한 미디어아트의 고해상도 인쇄 고정 프레임 본판입니다. 유기물 같은 기묘한 색광 조합을 발산합니다.",
    category: "Media Art",
    tags: ["디지털", "알고리즘", "네온", "유체", "형형색색", "다이내믹"],
    year: 2025,
    medium: "Generative Art Frame / High Gloss Acrylic Face-mount Print",
    dimensions: "100 x 100 cm (Edition 1 of 3)",
    priceRange: "₩3,100,000",
    featured: true,
  },
  {
    id: "art_19",
    title: "침묵 속에 번식하는 정교한 선들",
    artistId: "artist_4",
    artistName: "Park Ji-hoon (박지훈)",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
    description: "노이즈 알고리즘을 반복 적층하여 수백만 개의 미세기하학적 흑백 실선들이 원 모양의 동심원을 타고 소용돌이치게 연출한 미디어 스틸 작업입니다. 무한히 반복되는 수학적 프랙탈 자연을 표상합니다.",
    category: "Media Art",
    tags: ["미니멀", "알고리즘", "흑백", "원형", "디지털아트", "정적선"],
    year: 2026,
    medium: "UltraChrome Giclée Print on Fine Art Canvas",
    dimensions: "150 x 100 cm",
    priceRange: "₩2,200,000",
  },
];
