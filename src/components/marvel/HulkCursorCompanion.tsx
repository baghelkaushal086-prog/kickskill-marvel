/**
 * HulkCursorCompanion
 * ───────────────────
 * An interactive companion featuring the REAL, official Marvel Hulk
 * (/marvel/hulk.png) hanging by his right hand directly from your cursor
 * with authentic Newtonian pendulum inertia physics, and an explosive
 * punching animation that slams right onto wherever you click!
 *
 * Core Behaviors:
 *   1. Genuine Marvel Hulk: Uses the authentic full-body CGI Hulk render.
 *   2. Hanging by One Hand: Hulk's right hand is anchored at your cursor tip,
 *      with his massive muscular body dangling and swinging with real inertia.
 *   3. Zero Cursor Lag: The hand tracks the cursor in real-time without delay.
 *   4. Moving Left -> Swings Right: Proper D'Alembert inertial pendulum torque.
 *   5. Full Punch Animation: On click, Hulk lunges and slams his giant green fist
 *      directly onto the clicked coordinates with shockwaves and sub-bass crunch.
 *   6. Clean Visuals: Zero artificial lines or dots.
 *   7. 100% Non-Blocking: pointer-events-none ensures all clicks pass through to UI.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { marvelAudio } from "./MarvelAudioEngine";

interface SmashDecal {
  id: number;
  x: number;
  y: number;
  text: string;
  rotation: number;
}

const SMASH_PHRASES = ["SMASH!", "HULK SMASH!", "CRUNCH!", "POW!", "BOOM!"];

export function HulkCursorCompanion() {
  // Cursor coordinates
  const mouse = useRef({ x: -400, y: -400 });
  const prevMouse = useRef({ x: -400, y: -400 });
  const mouseVel = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Pendulum physics (rotation around his right hand)
  const angle = useRef(-30); // Resting hanging angle (degrees)
  const angleVel = useRef(0); // Angular velocity (deg/s)

  // Punch animation state
  const isPunching = useRef(false);
  const punchStartTime = useRef(0);
  const punchProgress = useRef(0); // 0 -> 1
  const punchTarget = useRef({ x: 0, y: 0 });
  const punchAngle = useRef(0); // Direction from Hulk toward click target
  const punchDist = useRef(0); // Distance to click target

  // Smash decals & comic bursts
  const [decals, setDecals] = useState<SmashDecal[]>([]);

  // DOM element refs for hardware-accelerated 60/144fps GPU rendering
  const containerRef = useRef<HTMLDivElement>(null);
  const hulkRef = useRef<HTMLDivElement>(null);
  const fistRef = useRef<HTMLDivElement>(null);

  const rafId = useRef<number | null>(null);

  // ── Spawn Comic Smash FX at Click Coordinates ───────────────────────
  const triggerSmashFX = useCallback((x: number, y: number) => {
    const text =
      SMASH_PHRASES[Math.floor(Math.random() * SMASH_PHRASES.length)];
    const rotation = (Math.random() - 0.5) * 26;

    const newDecal: SmashDecal = {
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      rotation,
    };

    setDecals((prev) => [...prev.slice(-3), newDecal]);

    // Visceral sub-bass crunch audio
    marvelAudio.playHulkSmash();

    // Auto-remove after animation completes
    setTimeout(() => {
      setDecals((prev) => prev.filter((d) => d.id !== newDecal.id));
    }, 650);
  }, []);

  // ── Physics & Animation Frame Loop ──────────────────────────────────
  const updatePhysics = useCallback(() => {
    if (!hasMoved.current) {
      rafId.current = requestAnimationFrame(updatePhysics);
      return;
    }

    const now = performance.now();
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Calculate cursor velocity
    const vx = mx - prevMouse.current.x;
    const vy = my - prevMouse.current.y;
    mouseVel.current.x = vx;
    mouseVel.current.y = vy;
    prevMouse.current.x = mx;
    prevMouse.current.y = my;

    // ─────────────────────────────────────────────────────────────────
    // 1. PENDULUM INERTIA PHYSICS (Hanging by his right hand)
    // ─────────────────────────────────────────────────────────────────
    // Resting angle: -30° (gives the natural look of hanging by one arm)
    const restAngle = -28;
    const gravityTorque = -(angle.current - restAngle) * 0.09; // Restoring gravity
    const inertiaTorque = -vx * 2.4; // Moving left (vx < 0) -> Force swings Hulk right!
    const damping = 0.88; // Air resistance

    angleVel.current = (angleVel.current + gravityTorque + inertiaTorque) * damping;
    angle.current += angleVel.current;

    // Clamp swing angle to natural range [-70°, +50°]
    angle.current = Math.max(-70, Math.min(50, angle.current));

    // ─────────────────────────────────────────────────────────────────
    // 2. PUNCH ANIMATION SEQUENCE
    // ─────────────────────────────────────────────────────────────────
    let lungeX = 0;
    let lungeY = 0;
    let fistExtend = 0;
    let fistScale = 1;

    if (isPunching.current) {
      const elapsed = now - punchStartTime.current;
      const punchDuration = 320; // 320ms snappy sequence

      if (elapsed < punchDuration) {
        const t = elapsed / punchDuration;

        if (t < 0.22) {
          // Wind-up: Hulk coils back slightly away from target
          const p = t / 0.22;
          punchProgress.current = -0.25 * Math.sin(p * (Math.PI / 2));
          lungeX = -Math.cos((punchAngle.current * Math.PI) / 180) * 12 * p;
          lungeY = -Math.sin((punchAngle.current * Math.PI) / 180) * 12 * p;
          fistExtend = 0;
          fistScale = 1;
        } else if (t < 0.45) {
          // Explosive Thrust: Hulk lunges and fist rockets forward
          const p = (t - 0.22) / 0.23;
          punchProgress.current = Math.sin(p * (Math.PI / 2));
          lungeX = Math.cos((punchAngle.current * Math.PI) / 180) * 28 * p;
          lungeY = Math.sin((punchAngle.current * Math.PI) / 180) * 28 * p;
          fistExtend = Math.min(punchDist.current * 0.9, 110) * p;
          fistScale = 1 + p * 0.55;
        } else if (t < 0.6) {
          // Impact Slam Hold
          punchProgress.current = 1.0;
          lungeX = Math.cos((punchAngle.current * Math.PI) / 180) * 28;
          lungeY = Math.sin((punchAngle.current * Math.PI) / 180) * 28;
          fistExtend = Math.min(punchDist.current * 0.9, 110);
          fistScale = 1.55;
        } else {
          // Recoil back to hanging hand
          const p = (t - 0.6) / 0.4;
          const ease = Math.cos(p * (Math.PI / 2));
          punchProgress.current = ease;
          lungeX = Math.cos((punchAngle.current * Math.PI) / 180) * 28 * ease;
          lungeY = Math.sin((punchAngle.current * Math.PI) / 180) * 28 * ease;
          fistExtend = Math.min(punchDist.current * 0.9, 110) * ease;
          fistScale = 1 + ease * 0.55;
        }
      } else {
        isPunching.current = false;
        punchProgress.current = 0;
        lungeX = 0;
        lungeY = 0;
        fistExtend = 0;
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. HARDWARE-ACCELERATED TRANSFORMS
    // ─────────────────────────────────────────────────────────────────
    // In hulk.png (785x1017), at size 76x98:
    // His right hand is at (x ≈ 8px, y ≈ 36px)
    const handAnchorX = 8;
    const handAnchorY = 36;

    const posX = mx - handAnchorX + lungeX;
    const posY = my - handAnchorY + lungeY;

    if (hulkRef.current) {
      hulkRef.current.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0px) rotate(${angle.current.toFixed(2)}deg)`;
    }

    // Punching Fist: shoots along punch vector toward the click point
    if (fistRef.current) {
      if (isPunching.current && fistExtend > 5) {
        // Origin of punch is Hulk's left shoulder (roughly mx + 38, my + 30)
        const startX = mx + 38;
        const startY = my + 30;
        const fX = startX + Math.cos((punchAngle.current * Math.PI) / 180) * fistExtend;
        const fY = startY + Math.sin((punchAngle.current * Math.PI) / 180) * fistExtend;

        fistRef.current.style.opacity = "1";
        fistRef.current.style.transform = `translate3d(${fX - 22}px, ${fY - 22}px, 0px) rotate(${punchAngle.current + 90}deg) scale(${fistScale.toFixed(2)})`;
      } else {
        fistRef.current.style.opacity = "0";
      }
    }

    rafId.current = requestAnimationFrame(updatePhysics);
  }, []);

  // ── Track Mouse Cursor ──────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;

    if (!hasMoved.current) {
      hasMoved.current = true;
      prevMouse.current.x = e.clientX;
      prevMouse.current.y = e.clientY;
      if (containerRef.current) {
        containerRef.current.style.opacity = "1";
      }
    }
  }, []);

  // ── Click Anywhere to Punch ─────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: MouseEvent) => {
      // Left click only
      if (e.button !== 0) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Punch vector from Hulk toward click target
      const shoulderX = mouse.current.x + 38;
      const shoulderY = mouse.current.y + 30;
      const dx = clickX - shoulderX;
      const dy = clickY - shoulderY;

      punchTarget.current = { x: clickX, y: clickY };
      punchAngle.current = (Math.atan2(dy, dx) * 180) / Math.PI;
      punchDist.current = Math.sqrt(dx * dx + dy * dy);

      punchStartTime.current = performance.now();
      isPunching.current = true;

      // Spawn punch impact exactly when fist connects (at 110ms)
      setTimeout(() => {
        triggerSmashFX(clickX, clickY);
      }, 110);
    },
    [triggerSmashFX]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    rafId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove, handlePointerDown, updatePhysics]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden"
      style={{ opacity: 0, transition: "opacity 0.2s ease-out" }}
    >
      {/* ═══════════════════════════════════════════════════════════════
          AUTHENTIC MARVEL HULK (/marvel/hulk.png)
          Hanging by his right hand directly at your cursor tip!
          ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={hulkRef}
        className="absolute top-0 left-0 w-[76px] h-[98px] will-change-transform filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.75)]"
        style={{
          transformOrigin: "8px 36px", // Anchored at his right hand!
          transform: "translate3d(-400px, -400px, 0px)",
        }}
      >
        <img
          src="/marvel/hulk.png"
          alt="Hulk"
          className="w-full h-full object-contain filter contrast-125 saturate-110 drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PUNCHING FIST OVERLAY (/marvel/hulk-fist-right.png)
          Hulk's real fist rocket-thrusts toward the clicked spot!
          ═══════════════════════════════════════════════════════════════ */}
      <div
        ref={fistRef}
        className="absolute top-0 left-0 w-[44px] h-[56px] will-change-transform pointer-events-none opacity-0 z-50 filter drop-shadow-[0_0_18px_rgba(34,197,94,0.85)]"
        style={{ transform: "translate3d(-400px, -400px, 0px)" }}
      >
        <img
          src="/marvel/hulk-fist-right.png"
          alt="Hulk Smashing Fist"
          className="w-full h-full object-contain filter contrast-125 saturate-115"
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CLICK IMPACT DECALS & COMIC BURST TYPOGRAPHY
          ═══════════════════════════════════════════════════════════════ */}
      {decals.map((decal) => (
        <div
          key={decal.id}
          className="absolute pointer-events-none select-none z-50 flex flex-col items-center justify-center"
          style={{
            left: decal.x,
            top: decal.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Dual Expanding Shockwaves */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-400/90 animate-[ping_0.45s_cubic-bezier(0,0,0.2,1)_forwards] filter drop-shadow-[0_0_14px_rgba(34,197,94,0.9)]" />
          <div className="absolute w-12 h-12 rounded-full border-2 border-yellow-300 animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)_forwards]" />

          {/* Radial Comic Impact Crack Lines */}
          <div className="absolute w-20 h-20 flex items-center justify-center pointer-events-none">
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-0 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-45 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-90 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-135 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-180 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-225 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-270 absolute" />
            <div className="w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent rotate-315 absolute" />
          </div>

          {/* Bold Comic Book Action Typography ("HULK SMASH!") */}
          <div
            className="relative px-3.5 py-1 rounded bg-[#14532D] border-2 border-[#22C55E] text-white font-black italic tracking-wider text-sm sm:text-base uppercase shadow-[0_0_25px_rgba(34,197,94,0.95)] animate-[bounce_0.35s_ease-out_forwards]"
            style={{
              transform: `rotate(${decal.rotation}deg)`,
              textShadow: "2px 2px 0px #000, 0 0 10px rgba(74,222,128,0.9)",
            }}
          >
            {decal.text}
          </div>
        </div>
      ))}
    </div>
  );
}
