import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import SkillsPage from "./pages/SkillsPage";
import LearningPage from "./pages/LearningPage";
import SkillPassportPage from "./pages/SkillPassportPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import AgentActivityPage from "./pages/AgentActivityPage";
import CareerGoalPage from "./pages/CareerGoalPage";
import SettingsPage from "./pages/SettingsPage";
import IndustryPage from "./pages/IndustryPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

import { MarvelAudioControls } from "./components/marvel/MarvelAudioControls";
import { MarvelParticleOverlay, triggerMarvelBurst } from "./components/marvel/MarvelParticleBurst";
import { ShieldEagleLogo, ArcReactor, AvengersLogo } from "./components/marvel/MarvelIcons";
import { marvelAudio } from "./components/marvel/MarvelAudioEngine";
import { IronManHelmet3D } from "./components/marvel/IronManHelmet3D";
import { ComicPageTransition } from "./components/marvel/ComicPageTransition";
import { IronManFlyBy } from "./components/marvel/IronManFlyBy";
import { SpiderManWebDrop } from "./components/marvel/SpiderManWebDrop";
import { MarvelCelebrations } from "./components/marvel/MarvelCelebrations";
import { useMarvelPrefs } from "./components/marvel/marvelPrefs";
import { HulkCursorCompanion } from "./components/marvel/HulkCursorCompanion";
import StarkAiAssistantDrawer from "./components/chat/StarkAiAssistantDrawer";

export type Page =
  | "home"
  | "opportunities"
  | "skills"
  | "learning"
  | "skill-passport"
  | "applications"
  | "agent-activity"
  | "career-goal"
  | "settings"
  | "industry"
  | "role-select";

import React from "react";
import { api, getCachedUser } from "./lib/api";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class StarkErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Stark HUD Intercepted Render Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-screen bg-[#0A0B10] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
          <div className="relative z-10 max-w-md w-full bg-black/85 border border-[#EC1D24]/60 p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(236,29,36,0.35)] text-center">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-[#EC1D24]">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-black italic uppercase text-white mb-2">
              STARK HUD RE-CALIBRATING
            </h1>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed font-sans">
              A temporary display protocol interrupt was detected. Core systems remain secure.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-[#EC1D24] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff2b33] transition-all cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.5)]"
            >
              Re-initialize HUD
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const VALID_PAGES: Page[] = [
  "home",
  "opportunities",
  "skills",
  "learning",
  "skill-passport",
  "applications",
  "agent-activity",
  "career-goal",
  "settings",
  "industry",
  "role-select",
];


import {
  ArrowUpIcon,
  Paperclip,
  Search,
  BrainCircuit,
  Route,
  FileText,
  Send,
  TrendingUp,
  X,
  Shield,
  Zap,
} from "lucide-react";

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: {
  minHeight: number;
  maxHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current)
      textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <button
      onClick={(e) => {
        marvelAudio.playRepulsorClick();
        triggerMarvelBurst(e.clientX, e.clientY);
        onClick(e);
      }}
      onMouseEnter={() => marvelAudio.playHudHover()}
      className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-white/10 bg-black/80 text-white/90 text-xs sm:text-sm hover:text-white hover:bg-black/95 hover:border-[#EC1D24]/70 hover:shadow-[0_0_15px_rgba(236,29,36,0.35)] transition-colors cursor-pointer group"
    >
      <span className="shrink-0 text-white/70 group-hover:text-[#EC1D24] transition-colors">
        {icon}
      </span>
      <span className="truncate font-medium">{label}</span>
    </button>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface SignUpData {
  name: string;
  email: string;
  institution: string;
  degree: string;
  branch: string;
  graduationYear: string;
  careerGoal: string;
  targetRole: string;
  currentSkills: string;
}

const emptySignUp: SignUpData = {
  name: "",
  email: "",
  institution: "",
  degree: "",
  branch: "",
  graduationYear: "",
  careerGoal: "",
  targetRole: "",
  currentSkills: "",
};

const glassModal =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md";
const glassPanel =
  "relative w-[92%] sm:w-full max-w-sm bg-[#0E1017]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-cyan-500/20 mx-auto";
const inputCls =
  "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-mono";
const labelCls = "block text-xs font-mono text-cyan-400/80 mb-1.5 tracking-wider uppercase";

export default function App() {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState<Page>("role-select");
  const marvelPrefs = useMarvelPrefs();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Stark AI Assistant Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  // Restore authenticated session from SQLite backend / local storage
  useEffect(() => {
    const cached = getCachedUser();
    if (cached) {
      setUserName(cached.name);
      setIsAuthenticated(true);
    }
    if (api.auth.isAuthenticated()) {
      api.auth
        .getMe()
        .then((user) => {
          setUserName(user.name);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // Token expired or server restarted
        });
    }
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.auth.login(authEmail.trim(), authName.trim() || undefined);
      marvelAudio.playVibraniumChime();
      setUserName(res.user.name);
      setIsAuthenticated(true);
      setShowSignIn(false);
      setAuthEmail("");
      setAuthName("");
      setActivePage("home");
    } catch (err: any) {
      setAuthError(err.message || "Unable to sign in. Please verify backend is running.");
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.auth.signup(authEmail.trim(), authName.trim() || undefined);
      marvelAudio.playVibraniumChime();
      setUserName(res.user.name);
      setIsAuthenticated(true);
      setShowSignUp(false);
      setAuthEmail("");
      setAuthName("");
      setActivePage("home");
    } catch (err: any) {
      setAuthError(err.message || "Unable to register. Please verify backend is running.");
    } finally {
      setIsAuthLoading(false);
    }
  }

  function handleQuickAction(prompt: string, targetPage: Page) {
    marvelAudio.playRepulsorClick();
    setActivePage(targetPage);
    setAiPrompt(prompt);
    setIsAiDrawerOpen(true);
  }

  function handleSubmitPrompt(e?: React.MouseEvent) {
    if (!message.trim()) return;
    marvelAudio.playRepulsorClick();
    if (e) triggerMarvelBurst(e.clientX, e.clientY);
    const query = message.trim();
    setMessage("");
    setAiPrompt(query);
    setIsAiDrawerOpen(true);
  }


  const quickActions: { icon: React.ReactNode; label: string; prompt: string; page: Page }[] = [
    {
      icon: <Search className="w-4 h-4" />,
      label: "Find Opportunities",
      prompt: "Find the strongest opportunities and internships matching my verified skills.",
      page: "opportunities",
    },
    {
      icon: <BrainCircuit className="w-4 h-4" />,
      label: "Analyze My Skills",
      prompt: "Analyze my verified skills and identify gaps for my target role.",
      page: "skills",
    },
    {
      icon: <Route className="w-4 h-4" />,
      label: "Career Roadmap",
      prompt: "Generate a personalized career roadmap to achieve my target role.",
      page: "learning",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Improve My Resume",
      prompt: "Review my experience and optimize my resume for high-match opportunities.",
      page: "settings",
    },
    {
      icon: <Send className="w-4 h-4" />,
      label: "Apply for Me",
      prompt: "Prepare and submit applications for qualifying opportunities based on my preferences.",
      page: "applications",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Career Progress",
      prompt: "Show a summary of my skill progress, active applications, and milestone readiness.",
      page: "skill-passport",
    },
  ];

  return (
    <StarkErrorBoundary>
    <main className="w-full h-full bg-[#0A0B10] text-white overflow-hidden relative">
      {/* Stark HUD Scanline Overlay */}
      <div className="hud-scanline-active pointer-events-none" />
      <ComicPageTransition page={activePage} />

      {/* Global Marvel Particle Burst Effect */}
      <MarvelParticleOverlay />

      {/* Hanging Hulk Cursor Companion (Gravity, Inertia & Smash Punch) */}
      {marvelPrefs.hulkCursor && <HulkCursorCompanion />}
      <MarvelCelebrations />
      {activePage !== "role-select" && <SpiderManWebDrop />}
      {activePage !== "role-select" && <IronManFlyBy />}

      {/* Sidebar Navigation */}
      {activePage !== "role-select" && activePage !== "industry" && (
        <Sidebar
          expanded={sidebarExpanded}
          onExpandChange={setSidebarExpanded}
          activePage={activePage}
          onNavigate={setActivePage}
          onOpenStarkAi={() => {
            setAiPrompt("");
            setIsAiDrawerOpen(true);
          }}
          onSignOut={() => {
            api.auth.logout();
            setIsAuthenticated(false);
            setUserName("");
            setActivePage("role-select");
          }}
        />
      )}

      {/* Global Top-Right Header (Music Off / On Controls + Auth) */}
      {activePage !== "role-select" && (
        <div className="fixed top-3.5 right-3.5 sm:top-5 sm:right-6 flex items-center gap-2.5 z-40 pointer-events-auto">
          <MarvelAudioControls />

          {activePage === "home" && (
            isAuthenticated ? (
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  api.auth.logout();
                  setIsAuthenticated(false);
                  setUserName("");
                  setActivePage("role-select");
                }}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#EC1D24] text-neutral-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  setShowSignIn(true);
                }}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium border border-white/20 bg-white/5 hover:bg-[#EC1D24] hover:border-[#EC1D24] text-white transition-all cursor-pointer shadow-sm backdrop-blur-md"
              >
                Sign In
              </button>
            )
          )}
        </div>
      )}

      {/* Sub-Pages */}
      {activePage === "opportunities" && (
        <div className="relative w-full h-full">
          <OpportunitiesPage />
        </div>
      )}
      {activePage === "skills" && (
        <div className="relative w-full h-full">
          <SkillsPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "learning" && (
        <div className="relative w-full h-full">
          <LearningPage />
        </div>
      )}
      {activePage === "skill-passport" && (
        <div className="relative w-full h-full">
          <SkillPassportPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "applications" && (
        <div className="relative w-full h-full">
          <ApplicationsPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "agent-activity" && (
        <div className="relative w-full h-full">
          <AgentActivityPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "career-goal" && (
        <div className="relative w-full h-full">
          <CareerGoalPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "settings" && (
        <div className="relative w-full h-full">
          <SettingsPage onNavigate={setActivePage} />
        </div>
      )}
      {activePage === "industry" && (
        <div className="fixed inset-0 z-20">
          <IndustryPage
            onSwitchWorkspace={() => setActivePage("home")}
            onSignOut={() => setActivePage("role-select")}
          />
        </div>
      )}
      {(activePage === "role-select" || !VALID_PAGES.includes(activePage)) && (
        <div className="fixed inset-0 z-30">
          <RoleSelectionPage onNavigate={setActivePage} />
        </div>
      )}

      {/* Command Center / Hero Home Page */}
      <div
        className={`relative w-full h-full bg-black flex flex-col items-center justify-between overflow-hidden ${
          activePage !== "home" ? "hidden" : ""
        }`}
      >
        {/* Marvel Comic Collage Wallpaper (Center Marvel Logo removed) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <img
            src="/marvel/marvel-comic-collage.jpg"
            alt="Marvel Comic Collage"
            className="w-full h-full object-cover opacity-60 sm:opacity-65 filter contrast-125 saturate-120"
          />
          {/* Subtle gradient vignette to blend seamlessly into UI & horizon curve */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(10,11,16,0.35)_70%,#0A0B10_100%)]" />
        </div>

        {/* Marvel Red Horizon Arc & Atmospheric Flare */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 -translate-y-7 sm:-translate-y-8 md:-translate-y-9">
          {/* Ambient red atmospheric radiant flare */}
          <div className="absolute w-[800px] sm:w-[1100px] h-[350px] sm:h-[450px] rounded-[100%] bg-gradient-to-t from-[#EC1D24]/20 via-[#EC1D24]/10 to-transparent blur-3xl transform -translate-y-4" />
          {/* Luminous red horizon curved edge */}
          <div
            className="absolute w-[750px] sm:w-[1020px] h-[300px] sm:h-[380px] rounded-[100%] border-t-2 border-[#EC1D24]/80 shadow-[0_-15px_80px_rgba(236,29,36,0.65)]"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(236, 29, 36, 0.35) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)",
              transform: "translateY(24px)",
            }}
          />
        </div>



        {/* Scrollable middle */}
        <div className="flex-1 w-full overflow-y-auto min-h-0" />

        {/* Fixed bottom: Marvel Logo + Iron Man Helmet + KickSkill AI + JARVIS + Input + Action Pills */}
        <div className="relative z-10 w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6 pb-8 sm:pb-14 md:pb-[14vh] shrink-0 mx-auto flex flex-col items-center">
          {/* Hero Branding - Layered in-depth behind prompt box (Depth Wallpaper effect) */}
          <div className="text-center relative z-10 -mb-6 sm:-mb-8 md:-mb-10 lg:-mb-11 -translate-y-7 sm:-translate-y-8 md:-translate-y-9 flex flex-col items-center pointer-events-none select-none">
            {/* Authenticated greeting banner if logged in */}
            {isAuthenticated && (
              <p className="text-xs sm:text-sm font-semibold font-mono tracking-wider text-white/80 mb-1.5">
                {getGreeting()}, {userName}
              </p>
            )}

            {/* Iron Man Helmet — 3D cursor-tracking head */}
            <div className="mb-2 sm:mb-3 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center filter drop-shadow-[0_0_22px_rgba(236,29,36,0.9)]">
              <IronManHelmet3D className="w-full h-full" />
            </div>

            {/* Marvel Studios Logo Lockup for KickSkill AI — Scaled larger & responsive for phone */}
            <div className="inline-flex items-stretch select-none my-1 shadow-[0_0_60px_rgba(236,29,36,0.6)] max-w-[94vw] sm:max-w-none">
              {/* Red Box with KICKSKILL */}
              <div className="bg-[#EC1D24] text-white font-black italic tracking-tight px-4 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-3.5 md:py-4 lg:py-5 text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase flex items-center justify-center font-sans leading-none border-2 sm:border-3 md:border-4 border-[#EC1D24] rounded-[2px] shadow-inner">
                KICKSKILL
              </div>
              {/* Marvel Studios-style AI box with top & bottom white lines */}
              <div className="flex flex-col justify-between ml-2 sm:ml-3 md:ml-4 py-0.5 sm:py-1 md:py-1.5 self-stretch">
                <div className="h-[2.5px] sm:h-[3.5px] md:h-[4.5px] lg:h-[5px] bg-white w-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
                <span className="text-white font-black tracking-[0.2em] sm:tracking-[0.25em] text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase px-2.5 sm:px-4 md:px-6 lg:px-7 leading-none flex items-center justify-center font-sans">
                  AI
                </span>
                <div className="h-[2.5px] sm:h-[3.5px] md:h-[4.5px] lg:h-[5px] bg-white w-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
              </div>
            </div>
          </div>

          {/* AI Chat Input Box - In Foreground (z-20) with transparent glass so logo shade shows through without backdrop-blur overhead */}
          <div className="relative z-20 w-full bg-[#0A0B10]/75 rounded-2xl border border-white/20 h-[104px] flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] focus-within:border-[#EC1D24]/70 focus-within:shadow-[0_0_35px_rgba(236,29,36,0.35)] transition-colors isolate">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitPrompt();
                }
              }}
              placeholder="Ask KickSkill anything about your career (e.g. Find ML internships, Audit skills)..."
              className="w-full flex-1 px-4 pt-3 resize-none border-none bg-transparent text-white text-sm focus:outline-none placeholder:text-neutral-400 font-sans"
              style={{ overflow: "hidden", height: "100%" }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                className="hidden"
              />
              <button
                onClick={() => {
                  marvelAudio.playHudHover();
                  fileInputRef.current?.click();
                }}
                title="Attach resume or document"
                className="p-2 rounded-md text-white/60 hover:text-white cursor-pointer group transition-colors"
              >
                <Paperclip className="w-4 h-4 transition-transform duration-200 group-hover:rotate-[-20deg]" />
              </button>

              <button
                disabled={!message.trim()}
                onClick={(e) => handleSubmitPrompt(e)}
                className={`p-2 rounded-lg text-white disabled:cursor-not-allowed cursor-pointer group transition-all duration-200 ${
                  message.trim()
                    ? "bg-[#EC1D24] hover:bg-[#ff2b33] shadow-[0_0_12px_rgba(236,29,36,0.6)]"
                    : "bg-white/10 text-white/30"
                }`}
              >
                <ArrowUpIcon className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Pills (same circular/capsule shape as circled) */}
          <div className="relative z-20 flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-4 max-w-full">
            {quickActions.map((a) => (
              <QuickAction
                key={a.label}
                icon={a.icon}
                label={a.label}
                onClick={() => handleQuickAction(a.prompt, a.page)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className={glassModal} onClick={() => { setShowSignIn(false); setAuthError(""); }}>
          <div className={glassPanel} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                setShowSignIn(false);
                setAuthError("");
              }}
              className="absolute top-4 right-4 text-cyan-400/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldEagleLogo className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-mono text-[#EC1D24] font-bold uppercase tracking-widest">
                  Authentication
                </span>
              </div>
              <h2 className="text-2xl font-black italic text-white tracking-wide uppercase">
                Welcome Back
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Sign in to your Skill Passport with your email
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
                {authError}
              </div>
            )}

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Your Name (Optional)</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Tony Stark"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={isAuthLoading || !authEmail.trim()}
                className="mt-2 w-full py-2.5 rounded-xl border border-yellow-400/40 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_20px_rgba(236,29,36,0.4)]"
              >
                {isAuthLoading ? "Authenticating..." : "Sign In with Stark ID"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-zinc-400">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                  setAuthError("");
                }}
                className="text-[#EC1D24] hover:underline cursor-pointer font-bold"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className={glassModal} onClick={() => { setShowSignUp(false); setAuthError(""); }}>
          <div className={glassPanel} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowSignUp(false);
                setAuthError("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldEagleLogo className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-mono text-[#EC1D24] font-bold uppercase tracking-widest">
                  Quick Registration
                </span>
              </div>
              <h2 className="text-xl font-black italic text-white mb-1 uppercase">
                Create Your Account
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Enter your name and email to initialize your passport
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
                {authError}
              </div>
            )}

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Peter Parker"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="peter.parker@university.edu"
                  className={inputCls}
                />
              </div>
              <button
                type="submit"
                disabled={isAuthLoading || !authEmail.trim()}
                className="mt-2 w-full py-2.5 rounded-lg border border-yellow-400 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(236,29,36,0.5)]"
              >
                {isAuthLoading ? "Initializing..." : "Create Account & Enter"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-zinc-400">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                  setAuthError("");
                }}
                className="text-[#EC1D24] hover:underline cursor-pointer font-bold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Floating Stark Tactical AI HUD Button */}
      {activePage !== "role-select" && activePage !== "industry" && (
        <button
          onClick={(e) => {
            marvelAudio.playRepulsorClick();
            triggerMarvelBurst(e.clientX, e.clientY);
            setAiPrompt("");
            setIsAiDrawerOpen(true);
          }}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-black/90 border border-cyan-500/50 hover:border-[#EC1D24] text-white shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(236,29,36,0.6)] backdrop-blur-xl transition-all duration-300 cursor-pointer"
          title="Engage Stark Tactical AI Assistant"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
            <ArcReactor className="w-full h-full text-cyan-400 group-hover:text-red-400 transition-colors" pulse={true} />
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] sm:text-xs font-black italic uppercase tracking-wider text-white group-hover:text-red-400 transition-colors font-sans leading-tight">
              STARK AI
            </span>
            <span className="text-[9px] font-mono text-cyan-400/90 leading-tight">
              ASSISTANT // ONLINE
            </span>
          </div>
        </button>
      )}

      {/* Live Stark AI Assistant Drawer */}
      <StarkAiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        initialPrompt={aiPrompt}
        pageContext={activePage}
        onNavigate={(page) => {
          if (VALID_PAGES.includes(page as Page)) {
            setActivePage(page as Page);
          }
        }}
      />
    </main>
    </StarkErrorBoundary>
  );
}
