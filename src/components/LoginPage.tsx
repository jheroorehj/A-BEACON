import React, { useState } from "react";
import { Eye, EyeOff, LogIn, Sparkles, AlertTriangle, ChevronLeft } from "lucide-react";
import { login, MOCK_USERS } from "../services/auth";
import { Logo } from "./Logo";
import type { UserSession } from "../types";

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
  onBack?: () => void;
  onRegister?: () => void;
}

export default function LoginPage({ onLogin, onBack, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // 비동기 처리 준비 (실제 백엔드 연결 시 await 추가)
    try {
      await new Promise((r) => setTimeout(r, 400)); // UX: 짧은 로딩감
      const session = login(email.trim(), password);
      onLogin(session);
    } catch (err: any) {
      setError(err.message ?? "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  const demoAccounts = MOCK_USERS.map((u) => ({
    email: u.email,
    password: u.password,
    label: u.displayName,
    badge: u.role === "admin" ? "관리자" : u.role === "artist" ? "작가" : "고객",
    badgeColor:
      u.role === "admin"
        ? "bg-[#ff385c] text-white"
        : u.role === "artist"
        ? "bg-violet-100 text-violet-700 border border-violet-200"
        : "bg-[#f7f7f7] text-[#222222] border border-[#dddddd]",
  }));

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      {/* 상단 브랜드 바 */}
      <header className="border-b border-[#ebebeb] px-6 sm:px-10 py-5 flex items-center justify-between">
        <Logo size="md" />
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-[#6a6a6a] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            홈으로
          </button>
        )}
      </header>

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* 헤드 카피 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-1.5 bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#ff385c]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#6a6a6a] uppercase">Fine Art Platform</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#222222]">
              다시 만나서 반갑습니다
            </h1>
            <p className="mt-2 text-sm text-[#6a6a6a] font-light">
              창작자와 감상자를 잇는 예술 플랫폼에 로그인하세요.
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 이메일 */}
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  이메일
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="your@email.com"
                  className="w-full border border-[#dddddd] rounded-lg px-4 py-2.5 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/20 transition-all bg-[#fafafa] focus:bg-white"
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="비밀번호 입력"
                    className="w-full border border-[#dddddd] rounded-lg px-4 py-2.5 pr-11 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/20 transition-all bg-[#fafafa] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent p-0"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-[#ff385c]/5 border border-[#ff385c]/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-[#ff385c] shrink-0" />
                  <p className="text-xs text-[#ff385c] font-medium">{error}</p>
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-[#ff385c] hover:bg-[#e00b41] disabled:bg-[#dddddd] disabled:text-[#aaaaaa] disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border-none"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>로그인 중...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>로그인</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 데모 계정 힌트 */}
          <div className="mt-6">
            <p className="text-center text-[10px] font-mono font-bold text-[#aaaaaa] uppercase tracking-widest mb-3">
              Demo Accounts
            </p>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#ebebeb] rounded-xl hover:border-[#ff385c]/30 hover:bg-[#fff5f6] transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="h-8 w-8 rounded-full bg-[#f7f7f7] border border-[#ebebeb] flex items-center justify-center text-sm font-bold text-[#222222]">
                      {acc.label[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#222222] group-hover:text-[#ff385c] transition-colors">{acc.label}</p>
                      <p className="text-[10px] text-[#aaaaaa] font-mono">{acc.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-[#aaaaaa]">{acc.password}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${acc.badgeColor}`}>
                      {acc.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-[#aaaaaa] mt-3">
              계정 클릭 시 자동 입력됩니다.
            </p>
          </div>

          {/* 회원가입 링크 */}
          {onRegister && (
            <p className="text-center text-xs text-[#6a6a6a] mt-6">
              아직 계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={onRegister}
                className="text-[#ff385c] font-bold hover:underline cursor-pointer border-none bg-transparent p-0"
              >
                회원가입
              </button>
            </p>
          )}

        </div>
      </div>

      {/* 하단 */}
      <footer className="py-6 text-center">
        <p className="text-[10px] text-[#aaaaaa] font-mono">
          &copy; {new Date().getFullYear()} A-BEACON. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
