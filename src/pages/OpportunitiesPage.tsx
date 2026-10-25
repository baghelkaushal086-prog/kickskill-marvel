import { useState, useCallback, useEffect } from "react";
import {
  Sparkles,
  Bot,
  MapPin,
  Briefcase,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Send,
  Bookmark,
  MessageSquare,
  RotateCcw,
  ChevronRight,
  Target,
  Zap,
  GraduationCap,
  FolderKanban,
  Shield,
} from "lucide-react";
import { GooeySearch } from "@/components/ui/gooey-search";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { OpportunityCardStack } from "@/components/ui/opportunity-card-stack";
import { ShieldEagleLogo, ArcReactor, AvengersLogo } from "../components/marvel/MarvelIcons";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";
import { triggerComicWord, triggerShieldSuccess } from "../components/marvel/MarvelCelebrations";
import { HeroTint } from "../components/marvel/HeroTint";
import { api, type OpportunityItem } from "../lib/api";

type Tab = "Recommended" | "Internships" | "Jobs" | "Projects";

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
  responsibilities: string[];
  eligibility: string;
  deadline: string;
  whyMatch: string;
  directiveCode?: string;
}

const allOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "AI & Machine Learning Intern",
    company: "Anthropic / Autonomous Labs",
    location: "San Francisco / Remote",
    mode: "Internship",
    match: 94,
    skills: ["Python", "Machine Learning", "SQL", "PyTorch"],
    skillGap: ["Docker"],
    about:
      "Join our core AI team to build high-efficiency data pipelines, evaluate edge neural models, and optimize deployment workflows.",
    responsibilities: [
      "Train and evaluate neural models on benchmark datasets",
      "Interface data pipelines with distributed storage systems",
      "Collaborate directly with senior ML systems engineers",
      "Conduct reproducible latency and accuracy benchmarks",
    ],
    eligibility:
      "Final-year students or recent graduates in Computer Science, AI, or related fields.",
    deadline: "April 30, 2026",
    whyMatch:
      "Your verified Python and Machine Learning scores closely align with core requirements. Closing your Docker gap will reach 98% match.",
  },
  {
    id: 2,
    title: "Frontend Systems Engineer",
    company: "Linear / Design Systems",
    location: "New York / Hybrid",
    mode: "Full-time",
    match: 86,
    skills: ["React", "TypeScript", "CSS", "Node.js"],
    skillGap: ["GraphQL", "Testing"],
    about:
      "Engineer fluid, high-performance web user interfaces for mission-critical collaboration and project management systems.",
    responsibilities: [
      "Develop reusable component libraries with 60fps micro-interactions",
      "Optimize web render cycles and Core Web Vitals",
      "Collaborate closely with product designers",
      "Maintain 95%+ unit test coverage for core workflows",
    ],
    eligibility: "1+ years of demonstrated excellence in modern React and TypeScript frontend engineering.",
    deadline: "May 15, 2026",
    whyMatch:
      "Your React and TypeScript proficiency are rated top-tier. Adding GraphQL fluency will secure top priority for this posting.",
  },
  {
    id: 3,
    title: "Data Science & Quantum Computing Fellow",
    company: "DeepMind Quantum Labs",
    location: "London / Remote",
    mode: "Project",
    match: 89,
    skills: ["Python", "Pandas", "Visualization", "Statistics"],
    skillGap: [],
    about:
      "Analyze experimental simulation datasets and statistical models. Research credits and co-authorship opportunities provided.",
    responsibilities: [
      "Clean and model multi-dimensional simulation datasets",
      "Construct interactive 3D data visualizations",
      "Synthesize experimental findings into concise technical reports",
      "Present discoveries to lead research investigators",
    ],
    eligibility: "Open to enrolled engineering students and early-career researchers.",
    deadline: "May 30, 2026",
    whyMatch:
      "All required competencies perfectly match your verified Skill Passport. Ideal for earning published credentials.",
  },
  {
    id: 4,
    title: "High-Throughput Backend Intern",
    company: "Stripe Cloud Infrastructure",
    location: "Seattle / Hybrid",
    mode: "Internship",
    match: 76,
    skills: ["Node.js", "PostgreSQL", "REST APIs", "Docker"],
    skillGap: ["Kubernetes", "Redis"],
    about:
      "Build high-reliability distributed services and real-time event systems powering global transactional workflows.",
    responsibilities: [
      "Architect and test resilient REST & WebSocket endpoints",
      "Optimize PostgreSQL query throughput and indexing",
      "Deploy containerized microservices across hybrid clusters",
      "Participate in asynchronous architecture reviews",
    ],
    eligibility: "3rd or 4th year undergraduate engineering students.",
    deadline: "April 25, 2026",
    whyMatch:
      "Your Node.js and SQL competencies are strong. Expanding into Redis caching and Kubernetes orchestration will lift you to 90%+ match.",
  },
  {
    id: 5,
    title: "Technical Product Analyst",
    company: "Figma Platform Operations",
    location: "San Francisco / Remote",
    mode: "Internship",
    match: 71,
    skills: ["Product Thinking", "Analytics", "User Research", "Figma"],
    skillGap: ["SQL", "A/B Testing"],
    about:
      "Shape product workflows by analyzing engagement metrics, conducting user interviews, and collaborating with cross-functional teams.",
    responsibilities: [
      "Conduct user interviews and distill functional specifications",
      "Write structured user stories with verifiable acceptance criteria",
      "Monitor product funnels and engagement metrics",
      "Coordinate sprints across design and engineering teams",
    ],
    eligibility: "Students in engineering, business, or design with sharp analytical acumen.",
    deadline: "May 10, 2026",
    whyMatch:
      "Your design and product thinking foundation is solid. Completing our SQL assessment will qualify you immediately.",
  },
  {
    id: 6,
    title: "Cloud & Site Reliability Engineer",
    company: "Datadog Systems",
    location: "New York / Remote",
    mode: "Full-time",
    match: 65,
    skills: ["Docker", "Linux", "CI/CD", "AWS"],
    skillGap: ["Terraform", "Kubernetes", "Monitoring"],
    about:
      "Maintain high availability for multi-region cloud clusters, automate deployment pipelines, and configure proactive monitoring.",
    responsibilities: [
      "Manage multi-zone cloud infrastructure and security policies",
      "Automate zero-downtime CI/CD deployment pipelines",
      "Monitor system telemetry and execute automated remediation",
      "Harden system configurations against vulnerabilities",
    ],
    eligibility: "Demonstrated hands-on experience with Linux and cloud infrastructure tooling.",
    deadline: "June 1, 2026",
    whyMatch:
      "You hold foundational Docker and Linux verifications. Complete the Kubernetes learning track to unlock this placement.",
  },
];

const tabNavItems = [
  { name: "Recommended", icon: Sparkles },
  { name: "Internships", icon: GraduationCap },
  { name: "Jobs", icon: Briefcase },
  { name: "Projects", icon: FolderKanban },
];

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback((q: string) => {
    marvelAudio.playRepulsorClick();
    setSearchQuery(q);
  }, []);

  const suggestions = allOpportunities.flatMap((o) => [o.title, o.company, ...o.skills]);

  const handleGooeySearch = useCallback(
    (q: string): string[] => {
      setSearchQuery(q);
      const lower = q.toLowerCase();
      return [...new Set(suggestions.filter((s) => s.toLowerCase().includes(lower)))];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [showApply, setShowApply] = useState<Opportunity | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(allOpportunities);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let active = true;
    api.opportunities
      .list()
      .then((data) => {
        if (active && data && data.length > 0) {
          setOpportunities(data as Opportunity[]);
        }
      })
      .catch((err) => {
        console.warn("Using local opportunities:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = opportunities.filter((o) => {
    const matchesTab =
      activeTab === "Recommended" ||
      (activeTab === "Internships" && o.mode === "Internship") ||
      (activeTab === "Jobs" && o.mode === "Full-time") ||
      (activeTab === "Projects" && o.mode === "Project");
    const matchesSearch =
      !searchQuery ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative h-full flex flex-col bg-[#0A0B10] text-white overflow-hidden">
      {/* Spider-Man Comic Panels Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/spiderman-comic-bg.jpg" decoding="async"
          alt="Spider-Man Comic Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="spiderman" />
      </div>

      {/* Marvel Red Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-[#EC1D24]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative shrink-0 px-4 pt-4 sm:px-8 sm:pt-8 pb-5 border-b border-[#EC1D24]/20 pl-16 sm:pl-16 bg-black/40">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <img src="/marvel/spiderman-face.svg" alt="Opportunities" className="w-4 h-4 object-contain drop-shadow-[0_1px_4px_rgba(236,29,36,0.5)]" />
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            KickSkill · Opportunities
          </p>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
          Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Opportunities tailored to your verified skills and target career goals.
        </p>

        {/* Search */}
        <div className="ks-search-wrap flex items-center gap-3">
          <GooeySearch
            onSearch={handleGooeySearch}
            placeholder="Search roles, organizations, skills..."
            buttonLabel="Search"
            onSelect={handleSearch}
            debounceMs={300}
            maxResults={5}
            onFilterToggle={() => {
              marvelAudio.playRepulsorClick();
              setShowFilters((v) => !v);
            }}
            filterActive={showFilters}
          />
        </div>

        {/* Filter tabs */}
        <div className="pt-10">
          <AnimeNavBar
            items={tabNavItems}
            activeTab={activeTab}
            mascotImage="/marvel/spiderman-face.svg"
            mascotAlt="Spider-Man"
            onTabChange={(name) => {
              marvelAudio.playRepulsorClick();
              setActiveTab(name as Tab);
            }}
          />
        </div>
      </div>

      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="px-4 sm:px-8 py-5">
          {/* Match header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-black/60 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(236,29,36,0.25)]">
                <img src="/marvel/spiderman-face.svg" alt="Spider-Man" className="w-5 h-5 object-contain drop-shadow-[0_2px_4px_rgba(236,29,36,0.6)]" />
              </div>
              <span className="text-sm font-semibold text-white">
                Matched Opportunities
              </span>
              <span className="text-xs text-neutral-400">
                · Verified against your Skill Passport
              </span>
            </div>
            <span className="text-xs font-semibold text-neutral-300">
              {filtered.length} AVAILABLE
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Target className="w-10 h-10 text-zinc-700 mb-4" />
              <p className="text-zinc-300 text-sm font-bold mb-1">
                No matching opportunities found.
              </p>
              <p className="text-zinc-500 text-xs mb-5 font-mono max-w-sm">
                Try adjusting your search filters or practice new skills to unlock more opportunities.
              </p>
            </div>
          ) : (
            <OpportunityCardStack
              opportunities={filtered}
              onApply={(opp) => {
                marvelAudio.playRepulsorClick();
                setShowApply(opp);
              }}
            />
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <>
          <div
            className="absolute inset-0 z-20 bg-black/60"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 z-30 bg-[#0E1017] border-l border-[#EC1D24]/30 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EC1D24]/20">
              <span className="text-sm font-black italic uppercase text-white">
                Filters
              </span>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-[#EC1D24] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {[
                "Target Role",
                "Skills",
                "Location",
                "Employment Type",
                "Experience Level",
                "Compensation",
              ].map((f) => (
                <div key={f}>
                  <p className="text-[10px] font-mono text-[#EC1D24] uppercase tracking-widest mb-1.5">
                    {f}
                  </p>
                  <input
                    placeholder={`Filter by ${f.toLowerCase()}...`}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#EC1D24]/25 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#EC1D24] transition-colors font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="shrink-0 px-5 py-4 border-t border-[#EC1D24]/20 flex gap-2">
              <button
                onClick={() => marvelAudio.playRepulsorClick()}
                className="flex-1 py-2 rounded-xl border border-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setShowFilters(false);
                }}
                className="flex-1 py-2 rounded-xl border border-yellow-400/50 bg-[#EC1D24] text-xs font-mono font-bold text-white hover:bg-red-600 transition-colors cursor-pointer shadow-[0_0_12px_rgba(236,29,36,0.3)]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Application Overview Modal */}
      {showApply && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EC1D24]/20 bg-black/40">
              <div className="flex items-center gap-2.5">
                <ShieldEagleLogo className="w-5 h-5 text-[#EC1D24]" />
                <div>
                  <h2 className="text-sm font-black italic uppercase text-white">
                    Application Overview
                  </h2>
                  <p className="text-xs font-mono text-[#EC1D24]">
                    {showApply.title} · {showApply.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApply(null)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3 font-mono text-xs">
              {[
                { label: "Profile Match", value: `${showApply.match - 3}%`, ok: showApply.match > 75 },
                { label: "Skill Match", value: `${showApply.match}%`, ok: showApply.match > 70 },
                { label: "Eligibility", value: "Verified & Eligible", ok: true },
                {
                  label: "Skill Gaps",
                  value: showApply.skillGap.length === 0 ? "Zero Gaps" : showApply.skillGap.join(", "),
                  ok: showApply.skillGap.length === 0,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#EC1D24]/15 last:border-0">
                  <span className="text-zinc-400">{row.label}</span>
                  <span className={`font-bold ${row.ok ? "text-[#EC1D24]" : "text-amber-400"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setShowApply(null);
                }}
                className="w-full py-2.5 rounded-xl border border-[#EC1D24]/40 bg-black/60 text-xs font-mono text-white hover:bg-[#EC1D24]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View Full Details
              </button>
              <button
                disabled={isApplying}
                onClick={async (e) => {
                  marvelAudio.playRepulsorClick();
                  marvelAudio.playVibraniumChime();
                  triggerComicWord(e.clientX, e.clientY, "THWIP!");
                  triggerShieldSuccess("Application Sent to SQLite!");
                  if (showApply) {
                    setIsApplying(true);
                    try {
                      await api.applications.apply(showApply.id);
                    } catch (err) {
                      console.warn("Could not save application to SQLite:", err);
                    } finally {
                      setIsApplying(false);
                    }
                  }
                  setShowApply(null);
                }}
                className="w-full py-2.5 rounded-xl border border-yellow-400 bg-[#EC1D24] hover:bg-red-600 disabled:opacity-50 text-xs font-mono font-bold text-white uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(236,29,36,0.5)] flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                {isApplying ? "Dispatching..." : "Submit Application"}
              </button>
              <p className="text-[10px] text-zinc-500 text-center font-mono">
                Your verified skills and credentials from your Skill Passport will be shared with the recruiter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
