/**
 * motion.config.ts — Shared animation tunables for the Omanyala motion system.
 *
 * Purpose: Single source of truth for all animation durations, easings, colours,
 * and thresholds. No magic numbers should be scattered through components.
 *
 * How to tweak: Change any value below and every animation that imports from
 * this file will update accordingly. Colors are intentionally sourced from the
 * existing CSS custom properties where possible.
 *
 * Connected to: Loader, ScrollReveal, TransitionOverlay, TransitionProvider,
 * hero intro, useAssetProgress.
 */

// ─── Design tokens (mirrored from globals.css :root) ─────────────────────────
export const COLORS = {
  /** Site's darkest colour — used for loader background, overlays */
  background: "#0A0A0A",
  /** Primary foreground text colour */
  foreground: "#F5F5F0",
  /** Brand accent — lime green */
  accent: "#D4FF3F",
  /** Brand red — used for highlights, CTAs */
  red: "#E4272A",
  /** Card / secondary dark */
  card: "#111111",
  /** Secondary surface */
  secondary: "#1A1A1A",
  /** Muted foreground */
  mutedForeground: "rgba(245, 245, 240, 0.5)",
  /** Border colour */
  border: "rgba(255, 255, 255, 0.1)",
} as const;

// ─── Loader ──────────────────────────────────────────────────────────────────
export const LOADER = {
  /** Minimum time the loader is shown (seconds) */
  minDuration: 2.2,
  /** Hard cap — force-complete if signals haven't all fired (seconds) */
  hardCap: 6,
  /** Hold at 100% before starting exit (seconds) */
  holdAt100: 0.25,
  /** Smoothing ease for the counter tween */
  counterEase: "power1.out",
  /** Runner cycle duration (seconds per full stride) */
  strideDuration: 0.42,
  /** Runner timeScale range — ramps from low to high as progress increases */
  timeScaleRange: [0.9, 1.3] as [number, number],
  /** Runner vertical bob amplitude (px) */
  bobAmplitude: 3,
  /** Exit wipe duration (seconds) */
  exitDuration: 0.8,
  /** Exit wipe ease */
  exitEase: "power4.inOut",
  /** Number of ghost copies for motion trail */
  ghostCount: 3,
  /** Session storage key */
  sessionKey: "omanyala:loaded",
  /** URL param to force loader */
  forceParam: "loader",
} as const;

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
export const SCROLL_REVEAL = {
  /** Heading line reveal — y offset as percent */
  lineYPercent: 110,
  /** Heading line stagger (seconds) */
  lineStagger: 0.08,
  /** Heading line ease */
  lineEase: "power4.out",
  /** Heading line duration (seconds) */
  lineDuration: 0.9,
  /** Heading trigger start */
  lineStart: "top 85%",
  /** Body word initial opacity (scrub mode) */
  wordInitialOpacity: 0.15,
  /** Body word scrub start */
  wordStart: "top 80%",
  /** Body word scrub end */
  wordEnd: "bottom 45%",
  /** Debounce time for resize re-split (ms) */
  resizeDebounce: 200,
} as const;

// ─── Page transitions ────────────────────────────────────────────────────────
export const TRANSITION = {
  /** Number of vertical lane strips */
  laneCount: 8,
  /** Cover animation duration (seconds) */
  coverDuration: 0.6,
  /** Reveal animation duration (seconds) */
  revealDuration: 0.6,
  /** Stagger between each strip (seconds) */
  stagger: 0.045,
  /** Strip animation ease */
  ease: "power4.inOut",
  /** Failsafe timeout — if route hasn't changed after this many seconds, reveal anyway */
  failsafeTimeout: 3,
  /** Reduced motion crossfade duration (seconds) */
  reducedMotionDuration: 0.2,
  /** Back/forward reveal duration (seconds) */
  popstateDuration: 0.25,
  /** Smooth scroll duration for anchor links (seconds) */
  anchorScrollDuration: 1.1,
  /** Smooth scroll ease for anchor links */
  anchorScrollEase: "power3.inOut",
} as const;

// ─── Hero intro ──────────────────────────────────────────────────────────────
export const HERO_INTRO = {
  /** Delay before hero intro starts (after loader:complete) (seconds) */
  delay: 0.1,
  /** Word rise duration (seconds) */
  wordDuration: 0.55,
  /** Word stagger (seconds) */
  wordStagger: 0.06,
  /** Word ease */
  wordEase: "power4.out",
} as const;
