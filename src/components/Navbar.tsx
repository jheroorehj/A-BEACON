import React from "react";
import { Compass, LogOut, UserCheck, LayoutDashboard, MessageSquare, Palette } from "lucide-react";
import { Logo } from "./Logo";
import type { UserSession } from "../types";

interface NavbarProps {
  session: UserSession;
  /** user role 전용: 현재 활성 모드 */
  currentMode?: "buyer" | "artist";
  /** user role 전용: 모드 변경 핸들러 */
  onModeChange?: (mode: "buyer" | "artist") => void;
  onLogout: () => void;
  /** 로고 클릭 시 호출 — 메인 화면으로 복귀 */
  onLogoClick?: () => void;
  /** 채팅 페이지 열기 */
  onOpenChat?: () => void;
  /** 현재 채팅 페이지 활성 여부 */
  isChatActive?: boolean;
}

export default function Navbar({
  session,
  currentMode,
  onModeChange,
  onLogout,
  onLogoClick,
  onOpenChat,
  isChatActive,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#ebebeb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">

          {/* 로고 */}
          <div className="flex items-center gap-3">
            <Logo
              size="md"
              onClick={onLogoClick}
              className={onLogoClick ? "hover:opacity-80 transition-opacity" : ""}
            />
            {session.role === "admin" && (
              <span className="hidden sm:flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-widest bg-[#ff385c] text-white px-2 py-0.5 rounded-full">
                <LayoutDashboard className="h-2.5 w-2.5" />
                DEV
              </span>
            )}
          </div>

          {/* 중앙: 역할에 따라 다른 내비게이션 */}
          <div className="flex items-center">
            {session.role === "admin" ? (
              /* 관리자 */
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#6a6a6a]">
                <LayoutDashboard className="h-4 w-4 text-[#ff385c]" />
                <span>개발자 대시보드</span>
              </div>
            ) : onModeChange ? (
              /* 모든 로그인 유저: 컬렉터 ↔ 작가 토글 */
              <div className="flex border border-[#dddddd] p-1 rounded-full bg-[#f7f7f7] gap-0.5">
                <button
                  onClick={() => onModeChange("buyer")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer border-none ${
                    currentMode === "buyer" && !isChatActive
                      ? "bg-[#ff385c] text-white shadow-sm"
                      : "text-[#6a6a6a] hover:text-[#222222] bg-transparent"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>컬렉터</span>
                </button>
                <button
                  onClick={() => onModeChange("artist")}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer border-none ${
                    currentMode === "artist" && !isChatActive
                      ? "bg-[#222222] text-white shadow-sm"
                      : "text-[#6a6a6a] hover:text-[#222222] bg-transparent"
                  }`}
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span>작가</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* 우측: 유저 정보 + 채팅 + 로그아웃 */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-full">
              {session.role === "artist" ? (
                <Palette className="h-3.5 w-3.5 text-violet-500" />
              ) : (
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
              <span className="font-mono text-[11px] text-[#222222] font-semibold max-w-[140px] truncate" title={session.email}>
                {session.displayName}
              </span>
              {session.role === "artist" && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600">작가</span>
              )}
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${session.role === "artist" ? "bg-violet-500" : "bg-emerald-500"}`} />
            </div>

            {/* 채팅 버튼 — admin 제외 */}
            {session.role !== "admin" && onOpenChat && (
              <button
                onClick={onOpenChat}
                className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isChatActive
                    ? "bg-[#ff385c] text-white border-[#ff385c]"
                    : "border-[#dddddd] text-[#6a6a6a] hover:text-[#ff385c] hover:border-[#ff385c]/40 hover:bg-[#ff385c]/5 bg-white"
                }`}
                title="채팅 & 거래 관리"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">채팅</span>
              </button>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#dddddd] rounded-full text-xs font-bold text-[#6a6a6a] hover:text-[#ff385c] hover:border-[#ff385c]/40 hover:bg-[#ff385c]/5 transition-all cursor-pointer bg-white"
              title="로그아웃"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
