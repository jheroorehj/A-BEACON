import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, Image, Users, MessageSquare, Server,
  Trash2, RefreshCw, CheckCircle2, XCircle, ChevronRight,
  Activity, Database, Tag, Eye
} from "lucide-react";
import { artworksApi, artistsApi, inquiriesApi, adminApi } from "../services/api";
import { MOCK_USERS } from "../services/auth";
import type { Artwork, Artist, UserInquiry, AdminStats } from "../types";

type Tab = "overview" | "artworks" | "artists" | "inquiries" | "system";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview",   label: "개요",      icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "artworks",   label: "작품 관리", icon: <Image className="h-4 w-4" /> },
  { id: "artists",    label: "작가 관리", icon: <Users className="h-4 w-4" /> },
  { id: "inquiries",  label: "문의 현황", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "system",     label: "시스템",    icon: <Server className="h-4 w-4" /> },
];

const CATEGORY_LABELS: Record<string, string> = {
  Painting: "회화", Sculpture: "조소", Photography: "사진",
  "Media Art": "미디어아트", Craft: "공예",
};
const CATEGORY_COLORS: Record<string, string> = {
  Painting: "bg-rose-50 text-rose-700 border-rose-100",
  Sculpture: "bg-slate-50 text-slate-700 border-slate-200",
  Photography: "bg-amber-50 text-amber-700 border-amber-100",
  "Media Art": "bg-violet-50 text-violet-700 border-violet-100",
  Craft: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

// ─── 재사용 UI ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color = "text-[#222222]" }: {
  label: string; value: number | string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-xl p-5 hover:border-[#dddddd] transition-colors">
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#aaaaaa]">{label}</p>
      <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-[#aaaaaa] mt-1">{sub}</p>}
    </div>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-[#ebebeb]">
        {cols.map((c) => (
          <th key={c} className="text-left text-[10px] font-mono font-bold uppercase tracking-wider text-[#aaaaaa] py-3 px-4 first:pl-0">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Badge({ text, colorClass = "bg-[#f7f7f7] text-[#6a6a6a] border-[#ebebeb]" }: { text: string; colorClass?: string }) {
  return (
    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${colorClass}`}>
      {text}
    </span>
  );
}

function LoadRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="py-16 text-center text-sm text-[#aaaaaa]">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 border-2 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
          <span>불러오는 중...</span>
        </div>
      </td>
    </tr>
  );
}

// ─── 탭별 뷰 ─────────────────────────────────────────────────────────────────

function OverviewTab({ stats, artworks, inquiries }: {
  stats: AdminStats | null;
  artworks: Artwork[];
  inquiries: UserInquiry[];
}) {
  const recentArtworks = [...artworks].slice(0, 6);
  const recentInquiries = [...inquiries].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="총 작품 수" value={stats?.totalArtworks ?? "-"} sub="등록된 작품" color="text-[#ff385c]" />
        <StatCard label="총 작가 수" value={stats?.totalArtists ?? "-"} sub="활동 작가" />
        <StatCard label="총 문의 수" value={stats?.totalInquiries ?? "-"} sub="누적 소장 문의" />
        <StatCard label="카테고리" value={5} sub="활성 분류" />
      </div>

      {/* 카테고리 분포 */}
      {stats && (
        <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4">카테고리 분포</h3>
          <div className="space-y-2.5">
            {Object.entries(stats.categoryCounts).map(([cat, cnt]) => {
              const pct = stats.totalArtworks > 0 ? Math.round((cnt / stats.totalArtworks) * 100) : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-[#6a6a6a] font-medium shrink-0">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <div className="flex-1 h-2 bg-[#f7f7f7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff385c] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-mono text-[#aaaaaa] w-14 text-right">{cnt}점 ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 작품 */}
        <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4">최근 등록 작품</h3>
          <div className="space-y-3">
            {recentArtworks.map((art) => (
              <div key={art.id} className="flex items-center space-x-3">
                <img src={art.image} alt={art.title} referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-lg object-cover bg-[#f7f7f7] border border-[#ebebeb] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#222222] truncate">{art.title}</p>
                  <p className="text-[10px] text-[#aaaaaa] font-mono">{art.artistName} · {art.priceRange}</p>
                </div>
                <Badge text={CATEGORY_LABELS[art.category] ?? art.category} colorClass={CATEGORY_COLORS[art.category] ?? ""} />
              </div>
            ))}
          </div>
        </div>

        {/* 최근 문의 */}
        <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4">최근 접수 문의</h3>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-[#aaaaaa] text-center py-8">접수된 문의가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="border-l-2 border-[#ff385c]/30 pl-3">
                  <p className="text-xs font-bold text-[#222222] truncate">{inq.artworkTitle}</p>
                  <p className="text-[10px] text-[#aaaaaa]">{inq.buyerName} → {inq.artistName}</p>
                  <p className="text-[10px] text-[#aaaaaa] font-mono">{inq.createdAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArtworksTab({ artworks, onDelete }: { artworks: Artwork[]; onDelete: (id: string) => void }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Painting", "Sculpture", "Photography", "Media Art", "Craft"];
  const filtered = filter === "All" ? artworks : artworks.filter((a) => a.category === filter);

  return (
    <div className="space-y-4">
      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              filter === c
                ? "bg-[#222222] text-white border-[#222222]"
                : "bg-white text-[#6a6a6a] border-[#ebebeb] hover:border-[#222222]"
            }`}
          >
            {CATEGORY_LABELS[c] ?? c}
            {c !== "All" && (
              <span className="ml-1 text-[9px] opacity-60">({artworks.filter((a) => a.category === c).length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader cols={["작품", "작가", "카테고리", "가격", "태그", "액션"]} />
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-sm text-[#aaaaaa]">작품이 없습니다.</td></tr>
              ) : (
                filtered.map((art) => (
                  <tr key={art.id} className="border-b border-[#f7f7f7] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-4 pl-0">
                      <div className="flex items-center space-x-3">
                        <img src={art.image} alt={art.title} referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-lg object-cover bg-[#f7f7f7] border border-[#ebebeb] shrink-0" />
                        <div>
                          <p className="font-semibold text-[#222222] text-xs truncate max-w-[180px]">{art.title}</p>
                          <p className="text-[10px] text-[#aaaaaa] font-mono">{art.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6a6a6a]">{art.artistName}</td>
                    <td className="py-3 px-4">
                      <Badge text={CATEGORY_LABELS[art.category] ?? art.category} colorClass={CATEGORY_COLORS[art.category] ?? ""} />
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-[#222222] font-mono">{art.priceRange}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {art.tags.slice(0, 2).map((t) => (
                          <span key={t} className="text-[9px] font-mono bg-[#f7f7f7] text-[#6a6a6a] px-1.5 py-0.5 rounded">#{t}</span>
                        ))}
                        {art.tags.length > 2 && (
                          <span className="text-[9px] font-mono text-[#aaaaaa]">+{art.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onDelete(art.id)}
                        className="p-1.5 text-[#aaaaaa] hover:text-[#ff385c] hover:bg-[#ff385c]/5 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                        title="작품 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#f7f7f7] bg-[#fafafa]">
          <p className="text-[10px] text-[#aaaaaa] font-mono">{filtered.length}개 작품 표시 중 (전체 {artworks.length}개)</p>
        </div>
      </div>
    </div>
  );
}

function ArtistsTab({ artists, artworks }: { artists: Artist[]; artworks: Artwork[] }) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHeader cols={["작가", "이메일", "키워드", "작품 수", "인터뷰"]} />
          <tbody>
            {artists.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-sm text-[#aaaaaa]">작가가 없습니다.</td></tr>
            ) : (
              artists.map((a) => {
                const cnt = artworks.filter((art) => art.artistId === a.id).length;
                return (
                  <tr key={a.id} className="border-b border-[#f7f7f7] hover:bg-[#fafafa] transition-colors">
                    <td className="py-3 px-4 pl-0">
                      <div className="flex items-center space-x-3">
                        <img src={a.avatar} alt={a.name} referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-full object-cover bg-[#f7f7f7] border border-[#ebebeb] shrink-0" />
                        <div>
                          <p className="font-semibold text-[#222222] text-xs">{a.name}</p>
                          <p className="text-[10px] text-[#aaaaaa] font-mono">{a.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6a6a6a] font-mono">{a.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {a.keywords.slice(0, 3).map((k) => (
                          <span key={k} className="text-[9px] font-mono bg-[#f7f7f7] text-[#6a6a6a] px-1.5 py-0.5 rounded">#{k}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-[#ff385c]">{cnt}점</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono text-[#aaaaaa]">{a.interviewQuestions.length}개</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-[#f7f7f7] bg-[#fafafa]">
        <p className="text-[10px] text-[#aaaaaa] font-mono">총 {artists.length}명의 작가</p>
      </div>
    </div>
  );
}

function InquiriesTab({ inquiries }: { inquiries: UserInquiry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const sorted = [...inquiries].reverse();

  return (
    <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
      {sorted.length === 0 ? (
        <p className="text-sm text-[#aaaaaa] text-center py-20">접수된 문의가 없습니다.</p>
      ) : (
        <div className="divide-y divide-[#f7f7f7]">
          {sorted.map((inq) => (
            <div key={inq.id} className="hover:bg-[#fafafa] transition-colors">
              <button
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                className="w-full flex items-start justify-between p-4 text-left cursor-pointer border-none bg-transparent"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#222222] truncate">{inq.artworkTitle}</span>
                    <span className="text-[9px] font-mono text-[#aaaaaa] shrink-0">{inq.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-[#6a6a6a]">
                    <span className="font-semibold">{inq.buyerName}</span>
                    <span className="text-[#aaaaaa] mx-1">({inq.buyerEmail})</span>
                    <span className="text-[#aaaaaa]">→ 작가</span>
                    <span className="font-semibold ml-1">{inq.artistName}</span>
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 text-[#aaaaaa] shrink-0 mt-0.5 transition-transform ${expanded === inq.id ? "rotate-90" : ""}`} />
              </button>
              {expanded === inq.id && (
                <div className="px-4 pb-4">
                  <div className="bg-[#f7f7f7] rounded-lg p-3 text-xs text-[#6a6a6a] leading-relaxed whitespace-pre-wrap font-sans border-l-2 border-[#ff385c]/30">
                    {inq.message}
                  </div>
                  <p className="text-[9px] font-mono text-[#aaaaaa] mt-2">ID: {inq.id} · 작품 ID: {inq.artworkId}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="px-4 py-3 border-t border-[#f7f7f7] bg-[#fafafa]">
        <p className="text-[10px] text-[#aaaaaa] font-mono">총 {inquiries.length}건의 문의</p>
      </div>
    </div>
  );
}

function SystemTab({ onHealthCheck }: { onHealthCheck: () => Promise<void> }) {
  const [healthStatus, setHealthStatus] = useState<"idle" | "ok" | "error">("idle");
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      await onHealthCheck();
      setHealthStatus("ok");
    } catch {
      setHealthStatus("error");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API 상태 */}
      <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" /> API 상태
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={runHealthCheck}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2 bg-[#222222] hover:bg-[#3f3f3f] disabled:bg-[#aaaaaa] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "확인 중..." : "헬스체크 실행"}
          </button>
          {healthStatus === "ok" && (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-semibold">서버 정상 응답</span>
            </div>
          )}
          {healthStatus === "error" && (
            <div className="flex items-center gap-1.5 text-[#ff385c]">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-semibold">서버 응답 없음</span>
            </div>
          )}
        </div>
      </div>

      {/* 환경 정보 */}
      <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4 flex items-center gap-2">
          <Database className="h-3.5 w-3.5" /> 환경 정보
        </h3>
        <div className="space-y-2 font-mono text-xs">
          {[
            { key: "스토리지", val: "In-Memory (서버 재시작 시 초기화)" },
            { key: "AI 모델", val: "Gemini 3.5 Flash (Key 미설정 시 로컬 룰베이스 폴백)" },
            { key: "API Base", val: (import.meta as any).env?.VITE_API_BASE_URL || "(상대경로 /api/...)" },
            { key: "인증 방식", val: "Mock (localStorage 세션)" },
          ].map(({ key, val }) => (
            <div key={key} className="flex gap-4">
              <span className="w-28 text-[#aaaaaa] shrink-0">{key}</span>
              <span className="text-[#222222]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mock 계정 목록 */}
      <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaaaaa] font-mono mb-4 flex items-center gap-2">
          <Users className="h-3.5 w-3.5" /> Mock 계정 목록
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <TableHeader cols={["UID", "이름", "이메일", "비밀번호", "역할", "작가 ID"]} />
            <tbody>
              {MOCK_USERS.map((u) => (
                <tr key={u.uid} className="border-b border-[#f7f7f7] last:border-0">
                  <td className="py-2.5 px-4 pl-0 font-mono text-[#aaaaaa]">{u.uid}</td>
                  <td className="py-2.5 px-4 font-semibold text-[#222222]">{u.displayName}</td>
                  <td className="py-2.5 px-4 font-mono text-[#6a6a6a]">{u.email}</td>
                  <td className="py-2.5 px-4 font-mono text-[#6a6a6a]">{u.password}</td>
                  <td className="py-2.5 px-4">
                    <Badge
                      text={u.role === "admin" ? "관리자" : "이용자"}
                      colorClass={u.role === "admin" ? "bg-[#ff385c] text-white border-[#ff385c]" : "bg-[#f7f7f7] text-[#6a6a6a] border-[#ebebeb]"}
                    />
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#aaaaaa]">{u.artistId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function DevDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [aw, ar, inq, st] = await Promise.all([
        artworksApi.list(),
        artistsApi.list(),
        inquiriesApi.listAll(),
        adminApi.stats(),
      ]);
      setArtworks(aw);
      setArtists(ar);
      setInquiries(inq);
      setStats(st);
    } catch (e) {
      console.error("DevDashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteArtwork = async (id: string) => {
    if (!window.confirm("이 작품을 삭제하시겠습니까?")) return;
    try {
      await artworksApi.remove(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      // stats 재계산
      setStats((prev) =>
        prev ? { ...prev, totalArtworks: prev.totalArtworks - 1 } : prev
      );
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleHealthCheck = async () => {
    await adminApi.health();
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 대시보드 헤더 */}
      <div className="bg-white border-b border-[#ebebeb] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base text-[#222222] flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-[#ff385c]" />
              개발자 대시보드
            </h1>
            <p className="text-[10px] font-mono text-[#aaaaaa] mt-0.5 uppercase tracking-wider">A-BEAC<span className="text-[#ff385c]">O</span>N Admin Console</p>
          </div>
          <button
            onClick={fetchAll}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ebebeb] bg-white hover:bg-[#f7f7f7] text-xs font-semibold text-[#6a6a6a] rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>
      </div>

      {/* 탭 내비게이션 */}
      <div className="bg-white border-b border-[#ebebeb] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex gap-0 overflow-x-auto">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer border-0 border-b-2 ${
                activeTab === tab.id
                  ? "border-[#ff385c] text-[#ff385c]"
                  : "border-transparent text-[#6a6a6a] hover:text-[#222222] hover:border-[#ebebeb]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-4 border-[#ff385c] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-[#aaaaaa]">데이터 로딩 중...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewTab stats={stats} artworks={artworks} inquiries={inquiries} />
            )}
            {activeTab === "artworks" && (
              <ArtworksTab artworks={artworks} onDelete={handleDeleteArtwork} />
            )}
            {activeTab === "artists" && (
              <ArtistsTab artists={artists} artworks={artworks} />
            )}
            {activeTab === "inquiries" && (
              <InquiriesTab inquiries={inquiries} />
            )}
            {activeTab === "system" && (
              <SystemTab onHealthCheck={handleHealthCheck} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
