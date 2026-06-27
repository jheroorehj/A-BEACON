import React, { useState } from "react";
import { Eye, EyeOff, UserPlus, Sparkles, AlertTriangle, ChevronLeft, Check } from "lucide-react";
import { register } from "../services/auth";
import { Logo } from "./Logo";
import type { UserSession } from "../types";

interface RegisterPageProps {
  onLogin: (session: UserSession) => void;
  onBack?: () => void;
}

export default function RegisterPage({ onLogin, onBack }: RegisterPageProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = displayName.trim() && email && password.length >= 6 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const session = register(email.trim(), password, displayName.trim());
      onLogin(session);
    } catch (err: any) {
      setError(err.message ?? "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      {/* 상단 브랜드 바 */}
      <header className="border-b border-[#ebebeb] px-8 sm:px-16 py-5">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs text-[#6a6a6a] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              로그인으로
            </button>
          )}
        </div>
      </header>

      {/* 메인 레이아웃 */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* 헤드 카피 */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-1.5 bg-[#f7f7f7] border border-[#ebebeb] px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#ff385c]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#6a6a6a] uppercase">Join A-BEACON</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#222222]">
              지금 시작해보세요
            </h1>
            <p className="mt-2 text-sm text-[#6a6a6a] font-light">
              창작자와 감상자가 만나는 예술 플랫폼에 합류하세요.
            </p>
          </div>

          {/* 회원가입 폼 */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* 이름 */}
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  이름 / 닉네임
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
                  placeholder="홍길동"
                  className="w-full border border-[#dddddd] rounded-lg px-4 py-2.5 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]/20 transition-all bg-[#fafafa] focus:bg-white"
                />
              </div>

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
                  비밀번호 <span className="text-[#aaaaaa] font-normal">(6자 이상)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="new-password"
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

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                    placeholder="비밀번호 재입력"
                    className={`w-full border rounded-lg px-4 py-2.5 pr-11 text-sm text-[#222222] placeholder-[#aaaaaa] focus:outline-none focus:ring-1 transition-all bg-[#fafafa] focus:bg-white ${
                      confirmPassword && !passwordsMatch
                        ? "border-[#ff385c] focus:border-[#ff385c] focus:ring-[#ff385c]/20"
                        : passwordsMatch
                        ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                        : "border-[#dddddd] focus:border-[#ff385c] focus:ring-[#ff385c]/20"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {passwordsMatch && (
                      <Check className="h-4 w-4 text-emerald-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      className="text-[#aaaaaa] hover:text-[#222222] transition-colors cursor-pointer border-none bg-transparent p-0"
                    >
                      {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-[#ff385c]/5 border border-[#ff385c]/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-[#ff385c] shrink-0" />
                  <p className="text-xs text-[#ff385c] font-medium">{error}</p>
                </div>
              )}

              {/* 가입 버튼 */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full bg-[#ff385c] hover:bg-[#e00b41] disabled:bg-[#dddddd] disabled:text-[#aaaaaa] disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border-none"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>가입 중...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>회원가입</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 로그인 링크 */}
          <p className="text-center text-xs text-[#6a6a6a] mt-6">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={onBack}
              className="text-[#ff385c] font-bold hover:underline cursor-pointer border-none bg-transparent p-0"
            >
              로그인
            </button>
          </p>

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
