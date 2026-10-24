/** Static hero-coloured glow layered over a page backdrop (no animation, no blend). */
const HERO_TINTS = {
  ironman: "rgba(236,29,36,0.18)",
  spiderman: "rgba(220,38,38,0.16)",
  captain: "rgba(37,99,235,0.18)",
  hulk: "rgba(34,197,94,0.16)",
  thor: "rgba(148,163,184,0.18)",
  widow: "rgba(190,18,60,0.18)",
  panther: "rgba(147,51,234,0.18)",
} as const;

export type HeroKey = keyof typeof HERO_TINTS;

export function HeroTint({ hero }: { hero: HeroKey }) {
  const c = HERO_TINTS[hero];
  return (
    <div
      className="absolute inset-0"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${c} 0%, transparent 60%)` }}
    />
  );
}
