import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMarvelPrefs } from "./marvelPrefs";

// Hero emblem + comic caption per student page
const PAGE_HEROES: Record<string, { img: string; caption: string }> = {
  home: { img: "/marvel/ironman-helmet.svg", caption: "Command Center" },
  opportunities: { img: "/marvel/spiderman-face.svg", caption: "Opportunities" },
  skills: { img: "/marvel/captain-america-face.svg", caption: "Skills" },
  learning: { img: "/marvel/hulk-face.svg", caption: "Learning" },
  "skill-passport": { img: "/marvel/thor-face.svg", caption: "Skill Passport" },
  applications: { img: "/marvel/black-widow-face.svg", caption: "Applications" },
  "agent-activity": { img: "/marvel/black-panther-face.svg", caption: "Agent Activity" },
  "career-goal": { img: "/marvel/shield-mission.svg", caption: "Career Goal" },
  settings: { img: "/marvel/ironman-face.svg", caption: "Settings" },
  industry: { img: "/marvel/shield-mission.svg", caption: "Recruiter Console" },
  // Recruiter console sections
  "r:ai-recruiting": { img: "/marvel/ironman-helmet.svg", caption: "AI Talent Search" },
  "r:dashboard": { img: "/marvel/ironman-face.svg", caption: "Dashboard" },
  "r:opportunities": { img: "/marvel/spiderman-face.svg", caption: "Active Roles" },
  "r:candidates": { img: "/marvel/captain-america-face.svg", caption: "Candidates" },
  "r:shortlist": { img: "/marvel/black-widow-face.svg", caption: "Shortlist" },
  "r:interviews": { img: "/marvel/black-panther-face.svg", caption: "Interviews" },
  "r:skill-demand": { img: "/marvel/hulk-face.svg", caption: "Skill Demand" },
  "r:company-profile": { img: "/marvel/thor-face.svg", caption: "Company Profile" },
  "r:settings": { img: "/marvel/shield-mission.svg", caption: "Settings" },
};

/** Quick red comic-panel wipe with the page's hero emblem on every page change. */
export function ComicPageTransition({ page }: { page: string }) {
  const [shown, setShown] = useState<string | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!PAGE_HEROES[page] || !getMarvelPrefs().animations) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(page);
    const t = setTimeout(() => setShown(null), 650);
    return () => clearTimeout(t);
  }, [page]);

  const hero = shown ? PAGE_HEROES[shown] : null;

  return (
    <AnimatePresence>
      {hero && (
        <motion.div
          key={shown}
          className="fixed inset-0 z-[998] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
          animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
          exit={{ clipPath: "polygon(120% 0, 120% 0, 100% 100%, 100% 100%)" }}
          transition={{ duration: 0.32, ease: [0.7, 0, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-[#EC1D24]" />
          <div className="absolute inset-0 comic-halftone-dark" />
          <div className="absolute inset-0 comic-speed-lines" />
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: -3, opacity: 1 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
            className="relative flex items-center gap-4 bg-black px-6 py-4 border-4 border-white shadow-[8px_8px_0_#000]"
          >
            <img src={hero.img} alt="" className="w-12 h-12 object-contain" />
            <span className="comic-title text-2xl sm:text-4xl text-white">{hero.caption}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
