/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Artist, ArtistCard } from "../types";

export function getCardConfig(artist: Artist): ArtistCard {
  return artist.card ?? {
    archetype: "cover",
    image: artist.avatar,
    headline: artist.bio.slice(0, 60),
    quote: artist.interviewQuestions[0]?.answer?.slice(0, 80) ?? "",
    bgColor: "#1a1a1a",
    accentColor: "#ff385c",
    textColor: "white",
    showBadges: { school: true, medium: true, year: false },
  };
}

export function shortName(artist: Artist): string {
  return artist.name.split(" (")[0];
}

interface CardProps {
  artist: Artist;
  card: ArtistCard;
  onClick?: () => void;
}

function Badge({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <span
      className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm"
      style={{ background: accentColor + "33", color: accentColor, border: `1px solid ${accentColor}66` }}
    >
      {label}
    </span>
  );
}

// ─── COVER: tall portrait, full-bleed image, text overlay bottom ───────────
function CoverCard({ artist, card, onClick }: CardProps) {
  const sn = shortName(artist);
  const textColor = card.textColor === "white" ? "#ffffff" : "#111111";
  return (
    <div
      className="relative w-full h-full overflow-hidden group cursor-pointer"
      style={{ background: card.bgColor }}
      onClick={onClick}
    >
      <img
        src={card.image}
        alt={sn}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {card.showBadges.medium && artist.keywords[0] && (
          <Badge label={artist.keywords[0]} accentColor={card.accentColor} />
        )}
        <h2
          className="text-2xl font-black mt-2 leading-tight"
          style={{ color: textColor, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          {sn}
        </h2>
        <p className="text-sm mt-1 leading-snug opacity-80" style={{ color: textColor }}>
          {card.headline}
        </p>
        <div
          className="mt-3 h-0.5 w-8"
          style={{ background: card.accentColor }}
        />
      </div>
    </div>
  );
}

// ─── EDITORIAL: landscape, image left 55% / text right 45% ───────────────
function EditorialCard({ artist, card, onClick }: CardProps) {
  const sn = shortName(artist);
  const textColor = card.textColor === "white" ? "#ffffff" : "#111111";
  return (
    <div
      className="relative w-full h-full overflow-hidden flex cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-[55%] overflow-hidden shrink-0">
        <img
          src={card.image}
          alt={sn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div
        className="flex-1 flex flex-col justify-between p-6"
        style={{ background: card.bgColor, color: textColor }}
      >
        <div>
          <div
            className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold mb-3"
            style={{ color: card.accentColor }}
          >
            Artist
          </div>
          <h2 className="text-2xl font-black leading-tight">{sn}</h2>
          {card.showBadges.school && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {artist.keywords.slice(0, 2).map((k) => (
                <span key={k}><Badge label={k} accentColor={card.accentColor} /></span>
              ))}
            </div>
          )}
          <p className="text-sm mt-4 leading-relaxed opacity-80">{card.headline}</p>
        </div>
        <div>
          <p className="text-xs italic opacity-60 leading-relaxed">"{card.quote}"</p>
          <div className="mt-3 h-px" style={{ background: card.accentColor + "44" }} />
        </div>
      </div>
    </div>
  );
}

// ─── MANIFESTO: bold typography, small corner image ───────────────────────
function ManifestoCard({ artist, card, onClick }: CardProps) {
  const sn = shortName(artist);
  const textColor = card.textColor === "white" ? "#ffffff" : "#111111";
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-between p-5 cursor-pointer group"
      style={{ background: card.bgColor, color: textColor }}
      onClick={onClick}
    >
      <div>
        <div
          className="text-[9px] font-mono tracking-[0.4em] uppercase font-bold mb-4"
          style={{ color: card.accentColor }}
        >
          Manifesto
        </div>
        <h2
          className="font-black leading-none tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
        >
          {sn.toUpperCase()}
        </h2>
        <div className="h-0.5 w-10 mt-3" style={{ background: card.accentColor }} />
        <p className="text-sm mt-3 leading-snug opacity-80 max-w-[80%]">{card.headline}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-xs italic opacity-50 max-w-[60%] leading-relaxed">"{card.quote}"</p>
        <div className="w-14 h-14 overflow-hidden shrink-0 ml-2 group-hover:scale-105 transition-transform duration-500">
          <img
            src={card.image}
            alt={sn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// ─── PORTRAIT: image left, Q&A right ─────────────────────────────────────
function PortraitCard({ artist, card, onClick }: CardProps) {
  const sn = shortName(artist);
  const textColor = card.textColor === "white" ? "#ffffff" : "#111111";
  const q = artist.interviewQuestions[0];
  return (
    <div
      className="relative w-full h-full overflow-hidden flex cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-[30%] overflow-hidden shrink-0">
        <img
          src={card.image || artist.avatar}
          alt={sn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div
        className="flex-1 flex flex-col justify-center px-6 py-5"
        style={{ background: card.bgColor, color: textColor }}
      >
        <div
          className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold mb-2"
          style={{ color: card.accentColor }}
        >
          Interview
        </div>
        <h2 className="text-xl font-black leading-tight">{sn}</h2>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {card.showBadges.school && artist.keywords.slice(0, 3).map((k) => (
            <span key={k}><Badge label={k} accentColor={card.accentColor} /></span>
          ))}
        </div>
        {q && (
          <div className="mt-4">
            <p
              className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1"
              style={{ color: textColor }}
            >
              Q. {q.question.slice(0, 30)}…
            </p>
            <p className="text-sm leading-relaxed opacity-70 line-clamp-3">
              {q.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUOTE: large centered quote on color bg ──────────────────────────────
function QuoteCard({ artist, card, onClick }: CardProps) {
  const sn = shortName(artist);
  const textColor = card.textColor === "white" ? "#ffffff" : "#111111";
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center px-6 text-center cursor-pointer group"
      style={{ background: card.bgColor, color: textColor }}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: card.accentColor }}
      />
      <p
        className="font-black leading-tight tracking-tight"
        style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}
      >
        "{card.quote}"
      </p>
      <div className="mt-4 flex flex-col items-center gap-1">
        <div className="h-px w-8" style={{ background: card.accentColor }} />
        <span
          className="text-xs font-mono tracking-widest"
          style={{ color: card.accentColor }}
        >
          — {sn}
        </span>
      </div>
      {card.showBadges.medium && artist.keywords[0] && (
        <div className="mt-3">
          <Badge label={artist.keywords[0]} accentColor={card.accentColor} />
        </div>
      )}
      <img
        src={card.image}
        alt=""
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500"
      />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────
export function ArtistCardRender({ artist, card, onClick }: CardProps) {
  switch (card.archetype) {
    case "cover":     return <CoverCard     artist={artist} card={card} onClick={onClick} />;
    case "editorial": return <EditorialCard artist={artist} card={card} onClick={onClick} />;
    case "manifesto": return <ManifestoCard artist={artist} card={card} onClick={onClick} />;
    case "portrait":  return <PortraitCard  artist={artist} card={card} onClick={onClick} />;
    case "quote":     return <QuoteCard     artist={artist} card={card} onClick={onClick} />;
    default:          return <CoverCard     artist={artist} card={card} onClick={onClick} />;
  }
}
