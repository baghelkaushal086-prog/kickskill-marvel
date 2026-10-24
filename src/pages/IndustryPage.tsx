import { useState, useRef, useCallback, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Star,
  CalendarCheck,
  TrendingUp,
  Bot,
  Building2,
  Settings,
  ChevronRight,
  X,
  BadgeCheck,
  Sparkles,
  Send,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  UserRound,
  Eye,
  MessageSquare,
  Trash2,
  PauseCircle,
  Search,
  SlidersHorizontal,
  IndianRupee,
  Paperclip,
  ArrowUpIcon,
  LogOut,
  Menu,
  Shield,
  Zap,
  Radio,
  Cpu,
  Target,
} from "lucide-react";
import type { Page } from "../App";
import { ShieldEagleLogo, ArcReactor, AvengersLogo } from "../components/marvel/MarvelIcons";
import { ComicPageTransition } from "../components/marvel/ComicPageTransition";
import { IronManHelmet3D } from "../components/marvel/IronManHelmet3D";
import { triggerComicWord, triggerShieldSuccess } from "../components/marvel/MarvelCelebrations";
import { MarvelExperienceSettings } from "../components/marvel/MarvelExperienceSettings";
import { HeroTint, type HeroKey } from "../components/marvel/HeroTint";
import { InfinityStonesProgress } from "../components/marvel/InfinityStonesProgress";
import { KickSkillLogo } from "../components/marvel/KickSkillLogo";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

type IndustrySection =
  | "dashboard"
  | "opportunities"
  | "candidates"
  | "shortlist"
  | "interviews"
  | "skill-demand"
  | "ai-recruiting"
  | "company-profile"
  | "settings";

// Per-section hero comic backdrops, mirroring the student workspace pages
const SECTION_BACKDROP: Record<IndustrySection, string> = {
  "dashboard": "/marvel/stark-tech-comic-bg.jpg",
  "opportunities": "/marvel/spiderman-comic-bg.jpg",
  "candidates": "/marvel/captain-america-comic-bg.jpg",
  "shortlist": "/marvel/black-widow-comic-bg.jpg",
  "interviews": "/marvel/black-panther-comic-bg.jpg",
  "skill-demand": "/marvel/hulk-comic-bg.jpg",
  "ai-recruiting": "/marvel/marvel-comic-collage.jpg",
  "company-profile": "/marvel/thor-comic-bg.jpg",
  "settings": "/marvel/stark-tech-comic-bg.jpg",
};

const SECTION_TINT: Record<IndustrySection, HeroKey> = {
  "dashboard": "ironman",
  "opportunities": "spiderman",
  "candidates": "captain",
  "shortlist": "widow",
  "interviews": "panther",
  "skill-demand": "hulk",
  "ai-recruiting": "ironman",
  "company-profile": "thor",
  "settings": "ironman",
};

interface Opportunity {
  id: string;
  title: string;
  type: "Internship" | "Contract" | "Full-Time" | "Commission" | "Research Fellowship";
  applicants: number;
  strongMatches: number;
  avgMatch: number;
  status: "Accepting" | "Paused" | "Closed";
  deadline: string;
  skills: string[];
}

interface Candidate {
  id: string;
  code: string;
  role: string;
  match: number;
  verifiedSkills: { name: string; level: number; verified: boolean }[];
  gapSkills: { name: string; level: number }[];
  projects: number;
  internships: number;
  institution: string;
  degree: string;
  status: "matched" | "shortlisted" | "interview" | "selected" | "rejected";
  projectRelevance: "High" | "Medium" | "Low";
  expRelevance: "High" | "Medium" | "Low";
}

interface Interview {
  candidateCode: string;
  role: string;
  stage: string;
  date: string;
  status: "Confirmed" | "Pending";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const opportunities: Opportunity[] = [
  {
    id: "o1",
    title: "AI / ML Systems Operative",
    type: "Internship",
    applicants: 184,
    strongMatches: 27,
    avgMatch: 91,
    status: "Accepting",
    deadline: "Cycle 4, Oct 15",
    skills: ["Python", "Neural Networks", "PyTorch", "Autonomous Systems"],
  },
  {
    id: "o2",
    title: "Backend Core & Holotable Engineer",
    type: "Internship",
    applicants: 96,
    strongMatches: 18,
    avgMatch: 87,
    status: "Accepting",
    deadline: "Cycle 4, Oct 20",
    skills: ["Node.js", "Distributed DB", "Docker", "Sub-space APIs"],
  },
  {
    id: "o3",
    title: "Quantum Data & Telemetry Analyst",
    type: "Commission",
    applicants: 62,
    strongMatches: 11,
    avgMatch: 83,
    status: "Accepting",
    deadline: "Cycle 5, Nov 1",
    skills: ["Python", "SQL", "Holotable Viz", "Predictive Analytics"],
  },
  {
    id: "o4",
    title: "Edge Cloud & Distributed Systems Engineer",
    type: "Full-Time",
    applicants: 38,
    strongMatches: 6,
    avgMatch: 79,
    status: "Paused",
    deadline: "Cycle 5, Nov 15",
    skills: ["Docker", "Kubernetes", "Quantum Encryption", "CI/CD Fleet"],
  },
];

const candidates: Candidate[] = [
  {
    id: "c1",
    code: "Candidate NS-01 (Nishant S.)",
    role: "AI / ML Systems Engineer",
    match: 94,
    verifiedSkills: [
      { name: "Python", level: 92, verified: true },
      { name: "Neural Networks", level: 87, verified: true },
      { name: "PyTorch", level: 81, verified: true },
      { name: "Autonomous Systems", level: 90, verified: true },
    ],
    gapSkills: [{ name: "Quantum Encryption", level: 42 }, { name: "Fleet Cloud", level: 31 }],
    projects: 3,
    internships: 1,
    institution: "IIIT Tiruchirappalli (AI Systems Cohort)",
    degree: "B.Tech CSE",
    status: "shortlisted",
    projectRelevance: "High",
    expRelevance: "High",
  },
  {
    id: "c2",
    code: "Candidate PM-02",
    role: "AI / ML Systems Engineer",
    match: 89,
    verifiedSkills: [
      { name: "Python", level: 88, verified: true },
      { name: "Neural Networks", level: 84, verified: true },
      { name: "SQL", level: 79, verified: true },
    ],
    gapSkills: [{ name: "PyTorch", level: 38 }, { name: "Cloud Defense", level: 28 }],
    projects: 2,
    internships: 0,
    institution: "NIT Trichy",
    degree: "B.Tech AI & Data",
    status: "matched",
    projectRelevance: "High",
    expRelevance: "Medium",
  },
  {
    id: "c3",
    code: "Candidate RH-03",
    role: "AI / ML Systems Operative",
    match: 86,
    verifiedSkills: [
      { name: "Python", level: 85, verified: true },
      { name: "PyTorch", level: 80, verified: true },
      { name: "SQL", level: 74, verified: false },
    ],
    gapSkills: [{ name: "Neural Networks", level: 55 }],
    projects: 4,
    internships: 1,
    institution: "BITS Pilani",
    degree: "B.E. CS",
    status: "matched",
    projectRelevance: "High",
    expRelevance: "High",
  },
  {
    id: "c4",
    code: "Candidate STK-04",
    role: "Backend Core & Holotable Engineer",
    match: 91,
    verifiedSkills: [
      { name: "Node.js", level: 89, verified: true },
      { name: "Distributed DB", level: 86, verified: true },
      { name: "Sub-space APIs", level: 92, verified: true },
    ],
    gapSkills: [{ name: "Docker", level: 45 }, { name: "Fleet K8s", level: 22 }],
    projects: 2,
    internships: 1,
    institution: "IIT Delhi",
    degree: "B.Tech CSE",
    status: "shortlisted",
    projectRelevance: "High",
    expRelevance: "High",
  },
  {
    id: "c5",
    code: "Candidate WAK-05",
    role: "Backend Core & Holotable Engineer",
    match: 84,
    verifiedSkills: [
      { name: "Node.js", level: 82, verified: true },
      { name: "Distributed DB", level: 77, verified: false },
      { name: "Docker", level: 71, verified: true },
    ],
    gapSkills: [{ name: "Sub-space APIs", level: 60 }],
    projects: 1,
    internships: 0,
    institution: "VIT Vellore",
    degree: "B.Tech CS",
    status: "interview",
    projectRelevance: "Medium",
    expRelevance: "Low",
  },
];

const interviews: Interview[] = [
  {
    candidateCode: "Candidate STK-04",
    role: "Backend Core & Systems Engineer",
    stage: "Technical Interview",
    date: "Tomorrow, 16:00 IST",
    status: "Confirmed",
  },
  {
    candidateCode: "Candidate TK-01 (Nishant S.)",
    role: "AI / ML Systems Engineer",
    stage: "Final Engineering Round",
    date: "Sep 5, 14:00 IST",
    status: "Confirmed",
  },
  {
    candidateCode: "Candidate PYM-02",
    role: "Data Science & Systems Analyst",
    stage: "System Design Assessment",
    date: "Sep 6, 11:00 IST",
    status: "Pending",
  },
];

const skillDemand = [
  { name: "Python", pct: 84 },
  { name: "Neural Networks / ML", pct: 72 },
  { name: "Distributed DB / SQL", pct: 61 },
  { name: "PyTorch & Tensor RT", pct: 54 },
  { name: "Docker & Container Ops", pct: 48 },
  { name: "Node.js & Real-Time Sync", pct: 43 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CardWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#EC1D24]/30 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#EC1D24]/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EC1D24] animate-pulse" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC1D24]/80">
        {children}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Accepting: "bg-[#EC1D24]/15 border-[#EC1D24]/40 text-[#EC1D24]",
    Paused: "bg-white/5 border-white/10 text-neutral-500",
    Closed: "bg-[#EC1D24]/10 border-[#EC1D24]/30 text-[#EC1D24]",
    Confirmed: "bg-[#EC1D24]/15 border-[#EC1D24]/40 text-[#EC1D24]",
    Pending: "bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]",
    shortlisted: "bg-[#FFD700]/15 border-[#FFD700]/40 text-[#FFD700]",
    interview: "bg-[#EC1D24]/15 border-[#EC1D24]/40 text-[#EC1D24]",
    selected: "bg-[#EC1D24]/25 border-[#EC1D24] text-[#EC1D24] font-bold shadow-[0_0_10px_rgba(236,29,36,0.3)]",
    rejected: "bg-white/5 border-white/10 text-white/30",
    matched: "bg-white/10 border-white/15 text-neutral-300",
  };
  const labels: Record<string, string> = {
    shortlisted: "Shortlisted",
    interview: "Interviewing",
    selected: "Offer Accepted",
    rejected: "Archived",
    matched: "Skill Matched",
    Accepting: "Open Roles",
    Paused: "Paused",
  };
  const cls = map[status] ?? map.matched;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cls}`}>
      {labels[status] ?? status}
    </span>
  );
}

function MatchRing({ value, size = 40 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={value >= 90 ? "#EC1D24" : value >= 80 ? "#EC1D24" : "#FFD700"}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(236,29,36,0.4))" }}
      />
    </svg>
  );
}

// ─── Post Opportunity Drawer ───────────────────────────────────────────────────

function PostOpportunityDrawer({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "analyze" | "confirm">("form");
  const [jobDesc, setJobDesc] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Internship",
    location: "Remote Relay",
    duration: "",
    stipend: "",
    qualification: "",
    description: "",
    deadline: "",
  });

  const extractedRequired = ["Python", "Neural Networks", "PyTorch", "Autonomous Systems"];
  const extractedPreferred = ["Quantum Encryption", "Distributed Mesh"];

  function handleAnalyze() {
    marvelAudio.playRepulsorClick();
    if (jobDesc.trim()) {
      setAnalyzed(true);
      setStep("analyze");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#0d1117] border-l border-[#EC1D24]/30 h-full overflow-y-auto flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <ArcReactor className="w-5 h-5 text-[#EC1D24]" pulse />
            <div>
              <h2 className="text-base font-bold text-white">Create Job Opportunity</h2>
              <p className="text-xs text-neutral-500 mt-0.5 font-sans">
                Post opportunities to KickSkill verified talent network.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Opportunity Title
              </label>
              <input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. AI / ML Systems Engineer"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#EC1D24] transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Opportunity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 focus:outline-none focus:border-[#EC1D24] transition-all appearance-none cursor-pointer"
              >
                {["Internship", "Full-Time", "Contract", "Research Fellowship"].map((t) => (
                  <option key={t} value={t} className="bg-black">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Work Mode
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 focus:outline-none focus:border-[#EC1D24] transition-all appearance-none cursor-pointer"
              >
                {["Remote", "Hybrid", "On-Site"].map(
                  (l) => (
                    <option key={l} value={l} className="bg-black">
                      {l}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Role Duration
              </label>
              <input
                value={formData.duration}
                onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                placeholder="e.g. 6 Months"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#EC1D24] transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Monthly Stipend (INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#EC1D24] pointer-events-none" />
                <input
                  value={formData.stipend}
                  onChange={(e) => setFormData((p) => ({ ...p, stipend: e.target.value }))}
                  placeholder="25,000 / month"
                  className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#EC1D24] transition-all"
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData((p) => ({ ...p, deadline: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 focus:outline-none focus:border-[#EC1D24] transition-all"
              />
            </div>
          </div>

          {/* Job description + AI extraction */}
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1.5">
              Role Description & Required Skills
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={4}
              placeholder="Outline the role responsibilities, required skills, and qualification criteria..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/85 placeholder:text-white/20 focus:outline-none focus:border-[#EC1D24] transition-all resize-none leading-relaxed"
            />
            <button
              onClick={handleAnalyze}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[#EC1D24] text-xs font-bold hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(236,29,36,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Skill Extraction
            </button>
          </div>

          {/* AI extraction results */}
          {analyzed && (
            <CardWrap className="p-4 border-[#EC1D24]/40">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#EC1D24]" />
                <SectionLabel>Extracted Skills</SectionLabel>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                    Primary Requirements
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedRequired.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-1 rounded-lg bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[#EC1D24] text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                    Preferred Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedPreferred.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardWrap>
          )}
        </div>

        <div className="shrink-0 px-6 pb-6 pt-4 border-t border-white/10 flex gap-2">
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl border border-white/15 text-xs text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              triggerComicWord(e.clientX, e.clientY, "POW!");
              triggerShieldSuccess("Mission Posted!");
              onClose();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex-1 py-2 rounded-xl bg-[#EC1D24] text-white text-xs font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)]"
          >
            {analyzed ? "Confirm & Publish Posting" : "Publish Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Candidate Detail Drawer ──────────────────────────────────────────────────

function CandidateDetailDrawer({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const [shortlisted, setShortlisted] = useState(
    candidate.status === "shortlisted" || candidate.status === "interview"
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#0d1117] border-l border-[#EC1D24]/30 h-full overflow-y-auto flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC1D24]/30 to-[#EC1D24]/25 border border-[#EC1D24]/40 flex items-center justify-center">
              <ShieldEagleLogo className="w-5 h-5 text-[#EC1D24]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">
                {candidate.code}
              </p>
              <p className="text-xs text-[#EC1D24] mt-1">{candidate.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <MatchRing value={candidate.match} size={36} />
              <span className="text-sm font-bold text-[#EC1D24]">{candidate.match}%</span>
            </div>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Info row */}
          <div className="flex flex-wrap gap-2 text-xs text-neutral-400 bg-black/40 p-3 rounded-xl border border-white/5">
            <span className="text-[#EC1D24]">{candidate.institution}</span>
            <span>·</span>
            <span>{candidate.degree}</span>
            <span>·</span>
            <span>{candidate.projects} Combat Builds</span>
            {candidate.internships > 0 && (
              <>
                <span>·</span>
                <span>{candidate.internships} Prior Tour</span>
              </>
            )}
          </div>

          {/* Why this candidate matches */}
          <CardWrap className="p-4">
            <SectionLabel>Verified Skills Assessment</SectionLabel>
            <div className="space-y-3 mb-4">
              {candidate.verifiedSkills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/80">{s.name}</span>
                      {s.verified ? (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#EC1D24]" />
                      ) : (
                        <span className="text-[9px] text-[#FFD700] border border-[#FFD700]/30 rounded px-1">
                          Self-Reported
                        </span>
                      )}
                    </div>
                    <span className="text-[#EC1D24] font-bold">{s.level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.verified
                          ? "bg-gradient-to-r from-[#EC1D24] to-[#EC1D24]"
                          : "bg-white/30"
                      }`}
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
              <div>
                <p className="text-[10px] text-white/35 mb-0.5">Project Relevance</p>
                <p className="text-xs font-bold text-[#EC1D24]">{candidate.projectRelevance}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/35 mb-0.5">Experience</p>
                <p className="text-xs font-bold text-white/80">{candidate.expRelevance}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/35 mb-0.5">Role Match</p>
                <p className="text-xs font-bold text-[#EC1D24]">{candidate.match}%</p>
              </div>
            </div>
          </CardWrap>

          {/* Skill gaps */}
          {candidate.gapSkills.length > 0 && (
            <CardWrap className="p-4 border-[#FFD700]/20">
              <SectionLabel>Skill Gaps to Address</SectionLabel>
              <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed font-sans">
                These capabilities are desired for this role but pending assessment verification.
              </p>
              <div className="space-y-3">
                {candidate.gapSkills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-neutral-300">{s.name}</span>
                      <span className="text-white/35">{s.level}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#FFD700]/50" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardWrap>
          )}
        </div>

        {/* Actions */}
        <div className="shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setShortlisted(true);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                shortlisted
                  ? "bg-[#FFD700]/20 border-[#FFD700]/50 text-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.2)]"
                  : "bg-white/5 border-white/15 text-neutral-300 hover:text-white"
              }`}
            >
              <Star className="w-3.5 h-3.5" /> {shortlisted ? "Shortlisted" : "Add to Shortlist"}
            </button>
            <button
              onClick={() => marvelAudio.playRepulsorClick()}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#EC1D24]/40 bg-[#EC1D24]/15 text-[#EC1D24] text-xs font-bold hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer shadow-[0_0_12px_rgba(236,29,36,0.2)]"
            >
              <CalendarCheck className="w-3.5 h-3.5" /> Schedule Interview
            </button>
            <button
              onClick={() => marvelAudio.playRepulsorClick()}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/15 bg-white/5 text-neutral-300 text-xs hover:text-white transition-all cursor-pointer"
            >
              <Eye className="w-3 h-3" /> View Profile
            </button>
            <button
              onClick={() => marvelAudio.playRepulsorClick()}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/15 bg-white/5 text-neutral-300 text-xs hover:text-white transition-all cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" /> Send Message
            </button>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onClose();
              }}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-[#EC1D24] text-xs hover:bg-[#EC1D24] hover:text-white transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Decline Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Industry Sidebar ──────────────────────────────────────────────────────────

const sidebarNav = [
  { id: "ai-recruiting", label: "AI Talent Search", img: "/marvel/ironman-helmet.svg" },
  { id: "dashboard", label: "Dashboard", img: "/marvel/ironman-face.svg" },
  { id: "opportunities", label: "Active Roles", img: "/marvel/spiderman-face.svg" },
  { id: "candidates", label: "Candidates", img: "/marvel/captain-america-face.svg" },
  { id: "shortlist", label: "Shortlisted Candidates", img: "/marvel/black-widow-face.svg" },
  { id: "interviews", label: "Interviews", img: "/marvel/black-panther-face.svg" },
  { id: "skill-demand", label: "Skill Demand Matrix", img: "/marvel/hulk-face.svg" },
];

const sidebarBottom = [
  { id: "company-profile", label: "Company Profile", icon: <Building2 className="w-4 h-4 text-[#EC1D24]" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white" /> },
];

const NAV_ACTIVE =
  "bg-gradient-to-r from-[#EC1D24]/20 via-[#EC1D24]/10 to-transparent text-white border border-[#EC1D24]/50 shadow-[0_0_20px_rgba(236,29,36,0.25)] font-semibold";
const NAV_IDLE =
  "text-neutral-300 hover:text-white hover:bg-[#EC1D24]/10 hover:border-[#EC1D24]/30 border border-transparent";

function IndustrySidebar({
  expanded,
  onExpandChange,
  activeSection,
  onSection,
  onSwitchWorkspace,
  onSignOut,
}: {
  expanded: boolean;
  onExpandChange: (v: boolean) => void;
  activeSection: IndustrySection;
  onSection: (s: IndustrySection) => void;
  onSwitchWorkspace: () => void;
  onSignOut: () => void;
}) {
  function handleCollapse() {
    onExpandChange(false);
  }
  function handleToggle() {
    marvelAudio.playRepulsorClick();
    onExpandChange(!expanded);
  }
  function go(id: string) {
    marvelAudio.playRepulsorClick();
    onSection(id as IndustrySection);
    handleCollapse();
  }

  return (
    <>
      {!expanded && (
        <button
          onClick={handleToggle}
          onMouseEnter={() => marvelAudio.playHudHover()}
          aria-label="Open menu"
          className="fixed top-3.5 left-3.5 sm:top-4 sm:left-4 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/90 hover:bg-black border border-white/20 hover:border-[#4ade80]/60 backdrop-blur-xl shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:shadow-[0_0_25px_rgba(74,222,128,0.45)] transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <img
            src="/marvel/avengers-logo-cutout.png"
            alt="Avengers Menu"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-110 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]"
          />
        </button>
      )}

      <div
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCollapse}
      />

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col
          w-[275px] sm:w-[290px] bg-[#08090D]/98 backdrop-blur-2xl border-r border-[#EC1D24]/30
          shadow-[15px_0_50px_rgba(236,29,36,0.15)] transition-transform duration-300 ease-in-out
          ${expanded ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#EC1D24]/20 shrink-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 relative">
          <div className="flex items-center cursor-pointer" onClick={() => go("ai-recruiting")}>
            <KickSkillLogo size="sm" showSubtitle subtitle="Recruiter Workspace" />
          </div>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              handleCollapse();
            }}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 hover:border-[#EC1D24]/40 border border-transparent transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EC1D24]/60 to-transparent" />
        </div>

        {/* Switch workspace */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onSwitchWorkspace();
              handleCollapse();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-[#EC1D24]/25 text-xs font-medium text-neutral-300 hover:text-white hover:border-[#EC1D24]/50 hover:bg-[#EC1D24]/10 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-[#EC1D24]" />
            <span className="truncate">Switch to Student View</span>
          </button>
        </div>

        {/* Main nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 px-3">
          {sidebarNav.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group justify-start relative overflow-hidden ${
                  isActive ? NAV_ACTIVE : NAV_IDLE
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#EC1D24] rounded-r shadow-[0_0_10px_#EC1D24]" />
                )}
                <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-lg bg-black/40 border border-white/10 p-0.5 group-hover:border-[#EC1D24]/60 group-hover:shadow-[0_0_12px_rgba(236,29,36,0.35)] transition-all">
                  <img
                    src={item.img}
                    alt=""
                    className="w-full h-full object-contain transition-transform group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <span className="text-sm font-medium tracking-wide truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="shrink-0 border-t border-white/10 px-3 py-2 space-y-1">
          {sidebarBottom.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group justify-start relative ${
                  isActive ? NAV_ACTIVE : NAV_IDLE
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#EC1D24] rounded-r shadow-[0_0_8px_#EC1D24]" />
                )}
                <span className="shrink-0">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Company identity */}
        <div className="shrink-0 border-t border-white/10 px-3 py-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/60 border border-[#EC1D24]/25 hover:border-[#EC1D24]/50 shadow-sm transition-colors">
            <div className="w-9 h-9 rounded-full bg-neutral-900 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-[0_0_8px_rgba(236,29,36,0.3)]">
              <img src="/marvel/shield-mission.svg" alt="Company" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-none mb-1">TechVenture Labs</p>
              <p className="text-xs text-neutral-400 truncate">Recruiter · Autonomous R&D</p>
            </div>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onSignOut();
                handleCollapse();
              }}
              title="Sign out"
              className="shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#EC1D24]/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Dashboard Section ────────────────────────────────────────────────────────

function DashboardSection({
  onSection,
  onPostOpportunity,
  onViewCandidate,
}: {
  onSection: (s: IndustrySection) => void;
  onPostOpportunity: () => void;
  onViewCandidate: (c: Candidate) => void;
}) {
  const stats = [
    { label: "Active Roles", value: "8" },
    { label: "Candidates Matched", value: "342" },
    { label: "Shortlisted", value: "47" },
    { label: "Active Interviews", value: "18" },
    { label: "Offers Extended", value: "6" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-[#EC1D24]/20 border border-[#EC1D24]/40 text-[#EC1D24]">
              [ TALENT DASHBOARD ]
            </span>
            <span className="text-[10px] text-[#EC1D24]">KICKSKILL TALENT CONSOLE</span>
          </div>
          <h1 className="text-3xl font-black tracking-wide text-white mb-1">
            RECRUITING DASHBOARD
          </h1>
          <p className="text-xs text-neutral-400 font-sans">
            Identify verified skills and connect with qualified student candidates.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onSection("ai-recruiting");
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs font-bold text-[#EC1D24] hover:bg-[#EC1D24]/20 transition-all cursor-pointer shadow-[0_0_10px_rgba(236,29,36,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Search
          </button>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onPostOpportunity();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC1D24] text-white text-xs font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)]"
          >
            <Briefcase className="w-3.5 h-3.5" /> Post Opportunity
          </button>
        </div>
      </div>

      {/* Infinity Stones — six hiring milestones */}
      <InfinityStonesProgress
        milestones={[
          { key: "space", label: "Roles Posted", detail: "Publish your first active role", done: true },
          { key: "mind", label: "Candidates Matched", detail: "Receive AI-matched candidates", done: true },
          { key: "reality", label: "Skills Verified", detail: "Review verified skill reports", done: true },
          { key: "power", label: "Shortlist", detail: "Shortlist your top candidates", done: true },
          { key: "time", label: "Interviews", detail: "Schedule candidate interviews", done: true },
          { key: "soul", label: "Hire", detail: "Extend and close your first offer", done: false },
        ]}
      />

      {/* Company profile strip */}
      <CardWrap className="px-5 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EC1D24]/30 via-black to-[#EC1D24]/25 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(236,29,36,0.2)]">
            <ArcReactor className="w-6 h-6 text-[#EC1D24]" pulse />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">TechVenture Labs AI</p>
            <p className="text-xs text-[#EC1D24] mt-1">Autonomous Systems & Cloud Division</p>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-4 text-sm hidden md:flex">
          {[
            { label: "Active Roles", value: "8 Postings" },
            { label: "Total Candidates", value: "342 Students" },
            { label: "Shortlisted", value: "48 Qualified" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-neutral-500 uppercase">{s.label}</p>
              <p className="text-xs font-bold text-white/90">{s.value}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            marvelAudio.playRepulsorClick();
            onSection("company-profile");
          }}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <Building2 className="w-3 h-3" /> Facility Specs
        </button>
      </CardWrap>

      {/* Recruitment overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map((s) => (
          <CardWrap key={s.label} className="p-4 text-center">
            <p className="text-2xl font-black text-[#EC1D24] leading-none mb-1">{s.value}</p>
            <p className="text-[10px] text-white/45 uppercase leading-tight font-sans">
              {s.label}
            </p>
          </CardWrap>
        ))}
      </div>

      {/* AI Insight */}
      <CardWrap className="p-5 border-[#EC1D24]/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#EC1D24]" />
          <SectionLabel>AI Talent Matching Insight</SectionLabel>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-sans">
          Your <span className="text-[#EC1D24] font-semibold">AI / ML Systems Engineer posting</span> has received{" "}
          <span className="text-white font-bold">184 applicants</span>. KickSkill filtered out unverified claims and isolated{" "}
          <span className="text-[#EC1D24] font-bold">27 qualified candidates</span> possessing an 85%+ verified skill match.{" "}
          <span className="text-[#EC1D24] font-bold">Nishant Singh</span> is flagged with optimal project and assessment scores.
        </p>
        <button
          onClick={() => {
            marvelAudio.playRepulsorClick();
            onSection("candidates");
          }}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[#EC1D24] text-xs font-bold hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer shadow-[0_0_10px_rgba(236,29,36,0.2)]"
        >
          <ChevronRight className="w-3 h-3" /> View Matched Candidates
        </button>
      </CardWrap>

      {/* Two-column body */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          {/* Active Opportunities */}
          <CardWrap>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <SectionLabel>Active Job Postings</SectionLabel>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onSection("opportunities");
                }}
                className="text-xs text-[#EC1D24] hover:underline cursor-pointer flex items-center gap-1"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {opportunities.slice(0, 3).map((opp) => (
                <div key={opp.id} className="px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1.5">
                        {opp.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>{opp.type}</span>
                        <span>·</span>
                        <span>{opp.applicants} candidates applied</span>
                        <span>·</span>
                        <span className="text-[#EC1D24]">{opp.strongMatches} high affinity</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white/80">{opp.avgMatch}% avg</span>
                      <StatusBadge status={opp.status} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {opp.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-neutral-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        marvelAudio.playRepulsorClick();
                        onSection("candidates");
                      }}
                      onMouseEnter={() => marvelAudio.playHudHover()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24]/25 transition-all cursor-pointer shrink-0"
                    >
                      View Candidates
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardWrap>

          {/* Top Matched Candidates */}
          <CardWrap>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <SectionLabel>Top Operative Radars</SectionLabel>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onSection("candidates");
                }}
                className="text-xs text-[#EC1D24] hover:underline cursor-pointer flex items-center gap-1"
              >
                All Candidates <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-white/5">
              {candidates.slice(0, 4).map((c) => (
                <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <UserRound className="w-4 h-4 text-[#EC1D24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-white leading-none">{c.code}</p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-neutral-500 mb-1.5">
                      {c.role} · {c.institution}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {c.verifiedSkills.slice(0, 3).map((s) => (
                        <span
                          key={s.name}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-neutral-300"
                        >
                          {s.verified && <BadgeCheck className="w-2.5 h-2.5 text-[#EC1D24]" />}{" "}
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-base font-black text-[#EC1D24] leading-none">{c.match}%</p>
                      <p className="text-[10px] text-white/35 mt-0.5">match</p>
                    </div>
                    <button
                      onClick={() => {
                        marvelAudio.playRepulsorClick();
                        onViewCandidate(c);
                      }}
                      onMouseEnter={() => marvelAudio.playHudHover()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer font-bold"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardWrap>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Skill Demand */}
          <CardWrap className="p-5">
            <SectionLabel>High-Demand Skills</SectionLabel>
            <div className="space-y-3">
              {skillDemand.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-neutral-300">{s.name}</span>
                    <span className="text-[#EC1D24] font-bold">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#EC1D24] to-[#EC1D24]"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardWrap>

          {/* Interviews */}
          <CardWrap className="p-5">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Upcoming Interviews</SectionLabel>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onSection("interviews");
                }}
                className="text-[10px] text-[#EC1D24] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {interviews.map((iv, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EC1D24]/15 border border-[#EC1D24]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CalendarCheck className="w-4 h-4 text-[#EC1D24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-none mb-0.5">
                      {iv.candidateCode}
                    </p>
                    <p className="text-[11px] text-neutral-500">{iv.role}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                      <Clock className="w-2.5 h-2.5 text-white/30" />
                      <span className="text-neutral-500">{iv.date}</span>
                      <StatusBadge status={iv.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardWrap>
        </div>
      </div>
    </div>
  );
}

// ─── Opportunities Section ────────────────────────────────────────────────────

function OpportunitiesSection({ onPostOpportunity }: { onPostOpportunity: () => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Active Job Postings</h2>
          <p className="text-xs text-neutral-500 font-sans">
            Opportunities posted by Autonomous Systems & Cloud Division.
          </p>
        </div>
        <button
          onClick={() => {
            marvelAudio.playRepulsorClick();
            onPostOpportunity();
          }}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC1D24] text-white text-xs font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shrink-0 shadow-[0_0_15px_rgba(236,29,36,0.4)]"
        >
          <Briefcase className="w-3.5 h-3.5" /> Post Opportunity
        </button>
      </div>
      <CardWrap className="divide-y divide-white/5">
        {opportunities.map((opp) => (
          <div key={opp.id} className="px-5 py-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-base font-bold text-white leading-none mb-1.5">{opp.title}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{opp.type}</span>
                  <span>·</span>
                  <span>Deadline: {opp.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={opp.status} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              {[
                { label: "Applicants", value: opp.applicants },
                { label: "High Affinity", value: opp.strongMatches },
                { label: "Average Match", value: `${opp.avgMatch}%` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-black/40 border border-white/5 rounded-xl px-3 py-2"
                >
                  <p className="text-[10px] text-white/35 mb-0.5">{s.label}</p>
                  <p className="font-bold text-[#EC1D24]">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {opp.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-neutral-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => marvelAudio.playRepulsorClick()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24]/20 transition-all cursor-pointer font-bold"
                >
                  <Eye className="w-3 h-3" /> View Applicants
                </button>
                <button
                  onClick={() => marvelAudio.playRepulsorClick()}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-500 hover:text-white transition-all cursor-pointer"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ─── Candidates Section ───────────────────────────────────────────────────────

function CandidatesSection({ onViewCandidate }: { onViewCandidate: (c: Candidate) => void }) {
  const [filterRole, setFilterRole] = useState("All");
  const [search, setSearch] = useState("");
  const roles = [
    "All",
    "AI / ML Systems Operative",
    "Backend Core & Holotable Engineer",
    "Quantum Data & Telemetry Analyst",
  ];

  const filtered = candidates.filter((c) => {
    if (filterRole !== "All" && c.role !== filterRole) return false;
    if (
      search &&
      !c.code.toLowerCase().includes(search.toLowerCase()) &&
      !c.role.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Candidate Radar</h2>
          <p className="text-xs text-neutral-500 font-sans">
            AI-matched candidates sorted by verified skill proficiency.
          </p>
        </div>
        <button
          onClick={() => marvelAudio.playRepulsorClick()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-3 h-3" /> Filters
        </button>
      </div>

      {/* Role filter + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates or skills..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 placeholder:text-white/30 focus:outline-none focus:border-[#EC1D24] transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setFilterRole(r);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                filterRole === r
                  ? "bg-[#EC1D24]/15 border-[#EC1D24]/40 text-[#EC1D24] font-bold shadow-[0_0_10px_rgba(236,29,36,0.2)]"
                  : "bg-white/5 border-white/10 text-white/45 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <CardWrap className="divide-y divide-white/5">
        {filtered.map((c) => (
          <div key={c.id} className="px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC1D24]/20 to-[#EC1D24]/20 border border-white/10 flex items-center justify-center shrink-0">
              <UserRound className="w-4 h-4 text-[#EC1D24]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-white">{c.code}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-neutral-500 mb-1.5">
                {c.role} · {c.institution}
              </p>
              <div className="flex flex-wrap gap-1">
                {c.verifiedSkills.slice(0, 3).map((s) => (
                  <span
                    key={s.name}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-neutral-300"
                  >
                    {s.verified && <BadgeCheck className="w-2.5 h-2.5 text-[#EC1D24]" />} {s.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-lg font-black text-[#EC1D24] leading-none">{c.match}%</p>
                <p className="text-[10px] text-white/30">match</p>
              </div>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onViewCandidate(c);
                }}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer font-bold"
              >
                Profile
              </button>
              <button
                onClick={() => marvelAudio.playRepulsorClick()}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/10 text-[#FFD700] text-xs hover:bg-[#FFD700] hover:text-black transition-all cursor-pointer font-bold"
              >
                <Star className="w-3 h-3" /> Shortlist
              </button>
            </div>
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ─── Shortlist Section ────────────────────────────────────────────────────────

function ShortlistSection({ onViewCandidate }: { onViewCandidate: (c: Candidate) => void }) {
  const shortlisted = candidates.filter(
    (c) => c.status === "shortlisted" || c.status === "interview" || c.status === "selected"
  );
  const stages = ["Shortlisted", "Technical Interview", "Final Evaluation", "Archived"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Candidate Shortlist</h2>
        <p className="text-xs text-neutral-500 font-sans">
          Top-tier candidates moved forward in the recruitment process.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${
                i === 0
                  ? "bg-[#EC1D24]/15 border-[#EC1D24]/40 text-[#EC1D24] font-bold"
                  : "bg-white/5 border-white/10 text-neutral-500"
              }`}
            >
              {i === 0 ? <Star className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {s}
            </div>
            {i < stages.length - 1 && <ChevronRight className="w-3 h-3 text-white/20" />}
          </div>
        ))}
      </div>

      <CardWrap className="divide-y divide-white/5">
        {shortlisted.map((c) => (
          <div key={c.id} className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <UserRound className="w-4 h-4 text-[#EC1D24]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold text-white">{c.code}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-xs text-neutral-500">
                {c.role} · {c.match}% affinity
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select className="px-2 py-1 bg-black border border-white/10 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-[#EC1D24] cursor-pointer">
                {stages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onViewCandidate(c);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24] hover:text-black font-bold transition-all cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ─── Interviews Section ───────────────────────────────────────────────────────

function InterviewsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Interviews & Schedules</h2>
        <p className="text-xs text-neutral-500 font-sans">
          Scheduled and completed candidate interview sessions.
        </p>
      </div>
      <CardWrap className="divide-y divide-white/5">
        {interviews.map((iv, i) => (
          <div key={i} className="px-5 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EC1D24]/15 border border-[#EC1D24]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(236,29,36,0.2)]">
              <CalendarCheck className="w-5 h-5 text-[#EC1D24]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none mb-1">
                {iv.candidateCode}
              </p>
              <p className="text-xs text-neutral-500 mb-1">
                {iv.role} · {iv.stage}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3 text-[#EC1D24]" />
                <span className="text-neutral-300">{iv.date}</span>
                <StatusBadge status={iv.status} />
              </div>
            </div>
            <button
              onClick={() => marvelAudio.playRepulsorClick()}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[#EC1D24] text-xs font-bold hover:bg-[#EC1D24] hover:text-black transition-all cursor-pointer"
            >
              Join Meeting
            </button>
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ─── Skill Demand Section ─────────────────────────────────────────────────────

function SkillDemandSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Skill Demand Matrix</h2>
        <p className="text-xs text-neutral-500 font-sans">
          Market demand and skill availability across current postings.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CardWrap className="p-5">
          <SectionLabel>In-Demand Skills</SectionLabel>
          <div className="space-y-4">
            {skillDemand.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-white/80">{s.name}</span>
                  <span className="text-[#EC1D24] font-bold">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#EC1D24] to-[#EC1D24]"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardWrap>
        <CardWrap className="p-5">
          <SectionLabel>Student Supply in Talent Network</SectionLabel>
          <div className="space-y-4">
            {[
              { name: "Python", available: 284 },
              { name: "Neural Networks & ML", available: 141 },
              { name: "SQL & Distributed Stores", available: 312 },
              { name: "PyTorch & Deep Learning", available: 89 },
              { name: "Docker & Container Ops", available: 95 },
              { name: "Node.js & Backend", available: 178 },
            ].map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-xs"
              >
                <span className="text-neutral-300">{s.name}</span>
                <span className="text-[#EC1D24] font-semibold">{s.available} verified candidates</span>
              </div>
            ))}
          </div>
        </CardWrap>
      </div>
    </div>
  );
}

// ─── AI Recruiting Home ───────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const quickActions = [
  {
    icon: <Search className="w-4 h-4" />,
    label: "Search Top Candidates",
    prompt: "Scan and rank the strongest candidates for my engineering role.",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Candidate Shortlist",
    prompt: "Show me the top 5 high-match candidates across active job postings.",
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    label: "Draft Job Posting",
    prompt: "Help me create a new job posting for an Edge AI & Systems Engineer.",
  },
  {
    icon: <BadgeCheck className="w-4 h-4" />,
    label: "Skill Audit",
    prompt: "Analyze the skill gaps and strengths of my shortlisted candidates.",
  },
  {
    icon: <Users className="w-4 h-4" />,
    label: "Compare Candidates",
    prompt: "Perform a side-by-side comparison between top shortlisted candidates.",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: "Hiring Pipeline",
    prompt: "Analyze hiring pipeline conversion velocity and application funnel status.",
  },
];

function AiRecruitingSection({ onPostOpportunity }: { onPostOpportunity: () => void }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="w-full h-full bg-cover bg-center flex flex-col items-center overflow-hidden relative"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(236, 29, 36, 0.22) 0%, rgba(10, 11, 16, 0.98) 70%)",
      }}
    >
      {/* Marvel comic collage wallpaper (matches student home) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <img
          src={SECTION_BACKDROP["ai-recruiting"]}
          decoding="async"
          alt=""
          className="w-full h-full object-cover opacity-60 sm:opacity-65 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(10,11,16,0.35)_70%,#0A0B10_100%)]" />
      </div>

      {/* Red horizon arc & atmospheric flare */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 -translate-y-7 sm:-translate-y-8 md:-translate-y-9">
        {/* Soft flare via radial gradient (no blur filter, avoids repaint flicker on hover) */}
        <div className="absolute w-[900px] sm:w-[1250px] h-[420px] sm:h-[540px] rounded-[100%] -translate-y-4 bg-[radial-gradient(ellipse_at_50%_60%,rgba(236,29,36,0.22)_0%,rgba(236,29,36,0.08)_45%,transparent_70%)]" />
        <div
          className="absolute w-[750px] sm:w-[1020px] h-[300px] sm:h-[380px] rounded-[100%] border-t-2 border-[#EC1D24]/80 shadow-[0_-15px_80px_rgba(236,29,36,0.65)]"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(236, 29, 36, 0.35) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)",
            transform: "translateY(24px)",
          }}
        />
      </div>

      <div className="flex-1 w-full min-h-0" />

      {/* Bottom: hero branding + input + quick actions */}
      <div className="relative z-10 w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6 pb-8 sm:pb-14 md:pb-[14vh] shrink-0 mx-auto flex flex-col items-center">
        <div className="text-center relative z-10 -mb-6 sm:-mb-8 md:-mb-10 lg:-mb-11 -translate-y-7 sm:-translate-y-8 md:-translate-y-9 flex flex-col items-center pointer-events-none select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-[#EC1D24]/50 text-[#EC1D24] text-[11px] font-bold mb-2 shadow-[0_0_15px_rgba(236,29,36,0.3)]">
            <ArcReactor className="w-3.5 h-3.5" pulse />
            <span>RECRUITER TALENT CONSOLE</span>
          </div>
          <div className="mb-2 sm:mb-3 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center filter drop-shadow-[0_0_22px_rgba(236,29,36,0.9)]">
            <IronManHelmet3D className="w-full h-full" />
          </div>
          <div className="inline-flex items-stretch select-none my-1 shadow-[0_0_60px_rgba(236,29,36,0.6)] max-w-[94vw] sm:max-w-none">
            <div className="bg-[#EC1D24] text-white font-black italic tracking-tight px-4 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3.5 md:py-4 lg:py-5 text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase flex items-center justify-center font-sans leading-none border-2 sm:border-3 md:border-4 border-[#EC1D24] rounded-[2px] shadow-inner">
              KICKSKILL
            </div>
            <div className="flex flex-col justify-between ml-2 sm:ml-3 md:ml-4 py-0.5 sm:py-1 md:py-1.5 self-stretch">
              <div className="h-[2.5px] sm:h-[3.5px] md:h-[4.5px] lg:h-[5px] bg-white w-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
              <span className="text-white font-black tracking-[0.2em] sm:tracking-[0.25em] text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase px-2.5 sm:px-4 md:px-6 lg:px-7 leading-none flex items-center justify-center font-sans">
                AI
              </span>
              <div className="h-[2.5px] sm:h-[3.5px] md:h-[4.5px] lg:h-[5px] bg-white w-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full bg-[#0A0B10]/75 rounded-2xl border border-white/20 h-[104px] flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] focus-within:border-[#EC1D24]/70 focus-within:shadow-[0_0_35px_rgba(236,29,36,0.35)] transition-colors isolate">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask KickSkill to scout candidates, compare skill proficiencies, or draft job postings..."
            className="w-full flex-1 px-4 pt-3 resize-none border-none bg-transparent text-white text-sm focus:outline-none placeholder:text-neutral-400 font-sans"
            style={{ overflow: "hidden", height: "100%" }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <input ref={fileInputRef} type="file" className="hidden" />
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                fileInputRef.current?.click();
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="p-2 rounded-md text-neutral-400 hover:text-white cursor-pointer group"
            >
              <Paperclip className="w-4 h-4 transition-transform duration-200 group-hover:rotate-[-20deg]" />
            </button>
            <button
              disabled={!message.trim()}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setMessage("");
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className={`p-2 rounded-lg text-white disabled:cursor-not-allowed cursor-pointer group transition-colors duration-200 ${
                message.trim()
                  ? "bg-[#EC1D24] hover:bg-[#ff2b33] shadow-[0_0_15px_rgba(236,29,36,0.5)]"
                  : "bg-white/10 text-white/30"
              }`}
            >
              <ArrowUpIcon className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="relative z-20 flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-4 max-w-full">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setMessage(a.prompt);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/75 text-white text-sm font-semibold hover:border-[#EC1D24]/60 hover:bg-black hover:shadow-[0_0_15px_rgba(236,29,36,0.35)] transition-all cursor-pointer shadow-sm"
            >
              <span className="shrink-0 text-[#EC1D24]">{a.icon}</span>
              <span className="truncate">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Company Profile Section ──────────────────────────────────────────────────

function CompanyProfileSection() {
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Company Information & Preferences</h2>
          <p className="text-xs text-neutral-500 font-sans">
            Visible to matched candidates based on privacy and verification settings.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              setEditing(true);
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24]/20 transition-all cursor-pointer font-bold"
          >
            Edit Profile
          </button>
        )}
      </div>
      <CardWrap className="p-5">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC1D24]/30 via-black to-[#EC1D24]/25 border border-[#EC1D24]/40 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#EC1D24]" />
          </div>
          <div>
            <p className="text-base font-bold text-white">TechVenture AI & Autonomous Labs</p>
            <p className="text-xs text-[#EC1D24] mt-0.5">
              AI Systems & Software · 51–200 Employees
            </p>
          </div>
        </div>
        {[
          { label: "Website", value: "techventure.ai" },
          { label: "Headquarters", value: "Bangalore & San Francisco" },
          { label: "Founded", value: "2024" },
          { label: "Core Division", value: "Autonomous Systems & Edge AI" },
          {
            label: "Mission",
            value:
              "Equipping the next generation of engineers with verified skill passports and AI career acceleration.",
          },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between py-3 border-b border-white/5 last:border-0 text-xs"
          >
            <span className="text-neutral-500 w-32 shrink-0">{row.label}</span>
            {editing ? (
              <input
                defaultValue={row.value}
                className="flex-1 bg-white/5 border border-[#EC1D24]/30 rounded-lg px-2 py-1 text-white/90 focus:outline-none focus:border-[#EC1D24]"
              />
            ) : (
              <span className="flex-1 text-white/80 text-right">{row.value}</span>
            )}
          </div>
        ))}
        {editing && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10 justify-end">
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setEditing(false);
              }}
              className="px-4 py-1.5 rounded-xl text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setEditing(false);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC1D24] text-white text-xs font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        )}
      </CardWrap>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface IndustryPageProps {
  onSwitchWorkspace: () => void;
  onSignOut: () => void;
}


// ─── Recruiter Settings Section ───────────────────────────────────────────────

function RecruiterSettingsSection({
  onSignOut,
  onSwitchWorkspace,
}: {
  onSignOut: () => void;
  onSwitchWorkspace: () => void;
}) {
  const [minMatch, setMinMatch] = useState(80);
  const [autoShortlist, setAutoShortlist] = useState(true);
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    marvelAudio.playVibraniumChime();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Recruiter Console Settings</h2>
          <p className="text-xs text-neutral-400 font-sans">
            Configure candidate qualification thresholds, automated screening rules, and workspace preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EC1D24] text-black text-xs font-bold hover:bg-[#33f3ff] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> {saved ? "Preferences Saved!" : "Save Settings"}
        </button>
      </div>

      <MarvelExperienceSettings />

      {/* Candidate Screening Rules */}
      <CardWrap className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#EC1D24] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Automated Verification Guardrails</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <p className="text-sm font-bold text-white">Minimum Skill Match Threshold</p>
            <p className="text-xs text-neutral-500 font-sans">Only candidates meeting or exceeding this verified score are flagged.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-28 accent-[#EC1D24] cursor-pointer"
            />
            <span className="text-sm font-bold text-[#EC1D24] w-12 text-right">{minMatch}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <p className="text-sm font-bold text-white">Require Cryptographic Skill Proof</p>
            <p className="text-xs text-neutral-500 font-sans">Filter out self-reported claims without platform-verified assessments.</p>
          </div>
          <button
            onClick={() => setAutoShortlist(!autoShortlist)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              autoShortlist
                ? "bg-[#EC1D24]/20 border-[#EC1D24] text-[#EC1D24]"
                : "bg-white/5 border-white/10 text-neutral-500"
            }`}
          >
            {autoShortlist ? "STRICT VERIFICATION" : "STANDARD"}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-bold text-white">Instant Telemetry Notifications</p>
            <p className="text-xs text-neutral-500 font-sans">Receive real-time alerts when top-tier 90%+ candidates apply.</p>
          </div>
          <button
            onClick={() => setNotifyApplications(!notifyApplications)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              notifyApplications
                ? "bg-[#EC1D24]/20 border-[#EC1D24] text-[#EC1D24]"
                : "bg-white/5 border-white/10 text-neutral-500"
            }`}
          >
            {notifyApplications ? "ENABLED" : "MUTED"}
          </button>
        </div>
      </CardWrap>

      {/* Workspace Management */}
      <CardWrap className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4 text-[#EC1D24]" />
          <span>Workspace Actions</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onSwitchWorkspace();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#EC1D24]/40 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24]/20 transition-all cursor-pointer font-bold"
          >
            <ArrowUpRight className="w-4 h-4" /> Switch to Student View
          </button>

          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onSignOut();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#EC1D24]/40 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24] hover:text-white transition-all cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Recruiter Suite
          </button>
        </div>
      </CardWrap>
    </div>
  );
}

export default function IndustryPage({ onSwitchWorkspace, onSignOut }: IndustryPageProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<IndustrySection>("ai-recruiting");
  const [showPostOpportunity, setShowPostOpportunity] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const isHome = activeSection === "ai-recruiting";

  function renderSection() {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardSection
            onSection={setActiveSection}
            onPostOpportunity={() => setShowPostOpportunity(true)}
            onViewCandidate={setSelectedCandidate}
          />
        );
      case "opportunities":
        return (
          <OpportunitiesSection onPostOpportunity={() => setShowPostOpportunity(true)} />
        );
      case "candidates":
        return <CandidatesSection onViewCandidate={setSelectedCandidate} />;
      case "shortlist":
        return <ShortlistSection onViewCandidate={setSelectedCandidate} />;
      case "interviews":
        return <InterviewsSection />;
      case "skill-demand":
        return <SkillDemandSection />;
      case "company-profile":
        return <CompanyProfileSection />;
      case "settings":
        return <RecruiterSettingsSection onSignOut={onSignOut} onSwitchWorkspace={onSwitchWorkspace} />;
      default:
        return (
          <DashboardSection
            onSection={setActiveSection}
            onPostOpportunity={() => setShowPostOpportunity(true)}
            onViewCandidate={setSelectedCandidate}
          />
        );
    }
  }

  return (
    <div className="w-full h-full bg-black text-white overflow-hidden flex relative">
      {/* Background Stark scanlines / grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#EC1D24_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <ComicPageTransition page={`r:${activeSection}`} />

      <IndustrySidebar
        expanded={sidebarExpanded}
        onExpandChange={setSidebarExpanded}
        activeSection={activeSection}
        onSection={setActiveSection}
        onSwitchWorkspace={onSwitchWorkspace}
        onSignOut={onSignOut}
      />

      <div className="relative flex-1 w-full h-full">
        {isHome ? (
          <AiRecruitingSection onPostOpportunity={() => setShowPostOpportunity(true)} />
        ) : (
          <div className="h-full overflow-y-auto overflow-x-hidden relative">
            {/* Stark Tech Comic Panels Backdrop */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                key={activeSection}
                src={SECTION_BACKDROP[activeSection]} decoding="async"
                alt=""
                className="w-full h-full object-cover opacity-40 sm:opacity-50 filter contrast-125 saturate-120"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-black/20 to-[#0d1117]/55" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(13,17,23,0.5)_75%,#0d1117_100%)]" />
              <HeroTint hero={SECTION_TINT[activeSection]} />
            </div>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16 relative z-10">
              {renderSection()}
              <div className="h-12" />
            </div>
          </div>
        )}
      </div>

      {showPostOpportunity && (
        <PostOpportunityDrawer onClose={() => setShowPostOpportunity(false)} />
      )}
      {selectedCandidate && (
        <CandidateDetailDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
