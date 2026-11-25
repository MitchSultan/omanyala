/**
 * components/transition/TransitionOverlay.tsx — The "Lane Wipe" overlay.
 *
 * Purpose: Renders 8 vertical lane strips (like track lanes) that animate
 * to cover/reveal the page during route transitions. Also shows a centre
 * label with the destination page name.
 *
 * Cover: strips scaleX 0 → 1 from left, staggered left → right
 * Reveal: strips scaleX 1 → 0 from right, same stagger direction
 *
 * Props: None — controlled entirely via TransitionProvider context
 *
 * Connected to: TransitionProvider.tsx (parent context), motion.config.ts
 *
 * Tweakables: TRANSITION.laneCount, TRANSITION.coverDuration,
 *   TRANSITION.stagger, TRANSITION.ease in motion.config.ts
 */

"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TRANSITION, COLORS } from "@/lib/motion.config";

export interface TransitionOverlayHandle {
  cover: (label?: string) => Promise<void>;
  reveal: () => Promise<void>;
  quickReveal: () => Promise<void>;
}

export const TransitionOverlay = forwardRef<TransitionOverlayHandle>(
  function TransitionOverlay(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const labelTextRef = useRef<HTMLParagraphElement>(null);
    const stripRefs = useRef<HTMLDivElement[]>([]);

    const setStripRef = (el: HTMLDivElement | null, i: number) => {
      if (el) stripRefs.current[i] = el;
    };

    useImperativeHandle(ref, () => ({
      async cover(label?: string) {
        const strips = stripRefs.current;
        if (!strips.length || !containerRef.current) return;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        // Show container
        gsap.set(containerRef.current, { visibility: "visible" });

        // Set label text without wiping child structure
        if (labelTextRef.current) {
          labelTextRef.current.textContent = label || "";
        }

        if (reducedMotion) {
          gsap.set(containerRef.current, { opacity: 1 });
          return;
        }

        // Reset strips
        gsap.set(strips, { scaleX: 0, transformOrigin: "left" });

        // Label hidden initially
        if (labelRef.current) {
          gsap.set(labelRef.current, { opacity: 0, scale: 0.9 });
        }

        return new Promise<void>((resolve) => {
          const tl = gsap.timeline({ onComplete: resolve });

          tl.to(strips, {
            scaleX: 1,
            duration: TRANSITION.coverDuration,
            stagger: { each: TRANSITION.stagger, from: "start" },
            ease: TRANSITION.ease,
          });

          // Label fades in at peak
          if (labelRef.current) {
            tl.to(
              labelRef.current,
              { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" },
              `-=${TRANSITION.coverDuration * 0.3}`
            );
          }
        });
      },

      async reveal() {
        const strips = stripRefs.current;
        if (!strips.length || !containerRef.current) return;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: TRANSITION.reducedMotionDuration,
            onComplete: () => {
              gsap.set(containerRef.current!, {
                visibility: "hidden",
                opacity: 1,
              });
            },
          });
          return;
        }

        // Label fades out
        if (labelRef.current) {
          gsap.to(labelRef.current, {
            opacity: 0,
            duration: 0.15,
            ease: "power2.in",
          });
        }

        return new Promise<void>((resolve) => {
          // Change origin for reveal direction
          gsap.set(strips, { transformOrigin: "right" });

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(containerRef.current!, { visibility: "hidden" });
              resolve();
            },
          });

          tl.to(strips, {
            scaleX: 0,
            duration: TRANSITION.revealDuration,
            stagger: { each: TRANSITION.stagger, from: "start" },
            ease: TRANSITION.ease,
          });
        });
      },

      async quickReveal() {
        if (!containerRef.current) return;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        gsap.set(containerRef.current, { visibility: "visible", opacity: 1 });

        await new Promise<void>((resolve) => {
          gsap.to(containerRef.current!, {
            opacity: 0,
            duration: reducedMotion
              ? TRANSITION.reducedMotionDuration
              : TRANSITION.popstateDuration,
            onComplete: () => {
              gsap.set(containerRef.current!, {
                visibility: "hidden",
                opacity: 1,
              });
              resolve();
            },
          });
        });
      },
    }));

    // Generate alternating lane colours
    const laneColors = Array.from({ length: TRANSITION.laneCount }, (_, i) =>
      i % 2 === 0 ? COLORS.accent : COLORS.background
    );

    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9000] pointer-events-none"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        {/* Lane strips */}
        <div className="flex h-full w-full">
          {laneColors.map((color, i) => (
            <div
              key={i}
              ref={(el) => setStripRef(el, i)}
              className="h-full"
              style={{
                flex: 1,
                backgroundColor: color,
                transform: "scaleX(0)",
                willChange: "transform",
              }}
            />
          ))}
        </div>

        {/* Centre label */}
        <div
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="rounded-full border px-8 py-4 text-center backdrop-blur-md"
            style={{
              backgroundColor: "rgba(10, 10, 10, 0.9)",
              borderColor: "rgba(212, 255, 63, 0.3)",
            }}
          >
            <p
              className="mb-1 text-xs uppercase tracking-[0.4em]"
              style={{ color: COLORS.accent }}
            >
              Lane 1
            </p>
            <p
              ref={labelTextRef}
              className="text-3xl font-black uppercase tracking-wider sm:text-5xl lg:text-6xl"
              style={{ color: COLORS.foreground }}
            />
          </div>
        </div>
      </div>
    );
  }
);
