import * as React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Briefcase, Sparkles, ChevronDown, ChevronUp, Send, Eye } from "lucide-react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { cn } from "@/lib/utils";

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
  whyMatch: string;
  deadline: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  expandedWhy: boolean;
  onToggleWhy: () => void;
  onViewDetails: () => void;
  onApply: () => void;
  className?: string;
  index?: number;
}

const matchColor = (pct: number) => {
  if (pct >= 85) return "text-[#EC1D24]";
  if (pct >= 70) return "text-[#FFD700]";
  return "text-neutral-400";
};

const matchBg = (pct: number) => {
  if (pct >= 85) return "bg-[#EC1D24]/15 border-[#EC1D24]/35";
  if (pct >= 70) return "bg-[#FFD700]/15 border-[#FFD700]/30";
  return "bg-neutral-800/40 border-white/10";
};

export const OpportunityCard = React.forwardRef<HTMLDivElement, OpportunityCardProps>(
  ({ opportunity: opp, expandedWhy, onToggleWhy, onViewDetails, onApply, className, index = 0 }, ref) => {
    const initial = opp.company.charAt(0).toUpperCase();

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.06 }}
        className={cn(
          "flex flex-col rounded-2xl border border-white/8 bg-black/60 backdrop-blur-sm p-5 hover:border-white/20 transition-colors cursor-pointer shadow-lg",
          className
        )}
        onClick={onViewDetails}
      >
        {/* Header: title + mode badge + match badge */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-xs font-semibold text-neutral-200">
              {initial}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate leading-tight">{opp.title}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{opp.company}</p>
            </div>
          </div>
          <span className={cn("shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border", matchBg(opp.match), matchColor(opp.match))}>
            {opp.match}%
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 my-3" />

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-500" />
            {opp.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-neutral-500" />
            {opp.mode}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3 text-neutral-500" />
            {opp.deadline}
          </span>
        </div>

        {/* Match score */}
        <div className="mb-4">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Verified Match Score</p>
          <p className={cn("text-2xl font-bold tracking-tight", matchColor(opp.match))}>
            {opp.match}% Match
          </p>
        </div>

        {/* Skills */}
        <div className="mb-2.5">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {opp.skills.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-neutral-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Skill gap */}
        {opp.skillGap.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Skill Gap</p>
            <div className="flex flex-wrap gap-1.5">
              {opp.skillGap.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-amber-950/20 border border-amber-500/20 text-amber-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-2">{opp.about}</p>

        {/* Why this matches — expandable */}
        <div
          className="mb-4"
          onClick={(e) => { e.stopPropagation(); onToggleWhy(); }}
        >
          <button className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Why this matches you
            {expandedWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expandedWhy && (
            <p className="mt-2 text-xs text-neutral-300 leading-relaxed pl-4 border-l border-white/10">
              {opp.whyMatch}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 mt-auto mb-3" />

        {/* Action buttons */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <LiquidMetalButton
            onClick={onViewDetails}
            icon={<Eye className="w-3.5 h-3.5" />}
            size="sm"
            className="flex-1"
          >
            View Details
          </LiquidMetalButton>
          <LiquidMetalButton
            onClick={onApply}
            icon={<Send className="w-3.5 h-3.5" />}
            size="sm"
            className="flex-1"
          >
            Apply
          </LiquidMetalButton>
        </div>
      </motion.div>
    );
  }
);

OpportunityCard.displayName = "OpportunityCard";
export default OpportunityCard;
