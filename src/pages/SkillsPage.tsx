import { useState } from "react";
import {
  BrainCircuit,
  Target,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ClipboardCheck,
  BookOpen,
  Bot,
  ArrowRight,
  Zap,
  BarChart2,
  Route,
  Search,
  UserRound,
  Wrench,
  Building2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { FunnelChart } from "@/components/ui/funnel-chart";
import type { Page } from "@/App";
import { ShieldEagleLogo, ArcReactor } from "../components/marvel/MarvelIcons";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";

const skillNavItems = [
  { name: "Technical", icon: BrainCircuit },
  { name: "Soft Skills", icon: UserRound },
  { name: "Tools", icon: Wrench },
  { name: "Industry", icon: Building2 },
];

const skillNameToCategory: Record<string, SkillCategory> = {
  Technical: "Technical",
  "Soft Skills": "Soft Skills",
  Tools: "Tools",
  Industry: "Industry",
};

const categoryToSkillName: Record<SkillCategory, string> = {
  Technical: "Technical",
  "Soft Skills": "Soft Skills",
  Tools: "Tools",
  Industry: "Industry",
};

interface Skill {
  name: string;
  level: number;
}

type SkillCategory = "Technical" | "Soft Skills" | "Tools" | "Industry";

const skillData: Record<SkillCategory, Skill[]> = {
  Technical: [
    { name: "Python", level: 86 },
    { name: "SQL", level: 81 },
    { name: "Machine Learning", level: 74 },
    { name: "React", level: 68 },
    { name: "PyTorch", level: 42 },
    { name: "Docker", level: 35 },
  ],
  "Soft Skills": [
    { name: "Teamwork", level: 85 },
    { name: "Problem Solving", level: 82 },
    { name: "Communication", level: 78 },
    { name: "Time Management", level: 71 },
    { name: "Leadership", level: 55 },
  ],
  Tools: [
    { name: "VS Code", level: 90 },
    { name: "Git", level: 88 },
    { name: "Jupyter", level: 79 },
    { name: "AWS", level: 38 },
    { name: "Kubernetes", level: 22 },
  ],
  Industry: [
    { name: "ML Applications", level: 72 },
    { name: "AI Ethics", level: 65 },
    { name: "Data Pipelines", level: 61 },
    { name: "Model Deployment", level: 38 },
  ],
};

const skillGaps = [
  {
    name: "PyTorch",
    current: 42,
    required: 70,
    impact: 12,
    reason: "Required for deep learning roles at top AI companies.",
  },
  {
    name: "Docker",
    current: 35,
    required: 65,
    impact: 8,
    reason: "Essential for deploying ML models in production environments.",
  },
  {
    name: "AWS",
    current: 38,
    required: 60,
    impact: 6,
    reason: "Expected for cloud infrastructure and scalable ML systems.",
  },
];

const assessmentCategories = [
  { icon: BrainCircuit, label: "Technical Skills" },
  { icon: BarChart2, label: "Analytical Aptitude" },
  { icon: Zap, label: "Data Structures & Algorithms" },
  { icon: Bot, label: "System Architecture" },
  { icon: Target, label: "Domain Knowledge" },
];

const MARVEL_FUNNEL_CHAIN = [
  "#EC1D24", // Marvel Red
  "#FF333A", // Scarlet
  "#F59E0B", // Stark Gold
  "#B91C1C", // Deep Crimson
  "#FFD700", // Bright Gold
  "#DC2626", // Flame Red
  "#E5E7EB", // Platinum Silver
];

function skillFunnelData(skills: Skill[]) {
  return [...skills]
    .sort((a, b) => b.level - a.level)
    .map((skill, i) => ({
      label: skill.name,
      value: skill.level,
      displayValue: `${skill.level}%`,
      gradient: [
        { offset: "0%", color: MARVEL_FUNNEL_CHAIN[i % MARVEL_FUNNEL_CHAIN.length] },
        { offset: "100%", color: MARVEL_FUNNEL_CHAIN[(i + 1) % MARVEL_FUNNEL_CHAIN.length] },
      ],
    }));
}

function getStatus(level: number): { label: string; color: string } {
  if (level >= 80) return { label: "Advanced (80%+)", color: "text-red-500 font-bold" };
  if (level >= 60) return { label: "Proficient (60%+)", color: "text-amber-400 font-bold" };
  return { label: "Needs Practice (<60%)", color: "text-zinc-400 font-medium" };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#EC1D24] mb-3 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#EC1D24]" />
      {children}
    </p>
  );
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#EC1D24]/20 bg-gradient-to-br from-[#12131C] to-[#0A0B10] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default function SkillsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [activeTab, setActiveTab] = useState<SkillCategory>("Technical");
  const [showAssessment, setShowAssessment] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const activeSkillsFunnel = skillFunnelData(skillData[activeTab]);

  return (
    <div className="relative h-full flex flex-col bg-[#0A0B10] text-white overflow-hidden">
      {/* Captain America Comic Panels Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/captain-america-comic-bg.jpg" decoding="async"
          alt="Captain America Comic Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="captain" />
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[#EC1D24]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative shrink-0 px-4 pt-16 sm:px-8 sm:pt-20 pb-6 border-b border-[#EC1D24]/20 pl-16 sm:pl-16 bg-black/40">
        <div className="flex items-center gap-2 mb-2">
          <img src="/marvel/captain-america-face.svg" alt="Captain America" className="w-4 h-4 object-contain" />
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            KickSkill · Skills
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-1">
              Skills Matrix
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Audit verified capabilities, identify critical skill gaps, and track mastery progression.
            </p>
          </div>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              setShowAssessment(true);
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EC1D24]/40 bg-[#EC1D24]/15 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#EC1D24]/25 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.25)]"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
            Skill Assessment
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-6 w-full">
          {/* Target Directive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard>
              <SectionLabel>Active Career Goal</SectionLabel>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black italic text-white uppercase font-sans">
                    AI / ML Systems Engineer
                  </p>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Readiness Index</p>
                  <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                    <span className="text-3xl font-black italic text-[#EC1D24]">78%</span>
                    <span className="text-xs text-amber-400 font-bold ml-1">MATCH READINESS</span>
                  </div>
                  <div className="mt-3 w-48">
                    <FunnelChart
                      data={[
                        {
                          label: "Readiness",
                          value: 78,
                          displayValue: "",
                          gradient: [
                            { offset: "0%", color: "#EC1D24" },
                            { offset: "100%", color: "#FFD700" },
                          ],
                        },
                      ]}
                      orientation="horizontal"
                      layers={4}
                      showLabels={false}
                      showValues={false}
                      showPercentage={false}
                      gap={0}
                      grid={false}
                      style={{ height: "28px", aspectRatio: "auto" }}
                    />
                  </div>
                </div>
                {/* 3D Toy-like Iron Man Mascot Badge */}
                <div className="relative group w-14 h-14 rounded-2xl bg-black/60 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(236,29,36,0.3)]">
                  <img
                    src="/marvel/ironman.png"
                    alt="Iron Man"
                    className="w-10 h-10 object-contain drop-shadow-[0_4px_10px_rgba(236,29,36,0.6)] group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setShowGoalModal(true);
                }}
                className="mt-4 flex items-center gap-1.5 text-xs font-mono text-[#EC1D24] hover:text-red-400 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                Change Career Goal
              </button>
            </GlassCard>
          </div>

          {/* Skill Category Tabs - Captain America Mascot Pointer */}
          <GlassCard className="p-0 overflow-visible pt-10">
            <div className="pb-4">
              <AnimeNavBar
                items={skillNavItems}
                activeTab={categoryToSkillName[activeTab]}
                mascotImage="/marvel/captain-america-face.svg"
                mascotAlt="Captain America"
                onTabChange={(name) => {
                  marvelAudio.playRepulsorClick();
                  setActiveTab(skillNameToCategory[name] ?? "Technical");
                }}
              />
            </div>

            <div className="px-5 pt-5 pb-2">
              <FunnelChart
                data={activeSkillsFunnel}
                orientation="horizontal"
                layers={4}
                showLabels={false}
                showValues={false}
                showPercentage={false}
                gap={3}
                grid={false}
                style={{ height: "140px", aspectRatio: "auto" }}
              />
            </div>

            {/* Legend grid */}
            <div className="px-5 pb-4 mt-1 grid grid-cols-2 gap-x-6 gap-y-2 font-mono">
              {activeSkillsFunnel.map((skill) => {
                const status = getStatus(skill.value);
                return (
                  <div key={skill.label} className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: skill.gradient[0].color }}
                    />
                    <span className="text-xs text-zinc-300 flex-1">{skill.label}</span>
                    <span className="text-xs font-bold text-white">{skill.displayValue}</span>
                    <span className={cn("text-[10px] w-36 text-right shrink-0", status.color)}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Gaps + AI Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Deficits */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <img src="/marvel/hulk-face.svg" alt="Hulk" className="w-5 h-5 object-contain" />
                <SectionLabel>Identified Skill Gaps</SectionLabel>
              </div>
              <p className="text-xs text-neutral-400 -mt-2 mb-3">
                Key technical areas to improve for higher match rates with your target roles.
              </p>
              {skillGaps.map((gap) => (
                <GlassCard key={gap.name} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-bold text-white">{gap.name}</p>
                      <p className="text-[11px] font-mono text-zinc-400 mt-0.5">{gap.reason}</p>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-mono font-bold text-[#EC1D24] bg-[#EC1D24]/15 border border-[#EC1D24]/40 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3 text-[#EC1D24]" />
                      +{gap.impact} matching roles
                    </span>
                  </div>

                  <div className="mb-3">
                    <FunnelChart
                      data={[
                        {
                          label: "Required",
                          value: gap.required,
                          displayValue: `${gap.required}%`,
                          gradient: [{ offset: "0%", color: "#FFD700" }, { offset: "100%", color: "#D97706" }],
                        },
                        {
                          label: "Current",
                          value: gap.current,
                          displayValue: `${gap.current}%`,
                          gradient: [{ offset: "0%", color: "#EC1D24" }, { offset: "100%", color: "#990B11" }],
                        },
                      ]}
                      orientation="horizontal"
                      layers={3}
                      showLabels={true}
                      showValues={true}
                      showPercentage={false}
                      gap={3}
                      grid={false}
                      style={{ height: "86px", aspectRatio: "auto" }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      marvelAudio.playRepulsorClick();
                      onNavigate("learning");
                    }}
                    className="w-full py-2 rounded-xl border border-[#EC1D24]/30 bg-black/60 text-xs font-mono font-bold text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    Practice Skill: {gap.name}
                  </button>
                </GlassCard>
              ))}
            </div>

            {/* AI Analysis */}
            <div className="space-y-4">
              <GlassCard className="border-[#EC1D24]/30 bg-[#0E1017]">
                <div className="flex items-center gap-2 mb-3">
                  <ArcReactor className="w-5 h-5 text-[#EC1D24]" />
                  <SectionLabel>AI Skill Insights</SectionLabel>
                </div>
                <div className="space-y-3 text-xs font-mono text-zinc-300 leading-relaxed">
                  <p>
                    Your highest calibrated competency is <span className="text-white font-bold">Python & Algorithmic Core (86%)</span>. You exceed the 75th percentile for problem solving.
                  </p>
                  <p>
                    Your highest-impact gap is <span className="text-red-400 font-bold">PyTorch Neural Modeling & Docker Containerization</span>. Closing these two will elevate compatibility from 78% to 94%.
                  </p>
                </div>
                <button
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    onNavigate("learning");
                  }}
                  className="mt-4 w-full py-2.5 rounded-xl border border-yellow-400/50 bg-[#EC1D24] text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(236,29,36,0.4)]"
                >
                  <Route className="w-3.5 h-3.5" />
                  Generate Learning Roadmap
                </button>
              </GlassCard>

              {/* Assessment Card */}
              <GlassCard>
                <div className="flex items-center gap-2 mb-1">
                  <img src="/marvel/captain-america-face.svg" alt="Captain America" className="w-4 h-4 object-contain" />
                  <SectionLabel>Skill Assessments</SectionLabel>
                </div>
                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Take adaptive evaluations to verify skills and showcase them directly on your Skill Passport.
                </p>
                <button
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    setShowAssessment(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/15 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-[#EC1D24]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(236,29,36,0.2)]"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Start Assessment
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      {showAssessment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowAssessment(false)}
        >
          <div
            className="w-full max-w-md bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ShieldEagleLogo className="w-4 h-4 text-[#EC1D24]" />
                <h2 className="text-sm font-black italic uppercase text-white font-sans">
                  Skill Assessment
                </h2>
              </div>
              <button
                onClick={() => setShowAssessment(false)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 font-mono">
              {assessmentCategories.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    setShowAssessment(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#EC1D24]/20 bg-black/60 hover:bg-[#EC1D24]/15 hover:border-[#EC1D24] text-xs text-zinc-300 hover:text-white transition-all cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 text-[#EC1D24] shrink-0" />
                  {label}
                  <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Change Goal Modal */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowGoalModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-black italic uppercase text-white mb-1">
              Change Career Goal
            </h2>
            <p className="text-xs font-mono text-zinc-400 mb-4">Select your target career path</p>
            <div className="space-y-2 font-mono">
              {["AI / ML Systems Engineer", "Frontend Engineer", "Data Scientist", "Product Manager", "DevOps Engineer"].map(
                (goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      marvelAudio.playRepulsorClick();
                      setShowGoalModal(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs transition-colors cursor-pointer",
                      goal === "AI / ML Systems Engineer"
                        ? "border-[#EC1D24] bg-[#EC1D24]/20 text-white font-bold shadow-[0_0_12px_rgba(236,29,36,0.3)]"
                        : "border-white/10 bg-black/60 text-zinc-300 hover:border-[#EC1D24]"
                    )}
                  >
                    {goal}
                    {goal === "AI / ML Systems Engineer" && (
                      <CheckCircle className="w-4 h-4 text-[#EC1D24]" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
