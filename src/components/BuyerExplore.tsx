/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles, Search, X, Mail, Layers,
  ZoomIn, ChevronRight, MessageCircle, CheckCircle2, Info, AlertTriangle,
  Camera, ChevronDown, ChevronUp, ImagePlus
} from "lucide-react";
import { Artwork, Artist, AISearchResult, ArtCategory } from "../types";
import { searchApi, inquiriesApi, roomMatchApi, ApiError } from "../services/api";

interface BuyerExploreProps {
  artworks: Artwork[];
  artists: Artist[];
  userEmail: string;
  displayName?: string;
  initialSelectedArtwork: Artwork | null;
  onClearInitialSelected: () => void;
  onAddArtworkToList: (newArt: Artwork) => void;
  initialSearchQuery?: string;
  onClearInitialSearch?: () => void;
  onOpenChat?: (roomId?: string) => void;
}

export default function BuyerExplore({
  artworks,
  artists,
  userEmail,
  displayName = "",
  initialSelectedArtwork,
  onClearInitialSelected,
  onAddArtworkToList,
  initialSearchQuery = "",
  onClearInitialSearch,
  onOpenChat,
}: BuyerExploreProps) {
  // Navigation tabs within Buyer Page
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "stories">("catalog");

  // Core Search State
  const [naturalSearchQuery, setNaturalSearchQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingStep, setAiLoadingStep] = useState(0);
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reusable Search Function
  const executeSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiResult(null);
    setSearchError(null);

    try {
      const data = await searchApi.naturalLanguage(query);
      setAiResult(data);
      setActiveSelectedTags(data.tags ?? []);
      setTimeout(() => {
        document.getElementById("explore-grid")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error("AI Search Failure:", err);
      setSearchError(err instanceof ApiError ? err.message : "검색 중 오류가 발생했습니다.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearchQuery) {
      setNaturalSearchQuery(initialSearchQuery);
      executeSearch(initialSearchQuery);
      if (onClearInitialSearch) {
        onClearInitialSearch();
      }
    }
  }, [initialSearchQuery]);

  // ─── Room Match (Iamhero AI) ────────────────────────────────────────────────
  const [showRoomMatch, setShowRoomMatch] = useState(false);
  const [roomMatchText, setRoomMatchText] = useState("");
  const [roomMatchFile, setRoomMatchFile] = useState<File | null>(null);
  const [roomMatchPreview, setRoomMatchPreview] = useState<string | null>(null);
  const [isRoomMatchLoading, setIsRoomMatchLoading] = useState(false);
  const [roomMatchError, setRoomMatchError] = useState<string | null>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);

  const handleRoomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRoomMatchFile(file);
    setRoomMatchPreview(URL.createObjectURL(file));
    setRoomMatchError(null);
  };

  const handleRoomMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomMatchText.trim() || !roomMatchFile) return;

    setIsRoomMatchLoading(true);
    setRoomMatchError(null);
    setAiResult(null);

    try {
      const data = await roomMatchApi.recommend(roomMatchText, roomMatchFile);
      setAiResult({
        tags: data.tags,
        matchedArtworkIds: data.matchedArtworkIds,
        explanations: data.explanations,
      });
      setActiveSelectedTags(data.tags ?? []);
      setTimeout(() => {
        document.getElementById("explore-grid")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      setRoomMatchError(
        err instanceof ApiError ? err.message : "AI 서버에 연결할 수 없습니다. Flask 서버가 실행 중인지 확인하세요."
      );
    } finally {
      setIsRoomMatchLoading(false);
    }
  };

  // Active filter states
  const [selectedCategory, setSelectedCategory] = useState<ArtCategory | "All">("All");
  const [activeSelectedTags, setActiveSelectedTags] = useState<string[]>([]);

  // Detailed Modal states
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedArtistPortfolio, setSelectedArtistPortfolio] = useState<Artist | null>(null);

  // Inquiry message states
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState(displayName);
  const [inquiryEmail, setInquiryEmail] = useState(userEmail);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isInquirySubmitting, setIsInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [createdInquiryId, setCreatedInquiryId] = useState<string | null>(null);

  // Active Story/Interview details
  const [showFullInterview, setShowFullInterview] = useState<Artist | null>(null);

  // Sync initialSelectedArtwork from gateway clicks and clear it once we capture it
  useEffect(() => {
    if (initialSelectedArtwork) {
      setSelectedArtwork(initialSelectedArtwork);
      onClearInitialSelected();
    }
  }, [initialSelectedArtwork, onClearInitialSelected]);

  // AI load animation steps simulator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAiLoading) {
      setAiLoadingStep(1);
      interval = setInterval(() => {
        setAiLoadingStep((prev) => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 950);
    } else {
      setAiLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAiLoading]);

  // Handle NLP Search submission
  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSearch(naturalSearchQuery);
  };

  // Remove tag chip
  const handleRemoveTag = (tag: string) => {
    const updated = activeSelectedTags.filter((t) => t !== tag);
    setActiveSelectedTags(updated);
    if (aiResult) {
      setAiResult({
        ...aiResult,
        tags: updated,
      });
    }
  };

  // Preset prompts for buyers to play with easily
  const presetPrompts = [
    { text: "차분한 거실 벽면에 어울리는 푸른색 모던 추상화", icon: "🌌" },
    { text: "햇살 드는 창가 아래 놓아둘 따뜻하고 소박한 도자기 화병", icon: "🏺" },
    { text: "밤 도심의 화려하면서도 외로운 불빛 순간들을 담아낸 몽환적인 이미지", icon: "🌃" },
    { text: "방 안 분위기를 활기차게 바꿀 형형색색 유체 미디어 아트", icon: "💥" }
  ];

  // Filter artworks on hand
  const filteredArtworks = artworks.filter((art) => {
    // 1. Category tab check
    if (selectedCategory !== "All" && art.category !== selectedCategory) {
      return false;
    }
    // 2. Tag chips check (Intersective match or Union match - default to Union for ease and variety)
    if (activeSelectedTags.length > 0) {
      const isAnyTagMatched = art.tags.some((tag) => activeSelectedTags.includes(tag));
      const isTitleMatched = activeSelectedTags.some((tag) => art.title.includes(tag) || art.description.includes(tag));
      return isAnyTagMatched || isTitleMatched;
    }
    // 3. Matched AI search results check
    if (aiResult && aiResult.matchedArtworkIds && aiResult.matchedArtworkIds.length > 0) {
      return aiResult.matchedArtworkIds.includes(art.id);
    }
    return true;
  });

  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Handle Inquiry Submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork) return;

    setIsInquirySubmitting(true);
    setInquiryError(null);
    try {
      const created = await inquiriesApi.create({
        artworkId: selectedArtwork.id,
        artworkTitle: selectedArtwork.title,
        artworkImage: selectedArtwork.image,
        artistId: selectedArtwork.artistId,
        artistName: selectedArtwork.artistName,
        buyerName: inquiryName,
        buyerEmail: inquiryEmail,
        message: inquiryMessage,
      });
      setCreatedInquiryId(created.id);
      setInquirySuccess(true);
    } catch (err) {
      console.error("Submit inquiry failed:", err);
      setInquiryError(err instanceof ApiError ? err.message : "문의 전송에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsInquirySubmitting(false);
    }
  };

  // Open artwork lightbox and preset inquiries template
  const handleOpenArtwork = (art: Artwork) => {
    setSelectedArtwork(art);
    setInquiryMessage(`안녕하세요, ${art.artistName} 작가님. 

귀중히 소장할 현대 fine art 작품을 수취하기 위해 작가 노트인 '${art.title}' 작품의 소장 가전 조건, 실물 프레임 재질 및 조명 추천 제언을 구하고자 실시간 서식을 남깁니다. 유선 혹은 회신을 희망합니다.`);
  };

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#222222]" id="buyer-explore-root">
      {/* Top Banner with Navigation toggle */}
      <div className="bg-[#ffffff] border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-[#222222] flex items-center space-x-2">
              <span>구매자 큐레이션 라운지</span>
            </h2>
            <p className="text-xs text-[#6a6a6a] font-mono tracking-wide uppercase mt-0.5">DISCOVER, APPRECIATE AND CONNECT FINE ARTISTS</p>
          </div>

          {/* Airbnb style tab-switch */}
          <div className="flex border border-[#dddddd] p-1 rounded-full bg-[#f7f7f7]" id="buyer-view-tabs">
            <button
              onClick={() => setActiveSubTab("catalog")}
              className={`px-4 sm:px-5 py-1.5 font-sans text-xs font-bold rounded-full tracking-tight transition-all ${
                activeSubTab === "catalog"
                  ? "bg-[#ffffff] text-[#222222] shadow-xs"
                  : "text-[#6a6a6a] hover:text-[#222222]"
              }`}
              id="tab-catalog-btn"
            >
              <span className="sm:hidden">카탈로그</span>
              <span className="hidden sm:inline">작품 및 AI 발견 (Catalog)</span>
            </button>
            <button
              onClick={() => {
                setActiveSubTab("stories");
                setAiResult(null); // Clear search overlay to focus on stories
                setActiveSelectedTags([]);
              }}
              className={`px-4 sm:px-5 py-1.5 font-sans text-xs font-bold rounded-full tracking-tight transition-all ${
                activeSubTab === "stories"
                  ? "bg-[#ffffff] text-[#222222] shadow-xs"
                  : "text-[#6a6a6a] hover:text-[#222222]"
              }`}
              id="tab-stories-btn"
            >
              <span className="sm:hidden">스토리</span>
              <span className="hidden sm:inline">이달의 작가 스토리 (Stories)</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === "catalog" ? (
        <>
          {/* Section 1: AI Natural Language Searching (Airbnb Warm/White Service Redesign) */}
          <section className="bg-[#f7f7f7] border-b border-[#ebebeb] text-[#222222] py-14 sm:py-20" id="ai-discover-section">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="inline-flex items-center space-x-1.5 bg-[#ffffff] border border-[#dddddd] shadow-xs px-3.5 py-1.5 text-[10px] text-[#222222] font-semibold uppercase tracking-widest mb-6 rounded-full font-mono">
                <Sparkles className="h-3.5 w-3.5 text-[#ff385c] animate-pulse" />
                <span>AI Curator Search Solution</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-sans font-medium text-[#222222] tracking-tight leading-tight">
                감성으로 탐색하는 나의 예술 취향
              </h2>
              <p className="mt-3 text-sm text-[#6a6a6a] font-light max-w-xl mx-auto">
                &quot;침실 침대맡에 어울리는 포근하고 평화로운 분위기의 그림&quot;, &quot;거칠고 아방가르드한 철제 기하학 조각&quot; 등 원하는 느낌을 대화하듯 편하게 남겨보세요.
              </p>

              <form onSubmit={handleAiSearch} className="mt-8 relative max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center overflow-hidden border border-[#dddddd] bg-white shadow-xs focus-within:shadow-md focus-within:border-[#ff385c] hover:border-[#ff385c]/50 transition-all rounded-full p-1 pl-4">
                  <div className="flex-1 flex items-center w-full px-2 py-1">
                    <Search className="h-4.5 w-4.5 text-[#ff385c] mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={naturalSearchQuery}
                      onChange={(e) => setNaturalSearchQuery(e.target.value)}
                      placeholder="내 공간, 마음에 어울리는 수채 전경이나 색채조건을 자유롭게 입력해보세요..."
                      className="w-full bg-transparent border-0 outline-0 text-[#222222] placeholder-[#6a6a6a] font-sans text-sm"
                      id="ai-search-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAiLoading || !naturalSearchQuery.trim()}
                    className="w-full sm:w-auto h-11 px-6 bg-[#ff385c] hover:bg-[#e00b41] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wider rounded-full transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer border-none"
                    id="ai-search-submit"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>AI 큐레이터 추천</span>
                  </button>
                </div>
              </form>

              {/* Progress Wizard Overlay */}
              {isAiLoading && (
                <div className="mt-6 max-w-lg mx-auto bg-white border border-[#dddddd] shadow-sm p-5 rounded-xl text-left" id="ai-progress-wizard">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold tracking-wider text-[#ff385c] animate-pulse">AI CURATOR IS PROCESSING...</span>
                    <span className="text-xs font-mono text-[#6a6a6a]">
                      {aiLoadingStep === 1 ? "30%" : aiLoadingStep === 2 ? "65%" : "100%"}
                    </span>
                  </div>
                  
                  <div className="h-1 bg-gray-100 w-full mb-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff385c] transition-all duration-1000 ease-out" 
                      style={{ width: aiLoadingStep === 1 ? "30%" : aiLoadingStep === 2 ? "65%" : "100%" }}
                    />
                  </div>

                  <div className="space-y-2 border-l-2 border-[#dddddd] pl-3 text-[#222222]">
                    <p className={`text-xs flex items-center space-x-2 transition-opacity ${aiLoadingStep >= 1 ? "text-[#222222] font-semibold" : "text-[#7f7f7f]"}`}>
                      <span className={aiLoadingStep > 1 ? "text-[#ff385c]" : "animate-pulse"}>●</span>
                      <span>{aiLoadingStep > 1 ? "✓ 회화적 감성 및 구문 명세 분석 완료" : "구문 맥락에 내포된 감각·도상학적 무드 탐색 중..."}</span>
                    </p>
                    <p className={`text-xs flex items-center space-x-2 transition-opacity ${aiLoadingStep >= 2 ? "text-[#222222] font-semibold" : "text-[#7f7f7f]"}`}>
                      <span className={aiLoadingStep > 2 ? "text-[#ff385c]" : "animate-pulse"}>●</span>
                      <span>{aiLoadingStep > 2 ? "✓ 감성 매개 키워드 태그 해체 완료" : "메타데이터 기반 예술가 핵심 키워드 대조 중..."}</span>
                    </p>
                    <p className={`text-xs flex items-center space-x-2 transition-opacity ${aiLoadingStep >= 3 ? "text-[#222222] font-semibold" : "text-[#7f7f7f]"}`}>
                      <span>●</span>
                      <span>{aiLoadingStep >= 3 ? "✓ 큐레이션 리포트 및 매칭 데이터 출력 완료" : "도상학적 공간 구조 및 매칭 매트릭스 도출 중..."}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* 검색 에러 표시 */}
              {searchError && !isAiLoading && (
                <div className="mt-4 max-w-lg mx-auto bg-red-50 border border-red-100 rounded-xl p-4 flex items-center space-x-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-[#ff385c] shrink-0" />
                  <p className="text-xs text-[#ff385c] font-semibold">{searchError}</p>
                </div>
              )}

              {/* Preset suggestions (white badge design) */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                <span className="text-xs text-[#6a6a6a] self-center font-mono py-1">추천 예제:</span>
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNaturalSearchQuery(p.text);
                      executeSearch(p.text);
                    }}
                    className="bg-white hover:bg-[#f7f7f7] text-[#222222] text-xs font-semibold py-1.5 px-3 border border-[#dddddd] rounded-full shadow-xs transition-all text-left cursor-pointer"
                  >
                    <span className="mr-1">{p.icon}</span>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ─── 방 사진 AI 매칭 패널 (Iamhero) ─────────────────────────── */}
          <section className="bg-white border-b border-[#ebebeb]">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {/* 토글 버튼 */}
              <button
                type="button"
                onClick={() => setShowRoomMatch((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#f7f7f7] hover:bg-[#f0f0f0] border border-[#ebebeb] rounded-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="h-4 w-4 text-[#ff385c]" />
                  <span className="text-sm font-bold text-[#222222]">방 사진으로 AI 작품 매칭</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-violet-100 text-violet-600 rounded-full uppercase tracking-widest">
                    Powered by Iamhero AI
                  </span>
                </div>
                {showRoomMatch
                  ? <ChevronUp className="h-4 w-4 text-[#6a6a6a]" />
                  : <ChevronDown className="h-4 w-4 text-[#6a6a6a]" />
                }
              </button>

              {/* 패널 본문 */}
              {showRoomMatch && (
                <form onSubmit={handleRoomMatch} className="mt-4 p-5 border border-[#ebebeb] rounded-xl bg-[#fafafa] space-y-4">
                  <p className="text-xs text-[#6a6a6a]">
                    방 사진과 현재 기분/원하는 분위기를 입력하면, 텍스트·이미지·색상을 동시에 분석해 가장 잘 어울리는 작품 3점을 추천합니다.
                  </p>

                  {/* 기분 입력 */}
                  <div>
                    <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                      현재 기분 / 원하는 분위기
                    </label>
                    <textarea
                      value={roomMatchText}
                      onChange={(e) => { setRoomMatchText(e.target.value); setRoomMatchError(null); }}
                      placeholder="예) 요즘 너무 지쳐있다. 조용하고 차분한 자연 풍경이 있는 그림이 있었으면 좋겠다."
                      rows={3}
                      className="w-full border border-[#dddddd] rounded-lg px-4 py-2.5 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/20 transition-all bg-white resize-none"
                    />
                  </div>

                  {/* 방 사진 업로드 */}
                  <div>
                    <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                      방 사진 업로드
                    </label>
                    <div
                      onClick={() => roomFileInputRef.current?.click()}
                      className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#dddddd] rounded-xl p-5 cursor-pointer hover:border-[#ff385c]/50 hover:bg-[#fff5f6] transition-all"
                    >
                      {roomMatchPreview ? (
                        <>
                          <img
                            src={roomMatchPreview}
                            alt="방 사진 미리보기"
                            className="max-h-40 rounded-lg object-cover mb-2"
                          />
                          <span className="text-[11px] text-[#6a6a6a]">클릭하여 사진 변경</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-[#dddddd] mb-2" />
                          <span className="text-xs text-[#6a6a6a]">클릭하여 방 사진 선택</span>
                          <span className="text-[10px] text-[#aaaaaa] mt-1">JPG, PNG, WEBP</span>
                        </>
                      )}
                    </div>
                    <input
                      ref={roomFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleRoomFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* 에러 */}
                  {roomMatchError && (
                    <div className="flex items-center gap-2 p-3 bg-[#ff385c]/5 border border-[#ff385c]/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-[#ff385c] shrink-0" />
                      <p className="text-xs text-[#ff385c] font-medium">{roomMatchError}</p>
                    </div>
                  )}

                  {/* 제출 버튼 */}
                  <button
                    type="submit"
                    disabled={isRoomMatchLoading || !roomMatchText.trim() || !roomMatchFile}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff385c] hover:bg-[#e00b41] disabled:bg-[#dddddd] disabled:text-[#aaaaaa] disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all border-none cursor-pointer"
                  >
                    {isRoomMatchLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AI 분석 중... (최초 실행 시 1~2분 소요)</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>방 사진으로 작품 매칭</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Catalog Explorations Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="explore-view">
            {/* Tag Chips Filters Overview */}
            {activeSelectedTags.length > 0 && (
              <div className="mb-8 p-4 bg-[#ff385c]/5 border border-[#ff385c]/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-[#ff385c]" />
                  <span className="text-sm text-[#222222] font-bold">AI 추출 추천 키워드:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSelectedTags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center space-x-1.5 bg-[#222222] text-white text-xs px-3 py-1 rounded-full font-medium font-sans shadow-xs"
                      >
                        <span>#{tag}</span>
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-[#ff385c] focus:outline-none cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveSelectedTags([]);
                    setAiResult(null);
                  }}
                  className="text-xs font-bold text-[#6a6a6a] hover:text-[#222222] px-3 py-1.5 border border-[#dddddd] bg-white rounded-full transition-all cursor-pointer"
                >
                  필터 전체 초기화
                </button>
              </div>
            )}

            {/* AI Search Match explanations Notice */}
            {aiResult && !isAiLoading && (
              <div className="mb-8 p-6 bg-white border border-[#dddddd] shadow-xs rounded-2xl">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#ff385c] text-white rounded-full">
                    <Sparkles className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-sans font-bold text-[#222222] flex items-center space-x-2">
                      <span>AI Curator's Recommendation Report</span>
                      <span className="text-xs bg-[#f7f7f7] text-[#6a6a6a] px-2 py-0.5 rounded-full font-mono">
                        {aiResult.isMocked ? "로컬 하이퍼 매치 작동" : "Gemini live 분석"}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-[#6a6a6a] leading-relaxed max-w-3xl font-light">
                      제안해 주신 묘사 <em>&ldquo;{naturalSearchQuery}&rdquo;</em> 에 호응하는 신진 작가의 소장 미술 컬렉션을 아래에 소장 등급순으로 하이라이팅했습니다. 작품 카드에서 <strong>큐레이터의 추천사</strong>를 직접 확인해 보세요.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Category Tabs (Airbnb Brand Category strip feel) */}
            <div className="flex overflow-x-auto pb-2 border-b border-[#ebebeb] mb-10 space-x-2 scrollbar-thin" id="category-tabs">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`py-3 px-5 text-sm font-sans font-bold shrink-0 transition-all ${
                  selectedCategory === "All"
                    ? "border-b-2 border-[#222222] text-[#222222]"
                    : "text-[#6a6a6a] hover:text-[#222222] hover:border-b-2 hover:border-[#ebebeb]"
                }`}
              >
                전체 매체 ({artworks.length})
              </button>
              {(["Painting", "Sculpture", "Photography", "Media Art", "Craft"] as ArtCategory[]).map((cat) => {
                const count = artworks.filter((a) => a.category === cat).length;
                const koreanLabels: { [key: string]: string } = {
                  Painting: "회화",
                  Sculpture: "조소/조각",
                  Photography: "사진",
                  "Media Art": "미디어아트",
                  Craft: "공예",
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-3 px-5 text-sm font-sans font-bold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? "border-b-2 border-[#222222] text-[#222222]"
                        : "text-[#6a6a6a] hover:text-[#222222] hover:border-b-2 hover:border-[#ebebeb]"
                    }`}
                  >
                    {koreanLabels[cat]} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Grid / Masonry style structure via CSS Columns */}
            <div className="relative" id="explore-grid">
              {filteredArtworks.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                  {filteredArtworks.map((art) => {
                    // Check if matched by AI search report
                    const isAiBestMatched = aiResult?.matchedArtworkIds?.includes(art.id);
                    const matchedReason = aiResult?.explanations?.[art.id];

                    return (
                      <div
                        key={art.id}
                        onClick={() => handleOpenArtwork(art)}
                        className={`break-inside-avoid bg-white border border-[#ebebeb] rounded-[14px] p-5 group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#ff385c]/40 flex flex-col justify-between ${
                          isAiBestMatched ? "ring-2 ring-[#ff385c] shadow-md relative" : ""
                        }`}
                      >
                        {/* AI Match Badge (Airbnb floating style) */}
                        {isAiBestMatched && (
                          <div className="absolute top-3 right-3 z-10 bg-[#ff385c] text-white text-[9px] font-sans tracking-wider uppercase font-bold px-3 py-1 flex items-center space-x-1 shadow-sm rounded-full">
                            <Sparkles className="h-3 w-3 text-white" />
                            <span>curator's match</span>
                          </div>
                        )}

                        <div>
                          {/* Image box (Rounded Top md token) */}
                          <div className="relative overflow-hidden aspect-auto bg-[#f2f2f2] rounded-lg mb-4 min-h-[160px] flex items-center justify-center">
                            <img
                              src={art.image}
                              alt={art.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-auto object-cover max-h-[460px] transition-transform duration-700 group-hover:scale-102 rounded-lg"
                              onError={(e) => {
                                const img = e.currentTarget;
                                img.style.display = "none";
                                const parent = img.parentElement;
                                if (parent && !parent.querySelector(".img-fallback")) {
                                  const fb = document.createElement("div");
                                  fb.className = "img-fallback flex flex-col items-center justify-center gap-2 py-10 w-full text-[#cccccc]";
                                  fb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:11px;color:#aaa">이미지 없음</span>';
                                  parent.appendChild(fb);
                                }
                              }}
                            />
                            {/* Hover zoom icon overlay */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                              <div className="p-3 bg-white/95 backdrop-blur-sm shadow-sm rounded-full self-center">
                                <ZoomIn className="h-4.5 w-4.5 text-[#222222]" />
                              </div>
                            </div>
                          </div>

                          {/* Media Spec Label */}
                          <div className="flex items-center space-x-2 mb-2 bg-[#f7f7f7] px-2.5 py-1 rounded-md w-max">
                            <span className="text-[10px] font-bold tracking-wider text-[#ff385c]">
                              {art.category.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-[#6a6a6a]">
                              {art.year}
                            </span>
                          </div>

                          {/* Meta description specs */}
                          <h3 className="font-sans font-bold text-base text-[#222222] group-hover:text-[#ff385c] transition-colors leading-tight">
                            {art.title}
                          </h3>
                          <p className="text-xs text-[#6a6a6a] font-sans mt-0.5">작가 {art.artistName}</p>
                          
                          <p className="mt-3 text-xs text-[#6a6a6a] font-light leading-relaxed line-clamp-3">
                            {art.description}
                          </p>
                        </div>

                        {/* Custom Curator matching tag explanation (Rausch highlight box) */}
                        {isAiBestMatched && matchedReason && (
                          <div className="mt-4 p-3.5 bg-[#ff385c]/5 border-l-2 border-[#ff385c] text-xs text-[#222222] font-sans leading-relaxed rounded-r-md">
                            <span className="font-bold flex items-center space-x-1 text-[#ff385c] mb-1">
                              <Sparkles className="h-3.5 w-3.5 text-[#ff385c]" />
                              <span>큐레이터 매칭 해설:</span>
                            </span>
                            {matchedReason}
                          </div>
                        )}

                        {/* Specs strip bottom */}
                        <div className="border-t border-[#ebebeb] pt-3.5 mt-4 flex items-center justify-between text-xs">
                          <span className="text-[#6a6a6a] font-normal italic truncate max-w-[150px]">{art.medium}</span>
                          <span className="font-sans font-extrabold text-[#222222] text-sm">{art.priceRange}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24 bg-white border border-[#ebebeb] rounded-xl shadow-xs">
                  <Info className="h-10 w-10 text-[#ff385c] mx-auto mb-4" />
                  <p className="font-sans font-bold text-[#222222] text-lg">해당 조건에 만족하는 작품이 없습니다.</p>
                  <p className="text-sm text-[#6a6a6a] max-w-sm mx-auto mt-1 font-light">AI 검색 조건 키워드를 일부 제거하거나 카테고리 필터를 '전체 매체'로 설정하여 새로운 자취를 탐색해 보세요.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory("All");
                      setActiveSelectedTags([]);
                      setAiResult(null);
                    }}
                    className="mt-6 px-5 py-2.5 border border-[#dddddd] text-xs font-bold hover:bg-[#ff385c] hover:text-white rounded-full transition-all cursor-pointer bg-white text-[#222222]"
                  >
                    필터 및 큐레이터 정렬 초기화
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Section 2: Emerging Artist Spotlight Stories */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="artist-spotlight-section">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h2 className="font-sans font-black text-2xl text-black">이달의 작가 &amp; 인터뷰</h2>
            <p className="text-sm text-gray-500">작업 공간의 철학과 동경을 고스란히 나누는 창작자 탐험</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => {
              const worksCount = artworks.filter((a) => a.artistId === artist.id).length;
              return (
                <div 
                  key={artist.id}
                  className="bg-white border border-gray-200 p-6 flex flex-col justify-between hover:border-black/30 transition-all duration-300"
                >
                  <div>
                    {/* Head row */}
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector(".avatar-fallback")) {
                            const fb = document.createElement("div");
                            fb.className = "avatar-fallback h-14 w-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold";
                            fb.textContent = artist.name.charAt(0);
                            parent.insertBefore(fb, e.currentTarget);
                          }
                        }}
                      />
                      <div>
                        <h3 className="font-sans font-bold text-base text-black flex items-center space-x-1.5">
                          <span>{artist.name}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-sm">작가</span>
                        </h3>
                        <p className="text-xs text-gray-400 font-sans">{artist.email}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-sans leading-relaxed line-clamp-3 mb-4 bg-gray-50 p-3">
                      {artist.bio}
                    </p>

                    {/* Keywords chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {artist.keywords.map((word) => (
                        <span key={word} className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5">
                          #{word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono uppercase font-bold">소장작품: {worksCount}점</span>
                    <button
                      onClick={() => setShowFullInterview(artist)}
                      className="text-xs font-bold font-sans text-black hover:text-neutral-500 flex items-center space-x-1 p-1 bg-neutral-100 hover:bg-neutral-200"
                    >
                      <span>인터뷰 &amp; 대표작 보기</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* Sub Drawer: SHOW DETAIL ARTWORK LIGHTBOX MODAL */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full flex flex-col md:flex-row overflow-hidden border border-black shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
            
            {/* Close modal X */}
            <button 
              onClick={() => setSelectedArtwork(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-black hover:text-white p-2 border border-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: Huge high-resolution image */}
            <div className="flex-1 bg-gray-50 relative group flex items-center justify-center min-h-[350px]">
              <img
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[580px] object-contain transition-transform duration-700 ease-in-out group-hover:scale-102"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector(".img-fallback")) {
                    const fb = document.createElement("div");
                    fb.className = "img-fallback flex flex-col items-center justify-center gap-3 text-gray-300 w-full h-full min-h-[350px]";
                    fb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:12px;color:#bbb">이미지를 불러올 수 없습니다</span>';
                    parent.appendChild(fb);
                  }
                }}
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xs px-3 py-1.5 text-white/90 text-xs font-mono font-bold">
                {selectedArtwork.dimensions}
              </div>
            </div>

            {/* Right: Fine Art metadata sheet */}
            <div className="w-full md:w-[380px] p-6 sm:p-8 flex flex-col justify-between border-l border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-black text-white px-2 py-1 font-semibold tracking-wider font-mono">
                    {selectedArtwork.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-gray-500 font-semibold">{selectedArtwork.year}년작</span>
                </div>

                <div>
                  <h1 className="font-sans font-black text-xl sm:text-2xl text-black leading-tight">
                    {selectedArtwork.title}
                  </h1>
                  <p className="mt-1 font-sans text-sm text-gray-400 font-medium">{selectedArtwork.artistName}</p>
                </div>

                <div className="py-3 border-y border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono">매체 / 기법</span>
                    <span className="text-black font-semibold font-sans">{selectedArtwork.medium}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 font-mono">작품 크기</span>
                    <span className="text-black font-semibold font-mono">{selectedArtwork.dimensions}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 font-mono">소장 가디언가(가제)</span>
                    <span className="text-emerald-700 font-bold font-sans text-sm leading-none">{selectedArtwork.priceRange}</span>
                  </div>
                </div>

                {/* Artist mini card */}
                {(() => {
                  const artArtist = artists.find((a) => a.id === selectedArtwork.artistId);
                  return (
                    <div className="bg-gray-50 p-3 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={artArtist?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt={selectedArtwork.artistName}
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"; }}
                        />
                        <div>
                          <p className="text-xs font-bold text-black font-sans">{selectedArtwork.artistName}</p>
                          <p className="text-[10px] text-gray-400">작가 프로필 공인인증 완료</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const matchedArtist = artists.find((a) => a.id === selectedArtwork.artistId);
                          if (matchedArtist) {
                            setSelectedArtistPortfolio(matchedArtist);
                            setSelectedArtwork(null); // transition lock
                          }
                        }}
                        className="text-[10px] font-sans font-bold bg-white text-black border border-gray-200 py-1 px-2 hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        포트폴리오
                      </button>
                    </div>
                  );
                })()}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {selectedArtwork.tags.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2.5 py-0.5">
                      #{t}
                    </span>
                  ))}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-600 font-sans">작품 상세 노트 및 수집가 안내:</h4>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed font-light font-sans max-h-[140px] overflow-y-auto">
                    {selectedArtwork.description}
                  </p>
                </div>
              </div>

              {/* Inquiry CTA block */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full bg-black text-white py-3 font-sans font-bold text-sm tracking-wide flex items-center justify-center space-x-2 hover:bg-neutral-800 transition-all rounded-none"
                >
                  <Mail className="h-4 w-4" />
                  <span>작가에게 소장 문의 및 의사 전송</span>
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-1.5 font-sans leading-relaxed">
                  본 플랫폼은 현장 직거래나 경매를 중독하지 않으며, 구매 희망자의 문의를 작가의 메일/계정 관리망으로 다이렉트 전송합니다.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* Sub Drawer: SHOW ARTIST PORTFOLIO LIGHTBOX VIEW */}
      {selectedArtistPortfolio && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full p-6 sm:p-8 overflow-hidden border border-black shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedArtistPortfolio(null)}
              className="absolute top-4 right-4 bg-white hover:bg-black hover:text-white p-2 border border-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border-b border-gray-200 pb-6 mb-6">
              <img
                src={selectedArtistPortfolio.avatar}
                alt={selectedArtistPortfolio.name}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-full object-cover border border-gray-300 shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector(".avatar-fallback")) {
                    const fb = document.createElement("div");
                    fb.className = "avatar-fallback h-20 w-20 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-2xl font-bold";
                    fb.textContent = selectedArtistPortfolio.name.charAt(0);
                    parent.insertBefore(fb, e.currentTarget);
                  }
                }}
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-sans font-black text-xl text-black flex items-center justify-center sm:justify-start space-x-2">
                  <span>{selectedArtistPortfolio.name}</span>
                  <span className="text-[10px] bg-neutral-900 text-white font-mono uppercase px-2 py-0.5 tracking-wider">emerging creator</span>
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedArtistPortfolio.email}</p>
                <p className="text-sm font-sans text-gray-500 mt-2.5 leading-relaxed font-light">
                  {selectedArtistPortfolio.bio}
                </p>
                {/* Keywords */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                  {selectedArtistPortfolio.keywords.map((kw) => (
                    <span key={kw} className="text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-0.5 border border-gray-100">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content: Dual Grid (Works Grid | Interview Sheet) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[380px] overflow-y-auto pr-2">
              
              {/* Works section */}
              <div>
                <h3 className="font-sans font-bold text-sm text-black mb-4 flex items-center space-x-1.5">
                  <Layers className="h-4 w-4" />
                  <span>작가의 대표작 갤러리</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {artworks
                    .filter((art) => art.artistId === selectedArtistPortfolio.id)
                    .map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          setSelectedArtwork(art);
                          setSelectedArtistPortfolio(null); // crossover transition
                        }}
                        className="group border border-gray-100 p-2 cursor-pointer hover:border-black/30 transition-all bg-gray-50/50"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-2 flex items-center justify-center">
                          <img
                            src={art.image}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        </div>
                        <h4 className="text-xs font-bold text-black font-sans leading-tight truncate">{art.title}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{art.priceRange}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Interview Q&As */}
              <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
                <h3 className="font-sans font-bold text-sm text-black mb-4 flex items-center space-x-1.5">
                  <MessageCircle className="h-4 w-4" />
                  <span>작가 큐레이팅 단독 인터뷰</span>
                </h3>

                <div className="space-y-4">
                  {selectedArtistPortfolio.interviewQuestions.map((qa, i) => (
                    <div key={i} className="bg-gray-50 p-3.5 border-l-4 border-black space-y-1">
                      <p className="text-xs font-bold text-neutral-800 font-sans">
                        Q. {qa.question}
                      </p>
                      <p className="text-xs text-gray-500 font-light leading-relaxed font-sans pl-1.5">
                        &ldquo;{qa.answer}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Inquiries Panel */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setSelectedArtistPortfolio(null)}
                className="px-6 py-2 border border-black font-sans text-xs font-bold hover:bg-black hover:text-white transition-all rounded-none"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}


      {/* Sub Drawer: SHOW DETAILED WRITTEN STORIES / INTERVIEW MODAL */}
      {showFullInterview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 border border-black shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowFullInterview(null)}
              className="absolute top-4 right-4 bg-white hover:bg-black hover:text-white p-2 border border-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[10px] bg-black text-white font-mono font-bold tracking-widest px-2 py-0.5">ESTEEMED INTERVIEW</span>
              <h2 className="font-sans font-black text-2xl text-black mt-2">
                작가 {showFullInterview.name} 이야기
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">예술을 빚어내는 무형의 고뇌와 흔적들을 나눕니다.</p>
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2" id="full-interview-scroll">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 border border-gray-100">
                <img
                  src={showFullInterview.avatar}
                  alt={showFullInterview.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector(".avatar-fallback")) {
                      const fb = document.createElement("div");
                      fb.className = "avatar-fallback h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0";
                      fb.textContent = showFullInterview.name.charAt(0);
                      parent.insertBefore(fb, e.currentTarget);
                    }
                  }}
                />
                <div>
                  <p className="text-xs text-gray-400">작가 소개글</p>
                  <p className="text-xs text-gray-600 font-light font-sans leading-relaxed">{showFullInterview.bio}</p>
                </div>
              </div>

              {showFullInterview.interviewQuestions.map((qa, i) => (
                <div key={i} className="space-y-2 border-b border-gray-100 pb-4 last:border-b-0">
                  <h4 className="font-sans font-bold text-sm text-black flex items-start space-x-2">
                    <span className="text-amber-600 font-mono">Q{i+1}.</span>
                    <span>{qa.question}</span>
                  </h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed pl-5 font-sans">
                    &ldquo;{qa.answer}&rdquo;
                  </p>
                </div>
              ))}

              {/* Representative artworks list of this specific artist */}
              <div>
                <h4 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider mb-3">소장 가능 대표 컬렉션</h4>
                <div className="grid grid-cols-3 gap-3">
                  {artworks
                    .filter((art) => art.artistId === showFullInterview.id)
                    .map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          setSelectedArtwork(art);
                          setShowFullInterview(null); // cross
                        }}
                        className="cursor-pointer border border-gray-100 p-1 bg-gray-50/50 hover:border-black/30 transition-all text-center"
                      >
                        <img
                          src={art.image}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full aspect-square object-cover mb-1 bg-gray-100"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <p className="text-[10px] font-sans font-bold text-black truncate">{art.title}</p>
                        <p className="text-[9px] font-mono text-gray-400">{art.priceRange}</p>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowFullInterview(null)}
                className="px-6 py-2 border border-black font-sans text-xs font-bold hover:bg-black hover:text-white transition-all rounded-none"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Sub Modal: ARTWORK INQUIRY DIALOG SCREEN */}
      {showInquiryModal && selectedArtwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 border-2 border-black shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 bg-white hover:bg-black hover:text-white p-1.5 border border-gray-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2.5 bg-neutral-900 text-white rounded-none mb-3">
                <Mail className="h-5 w-5 text-amber-300" />
              </div>
              <h2 className="font-sans font-black text-lg text-black">
                작가 소장 다이렉트 문의 송출
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                작품 <strong>&lsquo;{selectedArtwork.title}&rsquo;</strong> 의 소장 구매 방식, 운송 요율, 실제 프레임 질의를 작가 본인에게 정형화된 서류 형태로 발송합니다.
              </p>
            </div>

            {inquirySuccess ? (
              <div className="py-10 text-center space-y-4" id="inquiry-success-view">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-gray-800">문의가 전송되었습니다!</h3>
                  <p className="text-xs text-gray-400 leading-relaxed px-4 mt-1">
                    작가에게 문의가 전달되었습니다. 채팅에서 실시간으로 소통해보세요.
                  </p>
                </div>
                {onOpenChat && (
                  <button
                    onClick={() => {
                      setShowInquiryModal(false);
                      setInquirySuccess(false);
                      setInquiryMessage("");
                      onOpenChat(createdInquiryId ?? undefined);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff385c] text-white text-xs font-bold rounded-full hover:bg-[#e00b41] transition-all border-none cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    채팅으로 이동하기
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setInquirySuccess(false);
                    setInquiryMessage("");
                  }}
                  className="block mx-auto text-xs text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer mt-1"
                >
                  닫기
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4" id="inquiry-form">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-sans mb-1">문의자 실명 (성함)</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-sans mb-1">회신 수취용 이메일 계정</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-sans mb-1">수집의 지향성 및 메모 서신</label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 text-xs text-black focus:bg-white focus:border-black font-sans leading-relaxed"
                  />
                </div>

                {inquiryError && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-[#ff385c] shrink-0" />
                    <p className="text-xs text-[#ff385c]">{inquiryError}</p>
                  </div>
                )}

                <div className="pt-4 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="flex-1 bg-white hover:bg-gray-100 text-black border border-gray-200 py-2.5 font-bold text-xs truncate rounded-none"
                  >
                    아니오, 취소
                  </button>
                  <button
                    type="submit"
                    disabled={isInquirySubmitting}
                    className="flex-1 bg-black hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-bold text-xs py-2.5 truncate rounded-none flex items-center justify-center space-x-1.5"
                  >
                    <span>{isInquirySubmitting ? "전송 처리 중..." : "예, 서식 발송"}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
