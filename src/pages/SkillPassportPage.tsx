import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Share2,
  Pencil,
  X,
  ShieldCheck,
  Code2,
  Award,
  Briefcase,
  BrainCircuit,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Target,
  BookOpen,
  FolderKanban,
  TrendingUp,
  GraduationCap,
  Trophy,
  GitMerge,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import type { Page } from "../App";
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { CreepyButton } from "@/components/ui/creepy-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { UserRound, FolderKanban as FolderKanbanIcon, Award as AwardIcon, Trophy as TrophyIcon } from "lucide-react";
import { ShieldEagleLogo, ArcReactor, InfinityStoneBadge, InfinityStoneType } from "../components/marvel/MarvelIcons";
import { InfinityStonesProgress } from "../components/marvel/InfinityStonesProgress";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";
import { api, type ProfileData } from "../lib/api";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
import { AdmitOneTicket, PASSPORT_LAYOUT, PASSPORT_TEXTURE } from "../components/ui/admit-one-ticket";
import { SpiderManAnimated } from "../components/marvel/SpiderManAnimated";

type PassportTab = "overview" | "projects" | "certifications" | "experience" | "achievements";

const tabDefs: { id: PassportTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
];

const passportNavItems = [
  { name: "Overview", icon: UserRound },
  { name: "Projects", icon: FolderKanbanIcon },
  { name: "Certifications", icon: AwardIcon },
  { name: "Experience", icon: Briefcase },
  { name: "Achievements", icon: TrophyIcon },
];
const passportNameToId: Record<string, PassportTab> = {
  Overview: "overview",
  Projects: "projects",
  Certifications: "certifications",
  Experience: "experience",
  Achievements: "achievements",
};
const passportIdToName: Record<PassportTab, string> = {
  overview: "Overview",
  projects: "Projects",
  certifications: "Certifications",
  experience: "Experience",
  achievements: "Achievements",
};

interface SkillEntry {
  name: string;
  level: number;
  source: string;
  verified: boolean;
  stone: InfinityStoneType;
}

const verifiedSkills: SkillEntry[] = [
  { name: "Python", level: 86, source: "Skill Assessment + Project", verified: true, stone: "mind" },
  { name: "Machine Learning", level: 74, source: "Skill Assessment + Certification", verified: true, stone: "mind" },
  { name: "SQL", level: 81, source: "Database Assessment", verified: true, stone: "power" },
  { name: "React", level: 68, source: "Portfolio Project", verified: true, stone: "reality" },
  { name: "Git", level: 89, source: "Codebase Verification", verified: true, stone: "power" },
  { name: "PyTorch", level: 42, source: "Course In Progress", verified: false, stone: "mind" },
  { name: "Docker", level: 35, source: "Course In Progress", verified: false, stone: "space" },
  { name: "FastAPI", level: 58, source: "Backend API Project", verified: true, stone: "mind" },
  { name: "NumPy", level: 77, source: "Math Assessment", verified: true, stone: "mind" },
  { name: "Pandas", level: 72, source: "Data Analysis Lab", verified: true, stone: "mind" },
  { name: "TensorFlow", level: 48, source: "Course In Progress", verified: false, stone: "mind" },
  { name: "Node.js", level: 61, source: "Backend Project", verified: true, stone: "power" },
];

const featuredProjects = [
  {
    id: 1,
    title: "AI Resume & Portfolio Analyzer",
    desc: "Autonomous NLP platform scoring credentials against live industry requirements with deterministic auditing.",
    skills: ["Python", "NLP", "FastAPI", "PostgreSQL"],
    status: "Verified Project",
    verified: true,
    year: "2025",
    link: "#",
    github: "https://github.com/nishantsingh/ai-resume-analyzer",
  },
  {
    id: 2,
    title: "Campus Autonomous Logistics Mesh",
    desc: "Real-time dispatch coordination system with graph route optimization and telemetry tracking for 4,000 agents.",
    skills: ["React", "Node.js", "Firebase"],
    status: "Live Project",
    verified: true,
    year: "2025",
    link: "#",
    github: "https://github.com/nishantsingh/campus-delivery",
  },
  {
    id: 3,
    title: "Quantum ML Model Serving API",
    desc: "Containerized microservice delivering scikit-learn & PyTorch models with batch telemetry and high-throughput caching.",
    skills: ["Python", "Docker", "FastAPI", "PyTorch"],
    status: "Verified Project",
    verified: true,
    year: "2026",
    link: "#",
    github: "https://github.com/nishantsingh/ml-serving-api",
  },
];

const certifications = [
  {
    id: 1,
    title: "Machine Learning Specialization",
    org: "Coursera / DeepLearning.AI",
    year: "2025",
    skills: ["Python", "ML", "Data Science"],
    verified: true,
    image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&h=360&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "Python for Scientific Computing",
    org: "IBM / Cognitive Class",
    year: "2024",
    skills: ["Python", "Pandas", "NumPy"],
    verified: true,
    image: "https://images.unsplash.com/photo-1638636241638-aef5120c5153?w=600&h=360&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "React Architecture & UI Systems",
    org: "Frontend Masters",
    year: "2024",
    skills: ["React", "JavaScript", "TypeScript"],
    verified: true,
    image: "https://images.unsplash.com/photo-1755540735876-ff503cf594fe?w=600&h=360&fit=crop&auto=format",
  },
  {
    id: 4,
    title: "High-Throughput SQL for Analytics",
    org: "Mode Analytics",
    year: "2024",
    skills: ["SQL", "PostgreSQL", "Data Analysis"],
    verified: true,
    image: "https://images.unsplash.com/photo-1785119774760-185873634dcb?w=600&h=360&fit=crop&auto=format",
  },
];

const experiences = [
  {
    id: 1,
    role: "AI Systems Engineering Intern",
    org: "TechVenture Labs",
    duration: "June 2026 – August 2026",
    type: "Internship",
    skills: ["Python", "Machine Learning", "Docker"],
    desc: "Built high-throughput ML pipelines for structured data classification and integrated model telemetry.",
    verified: true,
  },
  {
    id: 2,
    role: "Full Stack Engineer",
    org: "Freelance",
    duration: "Jan 2025 – May 2025",
    type: "Freelance",
    skills: ["React", "Node.js", "Firebase"],
    desc: "Architected and shipped 3 production web applications with deterministic real-time data sync.",
    verified: true,
  },
  {
    id: 3,
    role: "Undergraduate Research Assistant",
    org: "IIIT Tiruchirappalli — NLP Lab",
    duration: "Aug 2024 – Dec 2024",
    type: "Research",
    skills: ["Python", "NLP", "PyTorch"],
    desc: "Co-authored multilingual sentiment analysis models and benchmarked transformer architectures.",
    verified: true,
  },
];

const achievements = [
  {
    id: 1,
    title: "1st Place — Smart India Hackathon",
    org: "Government of India",
    date: "2025",
    type: "Hackathon",
    icon: <Trophy className="w-4 h-4 text-yellow-400" />,
    verified: true,
  },
  {
    id: 2,
    title: "Top 50 Finalist — HackWithInfy",
    org: "Infosys",
    date: "2025",
    type: "Competition",
    icon: <Award className="w-4 h-4 text-amber-400" />,
    verified: true,
  },
  {
    id: 3,
    title: "Open Source Contributor",
    org: "scikit-learn (GitHub)",
    date: "2025",
    type: "Open Source",
    icon: <GitMerge className="w-4 h-4 text-white" />,
    verified: false,
  },
  {
    id: 4,
    title: "Technical Head — IIIT-T Coding Club",
    org: "IIIT Tiruchirappalli",
    date: "2024 – Present",
    type: "Leadership",
    icon: <Users className="w-4 h-4 text-red-400" />,
    verified: true,
  },
  {
    id: 5,
    title: "Best Technical Innovation Award",
    org: "IIIT Tiruchirappalli Tech Fest",
    date: "2025",
    type: "Award",
    icon: <Award className="w-4 h-4 text-yellow-400" />,
    verified: true,
  },
  {
    id: 6,
    title: "Finalist — Inter-NIT Programming League",
    org: "NIT Consortium",
    date: "2024",
    type: "Competition",
    icon: <Trophy className="w-4 h-4 text-amber-400" />,
    verified: true,
  },
];

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        IN PROGRESS
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EC1D24]/15 border border-[#EC1D24]/50 text-[10px] text-white font-mono font-bold tracking-wider shadow-[0_0_12px_rgba(236,29,36,0.3)]">
      <ShieldCheck className="w-3.5 h-3.5 text-[#EC1D24]" />
      VERIFIED
    </span>
  );
}

function SkillBar({
  name,
  level,
  source,
  verified,
  stone,
}: SkillEntry) {
  const stoneGradients: Record<InfinityStoneType, string> = {
    power: "linear-gradient(90deg, #9333ea, #c084fc)",
    mind: "linear-gradient(90deg, #eab308, #fef08a)",
    space: "linear-gradient(90deg, #0284c7, #38bdf8)",
    reality: "linear-gradient(90deg, #dc2626, #f87171)",
    time: "linear-gradient(90deg, #16a34a, #4ade80)",
    soul: "linear-gradient(90deg, #ea580c, #fb923c)",
  };

  return (
    <div className="group flex items-center gap-4 py-3.5 border-b border-[#EC1D24]/10 last:border-0 hover:bg-[#EC1D24]/[0.03] px-2 rounded-lg transition-colors">
      <div className="w-36 shrink-0 flex items-center gap-2">
        <InfinityStoneBadge type={stone} size={16} />
        <div>
          <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
            {name}
          </p>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">{source}</p>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-2 w-full rounded-full bg-black/60 border border-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${level}%`,
              background: verified ? stoneGradients[stone] : "rgba(255,255,255,0.15)",
              boxShadow: verified ? "0 0 10px rgba(236,29,36,0.5)" : "none",
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 font-mono">
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: verified ? "#FFFFFF" : "rgba(255,255,255,0.3)" }}
        >
          {level}%
        </span>
        {verified && <BadgeCheck className="w-4 h-4 text-[#EC1D24]" />}
      </div>
    </div>
  );
}

function SkillTag({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded bg-black/60 border border-[#EC1D24]/25 text-[10px] text-zinc-200 font-mono">
      {label}
    </span>
  );
}

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
    <h2 className="text-base font-bold text-white uppercase font-sans tracking-wide flex items-center gap-2 mb-4">
      <span className="w-1.5 h-4 bg-red-600 rounded-sm inline-block" />
      {children}
    </h2>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="space-y-8">
      {/* Verified Skills */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Verified Skills</SectionLabel>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onNavigate("skills");
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1 text-xs font-mono text-[#EC1D24] hover:text-red-400 transition-colors cursor-pointer"
          >
            View All Skills <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <CardWrap className="px-5 divide-y divide-[#EC1D24]/10">
          {verifiedSkills.slice(0, 6).map((s) => (
            <SkillBar key={s.name} {...s} />
          ))}
        </CardWrap>
      </section>

      {/* Featured Projects */}
      <section>
        <SectionLabel>Featured Projects</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featuredProjects.map((p) => (
            <CardWrap key={p.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-[#EC1D24] font-mono uppercase tracking-widest mb-1">
                    PROJECT · {p.year}
                  </p>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                </div>
                <VerifiedBadge verified={p.verified} />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed flex-1">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
              <button
                onClick={() => marvelAudio.playRepulsorClick()}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[#EC1D24]/30 bg-black/50 text-xs font-mono text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-all cursor-pointer mt-1"
              >
                <ExternalLink className="w-3 h-3 text-amber-400" /> View Project
              </button>
            </CardWrap>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black italic uppercase text-white">Projects</h2>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">
          Reviewed and verified project work and production deployments.
        </p>
      </div>
      <div className="space-y-4">
        {featuredProjects.map((p) => (
          <CardWrap key={p.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-[10px] text-[#EC1D24] uppercase tracking-widest">
                  PROJECT · {p.year}
                </span>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
              </div>
              <VerifiedBadge verified={p.verified} />
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.skills.map((s) => (
                <SkillTag key={s} label={s} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => marvelAudio.playRepulsorClick()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EC1D24]/30 bg-black/60 text-xs font-mono text-white hover:bg-[#EC1D24]/20 hover:border-[#EC1D24] transition-all cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5 text-amber-400" /> Source Code
              </a>
            </div>
          </CardWrap>
        ))}
      </div>
    </div>
  );
}

function CertificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black italic uppercase text-white">Certifications</h2>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">
          {certifications.filter((c) => c.verified).length} verified credentials on record.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {certifications.map((c) => (
          <CardWrap key={c.id} className="overflow-hidden p-0">
            <div className="relative w-full h-40 bg-zinc-900 overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <VerifiedBadge verified={c.verified} />
              </div>
            </div>
            <div className="p-5">
              <p className="font-mono text-[10px] text-[#EC1D24] uppercase tracking-widest mb-1">
                {c.year}
              </p>
              <h3 className="text-sm font-bold text-white mb-0.5">{c.title}</h3>
              <p className="text-xs text-zinc-400 mb-3">{c.org}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {c.skills.map((s) => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
            </div>
          </CardWrap>
        ))}
      </div>
    </div>
  );
}

function ExperienceTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black italic uppercase text-white">Experience</h2>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">
          Internships, research fellowships, and industry experience.
        </p>
      </div>
      <div className="relative space-y-4">
        {experiences.map((exp) => (
          <CardWrap key={exp.id} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                <p className="text-xs font-mono text-[#EC1D24] mt-0.5">{exp.org}</p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <VerifiedBadge verified={exp.verified} />
                <p className="text-[10px] text-zinc-400 mt-1 font-mono">{exp.duration}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-3">{exp.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {exp.skills.map((s) => (
                <SkillTag key={s} label={s} />
              ))}
            </div>
          </CardWrap>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black italic uppercase text-white">Honors & Achievements</h2>
        <p className="text-xs font-mono text-zinc-400 mt-0.5">
          Hackathon championships, open-source contributions, and leadership honors.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {achievements.map((a) => (
          <CardWrap key={a.id} className="p-5 flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-black/60 border border-[#EC1D24]/30">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-white">{a.title}</h3>
                <VerifiedBadge verified={a.verified} />
              </div>
              <p className="text-xs text-zinc-400">{a.org}</p>
              <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-zinc-400">
                <span>{a.date}</span>
                <span>·</span>
                <span className="text-amber-400">{a.type}</span>
              </div>
            </div>
          </CardWrap>
        ))}
      </div>
    </div>
  );
}

// Share Modal
function SharePassportModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0E1017] border border-[#EC1D24]/40 rounded-2xl p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <ShieldEagleLogo className="w-5 h-5 text-[#EC1D24]" />
          <h2 className="text-base font-black italic uppercase text-white">
            Public Skill Passport
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#EC1D24]/20">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-[#EC1D24]/50 flex items-center justify-center shrink-0">
            <span className="text-base font-black text-white">NS</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Nishant Singh</h3>
            <p className="text-xs font-mono text-[#EC1D24]">
              AI / ML Engineer · IIIT Tiruchirappalli
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
              Readiness Score
            </p>
            <p className="text-xl font-bold font-mono text-[#EC1D24]">78%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => marvelAudio.playRepulsorClick()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 border border-yellow-400 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.3)]"
          >
            <Share2 className="w-3.5 h-3.5" /> Copy Passport Link
          </button>
        </div>
      </div>
    </div>
  );
}

interface SkillPassportPageProps {
  onNavigate: (p: Page) => void;
}

export default function SkillPassportPage({ onNavigate }: SkillPassportPageProps) {
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");
  const [showShare, setShowShare] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    let active = true;
    api.profile
      .getMe()
      .then((p) => {
        if (active && p) setProfile(p);
      })
      .catch((err) => {
        console.warn("Could not fetch profile for passport:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#0A0B10] relative">
      {/* Thor Comic Panels Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/thor-comic-bg.jpg" decoding="async"
          alt="Thor Comic Backdrop"
          className="w-full h-full object-cover opacity-45 sm:opacity-55 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
        <HeroTint hero="thor" />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EC1D24]/20 border border-[#EC1D24]/40 mb-2">
              <img src="/marvel/thor-face.svg" alt="Thor" className="w-4 h-4 object-contain drop-shadow-[0_1px_4px_rgba(236,29,36,0.6)]" />
              <span className="text-[10px] font-mono text-red-300 font-bold uppercase tracking-widest">
                VERIFIED SKILL PASSPORT
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-white uppercase tracking-wide">
              Skill Passport
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Verified skill passport, projects, and career credentials.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <InteractiveHoverButton
              text="Edit Passport"
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onNavigate("settings");
              }}
              className="w-28 sm:w-32 text-xs text-white/70 border-[#EC1D24]/30"
            />
            <CreepyButton
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setShowShare(true);
              }}
              className="text-xs"
              coverClassName="bg-[#EC1D24] text-white text-xs font-bold uppercase"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 inline-block" /> Share Passport
            </CreepyButton>
          </div>
        </div>

        {/* Infinity Stones — six career milestones */}
        <div className="mb-6">
          <InfinityStonesProgress
            milestones={[
              { key: "space", label: "Verified Skills", detail: "At least 5 skills verified", done: true },
              { key: "mind", label: "Projects", detail: "3 projects added to passport", done: true },
              { key: "reality", label: "Credentials", detail: "A certificate or credential linked", done: true },
              { key: "power", label: "Applications", detail: "First application sent", done: true },
              { key: "time", label: "Interviews", detail: "First interview scheduled", done: false },
              { key: "soul", label: "Offer", detail: "First offer received", done: false },
            ]}
          />
        </div>

        {/* Profile Hero — Ticket Card with Animated Spider-Man Model */}
        <div className="mb-6">
          <div className="flex justify-center max-w-full overflow-x-auto py-2">
            <div className="relative">
              {/* Animated Spider-Man Model with Eye Tracking & Mechanical Blinking */}
              <div className="absolute -top-10 -right-2 sm:-right-6 z-20">
                <SpiderManAnimated size="md" showSpeechBubble={true} />
              </div>

              <AdmitOneTicket
                name={profile?.name || "Tony Stark"}
                presenter="KickSkill Verified Student"
                event={profile?.target_role || "AI / ML Systems Engineer"}
                venue={profile?.institution || "MIT / Stark Institute"}
                dates={profile?.degree ? `${profile.degree} · Class of ${profile.graduation_year || 2026}` : "B.Tech CSE · Class of 2026"}
                stubText="VERIFIED"
                watermark="PASSPORT"
                width={Math.min(680, window.innerWidth - 80)}
                layout={PASSPORT_LAYOUT}
                texture={PASSPORT_TEXTURE}
              />
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="mb-8 pt-8">
          <AnimeNavBar
            items={passportNavItems}
            activeTab={passportIdToName[activeTab]}
            mascotImage="/marvel/thor-face.svg"
            mascotAlt="Thor"
            onTabChange={(name) => {
              marvelAudio.playRepulsorClick();
              setActiveTab(passportNameToId[name]);
            }}
          />
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <OverviewTab onNavigate={onNavigate} />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "certifications" && <CertificationsTab />}
        {activeTab === "experience" && <ExperienceTab />}
        {activeTab === "achievements" && <AchievementsTab />}

        <div className="h-12" />
      </div>

      {showShare && <SharePassportModal onClose={() => setShowShare(false)} />}
    </div>
  );
}
