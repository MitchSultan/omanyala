/**
 * components/motion/ScrollReveal.tsx — Reusable scroll-triggered text reveal.
 *
 * Purpose: Wraps any heading or body text and applies GSAP-powered reveal
 * animations triggered by ScrollTrigger as content enters the viewport.
 *
 * Two reveal styles:
 *   1. Headings (mode="lines", not scrubbed): lines rise from below their
 *      overflow-hidden masks. Plays once.
 *   2. Body text (mode="words", scrub=true): words go from dim (opacity 0.15)
 *      to full opacity as the paragraph scrubs through viewport.
 *
 * Props:
 *   - as: HTML tag to render (default "div")
 *   - mode: "lines" | "words" | "chars"
 *   - scrub: boolean — scrub-linked animation
 *   - start: ScrollTrigger start (defaults per mode)
 *   - end: ScrollTrigger end (for scrub mode)
 *   - stagger: stagger value (seconds)
 *   - delay: initial delay (seconds)
 *   - once: play once (default true for non-scrub)
 *   - className: passed to the wrapper element
 *   - children: text content
 *
 * SSR/SEO: Text is fully visible in server HTML. Animations only apply after
 * client-side mount + font loading + splitting.
 *
 * Connected to: splitText.ts (text splitting), motion.config.ts (tunables),
 *   gsap.ts (GSAP + ScrollTrigger), LoaderGate.tsx (loader:complete triggers
 *   ScrollTrigger.refresh)
 *
 * Tweakables: SCROLL_REVEAL in motion.config.ts
 */

"use client";

import {
  useRef,
  useCallback,
  type ReactNode,
  type ElementType,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { splitText, type SplitMode, type SplitResult } from "@/lib/splitText";
import { SCROLL_REVEAL } from "@/lib/motion.config";

interface ScrollRevealProps {
  as?: ElementType;
  mode?: SplitMode;
  scrub?: boolean;
  start?: string;
  end?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  className?: string;
  children: ReactNode;
}

export function ScrollReveal({
  as: Tag = "div",
  mode = "lines",
  scrub = false,
  start,
  end,
  stagger,
  delay = 0,
  once,
  className,
  children,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitResult | null>(null);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  const shouldPlayOnce = once ?? !scrub;

  const createAnimation = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Check reduced motion
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      // Ensure text is fully visible
      gsap.set(el, { opacity: 1 });
      return;
    }

    // Clean up previous context
    if (ctxRef.current) {
      ctxRef.current.revert();
    }

    ctxRef.current = gsap.context(() => {
      // Split text
      const result = splitText(el, mode);
      splitRef.current = result;

      if (result.elements.length === 0) return;

      if (scrub) {
        // ── Scrub mode (body paragraphs) ───────────────────────────────
        gsap.set(result.elements, {
          opacity: SCROLL_REVEAL.wordInitialOpacity,
        });

        gsap.to(result.elements, {
          opacity: 1,
          stagger: stagger ?? 0.05,
          delay,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: start ?? SCROLL_REVEAL.wordStart,
            end: end ?? SCROLL_REVEAL.wordEnd,
            scrub: true,
          },
        });
      } else {
        // ── Non-scrub mode (headings) ──────────────────────────────────
        // Wrap each line/word in an overflow-hidden container for the mask effect
        result.elements.forEach((elem) => {
          const htmlEl = elem as HTMLElement;
          htmlEl.style.overflow = "hidden";

          // If the element has child spans (native SplitText), target those
          const target =
            htmlEl.querySelector(".split-word, .split-char, span") || htmlEl;
          gsap.set(target, { yPercent: SCROLL_REVEAL.lineYPercent, opacity: 0 });
        });

        // Get the inner targets
        const targets = result.elements.map((elem) => {
          const htmlEl = elem as HTMLElement;
          return (
            htmlEl.querySelector(".split-word, .split-char, span") || htmlEl
          );
        });

        gsap.to(targets, {
          yPercent: 0,
          opacity: 1,
          duration: SCROLL_REVEAL.lineDuration,
          stagger: stagger ?? SCROLL_REVEAL.lineStagger,
          delay,
          ease: SCROLL_REVEAL.lineEase,
          scrollTrigger: {
            trigger: el,
            start: start ?? SCROLL_REVEAL.lineStart,
            once: shouldPlayOnce,
          },
        });
      }
    }, el);
  }, [mode, scrub, start, end, stagger, delay, shouldPlayOnce]);

  useGSAP(
    () => {
      if (!ref.current) return;

      // Wait for fonts before splitting to get correct line breaks
      document.fonts.ready.then(() => {
        createAnimation();
      });

      // Re-split on resize (debounced)
      let resizeTimer: number;
      const handleResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          // Revert existing split
          if (splitRef.current) {
            splitRef.current.revert();
            splitRef.current = null;
          }
          if (ctxRef.current) {
            ctxRef.current.revert();
            ctxRef.current = null;
          }
          // Re-create
          createAnimation();
          ScrollTrigger.refresh();
        }, SCROLL_REVEAL.resizeDebounce);
      };

      window.addEventListener("resize", handleResize);

      // Listen for loader:complete to refresh ScrollTrigger positions
      const handleLoaderComplete = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("loader:complete", handleLoaderComplete);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("loader:complete", handleLoaderComplete);
        window.clearTimeout(resizeTimer);
        if (splitRef.current) {
          splitRef.current.revert();
        }
        if (ctxRef.current) {
          ctxRef.current.revert();
        }
      };
    },
    { scope: ref }
  );

  // Render as the specified tag with children visible (SSR-safe)
  const Component = Tag as ElementType<{
    ref?: RefObject<HTMLElement | null>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
