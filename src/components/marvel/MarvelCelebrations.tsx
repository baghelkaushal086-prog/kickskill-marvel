import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMarvelPrefs } from "./marvelPrefs";
import { marvelAudio } from "./MarvelAudioEngine";

type Celebration =
  | { id: number; kind: "word"; x: number; y: number; word: string; color: string }
  | { id: number; kind: "shield"; message: string };

let seq = 0;
const EVT = "marvel-celebrate";

const WORD_COLORS = ["#FFD23F", "#EC1D24", "#38BDF8", "#4ADE80"];

/** Pop a comic sound word ("POW!", "THWIP!") at a point. Use only on key actions. */
export function triggerComicWord(x: number, y: number, word: string) {
  if (!getMarvelPrefs().animations) return;
  const color = WORD_COLORS[seq % WORD_COLORS.length];
  window.dispatchEvent(new CustomEvent(EVT, { detail: { id: ++seq, kind: "word", x, y, word, color } }));
}

/** Captain America shield spin-in for real successes (application sent, posting published). */
export function triggerShieldSuccess(message: string) {
  marvelAudio.playVibraniumChime();
  if (!getMarvelPrefs().animations) return;
  window.dispatchEvent(new CustomEvent(EVT, { detail: { id: ++seq, kind: "shield", message } }));
}

export function MarvelCelebrations() {
  const [items, setItems] = useState<Celebration[]>([]);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const c = (e as CustomEvent<Celebration>).detail;
      setItems((prev) => [...prev, c]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== c.id)), c.kind === "shield" ? 1900 : 900);
    };
    window.addEventListener(EVT, onEvt);
    return () => window.removeEventListener(EVT, onEvt);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[996]">
      <AnimatePresence>
        {items.map((c) =>
          c.kind === "word" ? (
            <motion.span
              key={c.id}
              className="absolute comic-title text-3xl sm:text-4xl select-none"
              style={{
                left: c.x,
                top: c.y,
                color: c.color,
                WebkitTextStroke: "2px #000",
                textShadow: "4px 4px 0 #000",
              }}
              initial={{ x: "-50%", y: "-50%", scale: 0.3, rotate: -15, opacity: 0 }}
              animate={{ x: "-50%", y: "-120%", scale: 1, rotate: -8, opacity: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.5 }}
            >
              {c.word}
            </motion.span>
          ) : (
            <motion.div
              key={c.id}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ x: "-60vw", rotate: -720, scale: 0.6 }}
                animate={{ x: 0, rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.9, bounce: 0.35 }}
              >
                <CapShield className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" />
              </motion.div>
              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="comic-title text-xl sm:text-2xl text-white bg-black/85 border-2 border-white px-5 py-2 shadow-[5px_5px_0_#EC1D24]"
              >
                {c.message}
              </motion.p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

function CapShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="cap-shine" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#C8102E" />
      <circle cx="50" cy="50" r="38" fill="#F1F1F1" />
      <circle cx="50" cy="50" r="28" fill="#C8102E" />
      <circle cx="50" cy="50" r="19" fill="#1E3A8A" />
      <polygon
        fill="#F1F1F1"
        points="50,32 54.2,44.2 67,44.2 56.6,51.8 60.6,64 50,56.6 39.4,64 43.4,51.8 33,44.2 45.8,44.2"
      />
      <circle cx="50" cy="50" r="48" fill="url(#cap-shine)" />
    </svg>
  );
}
