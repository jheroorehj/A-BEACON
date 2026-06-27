/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { ArrowRight, Search, Heart, Sparkles } from "lucide-react";
import { Artwork, ArtCategory } from "../types";

interface HomeGatewayProps {
  setPersona: (persona: "buyer" | "artist" | "admin") => void;
  featuredArtworks: Artwork[];
  /** 카테고리 카운트 계산용 전체 작품 목록 */
  allArtworks: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
  onSearchAndNavigate?: (query: string) => void;
}

const WISHLIST_KEY = "beacon_wishlist";

function loadWishlist(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveWishlist(wishlist: Record<string, boolean>) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch {
    // localStorage 차단 환경에서는 무시
  }
}

export default function HomeGateway({
  setPersona,
  featuredArtworks,
  allArtworks,
  onSelectArtwork,
  onSearchAndNavigate,
}: HomeGatewayProps) {
  const [activeTab, setActiveTab] = useState<"homes" | "experiences" | "services">("homes");
  const [spaceQuery, setSpaceQuery] = useState("");
  const [genreQuery, setGenreQuery] = useState("");
  const [moodQuery, setMoodQuery] = useState("");

  // 위시리스트: localStorage에 영구 저장
  const [savedArts, setSavedArts] = useState<Record<string, boolean>>(loadWishlist);

  const toggleSave = (e: React.MouseEvent, artId: string) => {
    e.stopPropagation();
    setSavedArts((prev) => {
      const next = { ...prev, [artId]: !prev[artId] };
      saveWishlist(next);
      return next;
    });
  };

  const handlePillSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParts = [spaceQuery, genreQuery, moodQuery].filter(Boolean);
    const complexQuery = queryParts.length > 0
      ? queryParts.join(" ")
      : "차분하고 어울리는 예술 소장품";

    if (onSearchAndNavigate) {
      onSearchAndNavigate(complexQuery);
    } else {
      setPersona("buyer");
    }
  };

  // 카테고리 카운트를 실제 데이터 기반으로 동적 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const art of allArtworks) {
      counts[art.category] = (counts[art.category] ?? 0) + 1;
    }
    return counts;
  }, [allArtworks]);

  const categories: { id: ArtCategory; label: string; icon: string; isNew?: boolean }[] = [
    { id: "Painting", label: "회화", icon: "🎨" },
    { id: "Sculpture", label: "조소", icon: "🗿" },
    { id: "Photography", label: "사진", icon: "📷" },
    { id: "Media Art", label: "미디어 아트", icon: "💻" },
    { id: "Craft", label: "공예 오브제", icon: "🏺", isNew: true },
  ];

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#222222] pb-24" id="gateway-container">

      {/* Product-Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-center border-b border-[#ebebeb] pb-4 gap-8">
          <button
            onClick={() => setActiveTab("homes")}
            className={`pb-2 text-sm font-semibold tracking-tight relative transition-colors ${
              activeTab === "homes" ? "text-[#222222]" : "text-[#6a6a6a] hover:text-[#222222]"
            }`}
          >
            <span>소장용 작품 (Artworks)</span>
            {activeTab === "homes" && (
              <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#222222]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={`pb-2 text-sm font-semibold tracking-tight relative transition-colors flex items-center gap-1.5 ${
              activeTab === "experiences" ? "text-[#222222]" : "text-[#6a6a6a] hover:text-[#222222]"
            }`}
          >
            <span>도슨트 투어 &amp; 전시 (Experiences)</span>
            <span className="bg-[#ffffff] text-[#ff385c] border border-[#ff385c]/30 text-[8px] font-bold px-1 py-0.5 rounded-full uppercase tracking-wider scale-90">
              NEW
            </span>
            {activeTab === "experiences" && (
              <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#222222]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-2 text-sm font-semibold tracking-tight relative transition-colors flex items-center gap-1.5 ${
              activeTab === "services" ? "text-[#222222]" : "text-[#6a6a6a] hover:text-[#222222]"
            }`}
          >
            <span>공간 맞춤 컨설팅 (Services)</span>
            <span className="bg-[#ffffff] text-[#460479] border border-[#460479]/30 text-[8px] font-bold px-1 py-0.5 rounded-full uppercase tracking-wider scale-90">
              NEW
            </span>
            {activeTab === "services" && (
              <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#222222]" />
            )}
          </button>
        </div>
      </div>

      {/* Pill-shaped Search Bar */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <form
          onSubmit={handlePillSearchSubmit}
          className="bg-white border border-[#dddddd] shadow-md hover:shadow-lg transition-all rounded-full p-2 pl-6 flex flex-col md:flex-row items-center justify-between gap-2"
        >
          <div className="flex-1 w-full text-left md:border-r border-[#ebebeb] md:pr-4 py-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">어디에 놓을까요?</label>
            <input
              type="text"
              placeholder="예: 거실 벽면, 고요한 서재"
              value={spaceQuery}
              onChange={(e) => setSpaceQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#222222] placeholder-[#6a6a6a] outline-none mt-1 font-light"
            />
          </div>

          <div className="flex-1 w-full text-left md:border-r border-[#ebebeb] md:px-4 py-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">어떤 매체?</label>
            <input
              type="text"
              placeholder="예: 따뜻한 유화, 단단한 공예"
              value={genreQuery}
              onChange={(e) => setGenreQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#222222] placeholder-[#6a6a6a] outline-none mt-1 font-light"
            />
          </div>

          <div className="flex-1 w-full text-left md:pl-4 py-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#222222]">원하는 분위기 (자연어)</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="예: 쓸쓸하고 고요한 파스텔톤"
                value={moodQuery}
                onChange={(e) => setMoodQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#222222] placeholder-[#6a6a6a] outline-none mt-1 font-light"
              />
              <span className="p-1 text-[#ff385c]" title="AI 추천 필터 탑재">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto h-12 px-5 bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 text-white rounded-full font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="md:hidden">탐색하기</span>
          </button>
        </form>
      </div>

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-medium text-[28px] md:text-[36px] tracking-tight leading-[1.2] text-[#222222]">
            창작의 바다에서 외롭게 항해하는 신진작가의 등대, <span className="font-extrabold text-[#ff385c]">A-BEACON</span>
          </h1>
          <p className="mt-4 text-[#6a6a6a] text-sm md:text-base font-light leading-relaxed">
            세상이 아직 발견하지 못한 눈부신 보석들을 찾아내어 당신의 가장 안락한 공간으로 안내합니다.
            소박한 신진 예술가들과 안목 있는 감상자들을 유기적으로 투명하게 소통시킵니다.
          </p>
        </div>
      </section>

      {/* Category Links (동적 카운트) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-8 border-y border-[#ebebeb]">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-none py-2 justify-start md:justify-center">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (onSearchAndNavigate) {
                    onSearchAndNavigate(cat.id === "Painting" ? "회화 유화 수채화 Art" : cat.id);
                  } else {
                    setPersona("buyer");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f7f7f7] hover:bg-[#ebebeb] text-xs font-semibold text-[#222222] rounded-full transition-all border border-[#ebebeb] shrink-0"
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] text-[#6a6a6a] font-normal">({count}점)</span>
                {cat.isNew && <span className="h-1.5 w-1.5 bg-[#ff385c] rounded-full" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Preview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="spots-section">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl tracking-tight text-[#222222] flex items-center space-x-2">
              <span>오늘의 신진컬렉션 주목작</span>
              <span className="text-[10px] bg-[#f7f7f7] text-[#222222] border border-[#dddddd] font-semibold uppercase tracking-wider py-0.5 px-2 rounded-full font-mono">
                Curator's Premium Choice
              </span>
            </h2>
            <p className="mt-1 text-xs text-[#6a6a6a] font-mono tracking-wide">
              PHOTOGRAPHY-LED TRAVEL THROUGH FINE ART PIECES
            </p>
          </div>
          <button
            onClick={() => setPersona("buyer")}
            className="text-xs font-bold text-[#ff385c] hover:text-[#e00b41] flex items-center space-x-1 transition-colors underline bg-transparent border-none cursor-pointer"
          >
            <span>등재된 전체 작품 보러가기 ({allArtworks.length}점+)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.map((art) => {
            const isSaved = savedArts[art.id] ?? false;
            return (
              <div
                key={art.id}
                onClick={() => {
                  setPersona("buyer");
                  onSelectArtwork(art);
                }}
                className="group cursor-pointer bg-white transition-all duration-300"
              >
                <div className="relative overflow-hidden aspect-square bg-[#f2f2f2] rounded-[14px] shadow-xs mb-3">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute top-3 left-3 bg-white/95 text-[#222222] text-[10px] font-bold py-1 px-3 shadow-sm rounded-full flex items-center gap-1">
                    <span className="text-[#ff385c]">★</span>
                    <span>우수 신진 추천</span>
                  </div>

                  <button
                    onClick={(e) => toggleSave(e, art.id)}
                    className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white active:scale-95 shadow-sm rounded-full flex items-center justify-center transition-all cursor-pointer border-none outline-none"
                    title={isSaved ? "소장 찜 해제" : "소장 관심 등록"}
                  >
                    <Heart
                      className={`h-4 w-4 transition-all ${
                        isSaved ? "text-[#ff385c] fill-[#ff385c] scale-110" : "text-[#222222] hover:text-[#ff385c]"
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs py-1 px-2.5 text-[9px] font-mono font-semibold tracking-wider text-white">
                    {art.category.toUpperCase()}
                  </div>
                </div>

                <div className="flex flex-col space-y-1 px-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-[#222222] group-hover:text-[#ff385c] transition-colors truncate">
                      {art.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6a6a6a] font-normal leading-relaxed truncate">
                    작가 <strong>{art.artistName}</strong> · {art.medium}
                  </p>

                  <p className="text-xs text-[#6a6a6a] font-light truncate">
                    규격: {art.dimensions || "자유 규격 컨설팅"}
                  </p>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-[#6a6a6a] font-light">추천 소장 펀딩가</span>
                    <span className="font-bold text-[#222222] text-sm">{art.priceRange}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Info Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-[#f7f7f7] rounded-[20px] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[10px] bg-white text-[#460479] font-bold border border-[#460479]/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              A-BEACON Partnership
            </span>
            <h2 className="mt-4 font-medium text-2xl md:text-3xl tracking-tight leading-tight text-[#222222]">
              포트폴리오 하나만으로 완성되는<br />신진 예술가 날개 달기
            </h2>
            <p className="mt-4 text-[#6a6a6a] text-xs md:text-sm font-light leading-relaxed">
              작가 자리가 낯설고 외로운 모든 신인들에게 필요한 문체부 고시 미술거래 표준 계약서 및 검증된 우수 예시 자료 기획안 양식을 무료로 전파합니다. 포트폴리오를 채우면 삼청동 파트너 갤러리와의 오프라인 융합 기회까지 무료 연동됩니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setPersona("artist")}
                className="px-5 py-3 bg-[#222222] hover:bg-[#3f3f3f] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer border-none"
              >
                작가 자격 즉시 등록하기
              </button>
              <button
                onClick={() => setPersona("buyer")}
                className="px-5 py-3 bg-white hover:bg-[#f2f2f2] text-[#222222] border border-[#dddddd] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                성공사례 인터뷰 둘러보기
              </button>
            </div>
          </div>
          <div className="relative aspect-video md:aspect-square lg:aspect-video rounded-[14px] overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop"
              alt="Art center workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
