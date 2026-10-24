import { motion } from "framer-motion";

export interface StoneMilestone {
  key: "space" | "mind" | "reality" | "power" | "time" | "soul";
  label: string;
  detail: string;
  done: boolean;
}

const STONE_COLORS: Record<StoneMilestone["key"], { color: string; name: string }> = {
  space: { color: "#3B82F6", name: "Space" },
  mind: { color: "#FACC15", name: "Mind" },
  reality: { color: "#EF4444", name: "Reality" },
  power: { color: "#A855F7", name: "Power" },
  time: { color: "#22C55E", name: "Time" },
  soul: { color: "#F97316", name: "Soul" },
};

/** Six Infinity Stones = six career milestones. All six unlocks the Gauntlet badge. */
export function InfinityStonesProgress({ milestones }: { milestones: StoneMilestone[] }) {
  const doneCount = milestones.filter((m) => m.done).length;
  const complete = doneCount === milestones.length;

  return (
    <div className="relative rounded-2xl border border-[#EC1D24]/30 bg-black/60 backdrop-blur-md p-5 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC1D24] mb-1">Infinity Progress</p>
          <h3 className="text-lg font-black italic uppercase text-white tracking-wide">
            {complete ? "Gauntlet Complete" : "Collect All Six Stones"}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">Each stone is a verified career milestone.</p>
        </div>
        <div
          className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold ${
            complete
              ? "border-amber-400/60 bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
              : "border-white/10 bg-white/5 text-neutral-300"
          }`}
        >
          {doneCount} / {milestones.length}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {milestones.map((m, i) => {
          const s = STONE_COLORS[m.key];
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center text-center gap-2"
              title={m.detail}
            >
              <div
                className="relative w-11 h-14 flex items-center justify-center"
                style={{ filter: m.done ? `drop-shadow(0 0 10px ${s.color})` : "none" }}
              >
                <svg viewBox="0 0 40 52" className="w-full h-full">
                  <polygon
                    points="20,2 37,16 32,46 8,46 3,16"
                    fill={m.done ? s.color : "transparent"}
                    stroke={m.done ? "#fff" : s.color}
                    strokeOpacity={m.done ? 0.5 : 0.45}
                    strokeWidth="2"
                    strokeDasharray={m.done ? undefined : "4 3"}
                  />
                  {m.done && <polygon points="20,6 30,16 20,22 10,16" fill="#fff" opacity="0.35" />}
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">{m.label}</p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: m.done ? s.color : "#737373" }}>
                  {s.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#EF4444] to-[#F97316]"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / milestones.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
