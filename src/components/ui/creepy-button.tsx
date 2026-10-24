import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreepyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  coverClassName?: string;
}

type Coords = { x: number; y: number };

// Spider-Man Tiny Face Figure that peeks out and tracks cursor
function SpiderManTinyFigure({
  eyeCoords,
  isHovered,
}: {
  eyeCoords: Coords;
  isHovered: boolean;
}) {
  return (
    <motion.div
      className="absolute right-2.5 bottom-1 pointer-events-none z-0 flex items-center justify-center select-none"
      initial={{ opacity: 0, scale: 0.7, y: 8, rotate: 0 }}
      animate={{
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? 1.1 : 0.7,
        y: isHovered ? -2 : 8,
        rotate: isHovered ? 6 + eyeCoords.x * 12 : 0,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {/* Tiny Chibi Fingertips clinging to the edge */}
      <div className="absolute -bottom-1 -left-1 flex gap-1 z-10">
        <span className="w-1.5 h-1 rounded-t-full bg-[#EE0C28] border border-[#551217]" />
        <span className="w-1.5 h-1 rounded-t-full bg-[#EE0C28] border border-[#551217]" />
      </div>

      {/* Spider-Man Chibi Mask */}
      <svg
        className="w-7 h-7 drop-shadow-[0_2px_10px_rgba(238,12,40,0.7)]"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Head */}
        <path
          d="M80 12C40 12 18 45 18 90C18 130 45 150 80 150C115 150 142 130 142 90C142 45 120 12 80 12Z"
          fill="#EE0C28"
          stroke="#551217"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        {/* Web Lines */}
        <path d="M80 14V148" stroke="#551217" strokeWidth="4" strokeLinecap="round" />
        <path d="M80 75L22 42" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 75L138 42" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 75L20 85" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 75L140 85" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 75L35 135" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M80 75L125 135" stroke="#551217" strokeWidth="3.5" strokeLinecap="round" />

        {/* Forehead & Chin web arcs */}
        <path
          d="M48 30C58 38 68 40 80 40C92 40 102 38 112 30"
          stroke="#551217"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 50C48 60 62 64 80 64C98 64 112 60 126 50"
          stroke="#551217"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M44 115C56 108 68 105 80 105C92 105 104 108 116 115"
          stroke="#551217"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M52 135C62 130 70 128 80 128C90 128 98 130 108 135"
          stroke="#551217"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mechanical Expressive Lenses with Eye Tracking & Blink */}
        <motion.g
          animate={{
            scaleY: [1, 1, 0.15, 1],
            x: eyeCoords.x * 4,
            y: eyeCoords.y * 3,
          }}
          transition={{
            scaleY: {
              duration: 3.2,
              times: [0, 0.9, 0.94, 1],
              repeat: Infinity,
              ease: "easeInOut",
            },
            x: { duration: 0.1, ease: "easeOut" },
            y: { duration: 0.1, ease: "easeOut" },
          }}
          style={{ originX: "80px", originY: "75px" }}
        >
          {/* Left Eye */}
          <path
            d="M26 72C28 50 50 44 72 70C65 94 45 104 28 92C25 86 25 78 26 72Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Right Eye */}
          <path
            d="M134 72C132 50 110 44 88 70C95 94 115 104 132 92C135 86 135 78 134 72Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          {/* Eye Sheens */}
          <path
            d="M38 62C42 56 50 54 58 60"
            stroke="#E0E7FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M122 62C118 56 110 54 102 60"
            stroke="#E0E7FF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

export const CreepyButton = ({
  children,
  className,
  coverClassName,
  onClick,
  ...props
}: CreepyButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [eyeCoords, setEyeCoords] = useState<Coords>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updateCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const userEvent =
      "touches" in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const dx = userEvent.clientX - center.x;
    const dy = userEvent.clientY - center.y;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;
    const distance = Math.hypot(dx, dy);
    setEyeCoords({
      x: (Math.sin(angle) * Math.min(distance, 180)) / 180,
      y: (Math.cos(angle) * Math.min(distance, 75)) / 75,
    });
  };

  const resetCoords = () => {
    setEyeCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative min-w-[9em] rounded-xl bg-black cursor-pointer outline-none select-none group",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EC1D24]",
        className
      )}
      onClick={onClick}
      onMouseMove={(e) => {
        updateCoords(e);
        setIsHovered(true);
      }}
      onTouchMove={updateCoords}
      onMouseLeave={resetCoords}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      {...props}
    >
      {/* Spider-Man's Tiny Face Figure peeking out when hovered */}
      <SpiderManTinyFigure eyeCoords={eyeCoords} isHovered={isHovered} />

      {/* Front Hinged Cover Plate */}
      <motion.span
        className={cn(
          "absolute inset-0 block rounded-xl bg-[#EC1D24] text-white font-bold tracking-wider",
          "shadow-[inset_0_0_0_0.125em_rgba(0,0,0,1)]",
          "flex items-center justify-center px-4 py-2",
          "origin-[1.25em_50%]",
          coverClassName
        )}
        animate={{ rotate: isHovered ? -13 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.8 }}
      >
        {children}
      </motion.span>

      <span className="block opacity-0 px-4 py-2 font-bold tracking-wider min-w-[9em]">
        {children}
      </span>
    </button>
  );
};

export default CreepyButton;
