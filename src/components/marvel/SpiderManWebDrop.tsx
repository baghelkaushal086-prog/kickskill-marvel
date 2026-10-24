import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarvelPrefs } from "./marvelPrefs";

const HANG_MS = 5000; // time hanging in view
const REST_MS = 20000; // time hidden before the next drop
const FIRST_DROP_MS = 3000;
const DROP = 150; // px the web extends below the top edge
const SPIDEY_W = 84;

/**
 * Spider-Man drops from the top corner on a web, hangs for 5s with a gentle
 * sway, climbs back up, then repeats every 20s. Disabled when comic
 * animations are turned off in Marvel Experience settings.
 */
export function SpiderManWebDrop() {
  const { animations } = useMarvelPrefs();
  const [hanging, setHanging] = useState(false);

  useEffect(() => {
    if (!animations) {
      setHanging(false);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    const drop = () => {
      setHanging(true);
      t = setTimeout(() => {
        setHanging(false);
        t = setTimeout(drop, REST_MS);
      }, HANG_MS);
    };
    t = setTimeout(drop, FIRST_DROP_MS);
    return () => clearTimeout(t);
  }, [animations]);

  return (
    <div
      className="fixed top-0 right-[120px] sm:right-[190px] z-30 pointer-events-none select-none"
      style={{ width: SPIDEY_W }}
      aria-hidden
    >
      <AnimatePresence>
        {hanging && (
          <motion.div
            className="absolute top-0 left-0 w-full"
            initial={{ y: -DROP - 120 }}
            animate={{ y: 0 }}
            exit={{ y: -DROP - 120, transition: { duration: 0.55, ease: [0.5, 0, 0.9, 0.4] } }}
            transition={{ type: "spring", stiffness: 120, damping: 11, mass: 0.9 }}
          >
            {/* Sway pivots from the top of the web */}
            <motion.div
              style={{ transformOrigin: "50% 0%" }}
              animate={{ rotate: [0, 4, -3, 2, -1, 0] }}
              transition={{ duration: 4.5, ease: "easeInOut", delay: 0.4 }}
            >
              {/* Web line */}
              <div
                className="mx-auto"
                style={{
                  width: 2,
                  height: DROP,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.9))",
                  boxShadow: "0 0 4px rgba(255,255,255,0.5)",
                }}
              />
              <img
                src="/marvel/spiderman-hanging.png"
                alt=""
                decoding="async"
                className="block w-full h-auto -mt-1 drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
                style={{ marginLeft: "-2%" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
