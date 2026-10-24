import React, { useRef, useState } from "react";
import { marvelAudio } from "./MarvelAudioEngine";
import { triggerMarvelBurst } from "./MarvelParticleBurst";

interface Marvel3DCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Marvel3DCard: React.FC<Marvel3DCardProps> = ({
  children,
  className = "",
  onClick,
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth, subtle 3D tilt limit (-6 to +6 deg)
    const rotX = -((y - centerY) / centerY) * 6;
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    marvelAudio.playHudHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    marvelAudio.playRepulsorClick();
    triggerMarvelBurst(e.clientX, e.clientY);
    if (onClick) onClick();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        perspective: "1000px",
      }}
      className={`relative select-none ${className}`}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? "translateZ(6px)" : "translateZ(0px)"}`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        className={`relative w-full h-full rounded-2xl bg-[#0D0E15] border p-5 sm:p-6 transition-all duration-300 overflow-hidden shadow-2xl ${
          isHovered
            ? "border-[#EC1D24]/70 shadow-[0_12px_40px_rgba(236,29,36,0.25)]"
            : "border-white/10"
        }`}
      >
        {/* Soft, subtle ambient illumination on hover without blend mode or black shade glitches */}
        {isHovered && (
          <div
            className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(236,29,36,0.4) 0%, transparent 65%)`,
            }}
          />
        )}

        {/* Sleek Marvel Red Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/40 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/40 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/40 rounded-br-lg" />

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};
