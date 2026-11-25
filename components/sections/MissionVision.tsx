"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function MissionVision() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll("[data-mv-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
          Purpose
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Mission */}
          <div
            data-mv-card
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#E4272A]">
              Mission
            </p>
            <ScrollReveal
              as="h3"
              mode="lines"
              className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl lg:text-4xl"
            >
              Push the African sprint story into the global spotlight.
            </ScrollReveal>
            {/* MOCK COPY */}
            <ScrollReveal
              as="p"
              mode="words"
              scrub
              className="mt-6 text-lg leading-8 text-white/60"
            >
              To cultivate and elevate sports excellence by fostering talent development, nurturing the growth of young talents, sustaining healthy sports and promoting environmentally sustainable practices
            </ScrollReveal>
          </div>

          {/* Vision */}
          <div
            data-mv-card
            className="rounded-[2rem] border border-white/10 bg-[#111111] p-8 sm:p-10"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Vision
            </p>
            <ScrollReveal
              as="h3"
              mode="lines"
              className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl lg:text-4xl"
            >
              Represent excellence with calm conviction and relentless rhythm.
            </ScrollReveal>
            {/* MOCK COPY */}
            <ScrollReveal
              as="p"
              mode="words"
              scrub
              className="mt-6 text-lg leading-8 text-white/60"
            >
              A future where African sprinters are the standard, not the
              exception. Discipline, speed, and grace — on repeat.
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
