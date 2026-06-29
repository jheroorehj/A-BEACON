/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  Plus, Trash2, Mail, Save, Sparkles,
  FileText, Check, FileCheck, Layers, RefreshCw,
  BookOpen, Download, DollarSign, ExternalLink, ArrowRight, CheckCircle2,
  AlertCircle, ChevronUp, ChevronDown, Eye, Palette
} from "lucide-react";
import { Artwork, Artist, UserInquiry, ArtCategory, ArtistCard, ProfileBlock, ProfileBlockType, CardArchetype } from "../types";
import { artistsApi, artworksApi, inquiriesApi, searchApi, ApiError } from "../services/api";
import { ArtistCardRender, getCardConfig } from "./ArtistCardRender";

interface ArtistManagerProps {
  artworks: Artwork[];
  artists: Artist[];
  userEmail: string;
  selectedArtistId: string;
  onRefreshArtworks: () => void;
  onOpenChat?: (inquiryId?: string) => void;
}

export default function ArtistManager({
  artworks,
  artists,
  userEmail,
  selectedArtistId,
  onRefreshArtworks,
  onOpenChat,
}: ArtistManagerProps) {
  // Navigation inside the Artist Dedicated Page
  const [activeTab, setActiveTab] = useState<"guides" | "portfolio" | "inquiries">("guides");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Local active artist profile
  const [profile, setProfile] = useState<Artist | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileKeywordsText, setProfileKeywordsText] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  // ── 카드 빌더 상태 ─────────────────────────────────────────────────────────
  const [cardStep, setCardStep] = useState<1 | 2 | 3>(1);
  const [cardArchetype, setCardArchetype] = useState<CardArchetype>("cover");
  const [cardImage, setCardImage] = useState("");
  const [cardHeadline, setCardHeadline] = useState("");
  const [cardQuote, setCardQuote] = useState("");
  const [cardBgColor, setCardBgColor] = useState("#1a1a1a");
  const [cardAccentColor, setCardAccentColor] = useState("#ff385c");
  const [cardTextColor, setCardTextColor] = useState<"white" | "black">("white");
  const [cardShowSchool, setCardShowSchool] = useState(true);
  const [cardShowMedium, setCardShowMedium] = useState(true);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [saveCardSuccess, setSaveCardSuccess] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(true);

  // ── 프로필 블록 상태 ────────────────────────────────────────────────────────
  const [profileBlocks, setProfileBlocks] = useState<ProfileBlock[]>([]);
  const [isSavingBlocks, setIsSavingBlocks] = useState(false);
  const [saveBlocksSuccess, setSaveBlocksSuccess] = useState(false);
  const [showBlocksSection, setShowBlocksSection] = useState(false);

  // Artwork Upload Form fields
  const [artTitle, setArtTitle] = useState("");
  const [artDescription, setArtDescription] = useState("");
  const [artCategory, setArtCategory] = useState<ArtCategory>("Painting");
  const [artMedium, setArtMedium] = useState("");
  const [artDimensions, setArtDimensions] = useState("");
  const [artPriceRange, setArtPriceRange] = useState("");
  const [artImage, setArtImage] = useState("");
  const [artTagsText, setArtTagsText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // AI Autotagger states
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [autoTagSuccess, setAutoTagSuccess] = useState(false);

  // Received Inquiries state
  const [myInquiries, setMyInquiries] = useState<UserInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<"전체" | "문의중" | "거래중" | "거래완료" | "취소">("전체");

  // Preset Unsplash links to help artists populate gorgeous stock art instantly
  const presetArtImages = [
    { name: "파스텔 유화", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" },
    { name: "차가운 철골", url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80" },
    { name: "미니멀 세라믹", url: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=800&auto=format&fit=crop&q=80" },
    { name: "몽환 네온", url: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80" },
    { name: "수학적 미디어", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80" },
  ];

  // Fetch or setup current artist profile on mount / selection change
  useEffect(() => {
    fetchArtistProfile();
    fetchMyInquiries();
  }, [selectedArtistId]);

  // 문의 탭 활성화 시 최신 상태 자동 갱신
  useEffect(() => {
    if (activeTab === "inquiries") {
      fetchMyInquiries();
    }
  }, [activeTab]);

  const fetchArtistProfile = async () => {
    try {
      const data = await artistsApi.get(selectedArtistId);
      setProfile(data);
      setProfileName(data.name);
      setProfileBio(data.bio);
      setProfileEmail(data.email);
      setProfileAvatar(data.avatar);
      setProfileKeywordsText(data.keywords.join(", "));
      // 카드 빌더 초기화
      if (data.card) {
        setCardArchetype(data.card.archetype);
        setCardImage(data.card.image);
        setCardHeadline(data.card.headline);
        setCardQuote(data.card.quote);
        setCardBgColor(data.card.bgColor);
        setCardAccentColor(data.card.accentColor);
        setCardTextColor(data.card.textColor);
        setCardShowSchool(data.card.showBadges.school);
        setCardShowMedium(data.card.showBadges.medium);
      }
      // 프로필 블록 초기화
      if (data.profileBlocks) {
        setProfileBlocks([...data.profileBlocks].sort((a, b) => a.order - b.order));
      }
    } catch (e) {
      console.error("Fetch profile failed:", e);
    }
  };

  const fetchMyInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const data = await inquiriesApi.listByArtist(selectedArtistId);
      setMyInquiries(data);
    } catch (e) {
      console.error("Fetch inquiries failure:", e);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  // Save profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveProfileSuccess(false);

    const keywords = profileKeywordsText
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    try {
      await artistsApi.update(selectedArtistId, {
        name: profileName,
        bio: profileBio,
        email: profileEmail,
        avatar: profileAvatar,
        keywords,
      });
      setSaveProfileSuccess(true);
      fetchArtistProfile();
      onRefreshArtworks();
      setTimeout(() => setSaveProfileSuccess(false), 2000);
    } catch (e) {
      console.error("Profile save error:", e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── 카드 저장 ──────────────────────────────────────────────────────────────
  const handleSaveCard = async () => {
    setIsSavingCard(true);
    setSaveCardSuccess(false);
    const card: ArtistCard = {
      archetype: cardArchetype,
      image: cardImage || profileAvatar,
      headline: cardHeadline,
      quote: cardQuote,
      bgColor: cardBgColor,
      accentColor: cardAccentColor,
      textColor: cardTextColor,
      showBadges: { school: cardShowSchool, medium: cardShowMedium, year: false },
    };
    try {
      await artistsApi.update(selectedArtistId, { card } as any);
      setSaveCardSuccess(true);
      fetchArtistProfile();
      setTimeout(() => setSaveCardSuccess(false), 2000);
    } catch (e) {
      console.error("Card save error:", e);
    } finally {
      setIsSavingCard(false);
    }
  };

  // ── 블록 저장 ──────────────────────────────────────────────────────────────
  const handleSaveBlocks = async () => {
    setIsSavingBlocks(true);
    setSaveBlocksSuccess(false);
    try {
      await artistsApi.update(selectedArtistId, { profileBlocks } as any);
      setSaveBlocksSuccess(true);
      setTimeout(() => setSaveBlocksSuccess(false), 2000);
    } catch (e) {
      console.error("Blocks save error:", e);
    } finally {
      setIsSavingBlocks(false);
    }
  };

  const addBlock = (type: ProfileBlockType) => {
    const newBlock: ProfileBlock = {
      id: `pb_${Date.now()}`,
      type,
      order: profileBlocks.length,
      config: {},
    };
    setProfileBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    setProfileBlocks((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })));
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    setProfileBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next.map((b, i) => ({ ...b, order: i }));
    });
  };

  // AI Autotagger triggered during upload
  const handleTriggerAiTags = async () => {
    if (!artTitle.trim()) {
      alert("AI 태그 분석을 작동하기 위해 작품 제목을 먼저 작성해 주세요!");
      return;
    }
    setIsAutoTagging(true);
    setAutoTagSuccess(false);

    try {
      const data = await searchApi.autoTag(artTitle, artDescription);
      setArtTagsText(data.tags.join(", "));
      setAutoTagSuccess(true);
      setTimeout(() => setAutoTagSuccess(false), 2000);
    } catch (e) {
      console.error("AI tagging error:", e);
    } finally {
      setIsAutoTagging(false);
    }
  };

  // Upload artwork
  const handleUploadArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artMedium || !artPriceRange) return;

    const cargoImage = artImage.trim()
      ? artImage.trim()
      : presetArtImages[Math.floor(Math.random() * presetArtImages.length)].url;

    setIsUploading(true);
    setUploadSuccess(false);

    const tags = artTagsText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await artworksApi.create({
        title: artTitle,
        artistId: selectedArtistId,
        artistName: profileName || selectedArtistId,
        image: cargoImage,
        description: artDescription,
        category: artCategory,
        tags,
        year: new Date().getFullYear(),
        medium: artMedium,
        dimensions: artDimensions || "가변 규격",
        priceRange: artPriceRange,
      });
      setUploadSuccess(true);
      onRefreshArtworks();

      setArtTitle("");
      setArtDescription("");
      setArtMedium("");
      setArtDimensions("");
      setArtPriceRange("");
      setArtImage("");
      setArtTagsText("");

      setTimeout(() => setUploadSuccess(false), 2200);
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove Artwork from inventory
  const handleDeleteArtwork = async (id: string) => {
    if (!window.confirm("정말로 이 작품을 포트폴리오에서 삭제하시겠습니까?")) return;

    try {
      await artworksApi.remove(id);
      onRefreshArtworks();
    } catch (e) {
      console.error("Delete artwork failure:", e);
    }
  };

  const handleDownloadDemo = (itemTitle: string) => {
    setDownloadToast(`'${itemTitle}' 리소스 서식 파일 다운로드가 개시되었습니다.`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  const myArtworks = artworks.filter((art) => art.artistId === selectedArtistId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black font-sans" id="artist-manager-root">
      
      {/* Toast Alert for demo downloads */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-4 shadow-2xl border border-amber-400 max-w-sm flex items-start space-x-3 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">A-BEACON Resource Portal</p>
            <p className="text-sm font-sans mt-1 text-slate-100">{downloadToast}</p>
          </div>
        </div>
      )}

      {/* Brand Intro Hero for Artist Support Hub */}
      <div className="bg-[#f7f7f7] border border-[#ebebeb] rounded-2xl p-6 md:p-8 mb-8 text-left" id="artist-hub-header">
        <span className="text-[10px] bg-white text-[#ff385c] font-bold border border-[#ff385c]/20 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
          Artist Dedicated Space
        </span>
        <h1 className="mt-4 font-sans font-extrabold text-2xl md:text-3xl text-[#222222] tracking-tight leading-tight">
          작가 전용 활동 허브 A-BEAC<span className="text-[#ff385c]">O</span>N
        </h1>
        <p className="mt-2 text-sm text-[#222222] font-semibold">
          작가를 위한 든든한 동반자, A-BEACON
        </p>
        <p className="mt-2 text-xs md:text-sm text-[#6a6a6a] font-light leading-relaxed max-w-4xl">
          A-BEACON은 예술에 첫 발을 내딛는 작가님들을 절대 외롭게 두지 않습니다. 창작 생태계에 성공적으로 고착할 수 있도록 성장 튜토리얼, 검증된 합격 예시 자료 및 서식 파일, 그리고 일자별 주요 문화예술 지원 사업 정보를 원스톱으로 제공합니다.
        </p>
      </div>

      {/* Navigation Tab Rails */}
      <div className="flex border-b border-[#ebebeb] mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("guides")}
          className={`flex items-center space-x-2 py-4 px-4 sm:px-6 font-sans font-bold text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "guides"
              ? "border-[#ff385c] text-[#ff385c]"
              : "border-transparent text-[#6a6a6a] hover:text-[#222222]"
          }`}
        >
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span className="sm:hidden">지원 자료실</span>
          <span className="hidden sm:inline">작가 성장 지원 & 공모자료실</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center space-x-2 py-4 px-4 sm:px-6 font-sans font-bold text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "portfolio"
              ? "border-[#ff385c] text-[#ff385c]"
              : "border-transparent text-[#6a6a6a] hover:text-[#222222]"
          }`}
        >
          <Layers className="h-4 w-4 flex-shrink-0" />
          <span className="sm:hidden">포트폴리오 ({myArtworks.length})</span>
          <span className="hidden sm:inline">나의 프로필 & 포트폴리오 발행 ({myArtworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`flex items-center space-x-2 py-4 px-4 sm:px-6 font-sans font-bold text-sm border-b-2 transition-all shrink-0 relative cursor-pointer ${
            activeTab === "inquiries"
              ? "border-[#ff385c] text-[#ff385c]"
              : "border-transparent text-[#6a6a6a] hover:text-[#222222]"
          }`}
        >
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="sm:hidden">구매 문의</span>
          <span className="hidden sm:inline">컬렉터 구매 문의 장부</span>
          {myInquiries.length > 0 && (
            <span className="ml-1.5 bg-[#ff385c] text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full">
              {myInquiries.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab View Portports */}
      <div className="transition-all duration-200">
        
        {/* TAB 1: SUCCESS KIT (GUIDES, TEMPLATES, SUPPORT PROGRAMS) */}
        {activeTab === "guides" && (
          <div className="space-y-12 animate-fade-in" id="guides-tab-section">
            
            {/* Row 1: Tutorials */}
            <div>
              <div className="border-l-4 border-black pl-3 mb-6">
                <span className="text-xs font-mono font-bold text-gray-400 block uppercase">Section 01</span>
                <h2 className="font-sans font-black text-xl md:text-2xl text-black">
                  💡 작가를 위한 성장 튜토리얼
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-gray-200 hover:border-black p-6 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-neutral-100 w-fit text-black mb-4">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="font-sans font-black text-lg text-black mb-2">
                      AI 큐레이션 매칭을 위한 미학적 상세작성법
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      A-BEACON의 AI 큐레이션 엔진은 단순 장르 분류를 넘어 작가의 정체성이 담긴 상세 설명을 비교 분석합니다. "풍경 유화"라는 단순 기재보다는 "쓸쓸한 해질녘 고정된 대지의 따스함과 쓸쓸함이 파스텔톤으로 묘사된 캔버스" 같은 구체적인 시각 형용사를 작가노트 및 개별 세부 설명에 병기해주시면 매칭 노출 만족도가 배로 극대화됩니다.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-6 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>수정 일자: 2026.06</span>
                    <span className="font-sans font-semibold text-black hover:underline cursor-pointer flex items-center space-x-0.5">
                      <span>자세히 보기</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 hover:border-black p-6 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-neutral-100 w-fit text-black mb-4">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-sans font-black text-lg text-black mb-2">
                      매혹적인 '작가 노트(Artist Statement)' 설계 가이드
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      처음 예술 시장에 나서 가장 쓰기 곤란해하는 서술문이 바로 작가 노트입니다. 난해한 철학을 나열하는 것보다는 '내가 왜 이 소재를 집요하게 그리게 되었는지'의 계기, '어떤 기구와 기법으로 차별성을 이루는지' 등 구체적인 경험 중심 기술법의 기승전결 서술 규칙 템플릿입니다.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-6 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>수정 일자: 2026.05</span>
                    <span className="font-sans font-semibold text-black hover:underline cursor-pointer flex items-center space-x-0.5">
                      <span>자세히 보기</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 hover:border-black p-6 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-neutral-100 w-fit text-black mb-4">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-sans font-black text-lg text-black mb-2">
                      신진 작가를 위한 합리적인 생태계 가격 책정 가이드
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      첫 소장 작품의 적정한 가격 단가를 얼마로 매겨야 컬렉터에게 신뢰를 줄까요? 대한민국 미술 유통 시장 신인 기준 '호당 단가표(Size component)' 계산법과, 판매 기록이 적을 때 부담스럽지 않은 ₩500,000 ~ ₩1,800,000 선의 진입형 유통 전략 가이드라인을 상세히 정리해 드립니다.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-6 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span>수정 일자: 2026.04</span>
                    <span className="font-sans font-semibold text-black hover:underline cursor-pointer flex items-center space-x-0.5">
                      <span>자세히 보기</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Row 2: Resources & Download Templates */}
            <div>
              <div className="border-l-4 border-black pl-3 mb-6">
                <span className="text-xs font-mono font-bold text-gray-400 block uppercase">Section 02</span>
                <h2 className="font-sans font-black text-xl md:text-2xl text-black">
                  💾 예시 자료 & 실무 템플릿 아카이브
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-stone-50 border border-stone-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-0.5 bg-neutral-800 text-white font-mono text-[9px] font-bold">HWP / PDF</span>
                      <Download className="h-4 w-4 text-stone-400" />
                    </div>
                    <h4 className="font-sans font-bold text-base text-black mb-1">
                      미술품 양도/판매 표준 계약서 서식
                    </h4>
                    <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                      문화체육관광부가 고시한 미술거래 분야 표준 계약 계약서 양식입니다. 분쟁 없는 거래 성립을 위한 조약 항목 가이드 포함.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadDemo("미술품 표준계약서_A-BEACON.zip")}
                    className="w-full mt-2 bg-white hover:bg-black hover:text-white text-black border border-black py-2 text-xs font-sans font-extrabold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>서식 일체 복사 받기</span>
                  </button>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-0.5 bg-neutral-800 text-white font-mono text-[9px] font-bold">PPTX / CANVA</span>
                      <Download className="h-4 w-4 text-stone-400" />
                    </div>
                    <h4 className="font-sans font-bold text-base text-black mb-1">
                      모던 레이아웃 포트폴리오 슬라이드 디자인
                    </h4>
                    <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                      갤러리 큐레이터 및 파트너십 제안 시 예술성을 극대화시키는 심플하고 직관적인 여백 중심 프레젠테이션 테마입니다.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadDemo("Artist_Portfolio_Template.pptx")}
                    className="w-full mt-2 bg-white hover:bg-black hover:text-white text-black border border-black py-2 text-xs font-sans font-extrabold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>PPTX 템플릿 다운로드</span>
                  </button>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-0.5 bg-neutral-800 text-white font-mono text-[9px] font-bold">WORD / ENG</span>
                      <Download className="h-4 w-4 text-stone-400" />
                    </div>
                    <h4 className="font-sans font-bold text-base text-black mb-1">
                      공식 우수 진출용 작품 보증서 (Certificate) 영문
                    </h4>
                    <p className="text-xs text-stone-500 font-light leading-relaxed mb-4">
                      미술 수집가들에게 정품 보장을 발행하기 위한 세련되고 인위적인 여백을 담은 글로벌 표준 영어 보증 확인서 템플릿입니다.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadDemo("A-BEACON_COA_Form_English.docx")}
                    className="w-full mt-2 bg-white hover:bg-black hover:text-white text-black border border-black py-2 text-xs font-sans font-extrabold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>DOCX 양식 다운로드</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Row 3: Support Programs and Grants */}
            <div>
              <div className="border-l-4 border-black pl-3 mb-6">
                <span className="text-xs font-mono font-bold text-gray-400 block uppercase">Section 03</span>
                <h2 className="font-sans font-black text-xl md:text-2xl text-black">
                  🏛️ 작가 맞춤 정책 지원 사업 & 기획 공모전
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-500/5 border border-dashed border-amber-500/20 p-6 md:p-8">
                
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono bg-red-100 text-red-800 font-bold px-2 py-0.5">D-14 접수중</span>
                    <span className="text-xs font-mono text-gray-400">한국문화예술위원회</span>
                  </div>
                  <h4 className="font-sans font-black text-lg text-black mb-2">
                    2026 예술정착 준비 지원 및 창작 보증보조금
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light mb-4">
                    국내 거주 신진예술인들의 안심 창작 여건 조성을 위해 1인당 연 300만 원부터 최대 2,000만 원 상당의 무조건부 창작 실무 활동수당 수혜 정책입니다. (단독 포트폴리오 가중치 환산 신청서 작성 가능)
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-900">대상: 등단 5년 이하 모든 작가</span>
                    <a href="https://www.arko.or.kr" target="_blank" rel="noopener noreferrer" className="font-sans font-bold text-black border-b border-black flex items-center space-x-0.5">
                      <span>공식 웹 바로가기</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono bg-neutral-800 text-white font-bold px-2 py-0.5">A-BEACON 공모</span>
                    <span className="text-xs font-mono text-gray-400">분기 연례사업</span>
                  </div>
                  <h4 className="font-sans font-black text-lg text-black mb-2">
                    하반기 '샛별 갤러리' 가상공간(VR) 합동 기획전 공모
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-light mb-4">
                    A-BEACON이 주최하고 파트너 삼청동 오프라인 문화 갤러리가 연계하는 대형 가상 3D 전시전 우수 선발 사업입니다. 참여비 일체 면제 및 대화식 AI 도슨트 가이드 음성 나레이션 제작을 무료 지원합니다.
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-900">대상: A-BEACON 포트폴리오 3점 이상 업로드 작가</span>
                    <button 
                      onClick={() => {
                        setActiveTab("portfolio");
                        alert("작품을 3점 이상 자유롭게 등록한 후 고객지원 센터로 자동 신청 접수됩니다!");
                      }} 
                      className="font-sans font-bold text-black border-b border-black flex items-center space-x-0.5"
                    >
                      <span>지금 포트폴리오 채우기</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PORTFOLIO & PUBLISHING (existing upload and profile screens) */}
        {activeTab === "portfolio" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in" id="portfolio-tab-section">
            
            {/* Left Column: Card Builder + Blocks + Artwork upload */}
            <div className="lg:col-span-1 space-y-6" id="artist-settings-pane">

              {/* ── 카드 빌더 ─────────────────────────────────────────────── */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-sans font-extrabold text-base text-black flex items-center gap-2">
                    <Palette className="h-4 w-4 text-[#ff385c]" />
                    홈 카드 꾸미기
                  </h2>
                  <button
                    onClick={() => setShowCardPreview((v) => !v)}
                    className="text-[10px] font-mono text-gray-400 hover:text-black flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {showCardPreview ? "미리보기 닫기" : "미리보기"}
                  </button>
                </div>

                {/* Step tabs */}
                <div className="flex border-b border-gray-100">
                  {([1, 2, 3] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCardStep(s)}
                      className={`flex-1 py-2.5 text-xs font-bold transition-colors ${cardStep === s ? "text-[#ff385c] border-b-2 border-[#ff385c]" : "text-gray-400 hover:text-black"}`}
                    >
                      {s === 1 ? "01 · 형태" : s === 2 ? "02 · 내용" : "03 · 색상"}
                    </button>
                  ))}
                </div>

                <div className="p-5 space-y-4">
                  {/* STEP 1: Archetype */}
                  {cardStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 font-light">카드 레이아웃 형태를 선택하세요.</p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(["cover","editorial","manifesto","portrait","quote"] as CardArchetype[]).map((arch) => {
                          const labels: Record<CardArchetype, string> = { cover: "COVER", editorial: "EDIT", manifesto: "MANI", portrait: "PORT", quote: "QUOTE" };
                          const descs: Record<CardArchetype, string> = { cover: "세로형\n이미지 전면", editorial: "가로형\n좌이미지", manifesto: "타이포\n중심", portrait: "인터뷰\n형식", quote: "인용구\n전면" };
                          return (
                            <button
                              key={arch}
                              onClick={() => setCardArchetype(arch)}
                              className={`p-2 border-2 text-center transition-all rounded-sm ${cardArchetype === arch ? "border-[#ff385c] bg-[#fff5f6]" : "border-gray-200 hover:border-gray-400"}`}
                            >
                              <div className="text-[8px] font-mono font-black text-[#ff385c]">{labels[arch]}</div>
                              <div className="text-[8px] text-gray-400 mt-0.5 whitespace-pre-line leading-tight">{descs[arch]}</div>
                            </button>
                          );
                        })}
                      </div>
                      <button onClick={() => setCardStep(2)} className="w-full mt-2 bg-black text-white py-2 text-xs font-bold hover:bg-neutral-800 transition-colors">
                        다음: 내용 입력 →
                      </button>
                    </div>
                  )}

                  {/* STEP 2: Content */}
                  {cardStep === 2 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">대표 이미지 URL</label>
                        <input
                          type="text"
                          value={cardImage}
                          onChange={(e) => setCardImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono"
                        />
                        <span className="text-[10px] text-gray-400">비워두면 프로필 이미지 사용</span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          헤드라인 — {cardArchetype === "manifesto" ? "작가를 한마디로" : cardArchetype === "quote" ? "부제 (표시 안됨)" : "한 줄 소개"}
                        </label>
                        <input
                          type="text"
                          value={cardHeadline}
                          onChange={(e) => setCardHeadline(e.target.value)}
                          placeholder="예: 고향 하늘을 닮은 빛깔로"
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          인용구 — {cardArchetype === "quote" ? "카드 전면에 크게 표시됩니다" : "카드 하단 작은 글씨"}
                        </label>
                        <textarea
                          rows={2}
                          value={cardQuote}
                          onChange={(e) => setCardQuote(e.target.value)}
                          placeholder="인터뷰에서 가장 인상적인 한 마디"
                          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setCardStep(1)} className="flex-1 border border-gray-300 py-2 text-xs font-bold text-gray-600 hover:border-black transition-colors">← 이전</button>
                        <button onClick={() => setCardStep(3)} className="flex-1 bg-black text-white py-2 text-xs font-bold hover:bg-neutral-800 transition-colors">다음: 색상 →</button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Style */}
                  {cardStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">배경 색상</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {["#1a1a1a","#0f172a","#1c1c1c","#2d1b0e","#1a1a2e","#f7f3ee","#ffffff"].map((c) => (
                            <button
                              key={c}
                              onClick={() => { setCardBgColor(c); setCardTextColor(c === "#f7f3ee" || c === "#ffffff" ? "black" : "white"); }}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${cardBgColor === c ? "border-[#ff385c] scale-110" : "border-transparent"}`}
                              style={{ background: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none" }}
                            />
                          ))}
                          <input
                            type="color"
                            value={cardBgColor}
                            onChange={(e) => setCardBgColor(e.target.value)}
                            className="w-7 h-7 rounded-full border-2 border-gray-200 cursor-pointer p-0.5"
                            title="커스텀 색상"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">포인트 컬러</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {["#ff385c","#ff6b2b","#e2b96f","#6366f1","#8b7355","#e07b5a","#22c55e"].map((c) => (
                            <button
                              key={c}
                              onClick={() => setCardAccentColor(c)}
                              className={`w-7 h-7 rounded-full border-2 transition-all ${cardAccentColor === c ? "border-black scale-110" : "border-transparent"}`}
                              style={{ background: c }}
                            />
                          ))}
                          <input
                            type="color"
                            value={cardAccentColor}
                            onChange={(e) => setCardAccentColor(e.target.value)}
                            className="w-7 h-7 rounded-full border-2 border-gray-200 cursor-pointer p-0.5"
                            title="커스텀 포인트 컬러"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">텍스트 색상</label>
                        <div className="flex gap-2">
                          {(["white","black"] as const).map((c) => (
                            <button
                              key={c}
                              onClick={() => setCardTextColor(c)}
                              className={`flex-1 py-1.5 text-xs font-bold border-2 transition-all ${cardTextColor === c ? "border-black" : "border-gray-200"}`}
                              style={{ background: c === "white" ? "#1a1a1a" : "#ffffff", color: c === "white" ? "#fff" : "#000" }}
                            >
                              {c === "white" ? "흰색" : "검정"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-2">배지 표시</label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={cardShowSchool} onChange={(e) => setCardShowSchool(e.target.checked)} className="accent-[#ff385c]" />
                            학교/키워드
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={cardShowMedium} onChange={(e) => setCardShowMedium(e.target.checked)} className="accent-[#ff385c]" />
                            매체
                          </label>
                        </div>
                      </div>
                      {saveCardSuccess && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" />
                          카드 저장 완료!
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => setCardStep(2)} className="flex-1 border border-gray-300 py-2 text-xs font-bold text-gray-600 hover:border-black transition-colors">← 이전</button>
                        <button
                          onClick={handleSaveCard}
                          disabled={isSavingCard}
                          className="flex-1 bg-[#ff385c] text-white py-2 text-xs font-bold hover:bg-[#e00b41] disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {isSavingCard ? "저장 중..." : "카드 저장"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live preview */}
                {showCardPreview && profile && (
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-[10px] font-mono text-gray-400 mb-2 uppercase tracking-widest">실시간 미리보기</p>
                    <div className="w-full overflow-hidden rounded-sm" style={{ height: 200 }}>
                      <ArtistCardRender
                        artist={profile}
                        card={{
                          archetype: cardArchetype,
                          image: cardImage || profileAvatar,
                          headline: cardHeadline,
                          quote: cardQuote,
                          bgColor: cardBgColor,
                          accentColor: cardAccentColor,
                          textColor: cardTextColor,
                          showBadges: { school: cardShowSchool, medium: cardShowMedium, year: false },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── 프로필 페이지 블록 ──────────────────────────────────────── */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <button
                  onClick={() => setShowBlocksSection((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <h2 className="font-sans font-extrabold text-base text-black flex items-center gap-2">
                    <Layers className="h-4 w-4 text-gray-400" />
                    프로필 페이지 블록
                  </h2>
                  {showBlocksSection ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>
                {showBlocksSection && (
                  <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 font-light">작가 프로필 페이지에 표시할 섹션을 구성합니다.</p>
                    {profileBlocks.length > 0 ? (
                      <div className="space-y-1.5">
                        {profileBlocks.map((block, idx) => {
                          const typeLabels: Record<ProfileBlockType, string> = { hero: "🖼 Hero 카드", statement: "✍️ 작가 선언문", interview: "💬 인터뷰 Q&A", works: "🎨 작품 갤러리", quote_block: "❝ 인용구 블록", info: "ℹ️ 기본 정보" };
                          return (
                            <div key={block.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-sm">
                              <span className="flex-1 text-xs font-bold text-gray-700">{typeLabels[block.type]}</span>
                              <div className="flex gap-0.5">
                                <button onClick={() => moveBlock(block.id, "up")} disabled={idx === 0} className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20"><ChevronUp className="h-3.5 w-3.5" /></button>
                                <button onClick={() => moveBlock(block.id, "down")} disabled={idx === profileBlocks.length - 1} className="p-0.5 text-gray-400 hover:text-black disabled:opacity-20"><ChevronDown className="h-3.5 w-3.5" /></button>
                                <button onClick={() => removeBlock(block.id)} className="p-0.5 text-red-400 hover:text-red-600 ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-2">블록이 없습니다. 아래에서 추가하세요.</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(["hero","statement","interview","works","quote_block","info"] as ProfileBlockType[]).map((t) => {
                        const labels: Record<ProfileBlockType, string> = { hero: "Hero", statement: "선언문", interview: "인터뷰", works: "갤러리", quote_block: "인용구", info: "정보" };
                        return (
                          <button key={t} onClick={() => addBlock(t)} className="text-[10px] font-bold px-2 py-1 bg-gray-100 hover:bg-black hover:text-white text-gray-600 border border-gray-200 transition-colors">
                            + {labels[t]}
                          </button>
                        );
                      })}
                    </div>
                    {saveBlocksSuccess && (
                      <div className="p-2 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" />블록 저장 완료!
                      </div>
                    )}
                    <button
                      onClick={handleSaveBlocks}
                      disabled={isSavingBlocks}
                      className="w-full bg-black text-white py-2 text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSavingBlocks ? "저장 중..." : "블록 구성 저장"}
                    </button>
                  </div>
                )}
              </div>

              {/* ── 기본 정보 (숨김 가능) ──────────────────────────────────── */}
              <details className="bg-white border border-gray-200 shadow-sm">
                <summary className="px-5 py-4 font-sans font-extrabold text-sm text-black cursor-pointer flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  기본 정보 (검색 데이터)
                </summary>
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">작가명</label>
                      <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">이메일</label>
                      <input type="email" required value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">아바타 이미지 URL</label>
                      <input type="text" required value={profileAvatar} onChange={(e) => setProfileAvatar(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">키워드 (쉼표 구분)</label>
                      <input type="text" value={profileKeywordsText} onChange={(e) => setProfileKeywordsText(e.target.value)} placeholder="따뜻한, 자연, 풍경화" className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">바이오</label>
                      <textarea rows={3} required value={profileBio} onChange={(e) => setProfileBio(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 text-xs text-black focus:bg-white focus:border-black font-sans leading-relaxed" />
                    </div>
                    {saveProfileSuccess && (
                      <div className="p-2 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5"><Check className="h-3.5 w-3.5" />저장 완료!</div>
                    )}
                    <button type="submit" disabled={isSavingProfile} className="w-full bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-600 py-2 font-bold text-xs flex items-center justify-center gap-1.5">
                      <Save className="h-3.5 w-3.5" />
                      {isSavingProfile ? "저장 중..." : "기본 정보 저장"}
                    </button>
                  </form>
                </div>
              </details>

              {/* New Artwork Upload form */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <h2 className="font-sans font-extrabold text-lg text-black mb-6 flex items-center space-x-2 border-b border-gray-100 pb-3" id="artworks-upload-title">
                  <Plus className="h-5 w-5 text-gray-400" />
                  <span>신작 소장품 업로드 (Publish)</span>
                </h2>

                <form onSubmit={handleUploadArtwork} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">작품 제목 *</label>
                    <input
                      type="text"
                      required
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="예: 영혼의 숨결 02"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-500">작업 핵심 태그 *</label>
                      <button
                        type="button"
                        onClick={handleTriggerAiTags}
                        disabled={isAutoTagging || !artTitle.trim()}
                        className="text-[10px] bg-amber-400 hover:bg-amber-500 disabled:bg-gray-100 disabled:text-gray-400 font-bold font-sans text-black py-0.5 px-2 flex items-center space-x-1 border border-amber-500/20"
                        title="작품 제목과 묘사를 토대로 AI에게 태그를 추천받습니다"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{isAutoTagging ? "분석 중..." : "AI 태그 자동 생성"}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={artTagsText}
                      onChange={(e) => setArtTagsText(e.target.value)}
                      placeholder="따뜻한, 자연, 노을, 유화"
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                    />
                    {autoTagSuccess && (
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ AI 태깅 최우선 추출 완료!</span>
                    )}
                    <span className="text-[10px] text-gray-400 mt-1 block">태그는 AI 큐레이션 매칭의 튼튼한 이정표가 됩니다.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">작품 카테고리</label>
                      <select
                        value={artCategory}
                        onChange={(e) => setArtCategory(e.target.value as ArtCategory)}
                        className="w-full bg-gray-50 border border-gray-200 px-2 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                      >
                        <option value="Painting">회화 (Painting)</option>
                        <option value="Sculpture">조소 (Sculpture)</option>
                        <option value="Photography">사진 (Photography)</option>
                        <option value="Media Art">미디어 아트</option>
                        <option value="Craft">공예 (Craft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">소장 안내가/범위 *</label>
                      <input
                        type="text"
                        required
                        value={artPriceRange}
                        onChange={(e) => setArtPriceRange(e.target.value)}
                        placeholder="예: ₩1,800,000"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">기법 / 매체 *</label>
                      <input
                        type="text"
                        required
                        value={artMedium}
                        onChange={(e) => setArtMedium(e.target.value)}
                        placeholder="예: Oil on Canvas"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono text-[10px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">작품 크기 (Dimensions)</label>
                      <input
                        type="text"
                        value={artDimensions}
                        onChange={(e) => setArtDimensions(e.target.value)}
                        placeholder="예: 60.6 x 60.6 cm"
                        className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">이미지 리소스 웹 링크</label>
                    <input
                      type="text"
                      value={artImage}
                      onChange={(e) => setArtImage(e.target.value)}
                      placeholder="비워두시면 고화질 무작위 예술 이미지로 매칭 인지됩니다."
                      className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-black focus:bg-white focus:border-black font-mono"
                    />

                    <div className="mt-2.5 p-2 bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 block font-bold mb-1">데모용 예제 예술사진 원클릭 복사:</span>
                      <div className="flex flex-wrap gap-1">
                        {presetArtImages.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setArtImage(p.url);
                              setArtMedium(idx === 0 ? "Oil on Canvas" : idx === 1 ? "Anodized Steel" : idx === 2 ? "Fired Clay Glaze" : idx === 3 ? "Giclée archival art print" : "Generative Live Coding Frame");
                            }}
                            className="text-[9px] bg-white border border-gray-200 px-2 py-0.5 hover:border-black"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">작품 상세 해설 및 작가노트</label>
                    <textarea
                      rows={3}
                      value={artDescription}
                      onChange={(e) => setArtDescription(e.target.value)}
                      placeholder="작품을 관통하는 세계관이나 AI 큐레이션 매칭의 근거가 될 미학적 문안들을 상세히 나열하세요..."
                      className="w-full bg-gray-50 border border-gray-200 p-3 text-xs text-black focus:bg-white focus:border-black font-sans leading-relaxed"
                    />
                  </div>

                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-1.5">
                      <FileCheck className="h-4 w-4" />
                      <span>신규 작품 등록 완료! 포트폴리오에 가산되었습니다.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-600 py-3 font-sans font-bold text-sm tracking-wide flex items-center justify-center space-x-2 rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isUploading ? "업로드 등록 중..." : "포트폴리오 새 작품 발행"}</span>
                  </button>
                </form>
              </div>

            </div>

            {/* Right Columns: Active Portfolio Inventories */}
            <div className="lg:col-span-2 space-y-10" id="artist-data-boards">
              
              <div className="bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-end border-b border-gray-150 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-400 block uppercase">CURRENT PORTFOLIO</span>
                    <h2 className="font-sans font-black text-xl text-black">
                      나의 소장 포트폴리오 목록 ({myArtworks.length})
                    </h2>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">PUBLISHED PIECES IN INVENTORY</span>
                </div>

                {myArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="portfolio-works-grids">
                    {myArtworks.map((art) => (
                      <div key={art.id} className="border border-gray-200 p-4 bg-white hover:border-black transition-all flex flex-col justify-between">
                        <div>
                          <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-3 relative flex items-center justify-center">
                            <img
                              src={art.image}
                              alt={art.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector(".img-fallback")) {
                                  const fb = document.createElement("div");
                                  fb.className = "img-fallback flex flex-col items-center justify-center gap-1 text-gray-300";
                                  fb.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:10px">이미지 없음</span>';
                                  parent.appendChild(fb);
                                }
                              }}
                            />
                            <span className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase font-semibold">
                              {art.category.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="font-sans font-bold text-base text-black truncate">{art.title}</h3>
                          <p className="text-xs text-gray-400 font-mono italic mt-0.5">{art.medium}</p>
                          
                          <div className="pt-2 border-t border-gray-100 mt-2 flex flex-wrap gap-1">
                            {art.tags.map((t) => (
                              <span key={t} className="text-[9px] bg-gray-100 text-gray-600 py-0.5 px-1.5 border border-gray-200 rounded-sm">
                                #{t}
                              </span>
                            ))}
                          </div>

                          <p className="mt-2.5 text-xs text-gray-500 font-light font-sans line-clamp-2">
                            {art.description}
                          </p>
                        </div>

                        <div className="border-t border-gray-150 pt-3 mt-4 flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900 font-mono">{art.priceRange}</span>
                          <button
                            onClick={() => handleDeleteArtwork(art.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 hover:border border border-transparent transition-all"
                            title="작품 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600 font-sans">등록된 작품이 아직 업로드되지 않았습니다.</p>
                    <p className="text-xs text-gray-400 mt-1">좌측 신작 양식을 채우고 나의 포트폴리오를 발행해 보세요!</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: INQUIRIES LOG (Messages from prospective buyers) */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in" id="inquiries-tab-section">
            <div className="bg-white border border-gray-200 shadow-sm">

              {/* 장부 헤더 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-neutral-500" />
                  <h2 className="font-sans font-black text-xl text-black">
                    컬렉터 구매 문의 장부
                  </h2>
                  <span className="text-xs bg-[#ff385c] text-white font-bold px-2 py-0.5 rounded-full font-mono">
                    {myInquiries.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {onOpenChat && (
                    <button
                      onClick={() => onOpenChat()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      채팅으로 보기
                    </button>
                  )}
                  <button
                    onClick={fetchMyInquiries}
                    disabled={isLoadingInquiries}
                    className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                    title="새로고침"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingInquiries ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* 상태 필터 탭 */}
              <div className="flex gap-1 px-6 pt-4 pb-2 overflow-x-auto scrollbar-none">
                {(["전체", "문의중", "거래중", "거래완료", "취소"] as const).map((status) => {
                  const count = status === "전체"
                    ? myInquiries.length
                    : myInquiries.filter((i) => (i.status ?? "문의중") === status).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setInquiryStatusFilter(status)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all border ${
                        inquiryStatusFilter === status
                          ? status === "전체" ? "bg-[#222222] text-white border-[#222222]"
                          : status === "문의중" ? "bg-blue-600 text-white border-blue-600"
                          : status === "거래중" ? "bg-amber-500 text-white border-amber-500"
                          : status === "거래완료" ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-gray-500 text-white border-gray-500"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {status}
                      <span className={`text-[10px] px-1 rounded-full ${inquiryStatusFilter === status ? "bg-white/20" : "bg-gray-100 text-gray-400"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 목록 */}
              <div className="p-6 pt-3">
                {isLoadingInquiries ? (
                  <div className="py-12 text-center text-xs text-gray-400 font-mono animate-pulse">
                    문의 내역을 불러오는 중입니다...
                  </div>
                ) : (() => {
                  const filtered = myInquiries.filter((i) =>
                    inquiryStatusFilter === "전체" || (i.status ?? "문의중") === inquiryStatusFilter
                  );
                  return filtered.length > 0 ? (
                    <div className="space-y-3">
                      {filtered.map((inq) => {
                        const status = inq.status ?? "문의중";
                        const statusStyle =
                          status === "문의중" ? "bg-blue-50 text-blue-700 border-blue-200"
                          : status === "거래중" ? "bg-amber-50 text-amber-700 border-amber-200"
                          : status === "거래완료" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50 text-gray-500 border-gray-200";
                        const leftBorderColor =
                          status === "문의중" ? "border-l-blue-500"
                          : status === "거래중" ? "border-l-amber-500"
                          : status === "거래완료" ? "border-l-emerald-500"
                          : "border-l-gray-400";
                        return (
                          <div key={inq.id} className={`border border-l-4 border-gray-200 ${leftBorderColor} p-5 bg-gray-50 rounded-r-lg`}>
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>
                                    {status}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    {(() => {
                                      try {
                                        const d = new Date(inq.createdAt);
                                        return isNaN(d.getTime()) ? inq.createdAt : `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
                                      } catch { return inq.createdAt; }
                                    })()}
                                  </span>
                                </div>
                                <h4 className="font-sans font-bold text-sm text-black mt-1.5 flex items-center gap-2 flex-wrap">
                                  <span className="bg-neutral-800 text-white px-1.5 py-0.5 text-[10px] font-mono rounded">BUYER</span>
                                  <span>{inq.buyerName}</span>
                                  <span className="text-gray-400 font-normal text-xs">({inq.buyerEmail})</span>
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 font-sans">
                                  작품: <strong className="text-black">{inq.artworkTitle}</strong>
                                </p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                {onOpenChat && (
                                  <button
                                    onClick={() => onOpenChat(inq.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#ff385c] text-white text-xs font-bold rounded-lg hover:bg-[#e00b41] transition-colors"
                                  >
                                    <Mail className="h-3 w-3" />
                                    채팅 열기
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed font-sans bg-white p-3 border border-gray-100 rounded italic">
                              &ldquo;{inq.message}&rdquo;
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded">
                      <Mail className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-500 font-sans">
                        {inquiryStatusFilter === "전체" ? "아직 수신된 구매 문의가 없습니다." : `'${inquiryStatusFilter}' 상태의 문의가 없습니다.`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        고객이 작품에 문의하면 이곳에 표시됩니다.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

