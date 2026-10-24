import { useState } from "react";
import {
  CircleUserRound,
  Target,
  Bot,
  FileText,
  Bell,
  Shield,
  BadgeCheck,
  ShieldCheck,
  Upload,
  Settings,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  Pencil,
  KeyRound,
  LogOut,
  Trash2,
  X,
  ChevronRight,
  Lock,
  Globe,
  Building2,
  Eye,
  GraduationCap,
  Zap,
  Cpu,
  Radio,
  Flame,
  AlertTriangle,
} from "lucide-react";
import type { Page } from "../App";
import { ShieldEagleLogo, ArcReactor } from "../components/marvel/MarvelIcons";
import { MarvelExperienceSettings } from "../components/marvel/MarvelExperienceSettings";
import { HeroTint } from "../components/marvel/HeroTint";
import { marvelAudio } from "../components/marvel/MarvelAudioEngine";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "career" | "agent" | "documents" | "notifications" | "privacy";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function CardWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-[#0d1117]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#00F0FF]/30 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00F0FF]/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00F0FF]/80">
        {children}
      </p>
    </div>
  );
}

function FieldRow({
  label,
  value,
  editing,
  inputType = "text",
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  inputType?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs font-mono text-white/40 w-32 shrink-0">{label}</span>
      {editing ? (
        <input
          type={inputType}
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-white/5 border border-[#00F0FF]/30 rounded-lg px-3 py-1 text-xs text-white/90 font-mono focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/30 transition-all"
        />
      ) : (
        <span className="flex-1 text-xs font-mono text-white/80 text-right">{value}</span>
      )}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => {
        marvelAudio.playRepulsorClick();
        onChange(!enabled);
      }}
      onMouseEnter={() => marvelAudio.playHudHover()}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 cursor-pointer border shrink-0 ${
        enabled
          ? "bg-[#EC1D24]/40 border-[#EC1D24] shadow-[0_0_10px_rgba(236,29,36,0.3)]"
          : "bg-white/10 border-white/20"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 flex items-center justify-center ${
          enabled ? "translate-x-5 bg-[#EC1D24] text-white shadow-md" : "translate-x-0.5 bg-white/40"
        }`}
      >
        {enabled && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
    </button>
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
      onMouseEnter={() => marvelAudio.playHudHover()}
      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
        selected
          ? "bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.25)] font-semibold"
          : "bg-white/5 border-white/10 text-white/45 hover:text-white/80 hover:bg-white/8 hover:border-white/20"
      }`}
    >
      {selected ? `✓ ${label}` : label}
    </button>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    marvelAudio.playRepulsorClick();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldEagleLogo className="w-5 h-5 text-[#EC1D24]" />
          <h2 className="text-xl font-bold font-mono text-white/95 tracking-wide">
            Profile Information
          </h2>
        </div>
        <p className="text-xs text-white/45">
          Manage your student profile, university details, and contact information.
        </p>
      </div>

      {/* Avatar + name */}
      <CardWrap className="p-5">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/10">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC1D24]/30 via-black to-[#00F0FF]/25 border-2 border-[#00F0FF]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <span className="text-xl font-black font-mono text-[#00F0FF]">NS</span>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#EC1D24] text-[9px] font-mono font-bold text-white shadow">
              PRO
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold font-mono text-white/95">Nishant Singh</p>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]">
                VERIFIED STUDENT
              </span>
            </div>
            <p className="text-xs font-mono text-white/45 mt-0.5">
              IIIT Tiruchirappalli · Student ID #TK-9024
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setEditing(true);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-xs font-mono text-[#00F0FF] hover:bg-[#00F0FF]/20 hover:border-[#00F0FF] transition-all cursor-pointer shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            >
              <Pencil className="w-3 h-3" />
              Edit Profile
            </button>
          )}
        </div>
        <div>
          <FieldRow label="Email Address" value="nishant@example.com" editing={editing} inputType="email" />
          <FieldRow label="Institution" value="IIIT Tiruchirappalli" editing={editing} />
          <FieldRow label="Degree" value="B.Tech Computer Science" editing={editing} />
          <FieldRow label="Specialization" value="Artificial Intelligence & Machine Learning" editing={editing} />
          <FieldRow label="Graduation Year" value="2027" editing={editing} />
          <FieldRow label="Account Status" value="Verified Student" editing={false} />
        </div>
        {editing && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className={`text-xs font-mono text-[#00F0FF] transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile saved successfully.
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setEditing(false);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#EC1D24] text-white text-xs font-mono font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)]"
              >
                <CheckCircle2 className="w-3 h-3" /> Save Changes
              </button>
            </div>
          </div>
        )}
      </CardWrap>
    </div>
  );
}

// ─── Section: Career Preferences ─────────────────────────────────────────────

function CareerSection({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-xl font-bold font-mono text-white/95">
              Career Goals & Preferences
            </h2>
          </div>
          <p className="text-xs text-white/45">
            Target role, industries, and employment preferences.
          </p>
        </div>
        <button
          onClick={() => {
            marvelAudio.playRepulsorClick();
            onNavigate("career-goal");
          }}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EC1D24]/15 border border-[#EC1D24]/40 text-[#EC1D24] text-xs font-mono font-bold hover:bg-[#EC1D24] hover:text-white transition-all cursor-pointer shrink-0 ml-4 shadow-[0_0_12px_rgba(236,29,36,0.2)]"
        >
          <Target className="w-3 h-3" />
          Edit Goals
        </button>
      </div>

      <CardWrap className="p-5">
        <SectionLabel>Target Preferences</SectionLabel>
        <div className="space-y-3">
          {[
            { label: "Target Role", value: "AI / ML Systems Engineer" },
            { label: "Target Companies", value: "Anthropic · DeepMind · Stripe · Startups" },
            { label: "Preferred Locations", value: "India · Remote / Global" },
            { label: "Work Mode", value: "Remote · Hybrid" },
            { label: "Opportunity Types", value: "Internships · Full-time · Fellowships" },
            { label: "Target Timeline", value: "6 Months to target placement" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="text-xs font-mono text-white/40 w-44 shrink-0">{row.label}</span>
              <span className="flex-1 text-xs font-mono font-medium text-white/85 text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Section: Agent Permissions ───────────────────────────────────────────────

const agentModes = [
  {
    id: "ask",
    label: "Ask Before Applying",
    desc: "Autonomous agent recommends matching opportunities and prepares applications for manual review.",
  },
  {
    id: "prepare",
    label: "Prepare Applications",
    desc: "Autonomous agent automatically drafts tailored resumes and cover letters for matching roles.",
  },
  {
    id: "apply",
    label: "Autonomous Apply (Full Autopilot)",
    desc: "Autonomous agent applies directly to roles that meet your verified skill match threshold.",
  },
];

function AgentSection() {
  const [agentMode, setAgentMode] = useState("apply");
  const [minMatch, setMinMatch] = useState("85");
  const [minStipend, setMinStipend] = useState("15000");
  const [roles, setRoles] = useState(new Set(["AI / ML Systems", "Core Engineering", "Backend"]));
  const [locations, setLocations] = useState(new Set(["India Sector", "Remote Relay"]));
  const [modes, setModes] = useState(new Set(["Remote Telemetry", "Hybrid Compound"]));
  const [saved, setSaved] = useState(false);

  function toggle<T>(s: Set<T>, v: T) {
    const n = new Set(s);
    n.has(v) ? n.delete(v) : n.add(v);
    return n;
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ArcReactor className="w-5 h-5 text-[#00F0FF]" pulse />
          <h2 className="text-xl font-bold font-mono text-white/95">
            Autonomous Career Protocols
          </h2>
        </div>
        <p className="text-xs text-white/45">
          Configure autonomous agent capabilities and security rules.
        </p>
      </div>

      {/* Mode selector */}
      <CardWrap className="p-5">
        <SectionLabel>Autonomous Operating Mode</SectionLabel>
        <div className="space-y-2.5">
          {agentModes.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setAgentMode(m.id);
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                agentMode === m.id
                  ? "bg-[#00F0FF]/10 border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                  agentMode === m.id
                    ? "border-[#00F0FF] bg-[#00F0FF]/30 shadow-[0_0_8px_#00F0FF]"
                    : "border-white/20"
                }`}
              >
                {agentMode === m.id && <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />}
              </div>
              <div>
                <p
                  className={`text-sm font-mono font-bold leading-none mb-1.5 ${
                    agentMode === m.id ? "text-[#00F0FF]" : "text-white/60"
                  }`}
                >
                  {m.label.toUpperCase()}
                </p>
                <p className="text-xs text-white/40 leading-relaxed font-sans">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </CardWrap>

      {/* Application rules */}
      <CardWrap className="p-5">
        <SectionLabel>Tactical Thresholds</SectionLabel>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">
                Minimum Tactical Match
              </p>
              <div className="relative">
                <input
                  type="number"
                  value={minMatch}
                  onChange={(e) => setMinMatch(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full pr-8 pl-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-white/85 focus:outline-none focus:border-[#00F0FF] transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#00F0FF]">
                  %
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5">
                Minimum Monthly Stipend (INR)
              </p>
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00F0FF] pointer-events-none" />
                <input
                  type="number"
                  value={minStipend}
                  onChange={(e) => setMinStipend(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-white/85 focus:outline-none focus:border-[#00F0FF] transition-all"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
              Approved Specializations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "AI / ML Systems",
                "Core Engineering",
                "Backend",
                "Quantum Data Science",
                "Cloud Defense",
              ].map((r) => (
                <MultiChip
                  key={r}
                  label={r}
                  selected={roles.has(r)}
                  onClick={() => setRoles(toggle(roles, r))}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
              Operational Theaters
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["India Sector", "Remote Relay", "International Compound"].map((l) => (
                <MultiChip
                  key={l}
                  label={l}
                  selected={locations.has(l)}
                  onClick={() => setLocations(toggle(locations, l))}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">
              Deployment Modes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Remote Telemetry", "Hybrid Compound", "On-site Facility"].map((m) => (
                <MultiChip
                  key={m}
                  label={m}
                  selected={modes.has(m)}
                  onClick={() => setModes(toggle(modes, m))}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <div
            className={`text-xs font-mono text-[#00F0FF] transition-opacity ${
              saved ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Protocols Locked & Loaded.
            </span>
          </div>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-bold hover:bg-[#00F0FF] hover:text-black transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Lock In Guardrails
          </button>
        </div>
      </CardWrap>

      {/* Protected actions */}
      <CardWrap className="p-5 border-[#EC1D24]/30">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#EC1D24]" />
          <SectionLabel>Student Career Constitution Guardrails</SectionLabel>
        </div>
        <p className="text-[11px] text-white/40 mb-3 leading-relaxed">
          Under KickSkill student protection policies, the autonomous agent is strictly prevented from executing the following actions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            "Fabricate unverified skills or credentials",
            "Tamper with verified assessment scores or certificates",
            "Submit false employment or education history",
            "Authorize financial transactions without PIN",
            "Sign binding employment agreements",
            "Accept offers without explicit student confirmation",
            "Submit duplicate applications to the same employer",
            "Bypass institutional vetting protocols",
          ].map((rule) => (
            <div key={rule} className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
              <span className="text-[11px] font-mono text-white/70">{rule}</span>
            </div>
          ))}
        </div>
      </CardWrap>
    </div>
  );
}

// ─── Section: Documents ───────────────────────────────────────────────────────

const docs = [
  {
    type: "Primary Resume",
    name: "AI/ML Systems Resume (PDF)",
    status: "verified",
    icon: <FileText className="w-4 h-4 text-[#00F0FF]" />,
  },
  {
    type: "Secondary Resume",
    name: "Full-Stack Software Engineering Resume",
    status: "uploaded",
    icon: <FileText className="w-4 h-4 text-white/40" />,
  },
  {
    type: "Certifications",
    name: "Verified Assessment Certificates (4)",
    status: "verified",
    icon: <BadgeCheck className="w-4 h-4 text-[#FFD700]" />,
  },
  {
    type: "Academic Record",
    name: "Official Transcript 2024–2026 (IIIT-T)",
    status: "verified",
    icon: <GraduationCap className="w-4 h-4 text-[#00F0FF]" />,
  },
  {
    type: "Portfolio & Code",
    name: "GitHub Verified Repositories",
    status: "uploaded",
    icon: <Eye className="w-4 h-4 text-white/40" />,
  },
];

function DocStatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    verified: {
      cls: "bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]",
      label: "Verified",
    },
    uploaded: {
      cls: "bg-white/5 border-white/10 text-white/40",
      label: "Uploaded",
    },
    pending: {
      cls: "bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]",
      label: "In Review",
    },
  };
  const s = map[status] ?? map.uploaded;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function DocumentsSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-[#FFD700]" />
            <h2 className="text-xl font-bold font-mono text-white/95">
              Resumes & Documents
            </h2>
          </div>
          <p className="text-xs text-white/45">
            Files utilized by the autonomous agent during application submissions.
          </p>
        </div>
        <button
          onClick={() => marvelAudio.playRepulsorClick()}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono font-bold hover:bg-[#00F0FF] hover:text-black transition-all cursor-pointer shrink-0 ml-4 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Document
        </button>
      </div>

      <CardWrap className="divide-y divide-white/5">
        {docs.map((doc) => (
          <div key={doc.name} className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono font-semibold text-white/90 leading-none mb-1">
                {doc.name}
              </p>
              <p className="text-[10px] font-mono text-white/40">{doc.type}</p>
            </div>
            <DocStatusBadge status={doc.status} />
          </div>
        ))}
      </CardWrap>

      {/* Default application profile */}
      <CardWrap className="p-5">
        <SectionLabel>Default Application Profile</SectionLabel>
        <div className="space-y-2.5 mb-4 font-mono">
          {[
            { label: "Default Resume", value: "AI/ML Systems Resume v3" },
            { label: "Cover Letter Template", value: "Standard Technical Pitch" },
            { label: "Verified Credentials", value: "Skill Passport · Verified" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-xs text-white/40">{row.label}</span>
              <span className="text-xs text-[#00F0FF] font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => marvelAudio.playRepulsorClick()}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/60 hover:text-white hover:border-white/25 transition-all cursor-pointer"
        >
          <Settings className="w-3 h-3" /> Reconfigure Profile
        </button>
      </CardWrap>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

const notifItems = [
  { id: "matches", label: "Opportunity Radar Alerts", desc: "Alert when new high-match internships or jobs are found" },
  { id: "submitted", label: "Autonomous Submission Alerts", desc: "Notification whenever the agent applies on your behalf" },
  { id: "status", label: "Recruiter Status Feed", desc: "Notifications when resume is viewed or shortlisted" },
  { id: "interview", label: "Interview Invitations", desc: "Direct alerts for technical interviews and screening calls" },
  { id: "offers", label: "Offer Notifications", desc: "Immediate notice of formal job and internship offers" },
  { id: "gaps", label: "Skill Gap Alerts", desc: "Notifications when skill gaps are detected for target positions" },
  { id: "learning", label: "Learning Recommendations", desc: "Curated courses, challenges, and roadmaps" },
  { id: "agent", label: "Daily Agent Activity Summary", desc: "Daily digest of autonomous matching and applications" },
];

function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notifItems.map((n) => [n.id, true]))
  );

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Radio className="w-5 h-5 text-[#00F0FF] animate-pulse" />
          <h2 className="text-xl font-bold font-mono text-white/95">
            Notification Preferences
          </h2>
        </div>
        <p className="text-xs text-white/45">
          Select which communication channels and alerts remain active.
        </p>
      </div>
      <CardWrap className="divide-y divide-white/5">
        {notifItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-mono font-semibold text-white/85 leading-none mb-1">
                {item.label}
              </p>
              <p className="text-[11px] text-white/40 leading-relaxed font-sans">{item.desc}</p>
            </div>
            <Toggle
              enabled={enabled[item.id]}
              onChange={(v) => setEnabled((p) => ({ ...p, [item.id]: v }))}
            />
          </div>
        ))}
      </CardWrap>
    </div>
  );
}

// ─── Section: Privacy ─────────────────────────────────────────────────────────

const visibilityOptions = [
  "Private (Only Me)",
  "University Only",
  "Verified Employers",
  "Public",
];

const privacyToggles = [
  { id: "matching", label: "Job Opportunity Matching", desc: "Allow KickSkill matching engine to pair your verified skills with top opportunities" },
  { id: "discovery", label: "Recruiter Discovery", desc: "Permit verified employers to discover and view your verified profile" },
  { id: "ai", label: "Personalized AI Learning", desc: "Use assessment results to customize roadmaps and practice challenges" },
  { id: "storage", label: "Secure Activity Logging", desc: "Maintain audit trail of applications and verification receipts" },
];

const aiSources = [
  "Skill Matrix",
  "Assessment Results",
  "Project Repositories",
  "Certifications",
  "Target Career Goal",
  "Application History",
  "Learning Progress",
  "Industry Demand Data",
];

function PrivacySection({ onSignOut }: { onSignOut: () => void }) {
  const [profileVisibility, setProfileVisibility] = useState("Verified Employers");
  const [passportVisibility, setPassportVisibility] = useState("Verified Employers");
  const [ptEnabled, setPtEnabled] = useState<Record<string, boolean>>({
    matching: true,
    discovery: true,
    ai: true,
    storage: true,
  });
  const [aiEnabled, setAiEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(aiSources.map((s) => [s, true]))
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-[#EC1D24]" />
          <h2 className="text-xl font-bold font-mono text-white/95">
            Privacy & Data Controls
          </h2>
        </div>
        <p className="text-xs text-white/45">
          Manage your profile visibility, data sharing, and privacy settings.
        </p>
      </div>

      {/* Visibility controls */}
      <CardWrap className="p-5">
        <SectionLabel>Profile Visibility Controls</SectionLabel>
        <div className="space-y-4">
          {[
            { label: "Profile Visibility", value: profileVisibility, setter: setProfileVisibility },
            { label: "Public Skill Passport Visibility", value: passportVisibility, setter: setPassportVisibility },
          ].map((item) => (
            <div key={item.label} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <p className="text-xs font-mono text-white/50 mb-2">{item.label}</p>
              <div className="flex flex-wrap gap-2">
                {visibilityOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      marvelAudio.playRepulsorClick();
                      item.setter(opt);
                    }}
                    onMouseEnter={() => marvelAudio.playHudHover()}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      item.value === opt
                        ? "bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.2)] font-semibold"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:bg-white/8"
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardWrap>

      {/* Privacy toggles */}
      <CardWrap className="divide-y divide-white/5">
        {privacyToggles.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-mono font-semibold text-white/85 leading-none mb-1">
                {item.label}
              </p>
              <p className="text-[11px] text-white/40 leading-relaxed font-sans">{item.desc}</p>
            </div>
            <Toggle
              enabled={ptEnabled[item.id]}
              onChange={(v) => setPtEnabled((p) => ({ ...p, [item.id]: v }))}
            />
          </div>
        ))}
      </CardWrap>

      {/* AI personalisation sources */}
      <CardWrap className="p-5">
        <SectionLabel>AI Recommendation Data Sources</SectionLabel>
        <p className="text-[11px] text-white/40 mb-4 leading-relaxed font-sans">
          The autonomous system uses these inputs to provide tailored opportunity matches and study plans.
        </p>
        <div className="space-y-2 font-mono">
          {aiSources.map((src) => (
            <div
              key={src}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-xs text-white/70">{src}</span>
              <Toggle
                enabled={aiEnabled[src]}
                onChange={(v) => setAiEnabled((p) => ({ ...p, [src]: v }))}
              />
            </div>
          ))}
        </div>
      </CardWrap>

      {/* Account */}
      <CardWrap className="p-5 border-white/10">
        <SectionLabel>Account Security & Credentials</SectionLabel>
        <div className="space-y-2 font-mono">
          {[
            { label: "Account Email", value: "nishant@example.com" },
            { label: "Password", value: "••••••••••••" },
            { label: "Two-Factor Auth", value: "Hardware Token (YubiKey 5C)" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="text-xs text-white/40">{row.label}</span>
              <span className="text-xs text-white/75">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-white/10 font-mono">
          <button
            onClick={() => marvelAudio.playRepulsorClick()}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
          >
            <KeyRound className="w-3 h-3 text-[#00F0FF]" /> Change Password
          </button>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              onSignOut();
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white/60 hover:text-[#EC1D24] hover:border-[#EC1D24]/40 transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
          <button
            onClick={() => {
              marvelAudio.playRepulsorClick();
              setShowDeleteConfirm(true);
            }}
            onMouseEnter={() => marvelAudio.playHudHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EC1D24]/30 bg-[#EC1D24]/10 text-xs text-[#EC1D24] hover:bg-[#EC1D24] hover:text-white transition-all cursor-pointer ml-auto"
          >
            <Trash2 className="w-3 h-3" /> Delete Account
          </button>
        </div>
      </CardWrap>

      {/* Delete confirm overlay */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="relative w-full max-w-sm bg-[#0d1117] border-2 border-[#EC1D24] rounded-2xl p-6 shadow-[0_0_50px_rgba(236,29,36,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2 text-[#EC1D24]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold font-mono text-white">
                CONFIRM ACCOUNT DELETION
              </h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mb-5 font-sans">
              This permanently deletes your KickSkill account, verified Skill Passport, credentials, and application history. This action cannot be undone.
            </p>
            <div className="flex gap-2 font-mono">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-white/20 bg-white/5 text-xs text-white/70 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#EC1D24] text-white text-xs font-bold hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.5)]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <CircleUserRound className="w-4 h-4" /> },
  { id: "career", label: "Career Goals", icon: <Target className="w-4 h-4" /> },
  { id: "agent", label: "Agent Settings", icon: <Bot className="w-4 h-4" /> },
  { id: "documents", label: "Documents", icon: <FileText className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "privacy", label: "Privacy & Data", icon: <Shield className="w-4 h-4" /> },
];

interface SettingsPageProps {
  onNavigate: (p: Page) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<Section>("profile");

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-black text-white relative">
      {/* Background Stark scanlines / grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Stark Tech Comic Panels Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/marvel/stark-tech-comic-bg.jpg" decoding="async"
          alt="Stark Tech Backdrop"
          className="w-full h-full object-cover opacity-40 sm:opacity-50 filter contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-black/20 to-[#0d1117]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_30%,rgba(13,17,23,0.5)_75%,#0d1117_100%)]" />
        <HeroTint hero="ironman" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-8 pl-16 sm:pl-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8 border-b border-white/10 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              KickSkill · Settings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans">
            Manage your personal profile, autonomous agent permissions, notifications, and privacy.
          </p>
        </div>

        <MarvelExperienceSettings />

        <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
          {/* Settings nav — vertical on desktop, horizontal on mobile */}
          <nav className="shrink-0 w-full sm:w-56 xl:w-60">
            {/* Mobile: horizontal scroll */}
            <div className="flex sm:hidden gap-1.5 overflow-x-auto pb-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    marvelAudio.playRepulsorClick();
                    setActiveSection(item.id);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                    activeSection === item.id
                      ? "bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
            {/* Desktop: vertical list */}
            <div className="hidden sm:flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      marvelAudio.playRepulsorClick();
                      setActiveSection(item.id);
                    }}
                    onMouseEnter={() => marvelAudio.playHudHover()}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-mono text-left transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF] font-bold shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                        : "border-transparent text-white/50 hover:text-white hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className={isActive ? "text-[#00F0FF]" : "text-white/40"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Section content */}
          <div className="flex-1 min-w-0">
            {activeSection === "profile" && <ProfileSection />}
            {activeSection === "career" && <CareerSection onNavigate={onNavigate} />}
            {activeSection === "agent" && <AgentSection />}
            {activeSection === "documents" && <DocumentsSection />}
            {activeSection === "notifications" && <NotificationsSection />}
            {activeSection === "privacy" && (
              <PrivacySection onSignOut={() => onNavigate("home")} />
            )}
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
