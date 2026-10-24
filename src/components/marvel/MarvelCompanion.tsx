import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marvelAudio } from "./MarvelAudioEngine";
import { triggerMarvelBurst } from "./MarvelParticleBurst";
import { Sparkles, X, ChevronUp, Bot } from "lucide-react";

const CAREER_TELEMETRY = [
  "Deterministic match engine: ALL SYSTEMS VERIFIED.",
  "Scanning verified industry vacancies & internships...",
  "Skill Passport cryptographic audit: 100% verified.",
  "Course benchmarks & project milestones synchronized.",
  "Career Readiness Index: 88th percentile active.",
  "Credential privacy & verification: ACTIVE (Zero leaks).",
];

export const MarvelCompanion: React.FC = () => {
  const [currentText, setCurrentText] = useState<string>(CAREER_TELEMETRY[0]);
  const [character, setCharacter] = useState<"ironman" | "spiderman" | "groot">("ironman");
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Cycle telemetry updates every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * CAREER_TELEMETRY.length);
      setCurrentText(CAREER_TELEMETRY[nextIndex]);
      setIsBubbleVisible(true);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroClick = (e: React.MouseEvent) => {
    marvelAudio.playRepulsorClick();
    triggerMarvelBurst(e.clientX, e.clientY, "SKILLS VERIFIED!");

    // Cycle character
    const heroes: Array<"ironman" | "spiderman" | "groot"> = ["ironman", "spiderman", "groot"];
    const nextHero = heroes[(heroes.indexOf(character) + 1) % heroes.length];
    setCharacter(nextHero);

    // Pick a lively transmission
    const quotes = {
      ironman: "Ready to calibrate your skills and target top engineering roles.",
      spiderman: "Tracking verified opportunities matching your skillset!",
      groot: "All career telemetry and credential audits operational!",
    };
    setCurrentText(quotes[nextHero]);
    setIsBubbleVisible(true);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          marvelAudio.playRepulsorClick();
        }}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 bg-[#EC1D24] text-white px-3 py-1.5 rounded-full font-mono text-xs font-bold shadow-[0_0_15px_rgba(236,29,36,0.5)] border border-yellow-400 hover:scale-105 transition-all cursor-pointer"
      >
        <Bot className="w-4 h-4 animate-bounce" />
        <span>CAREER COPILOT</span>
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none">
      {/* Speech Bubble / Telemetry HUD */}
      <AnimatePresence>
        {isBubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 max-w-[240px] sm:max-w-[280px] bg-black/90 backdrop-blur-md border border-cyan-400/50 p-2.5 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.25)] relative text-left"
          >
            {/* Header / Timestamp */}
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 border-b border-cyan-500/30 pb-1 mb-1.5">
              <span className="flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                CAREER COPILOT
              </span>
              <button
                onClick={() => setIsBubbleVisible(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs font-sans text-zinc-200 leading-snug">
              {currentText}
            </p>

            {/* Bubble arrow pointer */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-black border-r border-b border-cyan-400/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Character */}
      <div className="relative group">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={handleHeroClick}
          onMouseEnter={() => marvelAudio.playHudHover()}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#990B11] via-[#EC1D24] to-[#FF453A] border-2 border-yellow-400 p-1 shadow-[0_0_25px_rgba(236,29,36,0.7)] cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          {/* Character Avatar Rendering */}
          {character === "ironman" && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Iron Man Helmet */}
              <path
                d="M20 30 C20 15 35 10 50 10 C65 10 80 15 80 30 L80 65 C80 80 65 90 50 90 C35 90 20 80 20 65 Z"
                fill="#800A0E"
              />
              <path
                d="M30 35 L70 35 L72 58 L62 76 L38 76 L28 58 Z"
                fill="#FFD700"
                stroke="#C69214"
                strokeWidth="2"
              />
              {/* Glowing Arc Eyes */}
              <polygon points="36,48 47,48 45,52 38,52" fill="#00F0FF" className="animate-pulse" />
              <polygon points="53,48 64,48 62,52 55,52" fill="#00F0FF" className="animate-pulse" />
              {/* Mouth slit */}
              <line x1="43" y1="67" x2="57" y2="67" stroke="#800A0E" strokeWidth="2.5" />
            </svg>
          )}

          {character === "spiderman" && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Spidey Head */}
              <circle cx="50" cy="50" r="42" fill="#D32F2F" />
              {/* Web Lines */}
              <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="#000" strokeWidth="1.5" opacity="0.4" />
              {/* Large Comic Eyes */}
              <path
                d="M24 40 Q38 32 46 54 Q36 62 24 40 Z"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3.5"
              />
              <path
                d="M76 40 Q62 32 54 54 Q64 62 76 40 Z"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="3.5"
              />
            </svg>
          )}

          {character === "groot" && (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Groot Bark Head */}
              <path
                d="M25 45 C25 25 35 15 50 18 C65 15 75 25 75 45 L72 80 C60 88 40 88 28 80 Z"
                fill="#6D4C41"
              />
              {/* Sprout Twig on top */}
              <path d="M45 18 Q40 5 35 10 Q42 12 45 18 Z" fill="#4CAF50" />
              {/* Cute Eyes */}
              <circle cx="40" cy="50" r="5" fill="#1A1A1A" />
              <circle cx="60" cy="50" r="5" fill="#1A1A1A" />
              <circle cx="42" cy="48" r="1.5" fill="#FFFFFF" />
              <circle cx="62" cy="48" r="1.5" fill="#FFFFFF" />
              {/* Smile */}
              <path d="M44 65 Q50 70 56 65" stroke="#3E2723" strokeWidth="2.5" fill="none" />
            </svg>
          )}

          {/* Repulsor Glow Dot */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#00F0FF] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>
        </motion.div>

        {/* Small Action tooltip on hover */}
        <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[9px] font-mono text-zinc-300 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap pointer-events-none">
          Click to switch character
        </div>
      </div>
    </div>
  );
};
