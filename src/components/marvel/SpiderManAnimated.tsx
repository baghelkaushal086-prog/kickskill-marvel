import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { marvelAudio } from "./MarvelAudioEngine";

interface SpiderManAnimatedProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showSpeechBubble?: boolean;
}

export function SpiderManAnimated({
  size = "md",
  className = "",
  showSpeechBubble = false,
}: SpiderManAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSquinting, setIsSquinting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  // Track mouse coordinates relative to Spider-Man's center
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize offset between -1 and 1, clamped
      const dx = Math.max(-1, Math.min(1, (e.clientX - centerX) / 400));
      const dy = Math.max(-1, Math.min(1, (e.clientY - centerY) / 400));

      setMousePos({ x: dx * 3.5, y: dy * 3 });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Automatic mechanical lens blinking and idle curious squints
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // 70% chance regular mechanical blink, 30% chance curious single-eye squint
      if (Math.random() > 0.3) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 160);
      } else {
        setIsSquinting(true);
        setTimeout(() => setIsSquinting(false), 900);
      }
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        setIsHovered(true);
        marvelAudio.playRepulsorClick();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none inline-flex items-center justify-center cursor-pointer group ${className}`}
    >
      {/* Speech / Status Bubble when hovered */}
      {showSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={isHovered ? { opacity: 1, y: -6, scale: 1 } : { opacity: 0, y: 6, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-30 whitespace-nowrap px-2.5 py-1 rounded-lg bg-black/90 border border-[#EC1D24]/50 shadow-[0_0_15px_rgba(236,29,36,0.35)]"
        >
          <span className="text-[10px] font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EC1D24] animate-ping" />
            Verified Skills Detected!
          </span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-[#EC1D24]/50" />
        </motion.div>
      )}

      {/* Spider-Man Character Head with Mechanical Animated Eyes */}
      <motion.div
        animate={{
          rotate: isSquinting ? [0, -3, 0] : isHovered ? [0, 2, -2, 0] : 0,
          y: isHovered ? -3 : 0,
        }}
        transition={{ duration: 0.4 }}
        className={`relative ${sizeMap[size]} filter drop-shadow-[0_4px_12px_rgba(236,29,36,0.5)]`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Eye Lens Clip Paths */}
            <clipPath id="spidey-left-eye-clip">
              <path d="M26 72C28 50 50 44 72 70C65 94 45 104 28 92C25 86 25 78 26 72Z" />
            </clipPath>
            <clipPath id="spidey-right-eye-clip">
              <path d="M134 72C132 50 110 44 88 70C95 94 115 104 132 92C135 86 135 78 134 72Z" />
            </clipPath>
            {/* Ambient Eye Glow */}
            <radialGradient id="spidey-eye-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
          </defs>

          {/* Outer Head */}
          <path
            d="M80 12C40 12 18 45 18 90C18 130 45 150 80 150C115 150 142 130 142 90C142 45 120 12 80 12Z"
            fill="#EE0C28"
            stroke="#792E0F"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Web Lines Pattern */}
          <path d="M80 14V148" stroke="#792E0F" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 75L22 42" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 75L138 42" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 75L20 85" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 75L140 85" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 75L35 135" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M80 75L125 135" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />

          {/* Web Arcs */}
          <path d="M48 30C58 38 68 40 80 40C92 40 102 38 112 30" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M34 50C48 60 62 64 80 64C98 64 112 60 126 50" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M44 115C56 108 68 105 80 105C92 105 104 108 116 115" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M52 135C62 130 70 128 80 128C90 128 98 130 108 135" stroke="#792E0F" strokeWidth="3.5" strokeLinecap="round" />

          {/* LEFT EYE ASSEMBLY */}
          <motion.g
            animate={{
              scaleY: isBlinking ? 0.12 : isSquinting ? 0.65 : isHovered ? 1.08 : 1,
              scaleX: isSquinting ? 0.95 : isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            style={{ originX: "48px", originY: "74px" }}
          >
            {/* White Lens inside clip */}
            <g clipPath="url(#spidey-left-eye-clip)">
              <motion.rect
                x="20"
                y="40"
                width="60"
                height="70"
                fill="url(#spidey-eye-glow)"
                animate={{
                  x: mousePos.x,
                  y: mousePos.y,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              {/* Inner lens mechanical shutter line */}
              <motion.line
                x1="30"
                y1="72"
                x2="68"
                y2="72"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                animate={{
                  x1: 30 + mousePos.x,
                  x2: 68 + mousePos.x,
                  y1: 72 + mousePos.y,
                  y2: 72 + mousePos.y,
                }}
              />
            </g>

            {/* Bold Black Eye Frame */}
            <path
              d="M26 72C28 50 50 44 72 70C65 94 45 104 28 92C25 86 25 78 26 72Z"
              fill="none"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* Specular White Sheen */}
            <path d="M38 62C42 56 50 54 58 60" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* RIGHT EYE ASSEMBLY */}
          <motion.g
            animate={{
              scaleY: isBlinking ? 0.12 : isHovered ? 1.08 : 1,
              scaleX: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            style={{ originX: "112px", originY: "74px" }}
          >
            {/* White Lens inside clip */}
            <g clipPath="url(#spidey-right-eye-clip)">
              <motion.rect
                x="80"
                y="40"
                width="60"
                height="70"
                fill="url(#spidey-eye-glow)"
                animate={{
                  x: mousePos.x,
                  y: mousePos.y,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
              {/* Inner lens mechanical shutter line */}
              <motion.line
                x1="92"
                y1="72"
                x2="130"
                y2="72"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                animate={{
                  x1: 92 + mousePos.x,
                  x2: 130 + mousePos.x,
                  y1: 72 + mousePos.y,
                  y2: 72 + mousePos.y,
                }}
              />
            </g>

            {/* Bold Black Eye Frame */}
            <path
              d="M134 72C132 50 110 44 88 70C95 94 115 104 132 92C135 86 135 78 134 72Z"
              fill="none"
              stroke="#09090B"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* Specular White Sheen */}
            <path d="M122 62C118 56 110 54 102 60" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}

export default SpiderManAnimated;
