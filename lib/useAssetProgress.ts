/**
 * lib/useAssetProgress.ts — Real asset loading progress aggregation.
 *
 * Purpose: Returns a 0–1 progress value based on weighted real loading signals:
 *   - document.fonts.ready           → weight 0.2
 *   - Hero poster/portrait decoded   → weight 0.3
 *   - Hero video canplay/loadeddata  → weight 0.3
 *   - window load event              → weight 0.2
 *
 * The returned value is a RAW target (not smoothed). The Loader component
 * is responsible for smoothing it via GSAP tween.
 *
 * Connected to: components/loader/Loader.tsx, components/loader/LoaderGate.tsx
 *
 * Tunables: LOADER.hardCap in lib/motion.config.ts controls the force-complete
 * timeout.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { LOADER } from "@/lib/motion.config";

type ProgressSignals = {
  fonts: boolean;
  heroImage: boolean;
  heroVideo: boolean;
  windowLoad: boolean;
};

const WEIGHTS: Record<keyof ProgressSignals, number> = {
  fonts: 0.2,
  heroImage: 0.3,
  heroVideo: 0.3,
  windowLoad: 0.2,
};

export function useAssetProgress(): number {
  const [progress, setProgress] = useState(0);
  const signals = useRef<ProgressSignals>({
    fonts: false,
    heroImage: false,
    heroVideo: false,
    windowLoad: false,
  });
  const hardCapFired = useRef(false);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === "undefined") return;

    const compute = () => {
      if (hardCapFired.current) return;
      let total = 0;
      for (const key of Object.keys(WEIGHTS) as (keyof ProgressSignals)[]) {
        if (signals.current[key]) total += WEIGHTS[key];
      }
      setProgress(total);
    };

    const mark = (key: keyof ProgressSignals) => {
      if (signals.current[key]) return;
      signals.current[key] = true;
      compute();
    };

    // 1. Fonts
    document.fonts.ready.then(() => mark("fonts"));

    // 2. Hero poster image — find the hero poster/portrait and wait for decode
    const heroImg = document.querySelector<HTMLImageElement>(
      "#hero img, [data-hero-poster]"
    );
    if (heroImg) {
      if (heroImg.complete && heroImg.naturalWidth > 0) {
        mark("heroImage");
      } else {
        const onLoad = () => mark("heroImage");
        heroImg.addEventListener("load", onLoad, { once: true });
        // Also try decode if available
        if (typeof heroImg.decode === "function") {
          heroImg.decode().then(() => mark("heroImage")).catch(() => mark("heroImage"));
        }
      }
    } else {
      // No hero image found — mark as done
      mark("heroImage");
    }

    // 3. Hero video
    const heroVideo = document.querySelector<HTMLVideoElement>(
      'video[src*="he.mp4"], video source[src*="he.mp4"]'
    );
    const videoEl = heroVideo?.tagName === "SOURCE"
      ? (heroVideo.parentElement as HTMLVideoElement | null)
      : heroVideo;

    if (videoEl) {
      const onCanPlay = () => mark("heroVideo");
      if (videoEl.readyState >= 2) {
        // HAVE_CURRENT_DATA or better
        mark("heroVideo");
      } else {
        videoEl.addEventListener("loadeddata", onCanPlay, { once: true });
        videoEl.addEventListener("canplay", onCanPlay, { once: true });
      }
    } else {
      mark("heroVideo");
    }

    // 4. Window load
    if (document.readyState === "complete") {
      mark("windowLoad");
    } else {
      window.addEventListener("load", () => mark("windowLoad"), { once: true });
    }

    // 5. Hard cap — force-complete after LOADER.hardCap seconds
    const hardCapTimer = window.setTimeout(() => {
      hardCapFired.current = true;
      setProgress(1);
    }, LOADER.hardCap * 1000);

    return () => {
      window.clearTimeout(hardCapTimer);
    };
  }, []);

  return progress;
}
