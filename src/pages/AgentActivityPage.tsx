import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Search,
  BrainCircuit,
  BadgeCheck,
  BarChart3,
  FileText,
  Send,
  Eye,
  RefreshCw,
  Target,
  Pause,
  Play,
  Settings,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Circle,
  CheckCircle2,
  Activity,
  Zap,
  Shield,
  Clock,
  CalendarDays,
  IndianRupee,
  MapPin,
  ArrowRight,
  Sparkles,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Page } from "../App";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ShieldEagleLogo, ArcReactor, AvengersLogo } from "../components/marvel/MarvelIcons";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityCategory = "opportunity" | "application" | "skill" | "learning" | "profile";

interface ActivityItem {
  id: number;
  time: string;
  date: "today" | "yesterday";
  category: ActivityCategory;
  title: string;
  subtitle: string;
  detail: string;
  role?: string;
  company?: string;
  match?: number;
  matchingSkills?: string[];
  gapSkills?: string[];
  whyReasons?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const activityItems: ActivityItem[] = [
  {
    id: 1,
    time: "10:42 AM",
    date: "today",
    category: "opportunity",
    title: "Opportunity discovered",
    subtitle: "AI Systems Engineering Intern · Anthropic / Autonomous Labs",
    detail: "Matched verified skills above your 85% threshold.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    match: 94,
    whyReasons: [
      "Match score 94% exceeds your 85% minimum threshold",
      "Location San Francisco / Remote matches your preferences",
      "Stipend ₹25,000 matches your target compensation",
      "Direct alignment with target AI & Machine Learning goal",
    ],
    matchingSkills: ["Python", "Machine Learning", "SQL", "FastAPI", "NumPy"],
    gapSkills: ["PyTorch", "Docker"],
  },
  {
    id: 2,
    time: "10:43 AM",
    date: "today",
    category: "opportunity",
    title: "Technical requirements analyzed",
    subtitle: "Anthropic Engineering Requirements",
    detail: "Extracted 8 required skills. Mapped against your verified Skill Passport.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    whyReasons: [
      "Contacting verified partner job board",
      "Parsed job description to extract required vs preferred skills",
    ],
    matchingSkills: ["Python", "Machine Learning", "SQL", "FastAPI", "NumPy"],
    gapSkills: ["PyTorch", "Docker"],
  },
  {
    id: 3,
    time: "10:43 AM",
    date: "today",
    category: "skill",
    title: "Skill Passport audited",
    subtitle: "Strong match — 5 of 7 core skills verified",
    detail: "Your verified credentials satisfy core job requirements.",
    matchingSkills: ["Python 86%", "Machine Learning 74%", "SQL 81%"],
    gapSkills: ["PyTorch 42% / req 70%", "Docker 35% / req 60%"],
    whyReasons: [
      "Audited matching skills across 12 verified competencies",
      "Deterministic score calculated based strictly on verified evidence",
    ],
  },
  {
    id: 4,
    time: "10:44 AM",
    date: "today",
    category: "application",
    title: "Student constitution check passed",
    subtitle: "94% — above your minimum auto-match threshold",
    detail: "Proceeding to tailor application per student career guidelines.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    match: 94,
    whyReasons: [
      "94% compatibility satisfies student rulebook",
      "No data fabrication: Only verified skills and projects included",
      "Action authorized by student-signed career policy",
    ],
  },
  {
    id: 5,
    time: "10:44 AM",
    date: "today",
    category: "application",
    title: "Tailored profile prepared",
    subtitle: "Profile_Anthropic_AI_Systems.pdf generated",
    detail: "Highlighted verified Python, ML, and SQL experience aligned to job requirements.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    whyReasons: [
      "Prioritized Python & ML systems in primary experience summary",
      "Referenced verified GitHub code audit for campus delivery platform",
      "Zero hallucinations — strictly grounded in verified evidence",
    ],
  },
  {
    id: 6,
    time: "10:45 AM",
    date: "today",
    category: "application",
    title: "Application submitted",
    subtitle: "Anthropic · Application Delivered",
    detail: "Transmitted via authorized recruiter integration. Confirmation logged.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    match: 94,
    whyReasons: [
      "All pre-submission checks verified",
      "Transmitted via secure recruiter integration",
      "Duplicate check confirmed zero prior applications",
    ],
  },
  {
    id: 7,
    time: "10:46 AM",
    date: "today",
    category: "application",
    title: "Application tracker updated",
    subtitle: "Status: Application Under Review",
    detail: "Added to your Active Applications list with real-time status monitoring.",
    role: "AI Systems Engineering Intern",
    company: "Anthropic",
    whyReasons: [
      "Application details recorded in immutable activity trail",
      "Monitoring recruiter portal for interview notifications",
    ],
  },
  {
    id: 8,
    time: "09:47 AM",
    date: "today",
    category: "skill",
    title: "Skill gap identified",
    subtitle: "Docker — 35% vs target 60%",
    detail: "Docker containerization appears in 7 of your target job postings.",
    gapSkills: ["Docker", "AWS", "Kubernetes"],
    whyReasons: [
      "Aggregated requirements across 127 analyzed job postings",
      "Docker is the most frequent requirement for backend & ML engineering roles",
    ],
  },
  {
    id: 9,
    time: "09:48 AM",
    date: "today",
    category: "learning",
    title: "Recommended learning track generated",
    subtitle: "Docker & Container Fundamentals assigned",
    detail: "Milestone added to your Learning Roadmap to close 60% of the gap.",
    whyReasons: [
      "Targeted to close Docker deficit in 14 days",
      "Provides hands-on deployment challenge with automated verification",
    ],
  },
  {
    id: 10,
    time: "09:31 AM",
    date: "today",
    category: "opportunity",
    title: "Job board scan completed",
    subtitle: "42 opportunities analyzed across partner network",
    detail: "Found 8 strong matches above 80%. 3 qualify for automatic application.",
    whyReasons: [
      "Scanned verified partner networks and campus placement portals",
      "Filtered by verified skill thresholds and preferred parameters",
    ],
  },
  {
    id: 11,
    time: "04:15 PM",
    date: "yesterday",
    category: "application",
    title: "Application submitted",
    subtitle: "Backend Systems Intern · Stripe Cloud Infrastructure",
    detail: "87% match. Securely submitted via authorized integration.",
    role: "Backend Systems Intern",
    company: "Stripe",
    match: 87,
    whyReasons: [
      "87% match exceeds minimum threshold",
      "Distributed systems matches student preference profile",
    ],
  },
  {
    id: 12,
    time: "02:30 PM",
    date: "yesterday",
    category: "profile",
    title: "Career goal updated",
    subtitle: "AI / ML Systems Engineer · Target Set",
    detail: "Target role preferences synchronized after profile update.",
    whyReasons: [
      "Updated career target role and timeline",
      "Re-indexed opportunity matching weights",
    ],
  },
  {
    id: 13,
    time: "11:15 AM",
    date: "yesterday",
    category: "opportunity",
    title: "Opportunity discovered",
    subtitle: "Data Science Fellow · DeepMind Quantum Labs",
    detail: "88% match. Recruiter has viewed your verified Skill Passport.",
    role: "Data Science Fellow",
    company: "DeepMind",
    match: 88,
    matchingSkills: ["Python", "SQL", "Pandas", "NumPy"],
    gapSkills: ["TensorFlow"],
    whyReasons: [
      "Strong synergy with data analytics track",
      "Recruiter initiated inquiry based on verified Python proficiency",
    ],
  },
];

const CATEGORY_ICONS: Record<ActivityCategory, React.ReactNode> = {
  opportunity: <Search className="w-3.5 h-3.5" />,
  application: <Send className="w-3.5 h-3.5" />,
  skill: <BrainCircuit className="w-3.5 h-3.5" />,
  learning: <BookOpen className="w-3.5 h-3.5" />,
  profile: <BadgeCheck className="w-3.5 h-3.5" />,
};

const CATEGORY_COLORS: Record<ActivityCategory, { bg: string; border: string; text: string }> = {
  opportunity: { bg: "bg-[#EC1D24]/10", border: "border-[#EC1D24]/30", text: "text-[#EC1D24]" },
  application: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" },
  skill: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
  learning: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  profile: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
};

function CardWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#12131C] to-[#0A0B10] border border-[#EC1D24]/20 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#EC1D24] mb-3 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EC1D24]" />
      {children}
    </p>
  );
}

function PulseDot({ active = true }: { active?: boolean }) {
  return (
    <span className="relative flex w-2.5 h-2.5">
      {active && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC1D24] opacity-75" />
      )}
      <span
        className={`relative inline-flex rounded-full w-2.5 h-2.5 ${
          active ? "bg-[#EC1D24]" : "bg-zinc-600"
        }`}
      />
    </span>
  );
}

function ActivityDetail({
  item,
  onClose,
  onNavigate,
}: {
  item: ActivityItem;
  onClose: () => void;
  onNavigate: (p: Page) => void;
}) {
  const c = CATEGORY_COLORS[item.category];
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[460px] h-full bg-[#0E1017] border-l border-[#EC1D24]/30 overflow-y-auto flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0E1017] border-b border-[#EC1D24]/20 px-6 py-4 flex items-start gap-3 z-10">
          <div
            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${c.bg} ${c.border} ${c.text}`}
          >
            {CATEGORY_ICONS[item.category]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white leading-none mb-1 font-sans">
              {item.title}
            </h2>
            <p className="text-xs font-mono text-zinc-400 truncate">{item.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#EC1D24]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {item.date === "today" ? "TODAY" : "YESTERDAY"}, {item.time}
          </div>

          <div>
            <SectionLabel>Event Summary</SectionLabel>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">{item.detail}</p>
          </div>

          {item.whyReasons && item.whyReasons.length > 0 && (
            <div>
              <SectionLabel>Agent Decision Log</SectionLabel>
              <div className="space-y-2">
                {item.whyReasons.map((reason, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EC1D24] shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300 leading-relaxed font-mono">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.match && (
            <div>
              <SectionLabel>Compatibility Score</SectionLabel>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black italic text-[#EC1D24] font-mono">
                  {item.match}%
                </span>
                <div className="flex-1 h-2 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#EC1D24] to-[#FFD700]"
                    style={{ width: `${item.match}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Threshold: 85%</span>
              </div>
            </div>
          )}

          {item.matchingSkills && item.matchingSkills.length > 0 && (
            <div>
              <SectionLabel>Verified Skills Matched</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {item.matchingSkills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[11px] font-mono text-red-300"
                  >
                    <BadgeCheck className="w-3 h-3 text-amber-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.gapSkills && item.gapSkills.length > 0 && (
            <div>
              <SectionLabel>Identified Skill Gaps</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.gapSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-[11px] font-mono text-red-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onClose();
                  onNavigate("learning");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                View Learning Roadmap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AgentActivityPageProps {
  onNavigate: (p: Page) => void;
}

export default function AgentActivityPage({ onNavigate }: AgentActivityPageProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | ActivityCategory>("all");
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
  const [progress, setProgress] = useState(27);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => {
      setProgress((p) => (p >= 42 ? 27 : p + 1));
    }, 3200);
    return () => clearInterval(t);
  }, [isPaused]);

  const filters: { id: "all" | ActivityCategory; label: string }[] = [
    { id: "all", label: "All Activity" },
    { id: "opportunity", label: "Opportunities" },
    { id: "application", label: "Applications" },
    { id: "skill", label: "Skills" },
    { id: "learning", label: "Learning" },
    { id: "profile", label: "Profile" },
  ];

  const filtered =
    activeFilter === "all"
      ? activityItems
      : activityItems.filter((a) => a.category === activeFilter);

  const todayItems = filtered.filter((a) => a.date === "today");
  const yesterdayItems = filtered.filter((a) => a.date === "yesterday");

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#0A0B10] relative">
      {/* S.H.I.E.L.D. Mission / Stark Tech Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/stark-tech-comic-bg.jpg" decoding="async"
          alt="SHIELD Tech Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="panther" />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EC1D24]/20 border border-[#EC1D24]/40 mb-2">
              <ShieldEagleLogo className="w-3.5 h-3.5 text-[#EC1D24]" />
              <span className="text-[10px] font-mono text-red-300 font-bold uppercase tracking-widest">
                AUTONOMOUS AI AGENT · ACTIVITY FEED
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-white uppercase tracking-wide">
              Agent Activity
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Live autonomous opportunity matching, application tracking, and skill recommendations.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <InteractiveHoverButton
              text="Agent Guardrails"
              className="w-36 text-xs text-white/70 border-[#EC1D24]/30"
            />
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setIsPaused((p) => !p);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                isPaused
                  ? "bg-[#EC1D24] border border-yellow-400 text-white shadow-[0_0_15px_rgba(236,29,36,0.4)]"
                  : "bg-black/60 border border-[#EC1D24]/40 text-red-300 hover:bg-[#EC1D24]/20"
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? "Resume Agent" : "Pause Agent"}
            </button>
          </div>
        </div>

        {/* Agent status bar */}
        <div className="relative mb-6 rounded-2xl border border-[#EC1D24]/30 bg-[#0E1017] p-5 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isPaused
                    ? "bg-black/60 border-zinc-700"
                    : "bg-[#EC1D24]/15 border-[#EC1D24]/50 shadow-[0_0_15px_rgba(236,29,36,0.3)]"
                }`}
              >
                <ArcReactor className={`w-6 h-6 ${isPaused ? "opacity-30" : "text-[#EC1D24]"}`} />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-0.5">
                  AI AGENT STATUS
                </p>
                <div className="flex items-center gap-2">
                  <PulseDot active={!isPaused} />
                  <span
                    className={`text-sm font-black font-mono tracking-wider ${
                      isPaused ? "text-zinc-500" : "text-[#EC1D24]"
                    }`}
                  >
                    {isPaused ? "DISENGAGED" : "AGENT ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#EC1D24]/20 shrink-0" />

            <p className="flex-1 text-xs text-zinc-300 font-mono leading-relaxed">
              {isPaused
                ? "Autonomous agent paused. Telemetry remains in passive listen-only mode."
                : "Scanning verified opportunities and preparing matching credentials under student constitution guardrails."}
            </p>

            <div className="hidden sm:block w-px h-8 bg-[#EC1D24]/20 shrink-0" />

            {/* Stats */}
            <div className="flex items-center gap-5 shrink-0">
              {[
                { label: "Relay Ping", value: "14ms" },
                { label: "Monitored", value: "127" },
                { label: "Prepared", value: "18" },
                { label: "Applied", value: "12" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-bold text-white font-mono leading-none">{s.value}</p>
                  <p className="text-[9px] text-[#EC1D24] font-mono mt-0.5 uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Currently working on */}
        {!isPaused && (
          <div className="mb-6">
            <CardWrap className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw
                  className="w-3.5 h-3.5 text-[#EC1D24] animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <SectionLabel>Active Opportunity Matching In Progress</SectionLabel>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white mb-1">
                    Scanning partner job boards and matching verified credentials
                  </p>
                  <p className="text-xs text-zinc-400 font-mono mb-3">
                    Matching verified Skill Passport against live requirements
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#EC1D24] to-[#FFD700] transition-all duration-1000 shadow-[0_0_10px_#EC1D24]"
                        style={{ width: `${(progress / 42) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#EC1D24] font-mono font-bold shrink-0">
                      {progress} / 42 ROLES
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    onNavigate("opportunities");
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EC1D24] border border-yellow-400 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_12px_rgba(236,29,36,0.3)]"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  View Opportunities
                </button>
              </div>
            </CardWrap>
          </div>
        )}

        {/* Live activity feed */}
        <div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setActiveFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? "bg-[#EC1D24] border border-yellow-400 text-white shadow-[0_0_10px_rgba(236,29,36,0.3)]"
                    : "bg-black/60 border border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <SectionLabel>Activity History</SectionLabel>

          {/* Today */}
          {todayItems.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3">
                TODAY
              </p>
              <div className="space-y-0">
                {todayItems.map((item, idx) => {
                  const c = CATEGORY_COLORS[item.category];
                  const isLast = idx === todayItems.length - 1 && yesterdayItems.length === 0;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 group cursor-pointer"
                      onClick={() => {
                        marvelAudio.playRepulsorClick();
                        setSelectedItem(item);
                      }}
                    >
                      <div className="flex flex-col items-center w-8 shrink-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${c.bg} ${c.border} ${c.text} group-hover:scale-110 transition-transform`}
                        >
                          {CATEGORY_ICONS[item.category]}
                        </div>
                        {!isLast && <div className="w-px flex-1 mt-1 mb-1 bg-[#EC1D24]/20" />}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0 font-mono">
                            {item.match && (
                              <span className="text-[11px] font-bold text-[#EC1D24]">
                                {item.match}%
                              </span>
                            )}
                            <span className="text-[10px] text-zinc-500">{item.time}</span>
                          </div>
                        </div>
                        <p className="text-xs font-mono text-zinc-400 mb-1">{item.subtitle}</p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">{item.detail}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#EC1D24] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-12" />
      </div>

      {/* Activity detail drawer */}
      {selectedItem && (
        <ActivityDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onNavigate={(p) => {
            setSelectedItem(null);
            onNavigate(p);
          }}
        />
      )}
    </div>
  );
}
