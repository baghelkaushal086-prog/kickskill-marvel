import { useState } from "react";
import {
  Target,
  BrainCircuit,
  Sparkles,
  BookOpen,
  Search,
  Bot,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight,
  IndianRupee,
  MapPin,
  Briefcase,
  BadgeCheck,
  Route,
  Settings,
  Send,
  History,
  Zap,
  ArrowDown,
  Shield,
} from "lucide-react";
import type { Page } from "../App";
import { ShieldEagleLogo, ArcReactor } from "../components/marvel/MarvelIcons";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";

// ─── Static data ──────────────────────────────────────────────────────────────

const ROLES = [
  "AI / ML Systems Engineer",
  "Robotics & Embedded Systems",
  "Backend Core Engineer",
  "Frontend Systems Engineer",
  "Data Scientist",
  "Distributed Systems Engineer",
  "Cybersecurity Engineer",
  "Cloud Fleet Architect",
  "Product Manager",
  "UI/UX Designer",
];

const INDUSTRIES = [
  "Artificial Intelligence & ML",
  "Robotics & Automation",
  "Quantum Computing",
  "Cybersecurity & Infrastructure",
  "Aerospace & Telemetry",
  "Biomedical Technology",
  "FinTech & Banking",
  "Consumer Platforms",
];

const TIMELINES = ["Actively Looking", "3 Months", "6 Months", "1 Year", "Multi-Year"];

const LOCATIONS = ["India", "Remote / Global", "International"];
const MODES = ["Remote", "Hybrid", "On-site"];
const OPP_TYPES = ["Internship", "Full-time", "Projects", "Fellowship"];

const goalSkills = [
  { name: "Python", level: 86, status: "Mastered" },
  { name: "Machine Learning", level: 74, status: "Developing" },
  { name: "SQL", level: 81, status: "Mastered" },
  { name: "Git", level: 89, status: "Mastered" },
  { name: "NumPy / Pandas", level: 75, status: "Developing" },
  { name: "FastAPI", level: 58, status: "Developing" },
  { name: "NLP", level: 48, status: "Developing" },
  { name: "PyTorch", level: 42, status: "Skill Gap" },
  { name: "Docker", level: 35, status: "Skill Gap" },
  { name: "Cloud (AWS/GCP)", level: 28, status: "Skill Gap" },
];

const careerPath = [
  { label: "Current Profile", desc: "Verified skills and project credentials" },
  { label: "Skill Development", desc: "Close critical gaps in PyTorch, Docker, and Cloud" },
  { label: "Portfolio Projects", desc: "Ship 1–2 production-grade AI portfolio systems" },
  { label: "Job Applications", desc: "Apply to high-match target companies and roles" },
  { label: "Interviews & Assessments", desc: "Technical interviews & offer evaluation" },
  { label: "Target Role Achieved", desc: "AI / ML Systems Engineer — full-time position" },
];
const CURRENT_STAGE = 1; // Skill Development

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

function SkillStatusLabel({ status }: { status: string }) {
  const isMastered = status === "Mastered";
  const isDeveloping = status === "Developing";
  return (
    <span
      className={`text-[10px] font-mono font-bold ${
        isMastered ? "text-[#EC1D24]" : isDeveloping ? "text-amber-400" : "text-zinc-400"
      }`}
    >
      {status}
    </span>
  );
}

function ReadinessArc({ value }: { value: number }) {
  const r = 32,
    cx = 40,
    cy = 40;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative w-[80px] h-[80px] shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#cg-marvel-grad)"
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="cg-marvel-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EC1D24" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
        <span className="text-lg font-black italic text-[#EC1D24] leading-none">{value}%</span>
      </div>
    </div>
  );
}

function MultiChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => {
        marvelAudio.playRepulsorClick();
        onClick();
      }}
      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
        selected
          ? "bg-[#EC1D24] border-yellow-400 text-white shadow-[0_0_12px_rgba(236,29,36,0.3)]"
          : "bg-black/60 border-white/10 text-zinc-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

interface CareerGoalPageProps {
  onNavigate: (p: Page) => void;
}

export default function CareerGoalPage({ onNavigate }: CareerGoalPageProps) {
  const [selectedRole, setSelectedRole] = useState("AI / ML Systems Engineer");
  const [roleSearch, setRoleSearch] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState(
    new Set(["Artificial Intelligence & Autonomous Systems", "Biomedical Technology"])
  );
  const [selectedLocations, setSelectedLocations] = useState(new Set(["India", "Remote / Global"]));
  const [selectedModes, setSelectedModes] = useState(new Set(["Remote", "Hybrid"]));
  const [selectedTypes, setSelectedTypes] = useState(new Set(["Internship", "Full-time"]));
  const [selectedTimeline, setSelectedTimeline] = useState("6 Months");
  const [stipend, setStipend] = useState("20000");
  const [saved, setSaved] = useState(false);

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  }

  function handleSave() {
    marvelAudio.playVibraniumChime();
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
  }

  const filteredRoles = roleSearch.trim()
    ? ROLES.filter((r) => r.toLowerCase().includes(roleSearch.toLowerCase()))
    : ROLES;

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#0A0B10] relative">
      {/* Black Panther / Wakanda Comic Collage Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/black-panther-comic-bg.jpg" decoding="async"
          alt="Black Panther Comic Backdrop"
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
            <div className="inline-flex items-center gap-1.5 mb-2">
              <img src="/marvel/spiderman-face.svg" alt="Spider-Man" className="w-4 h-4 object-contain" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                KickSkill · Career Goal
              </span>
            </div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                Career Goal & Direction
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GOAL ACTIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Define your target role and preferences to power AI-guided matching and customized learning roadmaps.
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            {/* Current goal hero */}
            <div className="relative rounded-2xl border border-[#EC1D24]/30 bg-[#0E1017] p-6 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.7)]">
              <SectionLabel>Active Career Goal</SectionLabel>
              <div className="relative flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-black italic text-white uppercase mb-3 font-sans">
                    {selectedRole}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-xs font-mono">
                    {[
                      { label: "Target Sector", value: "AI & Technology Systems" },
                      { label: "Career Path", value: "Entry-level → Lead Systems Architect" },
                      { label: "Timeline", value: selectedTimeline },
                    ].map((row) => (
                      <div key={row.label}>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
                          {row.label}
                        </p>
                        <p className="text-white font-bold">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <ReadinessArc value={78} />
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Readiness
                  </p>
                </div>
              </div>
            </div>

            {/* Role picker */}
            <CardWrap className="p-5">
              <SectionLabel>Select Target Role</SectionLabel>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#EC1D24] pointer-events-none" />
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="Filter roles..."
                  className="w-full pl-9 pr-4 py-2 bg-black/60 border border-[#EC1D24]/25 rounded-xl text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#EC1D24] transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      marvelAudio.playRepulsorClick();
                      setSelectedRole(role);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                      selectedRole === role
                        ? "bg-[#EC1D24] border-yellow-400 text-white shadow-[0_0_15px_rgba(236,29,36,0.4)]"
                        : "bg-black/60 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </CardWrap>

            {/* Required skills */}
            <CardWrap className="p-5">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Skills Required for This Role</SectionLabel>
                <button
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    onNavigate("skills");
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#EC1D24] hover:text-red-400 transition-colors cursor-pointer"
                >
                  View Skills Matrix
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3 font-mono">
                {goalSkills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-300">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <SkillStatusLabel status={s.status} />
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{
                            color: s.level >= 75 ? "#FFFFFF" : s.level >= 55 ? "#FFD700" : "#EC1D24",
                          }}
                        >
                          {s.level}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${s.level}%`,
                          background:
                            s.level >= 75
                              ? "#EC1D24"
                              : s.level >= 55
                              ? "#FFD700"
                              : "#990B11",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardWrap>

            {/* Path */}
            <CardWrap className="p-5">
              <SectionLabel>Career Progression Path</SectionLabel>
              <div className="space-y-0 mb-4 font-mono">
                {careerPath.map((step, i) => {
                  const isCurrent = i === CURRENT_STAGE;
                  const isDone = i < CURRENT_STAGE;
                  const isLast = i === careerPath.length - 1;
                  return (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex flex-col items-center w-6 shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isCurrent
                              ? "bg-red-600/30 border-red-500 shadow-[0_0_10px_#EC1D24]"
                              : isDone
                              ? "bg-[#EC1D24]/20 border-[#EC1D24]"
                              : "bg-black/60 border-zinc-700"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-[#EC1D24]" />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                          ) : (
                            <Circle className="w-3 h-3 text-zinc-700" />
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-px flex-1 mt-1 mb-1 ${
                              isDone ? "bg-[#EC1D24]/40" : "bg-white/5"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <p
                          className={`text-sm font-bold leading-none mb-1 ${
                            isCurrent ? "text-red-400" : isDone ? "text-white font-bold" : "text-zinc-500"
                          }`}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] text-red-400 font-mono font-normal">
                              [CURRENT PHASE]
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-zinc-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 rounded-xl bg-[#EC1D24]/10 border border-[#EC1D24]/30 font-mono text-xs">
                <p className="text-red-300 font-bold mb-1">
                  Current Focus — Skill Development
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  Your Python fundamentals are strong (86%). Prioritize closing Docker containerization and PyTorch neural modeling to achieve 90%+ readiness.
                </p>
              </div>
            </CardWrap>

            {/* Save */}
            <div className="flex items-center justify-between pt-2 pb-2">
              <div
                className={`text-xs font-mono text-[#EC1D24] transition-all duration-300 ${
                  saved ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Career goal saved successfully.
                </span>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#EC1D24] border border-yellow-400 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.3)] ml-auto"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Career Goal
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <CardWrap className="p-5">
              <SectionLabel>Target Sectors</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRIES.map((ind) => (
                  <MultiChip
                    key={ind}
                    label={ind}
                    selected={selectedIndustries.has(ind)}
                    onClick={() => setSelectedIndustries(toggle(selectedIndustries, ind))}
                  />
                ))}
              </div>
            </CardWrap>

            <CardWrap className="p-5">
              <SectionLabel>Operational Preferences</SectionLabel>
              <div className="space-y-3 font-mono">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">
                    Sector Location
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {LOCATIONS.map((l) => (
                      <MultiChip
                        key={l}
                        label={l}
                        selected={selectedLocations.has(l)}
                        onClick={() => setSelectedLocations(toggle(selectedLocations, l))}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">
                    Deployment Mode
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MODES.map((m) => (
                      <MultiChip
                        key={m}
                        label={m}
                        selected={selectedModes.has(m)}
                        onClick={() => setSelectedModes(toggle(selectedModes, m))}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardWrap>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
