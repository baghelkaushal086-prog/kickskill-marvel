import { useState, useMemo, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CalendarDays,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
  Bot,
  BadgeCheck,
  AlertTriangle,
  Zap,
  TrendingUp,
  Search,
  BookOpen,
  Settings,
  BarChart3,
  FileText,
  MapPin,
  IndianRupee,
  Target,
  Activity,
  Send,
  Eye,
  UserCheck,
  Award,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Shield,
  List,
  XCircle,
} from "lucide-react";
import type { Page } from "../App";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ShieldEagleLogo, ArcReactor } from "../components/marvel/MarvelIcons";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";
import { api, type ApplicationItem } from "../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type AppStatus =
  | "submitted"
  | "resume_viewed"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected";

type AppTab = "all" | "progress" | "interview" | "offer" | "rejected";

const appTabNavItems = [
  { name: "All Applications", icon: List },
  { name: "Under Review", icon: Clock },
  { name: "Interviews", icon: CalendarDays },
  { name: "Offers", icon: CheckCircle2 },
  { name: "Archived", icon: XCircle },
];
const appTabNameToId: Record<string, AppTab> = {
  "All Applications": "all",
  "Under Review": "progress",
  Interviews: "interview",
  Offers: "offer",
  Archived: "rejected",
};
const appTabIdToName: Record<AppTab, string> = {
  all: "All Applications",
  progress: "Under Review",
  interview: "Interviews",
  offer: "Offers",
  rejected: "Archived",
};

const officeImages = [
  "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1575318634028-6a0cfcb60c59?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1498409785966-ab341407de6e?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1700809887584-0798672b1d48?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1496664444929-8c75efb9546f?w=900&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?w=900&h=300&fit=crop&auto=format",
];

interface Application {
  id: number;
  role: string;
  company: string;
  companyInitial: string;
  accentColor: string;
  date: string;
  match: number;
  status: AppStatus;
  rejectedAt?: AppStatus;
  location: string;
  stipend: string;
  jobType: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PIPELINE: { key: AppStatus; label: string }[] = [
  { key: "submitted", label: "Applied" },
  { key: "resume_viewed", label: "Viewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
];

const STATUS_FULL: Record<AppStatus, string> = {
  submitted: "Application Submitted",
  resume_viewed: "Resume Viewed",
  shortlisted: "Shortlisted",
  interview: "Interview Scheduled",
  offer: "Offer Extended",
  rejected: "Archived",
};

const apps: Application[] = [
  {
    id: 1,
    role: "AI & Machine Learning Intern",
    company: "Anthropic / Autonomous Labs",
    companyInitial: "A",
    accentColor: "#00F0FF",
    date: "April 24, 2026",
    match: 94,
    status: "resume_viewed",
    location: "San Francisco / Remote",
    stipend: "₹25,000",
    jobType: "Internship",
  },
  {
    id: 2,
    role: "Frontend Systems Engineer",
    company: "Linear / Design Systems",
    companyInitial: "L",
    accentColor: "#EC1D24",
    date: "April 22, 2026",
    match: 87,
    status: "resume_viewed",
    location: "New York / Hybrid",
    stipend: "₹22,000",
    jobType: "Internship",
  },
  {
    id: 3,
    role: "Data Science & Quantum Fellow",
    company: "DeepMind Quantum Labs",
    companyInitial: "D",
    accentColor: "#FFD700",
    date: "April 20, 2026",
    match: 89,
    status: "submitted",
    location: "London / Remote",
    stipend: "₹20,000",
    jobType: "Fellowship",
  },
  {
    id: 4,
    role: "Backend Infrastructure Intern",
    company: "Stripe Cloud Infrastructure",
    companyInitial: "S",
    accentColor: "#38BDF8",
    date: "April 18, 2026",
    match: 88,
    status: "shortlisted",
    location: "Seattle / Hybrid",
    stipend: "₹26,000",
    jobType: "Internship",
  },
  {
    id: 5,
    role: "Edge ML Systems Intern",
    company: "Perception AI Labs",
    companyInitial: "P",
    accentColor: "#00F0FF",
    date: "April 15, 2026",
    match: 82,
    status: "submitted",
    location: "Remote",
    stipend: "₹18,000",
    jobType: "Internship",
  },
  {
    id: 6,
    role: "Autonomous Logistics Engineer",
    company: "Fleet Logistics Systems",
    companyInitial: "F",
    accentColor: "#EC1D24",
    date: "April 12, 2026",
    match: 86,
    status: "resume_viewed",
    location: "Hybrid",
    stipend: "₹24,000",
    jobType: "Internship",
  },
  // Interviews
  {
    id: 9,
    role: "Deep Neural Systems Fellow",
    company: "AI Research Institute",
    companyInitial: "A",
    accentColor: "#A855F7",
    date: "April 5, 2026",
    match: 93,
    status: "interview",
    location: "Bangalore / Hybrid",
    stipend: "₹30,000",
    jobType: "Internship",
  },
  {
    id: 10,
    role: "Cloud Reliability Intern",
    company: "Datadog Cloud Systems",
    companyInitial: "D",
    accentColor: "#00F0FF",
    date: "April 2, 2026",
    match: 89,
    status: "interview",
    location: "Remote",
    stipend: "₹28,000",
    jobType: "Internship",
  },
  // Offers
  {
    id: 13,
    role: "AI Perception Engineering Intern",
    company: "Autonomous Robotics Lab",
    companyInitial: "A",
    accentColor: "#10b981",
    date: "March 28, 2026",
    match: 94,
    status: "offer",
    location: "San Francisco / Hybrid",
    stipend: "₹35,000",
    jobType: "Internship",
  },
  // Archived
  {
    id: 15,
    role: "Site Reliability Intern",
    company: "Legacy Infra Corp",
    companyInitial: "L",
    accentColor: "#64748b",
    date: "March 20, 2026",
    match: 62,
    status: "rejected",
    rejectedAt: "resume_viewed",
    location: "On-site",
    stipend: "₹14,000",
    jobType: "Internship",
  },
];

const agentLog = [
  { time: "10:42", icon: <Search className="w-3.5 h-3.5" />, action: "Discovered matching role matching your target profile" },
  { time: "10:43", icon: <BrainCircuit className="w-3.5 h-3.5" />, action: "Calculated skill match: 94%" },
  { time: "10:43", icon: <BadgeCheck className="w-3.5 h-3.5" />, action: "Audited against verified Skill Passport" },
  { time: "10:44", icon: <BarChart3 className="w-3.5 h-3.5" />, action: "Validated student constitution guardrails" },
  { time: "10:45", icon: <FileText className="w-3.5 h-3.5" />, action: "Application tailored to role requirements" },
  { time: "10:46", icon: <Send className="w-3.5 h-3.5" />, action: "Application submitted via recruiter integration" },
];

const matchingSkills = [
  { name: "Python", yours: 86, required: 70 },
  { name: "Machine Learning", yours: 74, required: 70 },
  { name: "SQL", yours: 81, required: 60 },
  { name: "FastAPI", yours: 58, required: 50 },
  { name: "NumPy", yours: 77, required: 65 },
];

const gapSkills = [
  { name: "PyTorch", yours: 42, required: 70 },
  { name: "Docker", yours: 35, required: 60 },
];

function pipelineIdx(status: AppStatus): number {
  const keys = PIPELINE.map((p) => p.key);
  return keys.indexOf(status);
}

function getTabFilter(tab: AppTab): (a: Application) => boolean {
  if (tab === "all") return () => true;
  if (tab === "progress") return (a) => ["submitted", "resume_viewed", "shortlisted"].includes(a.status);
  if (tab === "interview") return (a) => a.status === "interview";
  if (tab === "offer") return (a) => a.status === "offer";
  if (tab === "rejected") return (a) => a.status === "rejected";
  return () => true;
}

function CardWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#12131C] to-[#0A0B10] border border-[#EC1D24]/20 rounded-2xl ${className}`}
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

function StatusTimeline({ status, rejected = false }: { status: AppStatus; rejected?: boolean }) {
  const currentIdx = pipelineIdx(status);
  return (
    <div className="flex items-center gap-0 mt-3 font-mono">
      {PIPELINE.map((step, i) => {
        const isDone = !rejected && i < currentIdx;
        const isCurrent = !rejected && i === currentIdx;
        const isFuture = i > currentIdx;
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  isCurrent
                    ? "bg-[#EC1D24] ring-2 ring-[#EC1D24]/50 shadow-[0_0_10px_#EC1D24]"
                    : isDone
                    ? "bg-red-500"
                    : "bg-zinc-700"
                }`}
              />
              <span
                className={`text-[8.5px] uppercase ${
                  isCurrent
                    ? "text-white font-bold"
                    : isDone
                    ? "text-zinc-300"
                    : isFuture
                    ? "text-zinc-600"
                    : "text-zinc-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < PIPELINE.length - 1 && (
              <div
                className={`h-px w-8 sm:w-10 mb-3.5 ${
                  i < currentIdx && !rejected ? "bg-[#EC1D24]/50" : "bg-white/5"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ApplicationCard({
  app,
  onView,
}: {
  app: Application;
  onView: (a: Application) => void;
}) {
  return (
    <CardWrap className="overflow-hidden hover:border-[#EC1D24]/50 hover:shadow-[0_4px_24px_rgba(236,29,36,0.25)] transition-all duration-200 group">
      <div className="p-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-red-300 font-bold uppercase">
                  APPLICATION #{app.id}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {app.match}% MATCH
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-none mb-1 font-sans">{app.role}</h3>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-white font-bold">{app.company}</span>
                <span>·</span>
                <span>{app.jobType}</span>
                <span>·</span>
                <span>{app.location}</span>
              </div>
            </div>
          </div>

          <StatusTimeline
            status={app.status === "rejected" ? app.rejectedAt ?? "submitted" : app.status}
            rejected={app.status === "rejected"}
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#EC1D24]/15 font-mono">
            <div className="flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-amber-400" />
                {app.date}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="w-3 h-3 text-[#EC1D24]" />
                Auto-Matched
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {app.stipend.replace("₹", "")} / mo
              </span>
            </div>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onView(app);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-[#EC1D24]/30 text-xs font-mono text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-all cursor-pointer"
            >
              View Details
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </CardWrap>
  );
}

function DetailDrawer({
  app,
  onClose,
  onNavigate,
}: {
  app: Application;
  onClose: () => void;
  onNavigate: (p: Page) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[500px] h-full bg-[#0E1017] border-l border-[#EC1D24]/30 overflow-y-auto flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#0E1017] border-b border-[#EC1D24]/20 px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldEagleLogo className="w-4 h-4 text-[#EC1D24]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#EC1D24]">
                APPLICATION DETAILS
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-sans">{app.role}</h2>
            <p className="text-xs font-mono text-zinc-400">{app.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <SectionLabel>Application Activity Log</SectionLabel>
            <div className="space-y-0 font-mono">
              {agentLog.map((entry, i) => (
                <div key={i} className="flex gap-3 items-stretch">
                  <div className="flex flex-col items-center w-6 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-[#EC1D24]/15 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 text-[#EC1D24]">
                      {entry.icon}
                    </div>
                    {i < agentLog.length - 1 && <div className="w-px flex-1 mt-1 mb-1 bg-[#EC1D24]/20" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-zinc-300 leading-none mb-0.5">{entry.action}</p>
                    <p className="text-[10px] text-zinc-500">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 p-3.5 rounded-xl bg-black/60 border border-[#EC1D24]/20 font-mono">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Protected by KickSkill Student Career Constitution. KickSkill never fabricates credentials, alters verified assessments, or auto-accepts offers without student consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ApplicationsPageProps {
  onNavigate: (p: Page) => void;
}

export default function ApplicationsPage({ onNavigate }: ApplicationsPageProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>(apps);

  useEffect(() => {
    let active = true;
    api.applications
      .list()
      .then((data) => {
        if (active && data && data.length > 0) {
          setApplications(data as unknown as Application[]);
        }
      })
      .catch((err) => {
        console.warn("Using sample applications:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredApps = useMemo(
    () => applications.filter(getTabFilter(activeTab)),
    [activeTab, applications]
  );

  const stats = {
    total: applications.length,
    progress: applications.filter(getTabFilter("progress")).length,
    interview: applications.filter(getTabFilter("interview")).length,
    offer: applications.filter(getTabFilter("offer")).length,
    rejected: applications.filter(getTabFilter("rejected")).length,
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#0A0B10] relative">
      {/* Black Widow Comic Panels Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/black-widow-comic-bg.jpg" decoding="async"
          alt="Black Widow Comic Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="widow" />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2">
              <img src="/marvel/black-widow-face.svg" alt="Applications" className="w-5 h-5 object-contain" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                KickSkill · Applications
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Applications
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Track live submissions, interview schedules, and received offers.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <InteractiveHoverButton
              text="Browse Opportunities"
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onNavigate("opportunities");
              }}
              className="w-44 text-xs text-white/70 border-[#EC1D24]/30"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
          {[
            { label: "Total Applications", value: stats.total, icon: <Briefcase className="w-3.5 h-3.5" />, accent: "text-zinc-300" },
            { label: "Under Review", value: stats.progress, icon: <Clock className="w-3.5 h-3.5" />, accent: "text-[#EC1D24]" },
            { label: "Interviews", value: stats.interview, icon: <CalendarDays className="w-3.5 h-3.5" />, accent: "text-amber-400" },
            { label: "Offers", value: stats.offer, icon: <CheckCircle2 className="w-3.5 h-3.5" />, accent: "text-emerald-400" },
            { label: "Archived", value: stats.rejected, icon: <Circle className="w-3.5 h-3.5" />, accent: "text-zinc-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0E1017] border border-[#EC1D24]/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <span className={s.accent}>{s.icon}</span>
              <div>
                <p className={`text-lg font-black italic leading-none ${s.accent}`}>{s.value}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide font-sans">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 pt-8">
          <AnimeNavBar
            items={appTabNavItems}
            activeTab={appTabIdToName[activeTab]}
            mascotImage="/marvel/black-widow-face.svg"
            mascotAlt="Black Widow"
            onTabChange={(name) => {
              marvelAudio.playRepulsorClick();
              setActiveTab(appTabNameToId[name]);
            }}
          />
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <ApplicationCard key={app.id} app={app} onView={setSelectedApp} />
          ))}
        </div>

        <div className="h-12" />
      </div>

      {selectedApp && (
        <DetailDrawer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
