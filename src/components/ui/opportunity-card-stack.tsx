"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, ChevronRight, X, Bookmark,
  CheckCircle, AlertCircle, Clock, MapPin, Briefcase, BookOpen,
} from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { cn } from "@/lib/utils";
import { marvelAudio } from "@/components/marvel/MarvelAudioEngine";
import { triggerComicWord } from "@/components/marvel/MarvelCelebrations";

// ── Types ──────────────────────────────────────────────────────────
interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  mode: string;
  match: number;
  skills: string[];
  skillGap: string[];
  about: string;
  deadline: string;
  whyMatch: string;
  responsibilities: string[];
  eligibility: string;
  bannerUrl?: string;
}

interface OpportunityCardStackProps {
  opportunities: Opportunity[];
  onApply: (opp: Opportunity) => void;
}

interface CardItem { uid: number; oppIndex: number }

// ── Banners ────────────────────────────────────────────────────────
const BANNER: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=800&h=280&fit=crop&auto=format",
  2: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=280&fit=crop&auto=format",
  3: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=280&fit=crop&auto=format",
  4: "https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?w=800&h=280&fit=crop&auto=format",
  5: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&h=280&fit=crop&auto=format",
  6: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=280&fit=crop&auto=format",
};

// ── Match helpers ──────────────────────────────────────────────────
const mColor = (p: number) => (p >= 85 ? "text-[#EC1D24]" : p >= 70 ? "text-amber-500" : "text-neutral-500");
const mBg = (p: number) => (p >= 85 ? "bg-[#EC1D24]/15 border-[#EC1D24]/30 text-white font-bold" : "bg-white/5 border-white/10 text-white/60");
const mDarkBg = (p: number) => (p >= 85 ? "bg-[#EC1D24]/20 border-[#EC1D24]/40 text-red-400 font-bold" : "bg-white/8 border-white/12 text-white/60");
const mBar = (p: number) => (p >= 85 ? "bg-[#EC1D24]" : p >= 70 ? "bg-amber-400" : "bg-white/30");

// ── Stack constants ────────────────────────────────────────────────
const BANNER_H  = 248;
const INFO_H    = 92;
const CARD_H    = BANNER_H + INFO_H;        // 340px
const PEEK_1    = 32;
const PEEK_2    = 62;
const CONTAINER_H = CARD_H + PEEK_2 + 16;  // ~418px

const POSITIONS = [
  { scale: 1, y: 12 },
  { scale: 1, y: 12 },
  { scale: 1, y: 12 },
] as const;

const SPRING = { type: "spring", duration: 0.9, bounce: 0 } as const;

// ── Card face ──────────────────────────────────────────────────────
function CardFace({
  opp,
  onRead,
  saved,
  onToggleSave,
}: {
  opp: Opportunity;
  onRead: () => void;
  saved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
}) {
  const banner = opp.bannerUrl ?? BANNER[opp.id] ?? BANNER[1];
  return (
    <div className="relative flex flex-col" style={{ height: CARD_H }}>
      {/* Spider-Man web stuck on saved cards */}
      <AnimatePresence>
        {saved && (
          <motion.img
            key="web"
            src="/marvel/web-corner.png"
            alt=""
            className="absolute top-0 right-0 z-10 w-28 h-28 pointer-events-none drop-shadow-[0_0_4px_rgba(0,0,0,0.9)]"
            style={{ transformOrigin: "100% 0%" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.45 }}
          />
        )}
      </AnimatePresence>
      {/* Banner image */}
      <div
        className="w-full overflow-hidden bg-neutral-800 shrink-0"
        style={{ height: BANNER_H }}
      >
        <img
          src={banner}
          alt={opp.title}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* White info strip */}
      <div
        className="flex items-center justify-between gap-4 bg-white px-6"
        style={{ height: INFO_H }}
      >
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold text-neutral-900 leading-tight truncate">
            {opp.title}
          </h3>
          <p className="text-[13px] text-neutral-500 mt-0.5 truncate">
            {opp.company}
            <span className={cn("ml-2 font-semibold text-[12px]", mColor(opp.match))}>
              · {opp.match}% match
            </span>
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={onToggleSave}
          aria-pressed={saved}
          title={saved ? "Saved" : "Save opportunity"}
          className={cn(
            "p-2 rounded-xl border transition-colors cursor-pointer",
            saved
              ? "bg-[#EC1D24] border-[#EC1D24] text-white"
              : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
          )}
        >
          <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
        </button>
        {/* Action: Read (opens detail) */}
        <button
          onClick={onRead}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Details
        </button>
        </div>
      </div>
    </div>
  );
}

// ── Stack card wrapper ─────────────────────────────────────────────
function StackCard({
  item,
  index,
  opportunities,
  onRead,
  savedIds,
  onToggleSave,
}: {
  item: CardItem;
  index: number;
  opportunities: Opportunity[];
  onRead: (opp: Opportunity) => void;
  savedIds: Set<number>;
  onToggleSave: (opp: Opportunity, e: React.MouseEvent) => void;
}) {
  const opp = opportunities[item.oppIndex];
  if (!opp) return null;

  const pos = POSITIONS[index] ?? POSITIONS[2];

  return (
    <motion.div
      layout
      layoutId={`card-${item.uid}`}
      className="absolute inset-x-0 mx-auto overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      style={{
        maxWidth: "min(680px, calc(100vw - 64px))",
        zIndex: 10 - index,
        transformOrigin: "bottom center",
      }}
      animate={{ y: pos.y, scale: pos.scale, opacity: 1 }}
      exit={{ y: -CARD_H, opacity: 0, transition: { duration: 0.3 } }}
      transition={SPRING}
    >
      <CardFace
        opp={opp}
        onRead={() => onRead(opp)}
        saved={savedIds.has(opp.id)}
        onToggleSave={(e) => onToggleSave(opp, e)}
      />
    </motion.div>
  );
}

// ── Detail overlay ─────────────────────────────────────────────────
function DetailCard({
  opp,
  onClose,
  onApply,
}: {
  opp: Opportunity;
  onClose: () => void;
  onApply: () => void;
}) {
  const banner = opp.bannerUrl ?? BANNER[opp.id] ?? BANNER[1];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal dialog */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <motion.div
          className="pointer-events-auto relative flex flex-col w-full max-w-lg rounded-2xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          {/* Header image with close button */}
          <div className="relative w-full overflow-hidden bg-neutral-800 shrink-0" style={{ height: 160 }}>
            <img src={banner} alt={opp.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div>
              <h2 className="text-lg font-bold text-white">{opp.title}</h2>
              <p className="text-sm text-neutral-400 mt-0.5">{opp.company}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { Icon: MapPin,   label: opp.location },
                { Icon: Briefcase, label: opp.mode    },
                { Icon: Clock,    label: opp.deadline },
              ].map(({ Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-neutral-300">
                  <Icon className="w-3 h-3 text-neutral-400" />{label}
                </span>
              ))}
            </div>

            {/* Match bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Match Score</span>
                <span className={cn("text-sm font-bold", mColor(opp.match).replace("600","400"))}>{opp.match}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className={cn("h-full rounded-full", mBar(opp.match))} style={{ width: `${opp.match}%` }} />
              </div>
            </div>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">About</p>
              <p className="text-xs text-neutral-300 leading-relaxed">{opp.about}</p>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {opp.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-neutral-200">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />{s}
                  </span>
                ))}
              </div>
            </section>

            {opp.skillGap.length > 0 && (
              <section>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Skill Gaps</p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.skillGap.map((s) => (
                    <span key={s} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-950/20 border border-amber-500/20 text-amber-300">
                      <AlertCircle className="w-3 h-3" />{s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Responsibilities</p>
              <ul className="space-y-1.5">
                {opp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <ChevronRight className="w-3 h-3 text-neutral-500 mt-0.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">Eligibility</p>
              <p className="text-xs text-neutral-300">{opp.eligibility}</p>
            </section>

            <section className="p-3 rounded-xl bg-[#EC1D24]/10 border border-[#EC1D24]/25">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-red-300">Why this matches you</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{opp.whyMatch}</p>
            </section>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-white/8 px-5 py-4 flex gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Prepare
            </button>
            <LiquidMetalButton
              onClick={onApply}
              icon={<Send className="w-3.5 h-3.5" />}
              size="sm"
              className="flex-1"
            >
              Apply Now
            </LiquidMetalButton>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────
export function OpportunityCardStack({ opportunities, onApply }: OpportunityCardStackProps) {
  const len = opportunities.length;

  const [cards, setCards] = useState<CardItem[]>(() =>
    Array.from({ length: Math.min(3, len) }, (_, i) => ({ uid: i, oppIndex: i % len }))
  );
  const [nextUid,    setNextUid]    = useState(Math.min(3, len));
  const [nextOppIdx, setNextOppIdx] = useState(Math.min(3, len) % Math.max(len, 1));
  const [detailOpp,  setDetailOpp]  = useState<Opportunity | null>(null);
  const [savedIds,   setSavedIds]   = useState<Set<number>>(() => new Set());

  const toggleSave = (opp: Opportunity, e: React.MouseEvent) => {
    const wasSaved = savedIds.has(opp.id);
    if (!wasSaved) triggerComicWord(e.clientX, e.clientY, "THWIP!");
    marvelAudio.playRepulsorClick();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(opp.id);
      else next.add(opp.id);
      return next;
    });
  };

  if (len === 0) return null;

  const handleNext = () => {
    setCards((prev) => {
      if (prev.length === 0) return prev;
      const rest = prev.slice(1);
      return len > 1 ? [...rest, { uid: nextUid, oppIndex: nextOppIdx }] : prev;
    });
    setNextUid((n) => n + 1);
    setNextOppIdx((n) => (n + 1) % len);
  };

  const currentOpp = opportunities[cards[0]?.oppIndex ?? 0];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Stack container */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: CONTAINER_H, maxWidth: "min(680px, calc(100vw - 64px))" }}
      >
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <StackCard
              key={card.uid}
              item={card}
              index={index}
              opportunities={opportunities}
              onRead={setDetailOpp}
              savedIds={savedIds}
              onToggleSave={toggleSave}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom nav bar */}
      <div
        className="flex w-full items-center justify-between border-t border-white/8 py-3 px-1"
        style={{ maxWidth: "min(680px, calc(100vw - 64px))" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-xs text-neutral-300 truncate">
            {currentOpp?.title}
            <span className="text-neutral-500 ml-1">· {currentOpp?.company}</span>
          </span>
        </div>
        <button
          onClick={handleNext}
          disabled={len <= 1}
          className="flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-neutral-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Detail overlay — fixed so it covers the full viewport */}
      <AnimatePresence>
        {detailOpp && (
          <DetailCard
            key="detail"
            opp={detailOpp}
            onClose={() => setDetailOpp(null)}
            onApply={() => { setDetailOpp(null); onApply(detailOpp); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default OpportunityCardStack;
