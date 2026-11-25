/**
 * components/loader/Loader.tsx — Full-screen sprint loader visual + timeline.
 *
 * Purpose: Renders the "starting block" loader experience:
 *   - Track lane with tick marks and finish tape
 *   - Large counter (0 → 100%) driven by real asset-loading progress
 *   - Micro-states: ON YOUR MARKS → SET → GO
 *   - Exit transition: tape snap, counter fade, clip-path wipe
 *
 * Props:
 *   - progress: 0–1 raw progress from useAssetProgress
 *   - onComplete: callback when exit animation finishes
 *
 * Connected to: LoaderGate.tsx (parent), motion.config.ts (tunables),
 *   useAssetProgress.ts (progress signal)
 *
 * Tweakables: All durations, eases, colours in LOADER & COLORS from motion.config.ts
 */

"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOADER, COLORS } from "@/lib/motion.config";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface LoaderProps {
  progress: number;
  onComplete: () => void;
}

export function Loader({ progress, onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const counterBlockRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const tweenObj = useRef({ value: 0 });
  const hasCompletedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [microState, setMicroState] = useState("ON YOUR MARKS");

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // ── Smooth the progress value toward target ────────────────────────────────
  useGSAP(
    () => {
      if (hasCompletedRef.current) return;

      const targetValue = Math.min(progress, 1) * 100;

      gsap.to(tweenObj.current, {
        value: targetValue,
        duration: 0.5,
        ease: LOADER.counterEase,
        overwrite: true,
        onUpdate() {
          const rounded = Math.round(tweenObj.current.value);
          // Never go backwards
          if (counterRef.current) {
            const current = parseInt(counterRef.current.textContent || "0", 10);
            if (rounded >= current) {
              counterRef.current.textContent = String(rounded);
            }
          }
          // Update micro-state
          if (rounded <= 33) setMicroState("ON YOUR MARKS");
          else if (rounded <= 66) setMicroState("SET");
          else setMicroState("GO");

          // Update aria-valuenow every ~10%
          if (containerRef.current && rounded % 10 === 0) {
            containerRef.current.setAttribute("aria-valuenow", String(rounded));
          }
        },
      });
    },
    { dependencies: [progress], scope: containerRef }
  );

  // ── Handle completion at 100% ──────────────────────────────────────────────
  const runExit = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Enforce minimum duration
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const delay = Math.max(0, LOADER.minDuration - elapsed) + LOADER.holdAt100;

    if (reducedMotion) {
      // Simple fade for reduced motion
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: Math.min(delay, 0.4),
        onComplete: onComplete,
      });
      return;
    }

    const tl = gsap.timeline({ delay, onComplete });

    // 1. Tape snaps
    if (tapeRef.current) {
      tl.to(tapeRef.current, { scaleX: 0, duration: 0.2, ease: "power2.in" }, 0);
    }

    // 2. Accent flash
    if (flashRef.current) {
      tl.fromTo(
        flashRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.1, yoyo: true, repeat: 1 },
        0
      );
    }

    // 3. Counter and wordmark fade/slide out
    tl.to(
      [counterBlockRef.current, wordmarkRef.current],
      { y: 20, opacity: 0, duration: 0.35, stagger: 0.05, ease: "power3.in" },
      0.15
    );

    // 4. Two-half wipe
    tl.to(
      topHalfRef.current,
      { yPercent: -100, duration: LOADER.exitDuration, ease: LOADER.exitEase },
      0.4
    );
    tl.to(
      bottomHalfRef.current,
      { yPercent: 100, duration: LOADER.exitDuration, ease: LOADER.exitEase },
      0.4
    );
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (progress >= 1 && !hasCompletedRef.current) {
      runExit();
    }
  }, [progress, runExit]);

  // ── Track tick marks ───────────────────────────────────────────────────────
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  // For reduced motion: simple counter only
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label="Loading"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <span
          ref={counterRef}
          className="font-mono text-7xl font-black"
          style={{ color: COLORS.accent, fontVariantNumeric: "tabular-nums" }}
        >
          0
        </span>
        <span className="ml-2 text-2xl font-light" style={{ color: COLORS.mutedForeground }}>
          %
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-label="Loading"
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Top half (for wipe exit) */}
      <div
        ref={topHalfRef}
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ backgroundColor: COLORS.background }}
      />
      {/* Bottom half (for wipe exit) */}
      <div
        ref={bottomHalfRef}
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ backgroundColor: COLORS.background }}
      />

      {/* Accent flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{ backgroundColor: COLORS.accent }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 sm:px-10 sm:py-12">
        {/* Top-left wordmark */}
        <div ref={wordmarkRef}>
          <p
            className="text-sm font-semibold uppercase tracking-[0.35em]"
            style={{ color: COLORS.foreground }}
          >
            OMANYALA
          </p>
        </div>

        {/* Centre: Track + Runner */}
        <div className="relative mx-auto w-full max-w-5xl">
          {/* Track lane line */}
          <div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
            style={{ height: 1, backgroundColor: COLORS.border }}
          >
            {/* Tick marks */}
            {ticks.map((pct) => (
              <div
                key={pct}
                className="absolute top-0 -translate-y-1/2"
                style={{
                  left: `${pct}%`,
                  width: 1,
                  height: pct % 50 === 0 ? 16 : 8,
                  backgroundColor: COLORS.mutedForeground,
                }}
              />
            ))}
          </div>

          {/* Finish tape */}
          <div
            ref={tapeRef}
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              right: "2%",
              width: 2,
              height: 80,
              backgroundColor: COLORS.red,
              transformOrigin: "center",
            }}
          />
        </div>

        {/* Bottom: Counter + tagline + micro-state */}
        <div className="flex items-end justify-between">
          <div ref={counterBlockRef}>
            <p
              className="text-xs uppercase tracking-[0.3em] mb-2"
              style={{ color: COLORS.accent, opacity: 0.7 }}
            >
              {microState}
            </p>
            <div className="flex items-baseline gap-1">
              <span
                ref={counterRef}
                className="font-mono font-black"
                style={{
                  color: COLORS.foreground,
                  fontVariantNumeric: "tabular-nums",
                  fontSize: "clamp(3rem, 10vw, 6rem)",
                  lineHeight: 1,
                }}
              >
                0
              </span>
              <span
                className="font-light"
                style={{
                  color: COLORS.mutedForeground,
                  fontSize: "clamp(1rem, 3vw, 1.5rem)",
                }}
              >
                %
              </span>
            </div>
            <p
              className="mt-2 text-xs uppercase tracking-[0.3em]"
              style={{ color: COLORS.mutedForeground }}
            >
              Fast. Focused. Forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
