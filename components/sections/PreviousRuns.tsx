"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { raceEntries } from "@/lib/mock-data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * MOCK DATA: illustrative race data based on Omanyala's real 2026 season shape.
 * Replace with verified data before production.
 */
export function PreviousRuns() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const current = raceEntries[activeIndex];

  const goTo = (index: number) => {
    const len = raceEntries.length;
    const next = ((index % len) + len) % len;
    const direction = index > activeIndex ? 1 : -1;
    setActiveIndex(next);

    // Quick GSAP card transition — fast, not decorative
    if (cardRef.current) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!reducedMotion) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0.6, x: direction * 20 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }
        );
      }
    }
  };

  /* Section entrance animation */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="runs"
      ref={sectionRef}
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Previous runs
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl">
              A season of sharp starts.
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 transition-colors hover:border-[#D4FF3F]/50"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous race"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 transition-colors hover:border-[#D4FF3F]/50"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next race"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex gap-2">
          {raceEntries.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-[#D4FF3F]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to race ${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Featured race detail card */}
          <Card
            ref={cardRef}
            className="overflow-hidden border-white/10 bg-[#111111] p-0"
          >
            {/* PLACEHOLDER IMAGE */}
            <div className="relative h-64 sm:h-80 bg-[#1A1A1A]">
              <Image
                src={current.url}
                alt={current.imageLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                    {current.date}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[#F5F5F0]">
                    {current.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    {current.location}
                  </p>
                </div>
                <span className="rounded-full border border-[#D4FF3F]/30 bg-[#D4FF3F]/10 px-3 py-1 text-sm font-semibold text-[#D4FF3F]">
                  {current.place}
                </span>
              </div>
              <div className="mt-6">
                {/* Stopwatch treatment — tabular numerals, monospace */}
                <span className="font-mono text-5xl font-black tracking-tight text-[#D4FF3F]">
                  {current.time}
                </span>
              </div>
            </div>
          </Card>

          {/* Race list — all entries */}
          <div className="flex flex-col gap-3">
            {raceEntries.map((entry, i) => (
              <button
                key={entry.name}
                type="button"
                onClick={() => goTo(i)}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                  i === activeIndex
                    ? "border-[#D4FF3F]/40 bg-[#D4FF3F]/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                      {entry.date}
                    </p>
                    <p className="mt-1.5 text-lg font-semibold text-[#F5F5F0]">
                      {entry.name}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {entry.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl font-bold text-[#D4FF3F]">
                      {entry.time}
                    </span>
                    <p className="mt-1 text-xs text-white/40">{entry.place}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
