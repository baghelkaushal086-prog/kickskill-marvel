import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Authentic S.H.I.E.L.D. Strategic Homeland Intervention, Enforcement and Logistics Division Crest
 */
export const ShieldEagleLogo: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle */}
    <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
    {/* Stylized eagle silhouette */}
    <path
      d="M50 15 
         C46 25 36 29 25 31 
         C28 39 33 46 40 50 
         C33 52 26 51 20 48 
         C24 58 31 66 41 70 
         C34 71 28 69 22 66 
         C28 78 40 85 50 87 
         C60 85 72 78 78 66 
         C72 69 66 71 59 70 
         C69 66 76 58 80 48 
         C74 51 67 52 60 50 
         C67 46 72 39 75 31 
         C64 29 54 25 50 15 Z"
      fill="currentColor"
    />
    <polygon points="50,45 44,57 56,57" fill="#0A0B10" />
    <rect x="48.5" y="58" width="3" height="15" fill="#0A0B10" />
  </svg>
);

/**
 * The Avengers Stylized 'A' Emblem
 */
export const AvengersLogo: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle outline with 45-deg slash cut */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" />
    {/* Avengers 'A' with sharp crossbar arrow */}
    <path
      d="M53 18 L38 78 L47 78 L51 61 L67 61 L64 73 L74 73 L83 38 L83 18 Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Arrow crossbar */}
    <path
      d="M20 54 L62 54 L58 43 L84 57 L58 71 L62 60 L20 60 Z"
      fill="#EC1D24"
    />
  </svg>
);

/**
 * Stark Industries Arc Reactor with concentric animated rings
 */
export const ArcReactor: React.FC<IconProps & { pulse?: boolean }> = ({
  className = "w-6 h-6",
  size,
  pulse = true,
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} ${pulse ? "animate-[pulse_2s_ease-in-out_infinite]" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer glow ring */}
    <circle cx="50" cy="50" r="46" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.6" />
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke="#00F0FF"
      strokeWidth="4"
      strokeDasharray="16 6"
      className="animate-[spin_20s_linear_infinite]"
      style={{ transformOrigin: "50% 50%" }}
    />
    {/* 10 Power Coils around circumference */}
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
      <rect
        key={i}
        x="47"
        y="12"
        width="6"
        height="10"
        rx="1"
        fill="#00F0FF"
        opacity="0.9"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    {/* Middle ring */}
    <circle cx="50" cy="50" r="26" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />
    {/* Central Palladium/Vibranium core */}
    <circle cx="50" cy="50" r="16" fill="#00F0FF" opacity="0.4" />
    <polygon
      points="50,38 61,57 39,57"
      fill="#FFFFFF"
      stroke="#00F0FF"
      strokeWidth="2"
      className="animate-[pulse_1.5s_ease-in-out_infinite]"
    />
  </svg>
);

/**
 * Captain America Vibranium Star Crest
 */
export const CaptainShieldLogo: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Red Ring */}
    <circle cx="50" cy="50" r="48" fill="#EC1D24" />
    {/* White / Silver Ring */}
    <circle cx="50" cy="50" r="38" fill="#E2E8F0" />
    {/* Inner Red Ring */}
    <circle cx="50" cy="50" r="28" fill="#EC1D24" />
    {/* Center Blue Circle */}
    <circle cx="50" cy="50" r="18" fill="#1E40AF" />
    {/* Silver Star */}
    <polygon
      points="50,34 53,44 64,44 55,51 58,61 50,55 42,61 45,51 36,44 47,44"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Infinity Stone Badge with custom glow
 */
export type InfinityStoneType = "power" | "mind" | "space" | "reality" | "time" | "soul";

const stoneColorMap: Record<InfinityStoneType, { bg: string; border: string; glow: string; label: string }> = {
  power: { bg: "#9333ea", border: "#c084fc", glow: "rgba(168,85,247,0.5)", label: "Power Stone · Backend & Systems" },
  mind: { bg: "#eab308", border: "#fde047", glow: "rgba(234,179,8,0.5)", label: "Mind Stone · AI & Logic" },
  space: { bg: "#0284c7", border: "#38bdf8", glow: "rgba(14,165,233,0.5)", label: "Space Stone · Cloud & Infra" },
  reality: { bg: "#dc2626", border: "#f87171", glow: "rgba(239,68,68,0.5)", label: "Reality Stone · Frontend & UI" },
  time: { bg: "#16a34a", border: "#4ade80", glow: "rgba(34,197,94,0.5)", label: "Time Stone · Roadmaps & Velocity" },
  soul: { bg: "#ea580c", border: "#fb923c", glow: "rgba(249,115,22,0.5)", label: "Soul Stone · Verified Integrity" },
};

export const InfinityStoneBadge: React.FC<{ type: InfinityStoneType; size?: number; showLabel?: boolean }> = ({
  type,
  size = 20,
  showLabel = false,
}) => {
  const conf = stoneColorMap[type] || stoneColorMap.mind;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs">
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={{ filter: `drop-shadow(0 0 6px ${conf.glow})` }}
      >
        <polygon
          points="12,2 20,7 20,17 12,22 4,17 4,7"
          fill={conf.bg}
          stroke={conf.border}
          strokeWidth="1.5"
        />
        <polygon points="12,5 17,9 17,15 12,19 7,15 7,9" fill="#FFFFFF" opacity="0.35" />
      </svg>
      {showLabel && <span className="font-semibold uppercase tracking-wider">{conf.label}</span>}
    </span>
  );
};
