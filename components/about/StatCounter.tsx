"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

/**
 * Scroll-triggered animated stat counter.
 * Renders the final value in SSR/reduced-motion, and counts up via GSAP
 * when scrolled into view without triggering per-frame React re-renders.
 */
export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
}: StatCounterProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    const numEl = numberRef.current;
    if (!el || !numEl) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      numEl.textContent = value.toFixed(decimals);
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let cancelled = false;

    const startCounter = () => {
      if (cancelled || !cardRef.current || !numberRef.current) return;

      ctx = gsap.context(() => {
        const counter = { current: 0 };
        numberRef.current!.textContent = (0).toFixed(decimals);

        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.to(counter, {
          current: value,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.textContent = counter.current.toFixed(decimals);
            }
          },
        });
      }, el);
    };

    const handleLoaderComplete = () => {
      startCounter();
      ScrollTrigger.refresh();
    };

    if (document.documentElement.dataset.loaded === "true") {
      startCounter();
    } else {
      window.addEventListener("loader:complete", handleLoaderComplete, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", handleLoaderComplete);
      if (ctx) {
        ctx.revert();
      }
    };
  }, [decimals, value]);

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-white/10 bg-[#111111] p-6 transition-colors hover:border-[#D4FF3F]/30"
    >
      <p className="font-mono text-3xl font-semibold tracking-tight text-[#D4FF3F] sm:text-4xl">
        {prefix}
        <span ref={numberRef}>{value.toFixed(decimals)}</span>
        {suffix}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/60">
        {label}
      </p>
    </div>
  );
}
