import { ArrowRight, Palette, MessageCircle, Layers } from "lucide-react";
import { Logo } from "./Logo";

interface HomePageProps {
  onStart: () => void;
}

const PREVIEW_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80",
    alt: "파스텔 추상 회화",
  },
  {
    src: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=500&auto=format&fit=crop&q=80",
    alt: "도시 야경 사진",
  },
  {
    src: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=500&auto=format&fit=crop&q=80",
    alt: "미니멀 도예 작품",
  },
  {
    src: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&auto=format&fit=crop&q=80",
    alt: "기하학 금속 조각",
  },
];

/** A-BEACON 텍스트에서 O에만 포인트 컬러를 적용하는 헬퍼 */
function AB() {
  return <>A-BEAC<span className="text-[#ff385c]">O</span>N</>;
}

/** 섹션 공통 라벨 */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm font-mono font-bold uppercase tracking-[0.25em] text-[#ff385c] mb-4">
      {children}
    </p>
  );
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white text-[#222222]">

      {/* ── 상단 헤더 ── */}
      <header className="border-b border-[#ebebeb] px-6 sm:px-10 py-5 flex items-center justify-between">
        <Logo size="md" />
        <button
          onClick={onStart}
          className="text-sm font-bold text-[#6a6a6a] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent"
        >
          로그인
        </button>
      </header>

      {/* ── 1. Hero ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* 텍스트 */}
        <div className="space-y-8">
          <div className="space-y-5">
            <SectionLabel>Art · Discovery · Connection</SectionLabel>
            <h1 className="text-[2.6rem] sm:text-[3.4rem] font-black leading-[1.15] tracking-tight text-[#222222]">
              작품을 찾는 경험까지,<br />
              <span className="text-[#ff385c]">예술이 되다.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#6a6a6a] font-light leading-relaxed">
              <AB />은 AI 큐레이션을 통해 원하는 작품을 추천하고,<br />
              신진 예술가가 더 많은 사람들과 연결될 수 있도록 돕습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-bold text-base rounded-full transition-all cursor-pointer border-none shadow-sm"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#story"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#dddddd] hover:border-[#222222] text-[#222222] font-bold text-base rounded-full transition-all cursor-pointer bg-white"
            >
              소개 더 보기
            </a>
          </div>

          {/* 숫자 지표 */}
          <div className="flex gap-10 pt-4 border-t border-[#ebebeb]">
            <div>
              <p className="text-3xl font-black text-[#222222]">5+</p>
              <p className="text-sm text-[#aaaaaa] font-mono mt-0.5">매체 분류</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#222222]">0%</p>
              <p className="text-sm text-[#aaaaaa] font-mono mt-0.5">수수료</p>
            </div>
            <div>
              <p className="text-3xl font-black text-[#222222]">AI</p>
              <p className="text-sm text-[#aaaaaa] font-mono mt-0.5">큐레이션</p>
            </div>
          </div>
        </div>

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {PREVIEW_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-[14px] bg-[#f7f7f7] ${i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Story ── */}
      <section id="story" className="bg-[#111111] text-white py-24 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-8">
            A-BEAC<span className="text-[#ff385c]">O</span>N은 작가들의 등대입니다.
          </h2>
          <p className="text-lg text-[#bbbbbb] font-light leading-relaxed max-w-xl mb-14">
            BEACON은 항해자를 안전한 곳으로 이끄는 등대를 뜻합니다.
            우리는 세상에 알려지지 않은 예술가들에게 빛을 비춰,
            그들의 작품이 마땅한 사람에게 닿을 수 있도록 합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-base text-[#cccccc] font-light leading-relaxed mb-16">
            <div className="space-y-4">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#ff385c]">신진 작가에게는</p>
              <p>
                훌륭한 작품을 만들어도 알릴 기회가 부족한 작가들이 많습니다.
                전시를 열기에는 비용이 부담되고, 온라인에서는 작품보다 유명세가 먼저 보이는 경우도 있습니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#ff385c]">작품을 찾는 사람에게는</p>
              <p>
                공간에 어울리는 작품을 찾고 싶지만, 어디서부터 찾아야 할지 막막합니다.
                수많은 작품 속에서 자신의 취향과 분위기에 맞는 작품을 발견하기란 쉽지 않습니다.
              </p>
            </div>
            <div className="space-y-4">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p className="text-sm font-bold uppercase tracking-widest text-[#ff385c]">그래서 A-BEACON을 만들었습니다.</p>
              <p>
                신진 작가에게는 홍보와 판매의 기회를, 구매자에게는 AI 기반 맞춤 추천으로
                원하는 작품을 더 쉽게 만날 수 있는 플랫폼을 만들었습니다.
              </p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-10 space-y-3">
            <p className="text-2xl sm:text-3xl font-medium text-white leading-relaxed tracking-tight">
              좋은 작품은 더 많은 사람을 만나야 합니다.
            </p>
            <p className="text-2xl sm:text-3xl font-medium text-white/70 leading-relaxed tracking-tight">
              그리고 좋은 작품을 찾는 일은 더 쉬워져야 합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. How It Works ── */}
      <section className="py-24 px-6 sm:px-10 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-14">
            <AB />이 하는 일
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="h-7 w-7 text-[#ff385c]" />,
                num: "01",
                title: "발견",
                desc: "분위기, 색감, 공간 — 느낌을 입력하면 어울리는 작품을 AI가 큐레이션합니다. 장르 필터가 아닌, 감성으로 탐색하세요.",
              },
              {
                icon: <MessageCircle className="h-7 w-7 text-[#ff385c]" />,
                num: "02",
                title: "연결",
                desc: "마음에 드는 작품을 찾았다면 작가에게 직접 소장 문의를 보낼 수 있습니다. 중간 유통 없이, 작가와 감상자가 직접.",
              },
              {
                icon: <Layers className="h-7 w-7 text-[#ff385c]" />,
                num: "03",
                title: "성장",
                desc: "작가는 포트폴리오를 등록하고 작품을 세상에 알립니다. 전시 공간 없이도, 자신의 작품으로 감상자를 만날 수 있습니다.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-white border border-[#ebebeb] rounded-2xl p-8 hover:border-[#ff385c]/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-[#ff385c]/5 rounded-xl">{item.icon}</div>
                  <span className="text-xs font-mono font-bold text-[#dddddd]">{item.num}</span>
                </div>
                <h3 className="text-xl font-black text-[#222222] mb-3">{item.title}</h3>
                <p className="text-base text-[#6a6a6a] font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. For Artists / For Collectors ── */}
      <section className="py-24 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Who It's For</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-14">
            작가와 컬렉터, 모두를 위해
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 작가 */}
            <div className="bg-[#222222] text-white rounded-2xl p-10 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff385c]">For Artists</span>
                <h3 className="text-3xl font-black mt-2 leading-tight">
                  작품만으로<br />말하세요.
                </h3>
              </div>
              <p className="text-base text-[#aaaaaa] font-light leading-relaxed">
                포트폴리오를 등록하고, 작품에 이야기를 담고, 감상자를 만나세요.
                갤러리 입성이나 큰 자본 없이도 세상과 연결될 수 있습니다.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  "온라인 포트폴리오 무료 개설",
                  "AI 기반 작품 태그 자동 생성",
                  "감상자로부터 직접 소장 문의 수령",
                  "수수료 없는 직거래 연결",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#dddddd]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff385c] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#222222] font-bold text-base rounded-full hover:bg-[#f7f7f7] transition-all cursor-pointer border-none"
              >
                작가로 시작하기
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* 감상자 */}
            <div className="bg-[#fff5f6] border border-[#ff385c]/10 rounded-2xl p-10 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#ff385c]">For Collectors</span>
                <h3 className="text-3xl font-black mt-2 leading-tight text-[#222222]">
                  원하는 작품을<br />찾으세요.
                </h3>
              </div>
              <p className="text-base text-[#6a6a6a] font-light leading-relaxed">
                경매장이나 갤러리가 아니어도 됩니다. 분위기, 색감, 공간을 기반으로
                나에게 맞는 작품을 AI가 추천합니다.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  "감성 기반 AI 큐레이션 검색",
                  "회화 · 조소 · 사진 · 미디어 · 공예 전 장르",
                  "작가와 직접 소통 및 소장 문의",
                  "작가 인터뷰와 작업 철학 열람",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#6a6a6a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff385c] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStart}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff385c] text-white font-bold text-base rounded-full hover:bg-[#e00b41] transition-all cursor-pointer border-none"
              >
                작품 탐색하기
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 최종 CTA ── */}
      <section className="py-24 px-6 sm:px-10 bg-[#fafafa] border-t border-[#ebebeb] text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <SectionLabel>Get Started</SectionLabel>
          <Logo size="lg" showDot={true} className="justify-center" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#222222] leading-tight">
            지금 시작하세요.
          </h2>
          <p className="text-base text-[#6a6a6a] font-light leading-relaxed">
            작가라면 나의 작품을 세상에 꺼내고, 감상자라면 오랫동안 찾던 그 작품을 만나보세요.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-9 py-4 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-bold text-base rounded-full transition-all cursor-pointer border-none shadow-sm"
          >
            <AB /> 시작하기
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* ── 하단 푸터 ── */}
      <footer className="border-t border-[#ebebeb] py-8 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-sm text-[#aaaaaa] font-mono">
            &copy; {new Date().getFullYear()} <AB />. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
