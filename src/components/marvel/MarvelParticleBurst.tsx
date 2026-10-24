import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface BurstEvent {
  id: number;
  x: number;
  y: number;
  comicText?: string;
  particles: Particle[];
}

const COMIC_PHRASES = ["VERIFIED!", "SKILL UNLOCKED!", "MATCHED!", "EXCELLENCE!"];
const MARVEL_COLORS = ["#00F0FF", "#EC1D24", "#FFD700", "#FFFFFF", "#9333EA"];

let globalTriggerBurst: ((x: number, y: number, text?: string) => void) | null = null;

export const triggerMarvelBurst = (x: number, y: number, text?: string) => {
  if (globalTriggerBurst) {
    globalTriggerBurst(x, y, text);
  }
};

export const MarvelParticleOverlay: React.FC = () => {
  const [bursts, setBursts] = useState<BurstEvent[]>([]);

  useEffect(() => {
    globalTriggerBurst = (x: number, y: number, text?: string) => {
      const burstId = Date.now() + Math.random();
      const phrase = text || COMIC_PHRASES[Math.floor(Math.random() * COMIC_PHRASES.length)];

      const particles: Particle[] = [];
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 40 + Math.random() * 80;
        particles.push({
          id: i,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: MARVEL_COLORS[Math.floor(Math.random() * MARVEL_COLORS.length)],
          size: Math.random() * 6 + 4,
        });
      }

      setBursts((prev) => [...prev.slice(-4), { id: burstId, x, y, comicText: phrase, particles }]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 700);
    };

    return () => {
      globalTriggerBurst = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}
          >
            {/* Comic Action Bubble */}
            {burst.comicText && (
              <motion.div
                initial={{ scale: 0.2, y: 0, opacity: 1, rotate: -10 + Math.random() * 20 }}
                animate={{ scale: 1.2, y: -45, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
              >
                <span className="inline-block bg-yellow-400 text-black border-2 border-black font-black italic px-2 py-0.5 text-xs sm:text-sm tracking-wider shadow-[3px_3px_0_#EC1D24] uppercase">
                  {burst.comicText}
                </span>
              </motion.div>
            )}

            {/* Repulsor Energy Sparkles */}
            {burst.particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: p.vx,
                  y: p.vy,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
