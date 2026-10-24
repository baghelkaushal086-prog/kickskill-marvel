import React from "react";

interface KickSkillLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
}

export const KickSkillLogo: React.FC<KickSkillLogoProps> = ({
  size = "md",
  className = "",
  showSubtitle = false,
  subtitle = "Verified Skill Platform",
}) => {
  if (size === "sm") {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className="inline-flex items-stretch shadow-[0_0_15px_rgba(236,29,36,0.4)]">
          {/* Red Box with KICKSKILL */}
          <div className="bg-[#EC1D24] text-white font-black italic tracking-tight px-2.5 py-1 text-xs sm:text-sm uppercase flex items-center justify-center font-sans leading-none border border-[#EC1D24] rounded-[2px]">
            KICKSKILL
          </div>
          {/* Marvel Studios-style AI box with top & bottom white lines */}
          <div className="flex flex-col justify-between ml-1.5 py-0.5 self-stretch">
            <div className="h-[1.5px] bg-white w-full" />
            <span className="text-white font-black tracking-[0.2em] text-[10px] sm:text-xs uppercase px-1.5 leading-none flex items-center justify-center font-sans">
              AI
            </span>
            <div className="h-[1.5px] bg-white w-full" />
          </div>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase mt-1">
            {subtitle}
          </span>
        )}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <div className="inline-flex items-stretch shadow-[0_0_40px_rgba(236,29,36,0.5)]">
          {/* Red Box with KICKSKILL */}
          <div className="bg-[#EC1D24] text-white font-black italic tracking-tight px-4 sm:px-5 py-1.5 sm:py-2 text-3xl sm:text-4xl md:text-5xl uppercase flex items-center justify-center font-sans leading-none border-2 border-[#EC1D24] rounded-[3px]">
            KICKSKILL
          </div>
          {/* Marvel Studios-style AI box with top & bottom white lines */}
          <div className="flex flex-col justify-between ml-2 sm:ml-2.5 py-0.5 sm:py-1 self-stretch">
            <div className="h-[2px] sm:h-[3px] bg-white w-full" />
            <span className="text-white font-black tracking-[0.25em] text-xl sm:text-2xl md:text-3xl uppercase px-2.5 sm:px-3.5 leading-none flex items-center justify-center font-sans">
              AI
            </span>
            <div className="h-[2px] sm:h-[3px] bg-white w-full" />
          </div>
        </div>
        {showSubtitle && (
          <p className="mt-2 text-xs sm:text-sm font-bold font-mono tracking-[0.35em] uppercase text-white/70">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  // Default "md" size
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className="inline-flex items-stretch shadow-[0_0_20px_rgba(236,29,36,0.45)]">
        <div className="bg-[#EC1D24] text-white font-black italic tracking-tight px-3 py-1 text-sm sm:text-base uppercase flex items-center justify-center font-sans leading-none border border-[#EC1D24] rounded-[2px]">
          KICKSKILL
        </div>
        <div className="flex flex-col justify-between ml-1.5 py-0.5 self-stretch">
          <div className="h-[2px] bg-white w-full" />
          <span className="text-white font-black tracking-[0.2em] text-xs sm:text-sm uppercase px-1.5 leading-none flex items-center justify-center font-sans">
            AI
          </span>
          <div className="h-[2px] bg-white w-full" />
        </div>
      </div>
      {showSubtitle && (
        <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase mt-1">
          {subtitle}
        </span>
      )}
    </div>
  );
};
