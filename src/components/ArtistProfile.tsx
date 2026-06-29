/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { X, MessageCircle, ChevronRight } from "lucide-react";
import { Artist, Artwork } from "../types";
import { getCardConfig, shortName } from "./ArtistCardRender";

interface ArtistProfileProps {
  artist: Artist;
  artworks: Artwork[];
  onClose: () => void;
  onContact?: () => void;
}

export default function ArtistProfile({ artist, artworks, onClose, onContact }: ArtistProfileProps) {
  const card = getCardConfig(artist);
  const myWorks = artworks.filter((a) => a.artistId === artist.id);
  const heroImg = myWorks[0]?.image || card.image;
  const sn = shortName(artist);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl border border-[#ebebeb] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 스티키 헤더 ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-[#ebebeb] bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-[0.35em] text-[#bbb] uppercase">A-BEACON · Artist</span>
          </div>
          <div className="flex items-center gap-2">
            {onContact && (
              <button
                onClick={onContact}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#ff385c] text-white text-xs font-bold rounded-full hover:bg-[#e00b41] transition-colors cursor-pointer border-none"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                작품 문의하기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#f7f7f7] transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="h-4.5 w-4.5 text-[#444]" />
            </button>
          </div>
        </div>

        {/* ── 스크롤 영역 ── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">

          {/* 히어로: 대표 작품 */}
          <div className="relative aspect-[16/9] bg-[#111] overflow-hidden">
            <img
              src={heroImg}
              alt={sn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {artist.keywords.slice(0, 3).map((k) => (
                  <span
                    key={k}
                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm"
                    style={{ background: card.accentColor + "33", color: card.accentColor, border: `1px solid ${card.accentColor}55` }}
                  >
                    {k}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{sn}</h2>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* 헤드라인 + 대표 멘트 */}
            <div className="pb-5 border-b border-[#f0f0f0]">
              {card.headline && (
                <p className="text-base text-[#222] font-semibold leading-relaxed">{card.headline}</p>
              )}
              {card.quote && (
                <p className="mt-2.5 text-sm text-[#888] italic leading-relaxed">
                  "{card.quote}"
                </p>
              )}
              {!card.headline && !card.quote && (
                <p className="text-sm text-[#555] leading-relaxed font-light">{artist.bio}</p>
              )}
            </div>

            {/* 대표 작품 그리드 */}
            {myWorks.length > 0 && (
              <div>
                <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#bbb] mb-3">Works · {myWorks.length}점</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {myWorks.slice(0, 6).map((w) => (
                    <div key={w.id} className="aspect-square overflow-hidden bg-[#f7f7f7] group/img">
                      <img
                        src={w.image}
                        alt={w.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    </div>
                  ))}
                </div>
                {myWorks[0] && (
                  <p className="mt-2 text-[10px] text-[#bbb] font-mono">
                    {myWorks[0].priceRange && `시작가 ${myWorks[0].priceRange}`}
                  </p>
                )}
              </div>
            )}

            {/* 인터뷰 */}
            {artist.interviewQuestions?.length > 0 && (
              <div className="pb-2">
                <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#bbb] mb-4">Interview</p>
                <div className="space-y-5">
                  {artist.interviewQuestions.map((qa, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold text-[#aaa] mb-1.5">Q. {qa.question}</p>
                      <p className="text-sm text-[#333] leading-relaxed font-light">{qa.answer}</p>
                      {i < artist.interviewQuestions.length - 1 && (
                        <div className="mt-5 h-px bg-[#f0f0f0]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 바이오 (headline이 있으면 접힌 섹션) */}
            {card.headline && artist.bio && (
              <div className="pb-2">
                <p className="text-[9px] font-mono tracking-[0.35em] uppercase text-[#bbb] mb-2">About</p>
                <p className="text-sm text-[#666] leading-relaxed font-light">{artist.bio}</p>
              </div>
            )}

            {/* 하단 CTA */}
            <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-between">
              <span className="text-xs text-[#bbb] font-mono">{artist.email}</span>
              {onContact && (
                <button
                  onClick={onContact}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#ff385c] text-white text-xs font-bold rounded-full hover:bg-[#e00b41] transition-colors cursor-pointer border-none"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  작품 문의하기
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
