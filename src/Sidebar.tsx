import { useState } from "react";
import type { Page } from "./App";
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  FolderKanban,
  BadgeCheck,
  AlertCircle,
  ClipboardCheck,
  Route,
  UserRound,
  Folder,
  Award,
  Trophy,
  List,
  Loader2,
  CalendarCheck,
  XCircle,
  Target,
  Settings,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { marvelAudio } from "./components/marvel/MarvelAudioEngine";
import { KickSkillLogo } from "./components/marvel/KickSkillLogo";

interface SubItem {
  icon: React.ReactNode;
  label: string;
}

interface NavItemDef {
  imageSrc: string;
  imageAlt: string;
  label: string;
  subItems?: SubItem[];
}

const mainNav: NavItemDef[] = [
  {
    imageSrc: "/marvel/ironman-helmet.svg",
    imageAlt: "Iron Man",
    label: "Home",
  },
  {
    imageSrc: "/marvel/spiderman-face.svg",
    imageAlt: "Spider-Man",
    label: "Opportunities",
    subItems: [
      { icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, label: "Recommended" },
      { icon: <GraduationCap className="w-3.5 h-3.5 text-blue-400" />, label: "Internships" },
      { icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />, label: "Jobs" },
      { icon: <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />, label: "Projects" },
    ],
  },
  {
    imageSrc: "/marvel/captain-america-face.svg",
    imageAlt: "Captain America",
    label: "Skills",
    subItems: [
      { icon: <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />, label: "Verified Skills" },
      { icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />, label: "Skill Gaps" },
      { icon: <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />, label: "Skill Assessments" },
    ],
  },
  {
    imageSrc: "/marvel/hulk-face.svg",
    imageAlt: "Hulk",
    label: "Learning",
    subItems: [
      { icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />, label: "Recommended Tracks" },
      { icon: <Route className="w-3.5 h-3.5 text-emerald-400" />, label: "Career Roadmaps" },
      { icon: <GraduationCap className="w-3.5 h-3.5 text-blue-400" />, label: "Courses" },
      { icon: <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />, label: "Projects & Labs" },
    ],
  },
  {
    imageSrc: "/marvel/thor-face.svg",
    imageAlt: "Thor",
    label: "Skill Passport",
    subItems: [
      { icon: <UserRound className="w-3.5 h-3.5 text-zinc-300" />, label: "Overview" },
      { icon: <Folder className="w-3.5 h-3.5 text-blue-400" />, label: "Work & Projects" },
      { icon: <Award className="w-3.5 h-3.5 text-amber-400" />, label: "Credentials" },
      { icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />, label: "Achievements" },
    ],
  },
  {
    imageSrc: "/marvel/black-widow-face.svg",
    imageAlt: "Black Widow",
    label: "Applications",
    subItems: [
      { icon: <List className="w-3.5 h-3.5 text-zinc-300" />, label: "All Applications" },
      { icon: <Loader2 className="w-3.5 h-3.5 text-blue-400" />, label: "Under Review" },
      { icon: <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />, label: "Interviews" },
      { icon: <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />, label: "Offers" },
      { icon: <XCircle className="w-3.5 h-3.5 text-zinc-400" />, label: "Archived" },
    ],
  },
];

const bottomNav = [
  {
    icon: <Target className="w-4 h-4 text-[#EC1D24]" />,
    label: "Career Goal",
    page: "career-goal" as Page,
  },
  {
    icon: <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white" />,
    label: "Settings",
    page: "settings" as Page,
  },
];

const pageMap: Record<string, Page> = {
  Home: "home",
  Opportunities: "opportunities",
  Skills: "skills",
  Learning: "learning",
  "Skill Passport": "skill-passport",
  Applications: "applications",
};

function NavRow({
  item,
  openSections,
  onToggleSection,
  activePage,
  onNavigate,
  onClose,
}: {
  item: NavItemDef;
  openSections: Set<string>;
  onToggleSection: (label: string) => void;
  activePage: Page;
  onNavigate: (p: Page) => void;
  onClose: () => void;
}) {
  const hasChildren = item.subItems && item.subItems.length > 0;
  const isOpen = openSections.has(item.label);
  const mappedPage = pageMap[item.label];
  const isActive = mappedPage !== undefined && activePage === mappedPage;

  function handleClick() {
    if (mappedPage) {
      onNavigate(mappedPage);
      onClose();
    } else if (hasChildren) {
      onToggleSection(item.label);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        onMouseEnter={() => marvelAudio.playHudHover()}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group justify-start relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-[#EC1D24]/20 via-[#EC1D24]/10 to-transparent text-white border border-[#EC1D24]/50 shadow-[0_0_20px_rgba(236,29,36,0.25)] font-semibold"
            : "text-neutral-300 hover:text-white hover:bg-[#EC1D24]/10 hover:border-[#EC1D24]/30 border border-transparent"
        }`}
      >
        {/* Subtle active left red glow bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#EC1D24] rounded-r shadow-[0_0_10px_#EC1D24]" />
        )}
        <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-lg bg-black/40 border border-white/10 p-0.5 group-hover:border-[#EC1D24]/60 group-hover:shadow-[0_0_12px_rgba(236,29,36,0.35)] transition-all">
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="w-full h-full object-contain transition-transform group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="flex-1 text-left min-w-0">
          <span className="text-sm font-medium tracking-wide truncate block">
            {item.label}
          </span>
        </div>
        {hasChildren && (
          <ChevronRight
            onClick={(e) => {
              e.stopPropagation();
              marvelAudio.playRepulsorClick();
              onToggleSection(item.label);
            }}
            className={`w-4 h-4 text-neutral-500 hover:text-white transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-90 text-[#EC1D24]" : ""
            }`}
          />
        )}
      </button>

      {/* Sub-items */}
      {hasChildren && isOpen && (
        <div className="ml-6 pl-3 border-l-2 border-[#EC1D24]/30 mt-1 mb-1.5 space-y-0.5">
          {item.subItems!.map((sub) => (
            <button
              key={sub.label}
              onClick={() => {
                marvelAudio.playRepulsorClick();
                if (mappedPage) onNavigate(mappedPage);
                onClose();
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-[#EC1D24]/10 transition-colors cursor-pointer text-left"
            >
              <span className="shrink-0">{sub.icon}</span>
              <span className="truncate">{sub.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  expanded: boolean;
  onExpandChange: (v: boolean) => void;
  activePage: Page;
  onNavigate: (p: Page) => void;
  onSignOut: () => void;
}

export default function Sidebar({
  expanded,
  onExpandChange,
  activePage,
  onNavigate,
  onSignOut,
}: SidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  function toggleSection(label: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function handleCollapse() {
    onExpandChange(false);
  }

  function handleToggle() {
    marvelAudio.playRepulsorClick();
    onExpandChange(!expanded);
  }

  return (
    <>
      {/* Floating menu button when closed */}
      {!expanded && (
        <button
          onClick={handleToggle}
          onMouseEnter={() => marvelAudio.playHudHover()}
          aria-label="Open Menu"
          className="fixed top-3.5 left-3.5 sm:top-4 sm:left-4 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black/90 hover:bg-black border border-white/20 hover:border-[#4ade80]/60 text-neutral-300 hover:text-white backdrop-blur-xl shadow-[0_0_20px_rgba(74,222,128,0.25)] hover:shadow-[0_0_25px_rgba(74,222,128,0.45)] transition-all duration-200 cursor-pointer group active:scale-95"
        >
          <img
            src="/marvel/avengers-logo-cutout.png"
            alt="Avengers Menu"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-110 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]"
          />
        </button>
      )}

      {/* Overlay backdrop when expanded */}
      <div
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCollapse}
      />

      {/* Slide-out drawer when expanded */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col
          w-[275px] sm:w-[290px] bg-[#08090D]/98 backdrop-blur-2xl border-r border-[#EC1D24]/30
          shadow-[15px_0_50px_rgba(236,29,36,0.15)] transition-transform duration-300 ease-in-out
          ${expanded ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header with Marvel-themed KickSkill logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#EC1D24]/20 shrink-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 relative">
          <div className="flex items-center cursor-pointer" onClick={() => { onNavigate("home"); handleCollapse(); }}>
            <KickSkillLogo size="sm" showSubtitle subtitle="Verified Skill Platform" />
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

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 px-3">
          {mainNav.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              openSections={openSections}
              onToggleSection={toggleSection}
              activePage={activePage}
              onNavigate={onNavigate}
              onClose={handleCollapse}
            />
          ))}

          {/* AI Agent section */}
          <div className="pt-3 mt-3 border-t border-white/10">
            <p className="px-3 pb-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              AI AGENT
            </p>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onNavigate("agent-activity");
                handleCollapse();
              }}
              onMouseEnter={() => marvelAudio.playHudHover()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group justify-start relative ${
                activePage === "agent-activity"
                  ? "bg-gradient-to-r from-[#EC1D24]/20 via-[#EC1D24]/10 to-transparent text-white border border-[#EC1D24]/50 shadow-[0_0_20px_rgba(236,29,36,0.25)] font-semibold"
                  : "text-neutral-300 hover:text-white hover:bg-[#EC1D24]/10 hover:border-[#EC1D24]/30 border border-transparent"
              }`}
            >
              {activePage === "agent-activity" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#EC1D24] rounded-r shadow-[0_0_10px_#EC1D24]" />
              )}
              <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-lg bg-black/40 border border-white/10 p-0.5 group-hover:border-[#EC1D24]/60 group-hover:shadow-[0_0_12px_rgba(236,29,36,0.35)] transition-all">
                <img
                  src="/marvel/black-panther-face.svg"
                  alt="AI Agent"
                  className="w-full h-full object-contain transition-transform group-hover:scale-115 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </div>
              <span className="text-sm font-medium tracking-wide">Agent Activity</span>
            </button>
          </div>
        </div>

        {/* Bottom links */}
        <div className="shrink-0 border-t border-white/10 px-3 py-2 space-y-1">
          {bottomNav.map((b) => {
            const isActive = activePage === b.page;
            return (
              <button
                key={b.label}
                onClick={() => {
                  marvelAudio.playRepulsorClick();
                  onNavigate(b.page);
                  handleCollapse();
                }}
                onMouseEnter={() => marvelAudio.playHudHover()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group justify-start relative ${
                  isActive
                    ? "bg-gradient-to-r from-[#EC1D24]/20 via-[#EC1D24]/10 to-transparent text-white border border-[#EC1D24]/50 font-semibold"
                    : "text-neutral-300 hover:text-white hover:bg-[#EC1D24]/10 hover:border-[#EC1D24]/30 border border-transparent"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#EC1D24] rounded-r shadow-[0_0_8px_#EC1D24]" />
                )}
                <span className="shrink-0">{b.icon}</span>
                <span className="text-sm font-medium">{b.label}</span>
              </button>
            );
          })}
        </div>

        {/* User identity & sign out */}
        <div className="shrink-0 border-t border-white/10 px-3 py-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-black/60 border border-[#EC1D24]/25 hover:border-[#EC1D24]/50 shadow-sm transition-colors">
            <div className="w-9 h-9 rounded-full bg-neutral-900 border border-[#EC1D24]/40 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-[0_0_8px_rgba(236,29,36,0.3)]">
              <img
                src="/marvel/ironman-helmet.svg"
                alt="Avatar"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-none mb-1">
                Nishant
              </p>
              <p className="text-xs text-neutral-400 truncate">Student · IIIT-T</p>
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
