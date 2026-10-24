import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarvelPrefs } from "./marvelPrefs";

const FIRST_FLIGHT_MS = 25000;
const INTERVAL_MS = 120000; // every 2 minutes
const FLIGHT_S = 3.6;

/** Iron Man streaks across the top of the screen with a repulsor trail, every couple of minutes. */
export function IronManFlyBy() {
  const { animations } = useMarvelPrefs();
  const [flight, setFlight] = useState(0);

  useEffect(() => {
    if (!animations) return;
    let t = setTimeout(function fly() {
      setFlight((n) => n + 1);
      t = setTimeout(fly, INTERVAL_MS);
    }, FIRST_FLIGHT_MS);
    return () => clearTimeout(t);
  }, [animations]);

  return (
    <div className="fixed inset-x-0 top-[72px] sm:top-[84px] h-24 z-30 pointer-events-none overflow-hidden" aria-hidden>
      <AnimatePresence>
        {animations && flight > 0 && (
          <motion.div
            key={flight}
            className="absolute top-0 left-0 flex items-center"
            initial={{ x: "-45vw", y: 36, rotate: -4 }}
            animate={{ x: "115vw", y: [36, 6, 18], rotate: [-4, -8, -2] }}
            transition={{ duration: FLIGHT_S, ease: [0.45, 0, 0.55, 1] }}
            onAnimationComplete={() => setFlight(0)}
          >
            {/* Repulsor trail */}
            <div
              className="h-[3px] w-[38vw] -mr-3 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,200,80,0.15) 40%, rgba(255,230,160,0.9) 100%)",
                boxShadow: "0 0 12px rgba(255,190,70,0.8)",
              }}
            />
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-[30%] w-6 h-6 rounded-full bg-amber-200/80 blur-[6px]" />
              <img
                src="/marvel/ironman-flying.png"
                alt=""
                decoding="async"
                className="relative w-[150px] sm:w-[190px] h-auto drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
