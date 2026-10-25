import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  BookOpen,
  Route,
  Sparkles,
  FolderKanban,
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Search,
  TrendingUp,
  Zap,
  Target,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { MovingBorderBox } from "@/components/ui/moving-border";
import { ShieldEagleLogo, ArcReactor } from "../components/marvel/MarvelIcons";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";
import { CourseDetailModal, type CourseDetail } from "../components/learning/CourseDetailModal";
import { ProjectDetailModal, type ProjectDetail } from "../components/learning/ProjectDetailModal";
import { api, type RoadmapData, type RoadmapStep } from "../lib/api";

const learningNavItems = [
  { name: "Recommended", icon: Sparkles },
  { name: "Roadmaps", icon: Route },
  { name: "Courses", icon: BookOpen },
  { name: "Projects", icon: FolderKanban },
];
const learningNameToId: Record<string, LearningTab> = {
  "Recommended": "foryou",
  "Roadmaps": "roadmaps",
  "Courses": "courses",
  "Projects": "projects",
};
const learningIdToName: Record<LearningTab, string> = {
  foryou: "Recommended",
  roadmaps: "Roadmaps",
  courses: "Courses",
  projects: "Projects",
};

type LearningTab = "foryou" | "roadmaps" | "courses" | "projects";

const COURSE_FILTERS = ["All", "AI/ML", "Development", "Data", "Cloud", "Cybersecurity", "Soft Skills"];

const recommendations = [
  {
    id: 1,
    title: "PyTorch Deep Learning Fundamentals",
    type: "course",
    skillGap: "PyTorch",
    current: 42,
    target: 70,
    progress: 32,
    impact: "Mastering PyTorch unlocks 12 additional AI/ML engineer roles.",
    impactCount: "+12 roles",
    cta: "Resume Course",
    started: true,
    accentColor: "#00F0FF",
  },
  {
    id: 2,
    title: "Docker & Container Fundamentals",
    type: "course",
    skillGap: "Docker",
    current: 35,
    target: 65,
    progress: 0,
    impact: "Containerization is required across 68% of backend engineering roles.",
    impactCount: "+8 roles",
    cta: "Start Course",
    started: false,
    accentColor: "#EC1D24",
  },
  {
    id: 3,
    title: "Build an Autonomous NLP Sentiment Analyzer",
    type: "project",
    skillGap: null,
    current: null,
    target: null,
    progress: 0,
    skills: ["Python", "NLP", "Machine Learning"],
    impact: "A deployed production project increases recruiter engagement by 3×.",
    impactCount: "+6 roles",
    cta: "Start Project",
    started: false,
    accentColor: "#FFD700",
  },
  {
    id: 4,
    title: "AWS Cloud Infrastructure & Deployment",
    type: "course",
    skillGap: "AWS",
    current: 28,
    target: 60,
    progress: 0,
    impact: "Cloud architecture knowledge is essential for scalable production systems.",
    impactCount: "+9 roles",
    cta: "Start Course",
    started: false,
    accentColor: "#38BDF8",
  },
];

const roadmapStages = [
  { num: "01", title: "Python & Algorithmic Core", status: "completed" },
  { num: "02", title: "Mathematical ML Foundations", status: "completed" },
  { num: "03", title: "PyTorch Deep Learning", status: "inprogress" },
  { num: "04", title: "NLP & Transformer Architectures", status: "upcoming" },
  { num: "05", title: "Docker & Container Deployment", status: "upcoming" },
  { num: "06", title: "Production ML Systems Deployment", status: "upcoming" },
];

const courses = [
  { title: "Machine Learning with Python", provider: "Coursera", skill: "Machine Learning", difficulty: "Intermediate", duration: "6 weeks", progress: 68, relevance: "High", category: "AI/ML" },
  { title: "Docker Fundamentals for Modern Systems", provider: "Udemy", skill: "Docker", difficulty: "Beginner", duration: "3 weeks", progress: 0, relevance: "High", category: "Development" },
  { title: "AWS Cloud Practitioner", provider: "AWS Training", skill: "AWS", difficulty: "Beginner", duration: "4 weeks", progress: 0, relevance: "High", category: "Cloud" },
  { title: "Deep Learning Specialization", provider: "deeplearning.ai", skill: "PyTorch", difficulty: "Advanced", duration: "10 weeks", progress: 22, relevance: "High", category: "AI/ML" },
  { title: "NLP with Transformers", provider: "Hugging Face", skill: "NLP", difficulty: "Intermediate", duration: "5 weeks", progress: 0, relevance: "Medium", category: "AI/ML" },
  { title: "FastAPI in Production", provider: "TestDriven.io", skill: "FastAPI", difficulty: "Intermediate", duration: "2 weeks", progress: 0, relevance: "Medium", category: "Development" },
];

const projects = [
  {
    title: "Real-Time NLP Sentiment Analyzer",
    desc: "Build a production-ready REST API classifying user text feedback with sub-50ms latency.",
    skills: ["Python", "NLP", "FastAPI", "Docker"],
    difficulty: "Intermediate",
    impact: "High",
    duration: "2-3 weeks",
    color: "#00F0FF",
  },
  {
    title: "Deploy an Edge ML Model to AWS",
    desc: "Package a trained PyTorch model in Docker and orchestrate serverless inference endpoints via AWS Lambda.",
    skills: ["PyTorch", "Docker", "AWS"],
    difficulty: "Intermediate",
    impact: "High",
    duration: "1-2 weeks",
    color: "#EC1D24",
  },
  {
    title: "Real-Time Computer Vision Pipeline",
    desc: "Build a computer vision model with YOLOv8 and a responsive React streaming frontend.",
    skills: ["Python", "PyTorch", "React", "WebSockets"],
    difficulty: "Advanced",
    impact: "High",
    duration: "3-4 weeks",
    color: "#FFD700",
  },
  {
    title: "Distributed Data Mesh with Airflow",
    desc: "Orchestrate resilient multi-step ETL pipelines feeding live AI models in production.",
    skills: ["Python", "Airflow", "SQL", "Docker"],
    difficulty: "Advanced",
    impact: "Medium",
    duration: "2-3 weeks",
    color: "#38BDF8",
  },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <MovingBorderBox
      as="span"
      borderRadius="0.375rem"
      containerClassName="inline-flex"
      duration={2500}
      className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-white border border-[#EC1D24]/40"
    >
      {difficulty}
    </MovingBorderBox>
  );
}

function SkillTag({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded bg-black/60 border border-[#EC1D24]/25 text-[10px] font-mono text-zinc-200">
      {label}
    </span>
  );
}

function ProgressBar({ value, color = "#EC1D24" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-black/60 border border-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 shadow-[0_0_10px_#EC1D24]"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function RecommendationsGrid({
  onOpenCourse,
  onOpenProject,
}: {
  onOpenCourse: (c: CourseDetail) => void;
  onOpenProject: (p: ProjectDetail) => void;
}) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const rows = useMemo(() => {
    const out: (typeof recommendations[number])[][] = [];
    for (let i = 0; i < recommendations.length; i += 2) {
      out.push(recommendations.slice(i, i + 2));
    }
    return out;
  }, []);

  return (
    <div className="relative w-full border border-[#EC1D24]/25 rounded-2xl overflow-hidden bg-[#0E1017]">
      {rows.map((row, r) => (
        <div
          key={r}
          className={`flex flex-col sm:flex-row ${
            r < rows.length - 1 ? "border-b border-[#EC1D24]/20" : ""
          }`}
        >
          {row.map((rec, c) => {
            const globalIdx = r * 2 + c;
            const isActive = activeIdx === globalIdx;
            return (
              <div
                key={rec.id}
                onMouseEnter={() => {
                  marvelAudio.playHudHover();
                  setActiveIdx(globalIdx);
                }}
                className={`relative flex-1 p-6 transition-all duration-200 ${
                  c < row.length - 1 ? "sm:border-r border-b sm:border-b-0 border-[#EC1D24]/20" : ""
                } ${isActive ? "bg-[#EC1D24]/[0.05]" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#EC1D24]">
                    [ {rec.type === "project" ? "Project" : "Course"} ]
                  </span>
                  {rec.impactCount && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-[#EC1D24]/40 bg-[#EC1D24]/15 text-red-300">
                      <TrendingUp className="w-3 h-3 text-[#EC1D24]" />
                      {rec.impactCount}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-3 font-sans">
                  {rec.title}
                </h3>

                {rec.type !== "project" && rec.skillGap && (
                  <div className="flex items-center gap-5 mb-4 font-mono text-xs">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5">
                        Skill Gap
                      </p>
                      <p className="text-zinc-300 font-bold">{rec.skillGap}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5">
                        Current
                      </p>
                      <p className="text-red-400 font-bold">{rec.current}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5">
                        Target
                      </p>
                      <p className="text-amber-400 font-bold">{rec.target}%</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-mono">
                  {rec.impact}
                </p>

                {rec.started && rec.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5 font-mono text-xs">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500">
                        Progress
                      </span>
                      <span className="text-red-400 font-bold">{rec.progress}%</span>
                    </div>
                    <ProgressBar value={rec.progress} color="#EC1D24" />
                  </div>
                )}

                <button
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    if (rec.type === "project") {
                      onOpenProject({
                        title: rec.title,
                        desc: rec.impact,
                        skills: rec.skills || ["Python", "NLP", "Machine Learning"],
                        difficulty: "Intermediate",
                        impact: "High",
                        duration: "2-3 weeks",
                      });
                    } else {
                      onOpenCourse({
                        title: rec.title,
                        provider: "KickSkill Academy",
                        category: "AI/ML",
                        skill: rec.skillGap || "Deep Learning",
                        difficulty: "Intermediate",
                        duration: "4 weeks",
                        progress: rec.progress,
                      });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-[#EC1D24]/30 bg-black/60 text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-all cursor-pointer shadow-[0_0_12px_rgba(236,29,36,0.2)]"
                >
                  {rec.started ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
                  {rec.cta}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ForYouTab({
  onOpenCourse,
  onOpenProject,
}: {
  onOpenCourse: (c: CourseDetail) => void;
  onOpenProject: (p: ProjectDetail) => void;
}) {
  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-black/60 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(236,29,36,0.3)]">
            <img src="/marvel/hulk-face.svg" alt="Hulk" className="w-7 h-7 object-contain drop-shadow-[0_2px_6px_rgba(236,29,36,0.5)]" />
          </div>
          <div>
            <h2 className="text-lg font-black italic uppercase text-white">
              Recommended Learning Tracks
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Curated courses and projects to close skill gaps and improve job match rates.
            </p>
          </div>
        </div>
        <RecommendationsGrid onOpenCourse={onOpenCourse} onOpenProject={onOpenProject} />
      </section>

      {/* AI Learning Recommendation */}
      <section>
        <div className="relative bg-gradient-to-br from-[#12131C] to-[#0A0B10] border border-[#EC1D24]/30 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <ArcReactor className="w-5 h-5 text-[#EC1D24]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#EC1D24]">
                AI LEARNING ANALYSIS
              </span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed mb-2 font-sans font-medium">
              Based on your career goals,{" "}
              <span className="text-red-400 font-bold">
                PyTorch is currently your highest-yield skill gap.
              </span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5 font-mono">
              The roles you are targeting require at least 70% proficiency in PyTorch (currently 42%). Completing this recommended track will lift your profile match from 74% to 94%.
            </p>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onOpenCourse({
                  title: "PyTorch Deep Learning Fundamentals",
                  provider: "deeplearning.ai",
                  category: "AI/ML",
                  skill: "PyTorch",
                  difficulty: "Advanced",
                  duration: "4 weeks",
                  progress: 42,
                });
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EC1D24] border border-yellow-400/60 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,29,36,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Start Learning Track
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoadmapsTab() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [targetRole, setTargetRole] = useState("AI / ML Systems Engineer");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [progress] = useState(42);

  const fetchRoadmap = useCallback(async () => {
    try {
      const data = await api.roadmap.getMe();
      if (data && data.steps && data.steps.length > 0) {
        setRoadmap(data);
        if (data.target_role) setTargetRole(data.target_role);
      }
    } catch {
      // Use default fallback if none saved yet
    }
  }, []);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  async function handleRegenerate() {
    marvelAudio.playRepulsorClick();
    setIsRegenerating(true);
    try {
      const updated = await api.roadmap.generate({ target_role: targetRole });
      setRoadmap(updated);
      marvelAudio.playVibraniumChime();
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setIsRegenerating(false);
    }
  }

  const displayStages = roadmap?.steps?.length
    ? roadmap.steps.map((step, idx) => ({
        num: String(idx + 1).padStart(2, "0"),
        title: step.title,
        desc: step.description,
        skills: step.skills || [],
        duration: step.duration_weeks ? `${step.duration_weeks} weeks` : "3 weeks",
        status: idx === 0 ? "completed" : idx === 1 ? "inprogress" : "upcoming",
      }))
    : roadmapStages.map((s, idx) => ({
        ...s,
        desc: "Core competencies and practical milestones required for industry readiness.",
        skills: idx === 0 ? ["Python", "Algorithms"] : idx === 1 ? ["Math", "Statistics"] : idx === 2 ? ["PyTorch", "Deep Learning"] : ["Docker", "APIs"],
        duration: "3-4 weeks",
      }));

  return (
    <div className="max-w-3xl">
      <div className="bg-[#0E1017] border border-[#EC1D24]/30 rounded-2xl p-6 mb-6 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC1D24] animate-pulse" />
              <p className="text-[10px] font-mono text-[#EC1D24] uppercase tracking-wider font-bold">
                Tactical AI Career Roadmap
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white font-sans">
              {targetRole}
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Powered by Stark Career Intelligence & Groq AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 hover:border-yellow-400/60 hover:bg-[#EC1D24]/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Synthesizing..." : "Regenerate AI"}
            </button>
            <div className="text-right pl-3 border-l border-white/10">
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
                Readiness
              </p>
              <p className="text-2xl sm:text-3xl font-black italic font-mono text-[#EC1D24]">
                {progress}%
              </p>
            </div>
          </div>
        </div>
        <ProgressBar value={progress} color="#EC1D24" />
      </div>

      <div className="relative space-y-0">
        {displayStages.map((stage, i) => {
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "inprogress";
          const isLast = i === displayStages.length - 1;

          return (
            <div key={stage.num} className="relative flex gap-4 sm:gap-5">
              {!isLast && (
                <div
                  className="absolute left-[19px] top-[40px] bottom-0 w-px"
                  style={{
                    background: isCompleted ? "rgba(236,29,36,0.6)" : "rgba(255,255,255,0.08)",
                  }}
                />
              )}

              <div
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 mt-3 transition-all"
                style={{
                  background: isCompleted
                    ? "rgba(236,29,36,0.2)"
                    : isInProgress
                    ? "rgba(255,215,0,0.15)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: isCompleted
                    ? "#EC1D24"
                    : isInProgress
                    ? "#FFD700"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#EC1D24]" />
                ) : isInProgress ? (
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-600" />
                )}
              </div>

              <div
                className={`flex-1 py-4 border-b transition-all ${
                  isLast ? "border-transparent" : "border-[#EC1D24]/15"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">
                        STAGE {stage.num}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        · {stage.duration}
                      </span>
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold font-sans ${
                        isCompleted
                          ? "text-zinc-400 line-through"
                          : isInProgress
                          ? "text-white"
                          : "text-zinc-300"
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono leading-relaxed">
                      {stage.desc}
                    </p>

                    {stage.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {stage.skills.map((sk: string) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-cyan-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span
                    className={`shrink-0 text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold uppercase tracking-wider ${
                      isCompleted
                        ? "bg-[#EC1D24]/20 border-[#EC1D24]/40 text-red-300"
                        : isInProgress
                        ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                        : "bg-black/40 border-white/5 text-zinc-600"
                    }`}
                  >
                    {isCompleted ? "Verified" : isInProgress ? "Active Track" : "Locked"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoursesTab({ onOpenCourse }: { onOpenCourse: (c: CourseDetail) => void }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = courses.filter((c) => {
    const matchesFilter = activeFilter === "All" || c.category === activeFilter;
    const matchesSearch =
      search === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skill.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EC1D24] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses & tutorials..."
            className="w-full bg-black/60 border border-[#EC1D24]/25 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#EC1D24] font-mono transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COURSE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setActiveFilter(f);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                activeFilter === f
                  ? "bg-[#EC1D24] border-yellow-400/80 text-white shadow-[0_0_12px_rgba(236,29,36,0.35)]"
                  : "bg-black/60 border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.title}
            className="bg-[#0E1017] border border-[#EC1D24]/20 rounded-2xl p-5 hover:border-[#EC1D24]/50 hover:shadow-[0_0_20px_rgba(236,29,36,0.2)] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-mono text-[#EC1D24] uppercase tracking-wider mb-1">
                  {c.provider}
                </p>
                <h3 className="text-sm font-bold text-white font-sans">{c.title}</h3>
              </div>
              <span className="shrink-0 ml-3 text-[10px] px-2 py-0.5 rounded-md border font-mono font-bold uppercase bg-red-950/40 border-[#EC1D24]/30 text-red-300">
                {c.relevance} Match
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <DifficultyBadge difficulty={c.difficulty} />
              <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                <Clock className="w-3 h-3 text-amber-400" />
                {c.duration}
              </span>
              <SkillTag label={c.skill} />
            </div>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onOpenCourse(c);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-[#EC1D24]/30 bg-black/60 text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-all cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              View & Start Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ onOpenProject }: { onOpenProject: (p: ProjectDetail) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-black/60 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(236,29,36,0.3)]">
          <img src="/marvel/spiderman-face.svg" alt="Spider-Man" className="w-6 h-6 object-contain drop-shadow-[0_2px_4px_rgba(236,29,36,0.6)]" />
        </div>
        <div>
          <h2 className="text-xl font-black italic uppercase text-white">
            Hands-on Projects & Labs
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Build practical portfolio projects to demonstrate verified proficiency.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.title}
            className="group relative bg-[#0E1017] border border-[#EC1D24]/25 rounded-2xl p-5 hover:border-[#EC1D24]/60 hover:shadow-[0_0_25px_rgba(236,29,36,0.2)] transition-all duration-200 overflow-hidden"
          >
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-bold text-white pr-2 font-sans">{p.title}</h3>
                <span className="shrink-0 text-[10px] px-2.5 py-1 rounded-lg border font-mono font-bold uppercase bg-[#EC1D24]/15 border-[#EC1D24]/40 text-red-300">
                  {p.impact} Impact
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-mono">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onOpenProject(p);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-yellow-400/50 bg-[#EC1D24] hover:bg-red-600 text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(236,29,36,0.3)]"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                View & Start Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<LearningTab>("foryou");
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#0A0B10] relative">
      {/* Hulk Comic Panels Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/hulk-comic-bg.jpg" decoding="async"
          alt="Hulk Comic Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="hulk" />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-2">
              <img src="/marvel/hulk-face.svg" alt="Hulk" className="w-4 h-4 object-contain" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                KickSkill · Learning
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Learning & Roadmaps
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Personalized learning roadmaps, courses, and hands-on projects to close skill gaps.
            </p>
          </div>
          <InteractiveHoverButton
            text="AI Study Plan"
            className="w-36 text-xs text-white/70 border-white/15 shrink-0"
          />
        </div>

        {/* Tab Nav */}
        <div className="mb-8 pt-8">
          <AnimeNavBar
            items={learningNavItems}
            activeTab={learningIdToName[activeTab]}
            mascotImage="/marvel/hulk-face.svg"
            mascotAlt="Hulk"
            onTabChange={(name) => {
              marvelAudio.playRepulsorClick();
              setActiveTab(learningNameToId[name]);
            }}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "foryou" && (
          <ForYouTab
            onOpenCourse={setSelectedCourse}
            onOpenProject={setSelectedProject}
          />
        )}
        {activeTab === "roadmaps" && <RoadmapsTab />}
        {activeTab === "courses" && <CoursesTab onOpenCourse={setSelectedCourse} />}
        {activeTab === "projects" && <ProjectsTab onOpenProject={setSelectedProject} />}

        {/* Interactive Modals */}
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        <div className="h-12" />
      </div>
    </div>
  );
}
