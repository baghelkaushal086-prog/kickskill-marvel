import { useSyncExternalStore } from "react";
import { Sparkles, Volume2, MousePointer2 } from "lucide-react";
import { setMarvelPref, useMarvelPrefs } from "./marvelPrefs";
import { marvelAudio } from "./MarvelAudioEngine";

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full border transition-colors cursor-pointer shrink-0 ${
        on ? "bg-[#EC1D24] border-[#EC1D24]" : "bg-white/10 border-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white transition-transform ${
          on ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

/** Comfort controls for animations, the Hulk cursor and sound effects. */
export function MarvelExperienceSettings() {
  const prefs = useMarvelPrefs();
  const sfx = useSyncExternalStore(
    (cb) => marvelAudio.subscribe(cb),
    () => marvelAudio.getSoundEnabled()
  );

  const rows = [
    {
      icon: <Sparkles className="w-4 h-4 text-[#EC1D24]" />,
      label: "Comic animations",
      desc: "Page transitions, shield celebrations and comic sound words.",
      on: prefs.animations,
      toggle: () => setMarvelPref("animations", !prefs.animations),
    },
    {
      icon: <MousePointer2 className="w-4 h-4 text-emerald-400" />,
      label: "Hulk cursor companion",
      desc: "Hulk hangs from your cursor and smashes where you click.",
      on: prefs.hulkCursor,
      toggle: () => setMarvelPref("hulkCursor", !prefs.hulkCursor),
    },
    {
      icon: <Volume2 className="w-4 h-4 text-sky-400" />,
      label: "Sound effects",
      desc: "Repulsor clicks and HUD hover sounds. Music is controlled separately.",
      on: sfx,
      toggle: () => marvelAudio.toggleSound(),
    },
  ];

  return (
    <div className="rounded-2xl border border-[#EC1D24]/30 bg-black/60 backdrop-blur-md p-5 mb-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC1D24] mb-1">Marvel Experience</p>
      <h3 className="text-base font-bold text-white mb-4">Motion & Sound</h3>
      <div className="divide-y divide-white/10">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              {r.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{r.label}</p>
              <p className="text-xs text-neutral-400">{r.desc}</p>
            </div>
            <Toggle on={r.on} onChange={r.toggle} label={r.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
