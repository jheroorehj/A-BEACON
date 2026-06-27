/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import BuyerExplore from "./components/BuyerExplore";
import ArtistManager from "./components/ArtistManager";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DevDashboard from "./components/DevDashboard";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import { Logo } from "./components/Logo";
import { Artist, Artwork, AppError, UserSession } from "./types";
import { artworksApi, artistsApi } from "./services/api";
import { getSession, logout } from "./services/auth";
import { Heart, AlertTriangle, RefreshCw } from "lucide-react";

type UserMode = "buyer" | "artist";

export default function App() {
  // ─── 인증 상태 ───────────────────────────────────────────────────────────────
  const [session, setSession] = useState<UserSession | null>(() => getSession());
  const [mode, setMode] = useState<UserMode>("buyer");

  // ─── 전역 데이터 ─────────────────────────────────────────────────────────────
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<AppError | null>(null);

  // 세션이 생기면 데이터 로드
  useEffect(() => {
    if (session) {
      fetchGlobalData();
    }
  }, [session]);

  const fetchGlobalData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [artworksData, artistsData] = await Promise.all([
        artworksApi.list(),
        artistsApi.list(),
      ]);
      setArtworks(artworksData);
      setArtists(artistsData);
    } catch (err: unknown) {
      console.error("Failed to load data:", err);
      const message = err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.";
      const code = (err as { status?: number })?.status;
      setLoadError({ message, code });
    } finally {
      setIsLoading(false);
    }
  };

  const syncArtworks = async () => {
    try {
      const data = await artworksApi.list();
      setArtworks(data);
    } catch (e) {
      console.error("Artworks sync failed:", e);
    }
  };

  const handleAddArtworkLocal = (newArt: Artwork) => {
    setArtworks((prev) => [newArt, ...prev]);
  };

  // ─── 비로그인 뷰 상태 ────────────────────────────────────────────────────────
  const [authView, setAuthView] = useState<"home" | "login" | "register">("home");

  // ─── 로그인 후 앱 뷰 ─────────────────────────────────────────────────────────
  const [appView, setAppView] = useState<"main" | "chat">("main");
  const [chatInitRoomId, setChatInitRoomId] = useState<string | null>(null);

  // ─── Auth 핸들러 ─────────────────────────────────────────────────────────────

  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    setMode("buyer"); // 항상 고객 모드로 시작
  };

  const handleLogout = () => {
    logout();
    setSession(null);
    setArtworks([]);
    setArtists([]);
    setLoadError(null);
    setAuthView("home");
    setAppView("main");
  };

  const handleOpenChat = (roomId?: string) => {
    setChatInitRoomId(roomId ?? null);
    setAppView("chat");
  };

  const handleLogoClick = () => {
    setAppView("main");
  };

  // ─── 라우팅 ──────────────────────────────────────────────────────────────────

  // 1. 비로그인 → 홈 / 로그인 / 회원가입 페이지
  if (!session) {
    if (authView === "home") {
      return <HomePage onStart={() => setAuthView("login")} />;
    }
    if (authView === "register") {
      return <RegisterPage onLogin={handleLogin} onBack={() => setAuthView("login")} />;
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setAuthView("home")}
        onRegister={() => setAuthView("register")}
      />
    );
  }

  // 2. 관리자 → 개발자 대시보드
  if (session.role === "admin") {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Navbar session={session} onLogout={handleLogout} onLogoClick={handleLogoClick} />
        <main className="flex-1">
          <DevDashboard />
        </main>
      </div>
    );
  }

  // 3. 로그인된 일반 사용자 / 작가 → 채팅 or 메인 뷰
  // role === "artist": 고객 모드 + 작가 모드 전환 가능
  // role === "user"  : 고객 모드 고정 (작가 탭 없음)
  const isArtistAccount = session.role === "artist";

  return (
    <div className={`bg-[#ffffff] text-[#222222] flex flex-col ${appView === "chat" ? "h-screen overflow-hidden" : "min-h-screen"}`} id="app-root-view">
      <Navbar
        session={session}
        currentMode={isArtistAccount ? mode : "buyer"}
        onModeChange={isArtistAccount ? (m) => { setMode(m); setAppView("main"); } : undefined}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick}
        onOpenChat={() => handleOpenChat()}
        isChatActive={appView === "chat"}
      />

      <main className={`flex-1 min-h-0 ${appView === "chat" ? "flex flex-col overflow-hidden" : ""}`}>
        {appView === "chat" ? (
          <ChatPage
            session={session}
            chatMode={isArtistAccount ? mode : "buyer"}
            initialRoomId={chatInitRoomId}
            onBack={() => setAppView("main")}
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="h-10 w-10 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#6a6a6a] font-mono tracking-widest animate-pulse font-semibold">
              LOADING COMPREHENSIVE ART ARCHIVES...
            </p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-[#ff385c]" />
            </div>
            <h2 className="font-bold text-[#222222] text-lg">연결 오류</h2>
            <p className="text-sm text-[#6a6a6a] text-center max-w-sm">{loadError.message}</p>
            <button
              onClick={fetchGlobalData}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#ff385c] text-white text-xs font-bold rounded-full hover:bg-[#e00b41] transition-all cursor-pointer border-none"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>재시도</span>
            </button>
          </div>
        ) : isArtistAccount && mode === "artist" ? (
          /* 작가 모드: 작가 지원실 — artist role 전용 */
          <ArtistManager
            artworks={artworks}
            artists={artists}
            userEmail={session.email}
            selectedArtistId={session.artistId ?? ""}
            onRefreshArtworks={syncArtworks}
            onOpenChat={handleOpenChat}
          />
        ) : (
          /* 고객 모드: 작품 탐색 — 모든 로그인 유저 */
          <BuyerExplore
            artworks={artworks}
            artists={artists}
            userEmail={session.email}
            displayName={session.displayName}
            initialSelectedArtwork={null}
            onClearInitialSelected={() => {}}
            onAddArtworkToList={handleAddArtworkLocal}
            initialSearchQuery=""
            onClearInitialSearch={() => {}}
            onOpenChat={handleOpenChat}
          />
        )}
      </main>

      {/* 푸터 — 채팅 페이지에서는 숨김 */}
      {appView !== "chat" && !isLoading && !loadError && (
        <footer className="bg-[#f7f7f7] border-t border-[#ebebeb] py-10 text-[#6a6a6a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs">
              <Logo size="sm" />
              <span className="text-[#ebebeb]">·</span>
              <span className="font-light text-[#6a6a6a]">창작자와 감상자를 잇는 예술 플랫폼</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#aaaaaa] font-mono">
              <Heart className="h-3 w-3 text-[#ff385c] fill-[#ff385c]" />
              <span>&copy; {new Date().getFullYear()} A-BEACON. All rights reserved.</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
