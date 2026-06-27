/**
 * ChatPage — 채팅 & 거래 관리 페이지
 *
 * 구매자와 작가 간 작품 거래 대화를 지원하는 두 컬럼 레이아웃 채팅 UI.
 * - 왼쪽: 대화 목록 사이드바 (모바일에서는 전체 화면)
 * - 오른쪽: 선택된 대화의 메시지 + 입력창
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MessageSquare,
  Send,
  ChevronLeft,
  Check,
  X,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  ImageOff,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  ShoppingBag,
  Info,
  Compass,
  Palette,
  FileText,
  CalendarDays,
  CircleDollarSign,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { chatApi, artworksApi } from "../services/api";
import type { UserSession, UserInquiry, ChatMessage, TradeStatus, Artwork, EstimateData } from "../types";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ChatPageProps {
  session: UserSession;
  /** "buyer": 내가 구매자인 채팅방만 표시 / "artist": 내가 작가인 채팅방만 표시 */
  chatMode: "buyer" | "artist";
  initialRoomId?: string | null;
  onBack: () => void;
}

// ─── 작가 퀵리플라이 템플릿 ────────────────────────────────────────────────────

const QUICK_REPLIES = [
  "안녕하세요! 작품에 관심 가져주셔서 감사합니다. 궁금하신 점이 있으시면 편하게 문의해 주세요.",
  "네, 실물과 사진의 색감 차이가 거의 없는 편입니다. 조명 환경에 따라 미묘하게 달라질 수 있습니다.",
  "배송은 안전 포장 후 보험 택배로 발송해 드리며, 서울 수도권은 직접 설치 방문도 가능합니다.",
  "작품 구매 확정 후 2~3 영업일 내 발송 예정입니다. 진행하시겠어요?",
  "감사합니다! 좋은 공간에서 작품이 함께하길 바랍니다.",
];

// ─── 유틸리티 ──────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function formatRoomTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return formatTime(isoString);
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function formatDateLabel(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const diffDays = Math.round((todayStart - dateStart) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "오늘";
    if (diffDays === 1) return "어제";
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  } catch {
    return "";
  }
}

function isSameDay(isoA: string, isoB: string): boolean {
  try {
    const a = new Date(isoA);
    const b = new Date(isoB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  } catch {
    return false;
  }
}

// ─── 상태 배지 ─────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: TradeStatus;
  size?: "sm" | "md";
}

function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";
  const styleMap: Record<TradeStatus, string> = {
    문의중: "bg-blue-100 text-blue-700",
    거래중: "bg-amber-100 text-amber-700",
    거래완료: "bg-emerald-100 text-emerald-700",
    취소: "bg-gray-100 text-gray-500",
  };
  const iconMap: Record<TradeStatus, React.ReactNode> = {
    문의중: <Clock className="h-2.5 w-2.5" />,
    거래중: <Package className="h-2.5 w-2.5" />,
    거래완료: <CheckCircle2 className="h-2.5 w-2.5" />,
    취소: <XCircle className="h-2.5 w-2.5" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClass} ${styleMap[status]}`}
    >
      {iconMap[status]}
      {status}
    </span>
  );
}

// ─── 이미지 썸네일 ─────────────────────────────────────────────────────────────

function ArtworkThumb({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`flex items-center justify-center bg-[#f2f2f2] ${className ?? ""}`}>
        <ImageOff className="h-5 w-5 text-[#cccccc]" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className ?? ""}`}
      onError={() => setBroken(true)}
    />
  );
}

// ─── 메시지 버블 ──────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  isConsecutive: boolean;
  onEstimateRespond?: (msgId: string, response: "accepted" | "rejected") => void;
}

function EstimateStatusBadge({ status }: { status: EstimateData["status"] }) {
  if (status === "accepted")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> 수락됨
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
        <XCircle className="h-3 w-3" /> 거절됨
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <Clock className="h-3 w-3" /> 검토 중
    </span>
  );
}

function MessageBubble({ message, isMine, isConsecutive, onEstimateRespond }: MessageBubbleProps) {
  // 시스템 메시지 — 중앙 이벤트 카드
  if (message.messageType === "system") {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#f0f4ff] border border-[#d0dcff] rounded-full">
          <Info className="h-3 w-3 text-blue-500 flex-shrink-0" />
          <span className="text-[11px] text-blue-700 font-semibold">{message.content}</span>
        </div>
      </div>
    );
  }

  // 견적서 메시지 — 전용 카드
  if (message.messageType === "estimate" && message.estimate) {
    const est = message.estimate;
    const canRespond = !isMine && est.status === "pending";
    const vatLabel = est.vatType === "included" ? "VAT 포함" : est.vatType === "excluded" ? "VAT 별도" : "VAT 면세";
    return (
      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} ${isConsecutive ? "mt-1" : "mt-4"}`}>
        {!isConsecutive && (
          <span className="text-[10px] text-[#aaaaaa] font-semibold mb-1 px-1">{message.senderName}</span>
        )}
        <div className="w-80 sm:w-96 border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm bg-white">

          {/* 헤더 */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#3a3a3a]">
            <FileText className="h-4 w-4 text-white flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">견적서</p>
              <p className="text-[10px] text-white/60 mt-0.5">{est.estimateNo} · {est.issuedAt?.slice(0,10)}</p>
            </div>
            <EstimateStatusBadge status={est.status} />
          </div>

          {/* ① 작품 정보 */}
          <div className="px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-1.5">작품 정보</p>
            <p className="text-sm font-bold text-[#222222]">{est.artworkTitle}</p>
            <p className="text-xs text-[#6a6a6a]">by {est.artistName}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
              {est.year && <span className="text-[11px] text-[#6a6a6a]">{est.year}년</span>}
              {est.medium && <span className="text-[11px] text-[#6a6a6a]">{est.medium}</span>}
              {(est.canvasSize || est.dimensions) && (
                <span className="text-[11px] text-[#6a6a6a]">
                  {[est.canvasSize, est.dimensions].filter(Boolean).join(" · ")}
                </span>
              )}
              {est.edition && <span className="text-[11px] text-[#6a6a6a]">Edition {est.edition}</span>}
            </div>
          </div>

          {/* ② 견적 금액 */}
          <div className="px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">견적 금액</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#6a6a6a]">공급가액</span>
                <span className="text-xs font-semibold text-[#222222]">{est.supplyPrice.toLocaleString("ko-KR")}원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#6a6a6a]">부가가치세</span>
                <span className="text-xs text-[#6a6a6a]">{vatLabel}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#f0f0f0]">
                <span className="text-sm font-bold text-[#222222]">총 합계</span>
                <span className="text-base font-bold text-[#ff385c]">{est.totalPrice.toLocaleString("ko-KR")}원</span>
              </div>
            </div>
          </div>

          {/* ③ 거래 조건 */}
          <div className="px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
            <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">거래 조건</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {est.depositRate !== undefined && est.depositRate > 0 && (
                <div>
                  <p className="text-[10px] text-[#aaaaaa]">계약금</p>
                  <p className="text-xs font-semibold text-[#222222]">{est.depositRate}%</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-[#aaaaaa]">결제 방식</p>
                <p className="text-xs font-semibold text-[#222222]">{est.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#aaaaaa]">인도 방법</p>
                <p className="text-xs font-semibold text-[#222222]">{est.deliveryMethod}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#aaaaaa]">배송비</p>
                <p className="text-xs font-semibold text-[#222222]">{est.deliveryFeeBy} 부담</p>
              </div>
              {est.deliveryDate && (
                <div>
                  <p className="text-[10px] text-[#aaaaaa]">인도 예정일</p>
                  <p className="text-xs font-semibold text-[#222222]">{est.deliveryDate}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-[#aaaaaa]">유효기간</p>
                <p className="text-xs font-semibold text-[#222222]">{est.validUntil}까지</p>
              </div>
            </div>
          </div>

          {/* ④ 비고 */}
          <div className="px-4 pt-2.5 pb-3">
            <div className="flex gap-3 mb-1.5">
              <span className={`text-[11px] font-semibold ${est.includesCoa ? "text-emerald-600" : "text-[#aaaaaa] line-through"}`}>
                진품보증서 {est.includesCoa ? "포함" : "미포함"}
              </span>
              <span className={`text-[11px] font-semibold ${est.includesFrame ? "text-emerald-600" : "text-[#aaaaaa] line-through"}`}>
                액자 {est.includesFrame ? "포함" : "미포함"}
              </span>
            </div>
            {est.notes && (
              <p className="text-[11px] text-[#6a6a6a] bg-[#f7f7f7] rounded-lg px-2.5 py-1.5 whitespace-pre-wrap leading-relaxed">{est.notes}</p>
            )}
          </div>

          {/* 응답 버튼 */}
          {canRespond && onEstimateRespond && (
            <div className="flex border-t border-[#ebebeb]">
              <button
                onClick={() => onEstimateRespond(message.id, "rejected")}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors border-none bg-transparent cursor-pointer border-r border-[#ebebeb]"
              >
                <ThumbsDown className="h-3.5 w-3.5" /> 거절
              </button>
              <button
                onClick={() => onEstimateRespond(message.id, "accepted")}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                <ThumbsUp className="h-3.5 w-3.5" /> 수락
              </button>
            </div>
          )}
          {est.status !== "pending" && est.respondedAt && (
            <div className="px-4 py-2 bg-[#fafafa] text-[10px] text-[#aaaaaa] text-center">
              {est.status === "accepted" ? "✓ 수락됨" : "✗ 거절됨"} · {formatTime(est.respondedAt)}
            </div>
          )}
        </div>
        <span className="text-[10px] text-[#aaaaaa] mt-1 px-1">{formatTime(message.sentAt)}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${isMine ? "items-end" : "items-start"} ${
        isConsecutive ? "mt-1" : "mt-4"
      }`}
    >
      {!isConsecutive && (
        <span className="text-[10px] text-[#aaaaaa] font-semibold mb-1 px-1">
          {message.senderName}
        </span>
      )}
      <div
        className={`max-w-[72%] sm:max-w-[60%] px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap ${
          isMine
            ? "bg-[#ff385c] text-white rounded-2xl rounded-tr-sm"
            : "bg-[#f7f7f7] text-[#222222] rounded-2xl rounded-tl-sm border border-[#ebebeb]"
        }`}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-[#aaaaaa] mt-1 px-1">{formatTime(message.sentAt)}</span>
    </div>
  );
}

// ─── 날짜 구분선 ──────────────────────────────────────────────────────────────

function DateSeparator({ isoString }: { isoString: string }) {
  const label = formatDateLabel(isoString);
  if (!label) return null;
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#ebebeb]" />
      <span className="text-[10px] text-[#aaaaaa] font-semibold px-3 py-1 bg-[#f7f7f7] rounded-full">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#ebebeb]" />
    </div>
  );
}

// ─── 작품 정보 패널 (채팅 헤더 하단 접기/펼치기) ───────────────────────────────

interface ArtworkInfoPanelProps {
  room: UserInquiry;
  artwork: Artwork | null;
}

function ArtworkInfoPanel({ room, artwork }: ArtworkInfoPanelProps) {
  return (
    <div className="px-4 py-3 bg-[#fafafa] border-b border-[#ebebeb]">
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-[#ebebeb]">
          <ArtworkThumb src={room.artworkImage} alt={room.artworkTitle} className="h-full w-full" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#222222] truncate">{room.artworkTitle}</p>
          <p className="text-xs text-[#6a6a6a] mb-2">by {room.artistName}</p>
          {artwork ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {artwork.priceRange && (
                <div>
                  <span className="text-[10px] text-[#aaaaaa] uppercase tracking-wide">가격</span>
                  <p className="text-xs font-bold text-[#ff385c]">{artwork.priceRange}</p>
                </div>
              )}
              {artwork.medium && (
                <div>
                  <span className="text-[10px] text-[#aaaaaa] uppercase tracking-wide">재료</span>
                  <p className="text-xs text-[#222222] truncate">{artwork.medium}</p>
                </div>
              )}
              {artwork.dimensions && (
                <div>
                  <span className="text-[10px] text-[#aaaaaa] uppercase tracking-wide">크기</span>
                  <p className="text-xs text-[#222222] truncate">{artwork.dimensions}</p>
                </div>
              )}
              {artwork.year && (
                <div>
                  <span className="text-[10px] text-[#aaaaaa] uppercase tracking-wide">제작연도</span>
                  <p className="text-xs text-[#222222]">{artwork.year}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="h-3 bg-[#ebebeb] rounded w-20 animate-pulse" />
              <div className="h-3 bg-[#ebebeb] rounded w-24 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 채팅 방 헤더 ─────────────────────────────────────────────────────────────

interface ChatRoomHeaderProps {
  room: UserInquiry;
  artwork: Artwork | null;
  isArtist: boolean;
  isUpdatingStatus: boolean;
  showArtworkPanel: boolean;
  onToggleArtworkPanel: () => void;
  onStatusChange: (status: TradeStatus) => void;
}

function ChatRoomHeader({
  room,
  artwork,
  isArtist,
  isUpdatingStatus,
  showArtworkPanel,
  onToggleArtworkPanel,
  onStatusChange,
}: ChatRoomHeaderProps) {
  const isClosed = room.status === "거래완료" || room.status === "취소";
  const counterpartLabel = isArtist ? room.buyerName : room.artistName || "작가";


  return (
    <div className="flex-shrink-0 bg-white border-b border-[#ebebeb]">
      {/* 메인 헤더 행 */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap">
        {/* 상대방 + 상태 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onToggleArtworkPanel}
            className="flex items-center gap-2 min-w-0 hover:opacity-70 transition-opacity border-none bg-transparent cursor-pointer p-0 text-left"
            title="작품 정보 보기"
          >
            <div className="h-8 w-8 flex-shrink-0 rounded-md overflow-hidden border border-[#ebebeb]">
              <ArtworkThumb
                src={room.artworkImage}
                alt={room.artworkTitle}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-[#222222] truncate">{counterpartLabel}</p>
                <StatusBadge status={room.status} size="sm" />
              </div>
              <p className="text-[11px] text-[#6a6a6a] truncate">{room.artworkTitle}</p>
            </div>
            {showArtworkPanel ? (
              <ChevronUp className="h-3.5 w-3.5 text-[#aaaaaa] flex-shrink-0" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-[#aaaaaa] flex-shrink-0" />
            )}
          </button>
        </div>

        {/* 액션 버튼 영역 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 작가 전용 */}
          {isArtist && (
            <>
              {room.status === "문의중" && (
                <button
                  onClick={() => onStatusChange("거래중")}
                  disabled={isUpdatingStatus}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-none cursor-pointer shadow-sm"
                >
                  {isUpdatingStatus ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <ArrowRight className="h-3 w-3" />
                  )}
                  거래 시작
                </button>
              )}
              {room.status === "거래중" && (
                <>
                  <button
                    onClick={() => onStatusChange("거래완료")}
                    disabled={isUpdatingStatus}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-none cursor-pointer shadow-sm"
                  >
                    {isUpdatingStatus ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    거래 완료
                  </button>
                  <button
                    onClick={() => onStatusChange("취소")}
                    disabled={isUpdatingStatus}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full bg-white text-[#ff385c] border border-[#ff385c]/40 hover:bg-[#ff385c]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  >
                    <X className="h-3 w-3" />
                    취소
                  </button>
                </>
              )}
            </>
          )}

          {/* 구매자 전용 */}
          {!isArtist && (
            <>
              {room.status === "거래중" && (
                <>
                  <button
                    onClick={() => onStatusChange("거래완료")}
                    disabled={isUpdatingStatus}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-[#ff385c] text-white hover:bg-[#e00b41] disabled:opacity-50 disabled:cursor-not-allowed transition-all border-none cursor-pointer shadow-sm"
                  >
                    {isUpdatingStatus ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-3 w-3" />
                    )}
                    구매 확정
                  </button>
                  <button
                    onClick={() => onStatusChange("취소")}
                    disabled={isUpdatingStatus}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full bg-white text-[#6a6a6a] border border-[#ebebeb] hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  >
                    <X className="h-3 w-3" />
                    취소 요청
                  </button>
                </>
              )}
              {room.status === "문의중" && (
                <button
                  onClick={() => onStatusChange("취소")}
                  disabled={isUpdatingStatus}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full bg-white text-[#6a6a6a] border border-[#ebebeb] hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                >
                  <X className="h-3 w-3" />
                  문의 취소
                </button>
              )}
            </>
          )}

          {isClosed && (
            <div className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#aaaaaa] bg-[#f7f7f7] rounded-full border border-[#ebebeb]">
              <CheckCircle2 className="h-3 w-3" />
              {room.status === "거래완료" ? "거래 완료됨" : "취소됨"}
            </div>
          )}
        </div>
      </div>

      {/* 작품 상세 정보 패널 (접기/펼치기) */}
      {showArtworkPanel && <ArtworkInfoPanel room={room} artwork={artwork} />}
    </div>
  );
}

// ─── 작가 퀵리플라이 패널 ─────────────────────────────────────────────────────

interface QuickReplyPanelProps {
  onSelect: (text: string) => void;
  onClose: () => void;
}

function QuickReplyPanel({ onSelect, onClose }: QuickReplyPanelProps) {
  return (
    <div className="border-t border-[#ebebeb] bg-[#fafafa] px-3 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide">
          자주 쓰는 문구
        </span>
        <button
          onClick={onClose}
          className="text-[#aaaaaa] hover:text-[#222222] border-none bg-transparent cursor-pointer p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-1">
        {QUICK_REPLIES.map((text, i) => (
          <button
            key={i}
            onClick={() => onSelect(text)}
            className="w-full text-left text-xs text-[#444444] px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-[#ebebeb] transition-all cursor-pointer bg-transparent truncate"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

type FilterTab = "전체" | "거래중" | "완료";
type RoleTab = "buyer" | "artist";

export default function ChatPage({ session, chatMode, initialRoomId, onBack }: ChatPageProps) {
  const isArtistAccount = !!session.artistId;
  const [roleTab, setRoleTab] = useState<RoleTab>(chatMode === "artist" ? "artist" : "buyer");

  const [rooms, setRooms] = useState<UserInquiry[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<UserInquiry | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [hasInput, setHasInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("전체");

  // 작품 정보 패널 (채팅 헤더 하단)
  const [showArtworkPanel, setShowArtworkPanel] = useState(false);
  // 작가 퀵리플라이
  const [showQuickReply, setShowQuickReply] = useState(false);
  // 견적서 모달
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimateForm, setEstimateForm] = useState({
    validUntil: "",
    supplyPrice: "",
    vatType: "included" as "included" | "excluded" | "exempt",
    depositRate: "",
    paymentMethod: "계좌이체",
    deliveryMethod: "택배",
    deliveryFeeBy: "구매자",
    deliveryDate: "",
    includesCoa: false,
    includesFrame: false,
    notes: "",
    // 작품 추가 정보
    canvasSize: "",
    edition: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isComposingRef = useRef(false);

  // ─── 역할 판단 ──────────────────────────────────────────────────────────────

  const isArtistInRoom = useCallback(
    (room: UserInquiry | null): boolean => {
      if (!room) return false;
      return !!session.artistId && session.artistId === room.artistId;
    },
    [session.artistId]
  );

  // ─── 대화 목록 로드 ────────────────────────────────────────────────────────

  const fetchRooms = useCallback(async () => {
    setRoomsLoading(true);
    setRoomsError(null);
    try {
      // 구매자 이메일 + 작가 ID 동시 전달 → 내가 참여한 모든 방 통합 조회
      const data = await chatApi.getRooms(session.email, session.artistId);
      setRooms(data);
    } catch (err: unknown) {
      setRoomsError(err instanceof Error ? err.message : "대화 목록을 불러오지 못했습니다.");
    } finally {
      setRoomsLoading(false);
    }
  }, [session.email, session.artistId]);

  useEffect(() => {
    setSelectedRoom(null);
    setMessages([]);
    fetchRooms();
  }, [fetchRooms]);

  // ─── 초기 방 자동 선택 ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!initialRoomId || rooms.length === 0) return;
    const found = rooms.find((r) => r.id === initialRoomId);
    if (found) {
      setSelectedRoom(found);
      setShowSidebar(false);
    }
  }, [initialRoomId, rooms]);

  // ─── 방 선택 시 작품 정보 로드 ──────────────────────────────────────────────

  useEffect(() => {
    if (!selectedRoom) {
      setSelectedArtwork(null);
      return;
    }
    setSelectedArtwork(null);
    artworksApi.get(selectedRoom.artworkId).then(setSelectedArtwork).catch(() => {});
  }, [selectedRoom?.id]);

  // ─── 메시지 로드 + 폴링 ─────────────────────────────────────────────────────

  const fetchMessages = useCallback(async (inquiryId: string) => {
    try {
      const data = await chatApi.getMessages(inquiryId);
      setMessages(data);
    } catch (err: any) {
      console.error("메시지 로드 실패:", err);
    }
  }, []);

  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }
    setMessagesLoading(true);
    fetchMessages(selectedRoom.id).finally(() => setMessagesLoading(false));
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchMessages(selectedRoom.id), 4000);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [selectedRoom, fetchMessages]);

  // ─── 자동 스크롤 ──────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── 메시지 전송 ──────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    if (!selectedRoom || isSending) return;
    const content = textareaRef.current?.value.trim() ?? "";
    if (!content) return;

    const role: "artist" | "buyer" = isArtistInRoom(selectedRoom) ? "artist" : "buyer";

    if (textareaRef.current) textareaRef.current.value = "";
    setHasInput(false);
    setShowQuickReply(false);

    const optimistic: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      inquiryId: selectedRoom.id,
      senderEmail: session.email,
      senderName: session.displayName,
      senderRole: role,
      content,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id
          ? { ...r, lastMessage: content, lastMessageAt: optimistic.sentAt }
          : r
      )
    );

    setIsSending(true);
    try {
      const sent = await chatApi.sendMessage(selectedRoom.id, {
        senderEmail: session.email,
        senderName: session.displayName,
        senderRole: role,
        content,
      });
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
    } catch (err: any) {
      console.error("메시지 전송 실패:", err);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      if (textareaRef.current) textareaRef.current.value = content;
      setHasInput(true);
    } finally {
      setIsSending(false);
    }
  }, [selectedRoom, isSending, session, isArtistInRoom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !isComposingRef.current &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  // 퀵리플라이 선택 → textarea에 삽입 후 포커스
  const handleQuickReplySelect = (text: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = text;
      setHasInput(true);
      textareaRef.current.focus();
    }
    setShowQuickReply(false);
  };

  // ─── 견적서 전송 ──────────────────────────────────────────────────────────

  const handleSendEstimate = useCallback(async () => {
    if (!selectedRoom || isSending) return;
    const supplyPrice = parseInt(estimateForm.supplyPrice.replace(/,/g, ""), 10);
    if (!supplyPrice || !estimateForm.validUntil) return;

    const vatAmount = estimateForm.vatType === "excluded" ? Math.round(supplyPrice * 0.1) : 0;
    const totalPrice = supplyPrice + vatAmount;
    const now = new Date();
    const estimateNo = `EST-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    const estimate = {
      estimateNo,
      issuedAt: now.toISOString(),
      validUntil: estimateForm.validUntil,
      artworkTitle: selectedRoom.artworkTitle,
      artistName: selectedRoom.artistName,
      year: selectedArtwork?.year ? String(selectedArtwork.year) : undefined,
      dimensions: selectedArtwork?.dimensions || undefined,
      canvasSize: estimateForm.canvasSize.trim() || undefined,
      medium: selectedArtwork?.medium || undefined,
      edition: estimateForm.edition.trim() || undefined,
      supplyPrice,
      vatType: estimateForm.vatType,
      totalPrice,
      depositRate: estimateForm.depositRate ? Number(estimateForm.depositRate) : undefined,
      paymentMethod: estimateForm.paymentMethod,
      deliveryMethod: estimateForm.deliveryMethod,
      deliveryFeeBy: estimateForm.deliveryFeeBy,
      deliveryDate: estimateForm.deliveryDate || undefined,
      includesCoa: estimateForm.includesCoa,
      includesFrame: estimateForm.includesFrame,
      notes: estimateForm.notes.trim() || undefined,
      status: "pending" as const,
    };

    setShowEstimateModal(false);
    setEstimateForm({
      validUntil: "", supplyPrice: "", vatType: "included",
      depositRate: "", paymentMethod: "계좌이체", deliveryMethod: "택배",
      deliveryFeeBy: "구매자", deliveryDate: "", includesCoa: false,
      includesFrame: false, notes: "", canvasSize: "", edition: "",
    });
    setIsSending(true);
    try {
      const sent = await chatApi.sendMessage(selectedRoom.id, {
        senderEmail: session.email,
        senderName: session.displayName,
        senderRole: "artist",
        content: `견적서를 보냈습니다. (${totalPrice.toLocaleString("ko-KR")}원)`,
        messageType: "estimate",
        estimate,
      });
      setMessages((prev) => [...prev, sent]);
      setRooms((prev) =>
        prev.map((r) =>
          r.id === selectedRoom.id
            ? { ...r, lastMessage: "견적서를 보냈습니다.", lastMessageAt: sent.sentAt }
            : r
        )
      );
    } catch (err) {
      console.error("견적서 전송 실패:", err);
    } finally {
      setIsSending(false);
    }
  }, [selectedRoom, selectedArtwork, isSending, estimateForm, session]);

  // ─── 견적서 응답 (컬렉터) ──────────────────────────────────────────────────

  const handleEstimateRespond = useCallback(
    async (msgId: string, response: "accepted" | "rejected") => {
      if (!selectedRoom) return;
      try {
        const updated = await chatApi.respondEstimate(selectedRoom.id, msgId, response);
        setMessages((prev) => prev.map((m) => (m.id === msgId ? updated : m)));
        if (response === "accepted") {
          setRooms((prev) =>
            prev.map((r) =>
              r.id === selectedRoom.id ? { ...r, status: "거래중" } : r
            )
          );
        }
      } catch (err) {
        console.error("견적서 응답 실패:", err);
      }
    },
    [selectedRoom]
  );

  // ─── 거래 상태 변경 ────────────────────────────────────────────────────────

  const handleStatusChange = useCallback(
    async (newStatus: TradeStatus) => {
      if (!selectedRoom || isUpdatingStatus) return;
      setIsUpdatingStatus(true);
      try {
        const updated = await chatApi.updateStatus(selectedRoom.id, newStatus);
        setSelectedRoom(updated);
        setRooms((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
        // 상태 변경 후 메시지 새로고침 (시스템 메시지 반영)
        await fetchMessages(selectedRoom.id);
      } catch (err: any) {
        console.error("상태 변경 실패:", err);
      } finally {
        setIsUpdatingStatus(false);
      }
    },
    [selectedRoom, isUpdatingStatus, fetchMessages]
  );

  // ─── 방 선택 ──────────────────────────────────────────────────────────────

  const handleSelectRoom = (room: UserInquiry) => {
    setSelectedRoom(room);
    setMessages([]);
    setShowSidebar(false);
    setShowArtworkPanel(false);
    setShowQuickReply(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // ─── 사이드바 필터 + 검색 ────────────────────────────────────────────────

  // 역할 탭 필터 — tabCounts·filteredRooms 공통 베이스
  const roleFilteredRooms = useMemo(() => {
    if (!isArtistAccount) return rooms;
    if (roleTab === "buyer") return rooms.filter((r) => r.buyerEmail === session.email);
    return rooms.filter((r) => r.artistId === session.artistId);
  }, [rooms, roleTab, isArtistAccount, session.email, session.artistId]);

  const filteredRooms = useMemo(() => {
    let list = roleFilteredRooms;

    if (filterTab === "거래중") {
      list = list.filter((r) => r.status === "거래중");
    } else if (filterTab === "완료") {
      list = list.filter((r) => r.status === "거래완료" || r.status === "취소");
    }

    if (sidebarSearch.trim()) {
      const q = sidebarSearch.toLowerCase();
      list = list.filter(
        (room) =>
          room.artworkTitle.toLowerCase().includes(q) ||
          room.artistName.toLowerCase().includes(q) ||
          room.buyerName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [roleFilteredRooms, sidebarSearch, filterTab]);

  const tabCounts = useMemo(
    () => ({
      전체: roleFilteredRooms.length,
      거래중: roleFilteredRooms.filter((r) => r.status === "거래중").length,
      완료: roleFilteredRooms.filter((r) => r.status === "거래완료" || r.status === "취소").length,
    }),
    [roleFilteredRooms]
  );

  // ─── 렌더링 ───────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col bg-white font-sans min-h-0">

      {/* 모바일: 채팅 화면일 때 상단 미니 바 */}
      {!showSidebar && selectedRoom && (
        <div className="flex sm:hidden items-center gap-3 px-3 py-2.5 border-b border-[#ebebeb] bg-[#f7f7f7] flex-shrink-0">
          <button
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#6a6a6a] border-none bg-transparent cursor-pointer p-1 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            목록
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ArtworkThumb
              src={selectedRoom.artworkImage}
              alt={selectedRoom.artworkTitle}
              className="h-7 w-7 rounded flex-shrink-0"
            />
            <span className="text-sm font-bold text-[#222222] truncate">
              {selectedRoom.artworkTitle}
            </span>
          </div>
          <StatusBadge status={selectedRoom.status} size="sm" />
        </div>
      )}

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── 왼쪽 사이드바 ──────────────────────────────────────────────────── */}
        <aside
          className={`flex-shrink-0 border-r border-[#ebebeb] bg-white flex-col overflow-hidden w-full sm:w-80 ${
            showSidebar ? "flex" : "hidden"
          } sm:flex`}
        >
          {/* 사이드바 헤더 */}
          <div className="flex-shrink-0 border-b border-[#ebebeb] bg-[#f7f7f7]">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#ff385c]" />
                <span className="text-sm font-bold text-[#222222]">채팅 & 거래</span>
                {!roomsLoading && (
                  <span className="text-xs text-[#6a6a6a] bg-[#ebebeb] px-1.5 py-0.5 rounded-full font-semibold">
                    {filteredRooms.length !== roleFilteredRooms.length
                      ? `${filteredRooms.length}/${roleFilteredRooms.length}`
                      : roleFilteredRooms.length}
                  </span>
                )}
              </div>
              <button
                onClick={fetchRooms}
                disabled={roomsLoading}
                className="p-1.5 rounded-full text-[#6a6a6a] hover:text-[#222222] hover:bg-[#ebebeb] transition-all border-none bg-transparent cursor-pointer disabled:opacity-40"
                title="새로고침"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${roomsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* 컬렉터 / 작가 역할 탭 — 작가 계정만 표시 */}
            {isArtistAccount && (
              <div className="flex px-3 pb-2 gap-1.5">
                <button
                  onClick={() => { setRoleTab("buyer"); setSelectedRoom(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                    roleTab === "buyer"
                      ? "bg-[#ff385c] text-white border-[#ff385c]"
                      : "bg-white text-[#6a6a6a] border-[#ebebeb] hover:border-[#ff385c]/40 hover:text-[#ff385c]"
                  }`}
                >
                  <Compass className="h-3 w-3" />
                  컬렉터
                </button>
                <button
                  onClick={() => { setRoleTab("artist"); setSelectedRoom(null); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                    roleTab === "artist"
                      ? "bg-[#222222] text-white border-[#222222]"
                      : "bg-white text-[#6a6a6a] border-[#ebebeb] hover:border-[#222222]/40 hover:text-[#222222]"
                  }`}
                >
                  <Palette className="h-3 w-3" />
                  작가
                </button>
              </div>
            )}
          </div>

          {/* 필터 탭 */}
          {roleFilteredRooms.length > 0 && (
            <div className="flex border-b border-[#ebebeb] flex-shrink-0">
              {(["전체", "거래중", "완료"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 py-2 text-xs font-semibold transition-all border-none cursor-pointer ${
                    filterTab === tab
                      ? "text-[#ff385c] border-b-2 border-[#ff385c] bg-white"
                      : "text-[#6a6a6a] bg-[#f7f7f7] hover:text-[#222222]"
                  }`}
                >
                  {tab}
                  {tabCounts[tab] > 0 && (
                    <span
                      className={`ml-1 text-[10px] px-1 py-0.5 rounded-full ${
                        filterTab === tab
                          ? "bg-[#ff385c]/10 text-[#ff385c]"
                          : "bg-[#ebebeb] text-[#6a6a6a]"
                      }`}
                    >
                      {tabCounts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 검색 */}
          {roleFilteredRooms.length > 0 && (
            <div className="px-3 py-2 border-b border-[#ebebeb] flex-shrink-0">
              <div className="flex items-center gap-2 bg-[#f7f7f7] rounded-lg px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-[#aaaaaa] flex-shrink-0" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="작품명, 상대방 이름 검색..."
                  className="flex-1 bg-transparent text-xs text-[#222222] placeholder-[#aaaaaa] outline-none font-sans"
                />
                {sidebarSearch && (
                  <button
                    onClick={() => setSidebarSearch("")}
                    className="text-[#aaaaaa] hover:text-[#222222] border-none bg-transparent cursor-pointer p-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 방 목록 */}
          <div className="flex-1 overflow-y-auto">
            {roomsLoading ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f7f7] animate-pulse"
                  >
                    <div className="h-12 w-12 rounded-lg bg-[#ebebeb] flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#ebebeb] rounded w-3/4" />
                      <div className="h-2.5 bg-[#ebebeb] rounded w-1/2" />
                      <div className="h-2 bg-[#ebebeb] rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : roomsError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 gap-3">
                <XCircle className="h-8 w-8 text-[#ff385c]/60" />
                <p className="text-xs text-[#6a6a6a] text-center">{roomsError}</p>
                <button
                  onClick={fetchRooms}
                  className="text-xs text-[#ff385c] font-semibold hover:underline border-none bg-transparent cursor-pointer"
                >
                  재시도
                </button>
              </div>
            ) : roleFilteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 gap-3">
                <div className="p-4 bg-[#f7f7f7] rounded-full">
                  <MessageSquare className="h-8 w-8 text-[#ebebeb]" />
                </div>
                <p className="text-sm font-semibold text-[#6a6a6a]">아직 대화가 없습니다</p>
                <p className="text-xs text-[#aaaaaa] text-center leading-relaxed">
                  {isArtistAccount && roleTab === "artist"
                    ? "컬렉터가 작품에 문의하면\n여기에 표시됩니다."
                    : "작품을 탐색하고\n작가에게 문의해보세요."}
                </p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 gap-2">
                <Search className="h-6 w-6 text-[#ebebeb]" />
                <p className="text-xs text-[#aaaaaa] text-center">
                  검색 결과가 없습니다
                </p>
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {filteredRooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const asArtist = isArtistInRoom(room);
                  const counterpartName = asArtist ? room.buyerName : room.artistName || "작가";
                  const previewText = room.lastMessage ?? room.message;
                  const previewTime = room.lastMessageAt ?? room.createdAt;

                  return (
                    <li key={room.id}>
                      <button
                        onClick={() => handleSelectRoom(room)}
                        className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-[#ff385c]/5 border-l-2 border-l-[#ff385c] border-r-transparent border-t-transparent border-b-transparent"
                            : "border-transparent hover:bg-[#f7f7f7] hover:border-[#ebebeb]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-[#ebebeb]">
                            <ArtworkThumb
                              src={room.artworkImage}
                              alt={room.artworkTitle}
                              className="h-full w-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-sm font-bold text-[#222222] truncate">
                                {counterpartName}
                              </span>
                              <span className="text-[10px] text-[#aaaaaa] flex-shrink-0">
                                {formatRoomTime(previewTime)}
                              </span>
                            </div>
                            <p className="text-xs text-[#6a6a6a] truncate mb-1.5">
                              {room.artworkTitle}
                            </p>
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs text-[#aaaaaa] truncate flex-1">
                                {previewText}
                              </p>
                              <StatusBadge status={room.status} size="sm" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* ── 오른쪽 패널 ────────────────────────────────────────────────────── */}
        <div
          className={`flex-1 flex-col overflow-hidden bg-white ${
            !showSidebar ? "flex" : "hidden"
          } sm:flex`}
        >
          {!selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
              <div className="p-6 bg-[#f7f7f7] rounded-full">
                <MessageSquare className="h-12 w-12 text-[#ebebeb]" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-[#222222] mb-1">대화를 선택해주세요</p>
                <p className="text-sm text-[#6a6a6a]">
                  왼쪽 목록에서 대화방을 선택하면
                  <br />
                  메시지를 확인할 수 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* 채팅 헤더 (PC) */}
              <ChatRoomHeader
                room={selectedRoom}
                artwork={selectedArtwork}
                isArtist={isArtistInRoom(selectedRoom)}
                isUpdatingStatus={isUpdatingStatus}
                showArtworkPanel={showArtworkPanel}
                onToggleArtworkPanel={() => setShowArtworkPanel((v) => !v)}
                onStatusChange={handleStatusChange}
              />

              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-white min-h-0">
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="h-6 w-6 border-2 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-[#6a6a6a]">메시지를 불러오는 중...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <div className="p-4 bg-[#f7f7f7] rounded-full">
                      <MessageSquare className="h-6 w-6 text-[#ebebeb]" />
                    </div>
                    <p className="text-sm text-[#6a6a6a]">아직 메시지가 없습니다.</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isMine = msg.senderEmail === session.email;
                      const prevMsg = index > 0 ? messages[index - 1] : null;
                      const isConsecutive =
                        prevMsg?.senderEmail === msg.senderEmail &&
                        isSameDay(prevMsg.sentAt, msg.sentAt) &&
                        msg.messageType !== "system" &&
                        prevMsg.messageType !== "system";
                      const showDateSep =
                        msg.messageType !== "system" &&
                        (!prevMsg || !isSameDay(prevMsg.sentAt, msg.sentAt));

                      return (
                        <React.Fragment key={msg.id}>
                          {showDateSep && <DateSeparator isoString={msg.sentAt} />}
                          <MessageBubble
                            message={msg}
                            isMine={isMine}
                            isConsecutive={isConsecutive}
                            onEstimateRespond={handleEstimateRespond}
                          />
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* 퀵리플라이 패널 (작가 전용) */}
              {showQuickReply && isArtistInRoom(selectedRoom) && (
                <QuickReplyPanel
                  onSelect={handleQuickReplySelect}
                  onClose={() => setShowQuickReply(false)}
                />
              )}

              {/* 입력 영역 */}
              <div className="flex-shrink-0 border-t border-[#ebebeb] bg-white px-4 py-3">
                  <div className="flex items-end gap-2">
                    {/* 작가 전용: 퀵리플라이 토글 버튼 */}
                    {isArtistInRoom(selectedRoom) && (
                      <button
                        onClick={() => setShowQuickReply((v) => !v)}
                        title="자주 쓰는 문구"
                        className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                          showQuickReply
                            ? "bg-[#ff385c] border-[#ff385c] text-white"
                            : "bg-white border-[#ebebeb] text-[#6a6a6a] hover:border-[#ff385c] hover:text-[#ff385c]"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                      </button>
                    )}

                    <textarea
                      ref={textareaRef}
                      defaultValue=""
                      onChange={(e) => setHasInput(e.target.value.trim().length > 0)}
                      onCompositionStart={() => {
                        isComposingRef.current = true;
                      }}
                      onCompositionEnd={(e) => {
                        isComposingRef.current = false;
                        setHasInput(
                          (e.target as HTMLTextAreaElement).value.trim().length > 0
                        );
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="메시지를 입력하세요... (Enter 전송 · Shift+Enter 줄바꿈)"
                      rows={2}
                      disabled={isSending}
                      className="flex-1 resize-none rounded-2xl border border-[#ebebeb] bg-[#f7f7f7] px-4 py-3 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/30 focus:border-[#ff385c]/50 focus:bg-white transition-all disabled:opacity-60 font-sans"
                      style={{ maxHeight: "120px" }}
                    />
                    {/* 견적서 버튼 — 작가 역할일 때만 */}
                    {selectedRoom && isArtistInRoom(selectedRoom) && (
                      <button
                        onClick={() => setShowEstimateModal(true)}
                        disabled={isSending}
                        title="견적서 보내기"
                        className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border border-[#ebebeb] text-[#6a6a6a] hover:border-[#222222] hover:text-[#222222] bg-white transition-all cursor-pointer disabled:opacity-40"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={handleSend}
                      disabled={!hasInput || isSending}
                      className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-[#ff385c] text-white hover:bg-[#e00b41] disabled:opacity-40 disabled:cursor-not-allowed transition-all border-none cursor-pointer shadow-sm"
                      title="전송 (Enter)"
                    >
                      {isSending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── 견적서 작성 모달 ─────────────────────────────────────────────── */}
      {showEstimateModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] rounded-t-2xl">

            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb] flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#222222]" />
                <div>
                  <p className="text-sm font-bold text-[#222222]">견적서 작성</p>
                  <p className="text-[11px] text-[#aaaaaa]">{selectedRoom.artworkTitle}</p>
                </div>
              </div>
              <button onClick={() => setShowEstimateModal(false)} className="p-1.5 rounded-full hover:bg-[#f7f7f7] text-[#6a6a6a] transition-colors border-none bg-transparent cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 모달 바디 — 스크롤 */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

              {/* ① 작품 정보 (자동 + 보완) */}
              <section>
                <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">① 작품 정보</p>
                <div className="bg-[#f7f7f7] rounded-xl px-3 py-2.5 mb-3 space-y-0.5">
                  <p className="text-xs font-bold text-[#222222]">{selectedRoom.artworkTitle}</p>
                  <p className="text-[11px] text-[#6a6a6a]">by {selectedRoom.artistName}</p>
                  {selectedArtwork && (
                    <p className="text-[11px] text-[#6a6a6a]">
                      {[selectedArtwork.year, selectedArtwork.medium, selectedArtwork.dimensions].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">호수 <span className="text-[#aaaaaa] font-normal">(선택)</span></label>
                    <input type="text" placeholder="예: 20호" value={estimateForm.canvasSize}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, canvasSize: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">에디션 <span className="text-[#aaaaaa] font-normal">(선택)</span></label>
                    <input type="text" placeholder="예: 3/30" value={estimateForm.edition}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, edition: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                  </div>
                </div>
              </section>

              {/* ② 견적 금액 */}
              <section>
                <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">② 견적 금액</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">공급가액 <span className="text-[#ff385c]">*</span></label>
                    <div className="relative">
                      <input type="text" inputMode="numeric" placeholder="0"
                        value={estimateForm.supplyPrice}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          setEstimateForm((f) => ({ ...f, supplyPrice: raw ? parseInt(raw,10).toLocaleString("ko-KR") : "" }));
                        }}
                        className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 pr-8 text-sm placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6a6a6a] font-semibold">원</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1.5">부가가치세(VAT)</label>
                    <div className="flex gap-2">
                      {(["included","excluded","exempt"] as const).map((v) => (
                        <button key={v} onClick={() => setEstimateForm((f) => ({ ...f, vatType: v }))}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${estimateForm.vatType === v ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-[#6a6a6a] border-[#ebebeb] hover:border-[#222222]/40"}`}>
                          {v === "included" ? "포함" : v === "excluded" ? "별도(+10%)" : "면세"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {estimateForm.supplyPrice && (
                    <div className="bg-[#f7f7f7] rounded-xl px-3 py-2 flex justify-between items-center">
                      <span className="text-xs text-[#6a6a6a] font-semibold">총 합계</span>
                      <span className="text-sm font-bold text-[#ff385c]">
                        {(() => {
                          const sp = parseInt(estimateForm.supplyPrice.replace(/,/g,""),10)||0;
                          const total = estimateForm.vatType === "excluded" ? sp + Math.round(sp*0.1) : sp;
                          return total.toLocaleString("ko-KR") + "원";
                        })()}
                      </span>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">유효기간 <span className="text-[#ff385c]">*</span></label>
                    <input type="date" value={estimateForm.validUntil}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, validUntil: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                  </div>
                </div>
              </section>

              {/* ③ 거래 조건 */}
              <section>
                <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">③ 거래 조건</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">계약금 비율 <span className="text-[#aaaaaa] font-normal">(선택)</span></label>
                    <div className="relative">
                      <input type="number" min="0" max="100" placeholder="30"
                        value={estimateForm.depositRate}
                        onChange={(e) => setEstimateForm((f) => ({ ...f, depositRate: e.target.value }))}
                        className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 pr-7 text-sm placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6a6a6a]">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">결제 방식</label>
                    <select value={estimateForm.paymentMethod}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50 bg-white">
                      {["계좌이체","카드결제","현금","기타"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">인도 방법</label>
                    <select value={estimateForm.deliveryMethod}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, deliveryMethod: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50 bg-white">
                      {["택배","직접 수령","화물 배송","설치 포함"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#444444] mb-1">배송비 부담</label>
                    <select value={estimateForm.deliveryFeeBy}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, deliveryFeeBy: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50 bg-white">
                      {["구매자","판매자","협의"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[#444444] mb-1">인도 예정일 <span className="text-[#aaaaaa] font-normal">(선택)</span></label>
                    <input type="date" value={estimateForm.deliveryDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, deliveryDate: e.target.value }))}
                      className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50" />
                  </div>
                </div>
              </section>

              {/* ④ 비고·유의사항 */}
              <section>
                <p className="text-[10px] font-bold text-[#aaaaaa] uppercase tracking-wide mb-2">④ 비고 · 유의사항</p>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={estimateForm.includesCoa}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, includesCoa: e.target.checked }))}
                      className="w-4 h-4 accent-[#222222] cursor-pointer" />
                    <span className="text-xs font-semibold text-[#444444]">진품보증서 포함</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={estimateForm.includesFrame}
                      onChange={(e) => setEstimateForm((f) => ({ ...f, includesFrame: e.target.checked }))}
                      className="w-4 h-4 accent-[#222222] cursor-pointer" />
                    <span className="text-xs font-semibold text-[#444444]">액자 포함</span>
                  </label>
                </div>
                <textarea placeholder="기타 특약사항 (색상 차이, 교환·환불 조건 등)"
                  value={estimateForm.notes}
                  onChange={(e) => setEstimateForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full border border-[#ebebeb] rounded-xl px-3 py-2 text-sm placeholder-[#aaaaaa] focus:outline-none focus:ring-2 focus:ring-[#222222]/20 focus:border-[#222222]/50 resize-none font-sans" />
              </section>
            </div>

            {/* 모달 푸터 */}
            <div className="flex gap-2 px-5 py-4 border-t border-[#ebebeb] flex-shrink-0">
              <button onClick={() => setShowEstimateModal(false)}
                className="flex-1 py-2.5 border border-[#ebebeb] rounded-xl text-sm font-bold text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors cursor-pointer bg-white">
                취소
              </button>
              <button onClick={handleSendEstimate}
                disabled={!estimateForm.supplyPrice || !estimateForm.validUntil || isSending}
                className="flex-2 px-6 py-2.5 bg-[#222222] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                견적서 보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
