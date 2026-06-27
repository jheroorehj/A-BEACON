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

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white text-[#222222]">

      {/* ── 상단 헤더 ── */}
      <header className="border-b border-[#ebebeb] px-6 sm:px-10 py-5 flex items-center justify-between">
        <Logo size="md" />
        <button
          onClick={onStart}
          className="text-xs font-bold text-[#6a6a6a] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent"
        >
          로그인
        </button>
      </header>

      {/* ── 1. Hero ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* 텍스트 */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#ff385c]">
              Art · Discovery · Connection
            </p>
            <h1 className="text-[2.2rem] sm:text-[2.8rem] font-black leading-[1.2] tracking-tight text-[#222222]">
              작품이 필요한 사람과,<br />
              <span className="text-[#ff385c]">작품을 만드는 사람을 잇다.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#6a6a6a] font-light leading-relaxed max-w-md">
              A-BEACON은 신진 예술가의 작품을 소개하고 판매하는 플랫폼입니다.<br />
              <span className="text-[#444444]">공간의 분위기만 입력하면 AI가 어울리는 작품을 추천해 드립니다.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-bold text-sm rounded-full transition-all cursor-pointer border-none shadow-sm"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#story"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#dddddd] hover:border-[#222222] text-[#222222] font-bold text-sm rounded-full transition-all cursor-pointer bg-white"
            >
              소개 더 보기
            </a>
          </div>

          {/* 간단한 숫자 지표 */}
          <div className="flex gap-8 pt-4 border-t border-[#ebebeb]">
            <div>
              <p className="text-2xl font-black text-[#222222]">5+</p>
              <p className="text-[11px] text-[#aaaaaa] font-mono mt-0.5">매체 분류</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#222222]">0%</p>
              <p className="text-[11px] text-[#aaaaaa] font-mono mt-0.5">수수료</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#222222]">AI</p>
              <p className="text-[11px] text-[#aaaaaa] font-mono mt-0.5">큐레이션</p>
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

      {/* ── 2. Story (왜 만들었나) ── */}
      <section id="story" className="bg-[#111111] text-white py-24 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#ff385c] mb-6">
            Our Story
          </p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-12">
            우리가 이 플랫폼을<br />만든 이유
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-[#aaaaaa] font-light leading-relaxed">
            <div className="space-y-3">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p>
                세상 어딘가에는 훌륭한 작품을 만들지만 알릴 방법을 찾지 못한 작가들이 있습니다.
                갤러리 인맥도, 큰 자본도 없이, 오직 작품으로만 말하고 싶은 사람들.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p>
                그리고 다른 곳에는 비어 있는 벽, 빛이 드는 공간, 이야기가 담긴 작품 하나를 찾고 있지만
                어디서 시작해야 할지 모르는 사람들이 있습니다.
              </p>
            </div>
            <div className="space-y-3">
              <div className="h-px w-12 bg-[#ff385c] mb-5" />
              <p>
                A-BEACON은 이 두 그룹을 잇기 위해 만들어졌습니다.
                작가의 작품이 세상에 나올 수 있도록, 그 작품이 찾는 사람을 만날 수 있도록.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 border border-white/10 rounded-2xl bg-white/5">
            <blockquote className="text-xl sm:text-2xl font-medium text-white leading-relaxed tracking-tight">
              "예술은 특정 계층의 전유물이 아닙니다. 우리는 창작과 감상의
              문화를 모두에게 열려 있는 것으로 만들고자 합니다."
            </blockquote>
            <p className="mt-4 text-xs font-mono text-[#6a6a6a]">— A-BEACON 팀</p>
          </div>
        </div>
      </section>

      {/* ── 3. 핵심 기능 3가지 ── */}
      <section className="py-24 px-6 sm:px-10 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#ff385c] mb-3">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-14">
            A-BEACON이 하는 일
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Palette className="h-6 w-6 text-[#ff385c]" />,
                num: "01",
                title: "발견",
                desc: "분위기, 색감, 공간 — 느낌을 입력하면 어울리는 작품을 AI가 큐레이션합니다. 장르 필터가 아닌, 감성으로 탐색하세요.",
              },
              {
                icon: <MessageCircle className="h-6 w-6 text-[#ff385c]" />,
                num: "02",
                title: "연결",
                desc: "마음에 드는 작품을 찾았다면 작가에게 직접 소장 문의를 보낼 수 있습니다. 중간 유통 없이, 작가와 감상자가 직접.",
              },
              {
                icon: <Layers className="h-6 w-6 text-[#ff385c]" />,
                num: "03",
                title: "성장",
                desc: "작가는 포트폴리오를 등록하고 작품을 세상에 알립니다. 전시 공간 없이도, 자신의 작품으로 감상자를 만날 수 있습니다.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-white border border-[#ebebeb] rounded-2xl p-8 hover:border-[#ff385c]/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-2.5 bg-[#ff385c]/5 rounded-xl">{item.icon}</div>
                  <span className="text-[10px] font-mono font-bold text-[#dddddd]">{item.num}</span>
                </div>
                <h3 className="text-lg font-black text-[#222222] mb-3">{item.title}</h3>
                <p className="text-sm text-[#6a6a6a] font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 작가를 위해 / 감상자를 위해 ── */}
      <section className="py-24 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 작가 */}
          <div className="bg-[#222222] text-white rounded-2xl p-10 space-y-6">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#ff385c]">For Artists</span>
              <h3 className="text-2xl font-black mt-2 leading-tight">
                작품만으로<br />말하세요.
              </h3>
            </div>
            <p className="text-sm text-[#aaaaaa] font-light leading-relaxed">
              포트폴리오를 등록하고, 작품에 이야기를 담고, 감상자를 만나세요.
              갤러리 입성이나 큰 자본 없이도 세상과 연결될 수 있습니다.
            </p>
            <ul className="space-y-3 text-sm">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#222222] font-bold text-xs rounded-full hover:bg-[#f7f7f7] transition-all cursor-pointer border-none"
            >
              작가로 시작하기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 감상자 */}
          <div className="bg-[#fff5f6] border border-[#ff385c]/10 rounded-2xl p-10 space-y-6">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#ff385c]">For Collectors</span>
              <h3 className="text-2xl font-black mt-2 leading-tight text-[#222222]">
                원하는 작품을<br />찾으세요.
              </h3>
            </div>
            <p className="text-sm text-[#6a6a6a] font-light leading-relaxed">
              경매장이나 갤러리가 아니어도 됩니다. 분위기, 색감, 공간을 기반으로
              나에게 맞는 작품을 AI가 추천합니다.
            </p>
            <ul className="space-y-3 text-sm">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff385c] text-white font-bold text-xs rounded-full hover:bg-[#e00b41] transition-all cursor-pointer border-none"
            >
              작품 탐색하기
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. 최종 CTA ── */}
      <section className="py-24 px-6 sm:px-10 bg-[#fafafa] border-t border-[#ebebeb] text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <Logo size="lg" showDot={true} className="justify-center" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#222222] leading-tight">
            지금 시작하세요.
          </h2>
          <p className="text-sm text-[#6a6a6a] font-light leading-relaxed">
            작가라면 나의 작품을 세상에 꺼내고, 감상자라면 오랫동안 찾던 그 작품을 만나보세요.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white font-bold text-sm rounded-full transition-all cursor-pointer border-none shadow-sm"
          >
            A-BEACON 시작하기
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── 하단 푸터 ── */}
      <footer className="border-t border-[#ebebeb] py-8 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-[11px] text-[#aaaaaa] font-mono">
            &copy; {new Date().getFullYear()} A-BEACON. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
