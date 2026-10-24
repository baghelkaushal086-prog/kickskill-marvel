import { GraduationCap, Building2, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { TwistingRibbon } from "../components/ui/twisting-ribbon";
import type { Page } from "../App";
import { Marvel3DCard } from "../components/marvel/Marvel3DCard";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";
import { MarvelAudioControls } from "../components/marvel/MarvelAudioControls";
import { KickSkillLogo } from "../components/marvel/KickSkillLogo";

const ribbonMarvel = {
  face:  "#EC1D24",
  foldA: "#FFFFFF",
  foldB: "#8B0000",
  foldC: "#1A1A24",
};

interface RoleSelectionPageProps {
  onNavigate: (p: Page) => void;
}

const roles = [
  {
    page: "home" as Page,
    badge: "STUDENT & CANDIDATE",
    badgeColor: "bg-red-600/20 text-red-400 border-[#EC1D24]/40",
    icon: <GraduationCap className="w-7 h-7 text-[#EC1D24] group-hover:scale-110 transition-transform duration-300" />,
    title: "I'm looking for opportunities",
    subtitle: "Student & Job Seeker",
    desc: "Calibrate your verified skill passport, follow personalized learning roadmaps, and land your ideal career roles.",
    points: [
      "Deterministic Skill Gap Audits",
      "Personalized Learning Roadmaps",
      "Verified Credential Passport",
      "AI-Powered Opportunity Matching",
      "Automated Application Guardrails",
    ],
    cta: "Continue as Student",
  },
  {
    page: "industry" as Page,
    badge: "RECRUITER & EMPLOYER",
    badgeColor: "bg-white/10 text-white/90 border-white/20",
    icon: <Building2 className="w-7 h-7 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform duration-300" />,
    title: "I'm hiring / recruiting talent",
    subtitle: "Recruiter & Industry Partner",
    desc: "Broadcast engineering roles to top candidates with cryptographically audited skills and zero resume inflation.",
    points: [
      "Post Opportunities & Engineering Roles",
      "Deterministic Vector Readiness Scoring",
      "Cryptographically Verified Credentials",
      "Zero-Inflation Candidate Shortlists",
      "Direct Sourcing & Pipeline Telemetry",
    ],
    cta: "Enter Recruiter Console",
  },
];

export default function RoleSelectionPage({ onNavigate }: RoleSelectionPageProps) {
  return (
    <div className="w-full h-full bg-[#0A0B10] flex flex-col items-center overflow-auto relative">
      {/* Marvel Heroes Lineup Backdrop with KICKSKILL AI Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/role-selection-heroes.jpg"
          alt="KickSkill Marvel Heroes"
          className="w-full h-full object-cover object-top opacity-65 sm:opacity-75 filter contrast-125 saturate-120"
        />
        {/* Cinematic Vignette Overlays so role cards and text remain readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-black/20 to-[#0A0B10]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,11,16,0.45)_75%,#0A0B10_100%)]" />
      </div>

      {/* Top bar with audio controls */}
      <div className="relative w-full flex items-center justify-between px-6 sm:px-10 pt-6 shrink-0 z-20">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate("home")}>
          <KickSkillLogo size="sm" />
        </div>

        <MarvelAudioControls />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:py-12 z-10">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-black italic tracking-wide text-white uppercase drop-shadow-sm pb-2">
            Select Your Role
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans tracking-wide max-w-md mx-auto">
            Choose your profile type to initialize your personalized career workspace.
          </p>
        </div>

        {/* 3D Parallax Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          {roles.map((r) => (
            <Marvel3DCard
              key={r.page}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onNavigate(r.page);
              }}
              className="cursor-pointer h-full"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border tracking-wider uppercase ${r.badgeColor}`}
                >
                  {r.badge}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">KICKSKILL VERIFIED</span>
              </div>

              {/* Icon Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-sm group-hover:border-[#EC1D24]/60 group-hover:bg-white/8 transition-all">
                {r.icon}
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-white leading-snug mb-0.5 group-hover:text-red-400 transition-colors">
                {r.title}
              </h3>
              <p className="text-xs font-semibold text-[#EC1D24] mb-2">{r.subtitle}</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-5">{r.desc}</p>

              {/* Feature points */}
              <ul className="space-y-2 mb-6 border-t border-white/10 pt-4">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#EC1D24]" />
                    <span className="text-xs text-neutral-300">{p}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10 group-hover:border-[#EC1D24]/60 group-hover:shadow-[0_0_15px_rgba(236,29,36,0.3)] transition-all">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {r.cta}
                </span>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 group-hover:text-[#EC1D24] transition-all" />
              </div>
            </Marvel3DCard>
          ))}
        </div>

        {/* Assurance */}
        <p className="text-[11px] text-neutral-500 text-center flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-[#EC1D24]" />
          <span>Student Career Privacy & Verified Credential Integrity Guaranteed</span>
        </p>
      </div>
    </div>
  );
}
