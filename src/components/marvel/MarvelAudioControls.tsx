import React, { useState, useEffect } from "react";
import { marvelAudio } from "./MarvelAudioEngine";
import { Volume2, VolumeX } from "lucide-react";

export const MarvelAudioControls: React.FC = () => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.75);

  useEffect(() => {
    // Sync initial state
    setSoundOn(marvelAudio.getSoundEnabled());
    setMusicOn(marvelAudio.getMusicEnabled());
    setVolume(marvelAudio.getVolume());

    // Subscribe to engine state changes (e.g. autoplay unblocked, shortcut pressed)
    const unsubscribe = marvelAudio.subscribe(() => {
      setSoundOn(marvelAudio.getSoundEnabled());
      setMusicOn(marvelAudio.getMusicEnabled());
      setVolume(marvelAudio.getVolume());
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key.toLowerCase() === "m") {
        const next = marvelAudio.toggleMusic();
        setMusicOn(next);
      }
      if (e.key.toLowerCase() === "s") {
        const next = marvelAudio.toggleSound();
        setSoundOn(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      unsubscribe();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggleSound = () => {
    const next = marvelAudio.toggleSound();
    setSoundOn(next);
  };

  const handleToggleMusic = () => {
    const next = marvelAudio.toggleMusic();
    setMusicOn(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    marvelAudio.setVolume(newVol);
  };

  return (
    <div className="group relative flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/20 hover:border-[#EC1D24]/60 px-2 sm:px-2.5 py-1 rounded-full shadow-[0_0_20px_rgba(236,29,36,0.3)] z-50 transition-all">
      {/* Primary Music Toggle / Music Off Button */}
      <button
        onClick={handleToggleMusic}
        onMouseEnter={() => marvelAudio.playHudHover()}
        title={
          musicOn
            ? "Avengers Theme Music is playing - Click to turn Music OFF [Shortcut: M]"
            : "Click to turn Music ON [Shortcut: M]"
        }
        className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          musicOn
            ? "bg-[#EC1D24] text-white hover:bg-[#c9181f] shadow-[0_0_14px_rgba(236,29,36,0.6)] border border-white/25"
            : "bg-white/10 text-neutral-300 hover:text-white hover:bg-white/15 border border-white/15"
        }`}
      >
        {musicOn ? (
          <>
            {/* Equalizer animation waves */}
            <span className="flex items-end gap-[2px] h-3.5 w-3.5 shrink-0 justify-center pb-0.5">
              <span className="w-[2.5px] h-2 bg-white rounded-full animate-pulse" />
              <span className="w-[2.5px] h-3.5 bg-white rounded-full animate-bounce" />
              <span className="w-[2.5px] h-2.5 bg-white rounded-full animate-pulse delay-100" />
            </span>
            <span className="tracking-wider">MUSIC OFF</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="tracking-wider">MUSIC ON</span>
          </>
        )}
        <kbd className="hidden md:inline text-[9px] opacity-75 bg-black/40 px-1 rounded border border-white/20">
          M
        </kbd>
      </button>

      {/* Volume Slidebar - reveals on hover */}
      <div
        className="flex items-center gap-1.5 max-w-0 opacity-0 overflow-hidden pointer-events-none group-hover:max-w-[140px] group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out"
        title={`Avengers BGM Volume: ${Math.round(volume * 100)}%`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Music Volume Slider"
          className="w-14 sm:w-16 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#EC1D24] hover:accent-[#ff333a] transition-all"
        />
        <span className="text-[10px] font-mono text-neutral-400 w-6 text-right select-none shrink-0">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Sound FX Toggle */}
      <button
        onClick={handleToggleSound}
        onMouseEnter={() => marvelAudio.playHudHover()}
        title={`Stark HUD FX [S] ${soundOn ? "(Active)" : "(Muted)"}`}
        className={`relative flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
          soundOn
            ? "bg-white/10 text-white border border-white/20 shadow-sm"
            : "text-neutral-500 hover:text-white border border-transparent"
        }`}
      >
        {soundOn ? (
          <Volume2 className="w-3.5 h-3.5 text-[#EC1D24] animate-pulse shrink-0" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        )}
        <span className="hidden sm:inline font-bold tracking-wider">
          {soundOn ? "SFX" : "MUTED"}
        </span>
        <kbd className="hidden md:inline text-[9px] opacity-60 bg-black/50 px-1 rounded border border-white/10">
          S
        </kbd>
      </button>
    </div>
  );
};
