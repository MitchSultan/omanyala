"use client";

import Image from "next/image";
import { aboutStats } from "@/lib/mock-data";
import { StatCounter } from "@/components/StatCounter";
import { useGSAPReveal } from "@/hooks/useGSAPReveal";

export function About() {
  const sectionRef = useGSAPReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="border-t border-white/10 bg-[#0A0A0A] px-6 pt-16  sm:px-8 md:pt-32 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Portrait image */}
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
          {/* PLACEHOLDER: Replace with real portrait of Ferdinand Omanyala */}
          <div className="relative aspect-[4/5]">
            <Image
              src="/hero.jfif"
              alt="Portrait of Ferdinand Omanyala in a sprint-ready pose"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              About Ferdinand
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl">
              From rugby to record books, built for the lane.
            </h2>
            {/* MOCK BIO: grounded in public facts for authentic feel */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Born in Nairobi, Ferdinand Omanyala&apos;s journey to becoming
              Africa&apos;s fastest man began not on the track, but on the rugby
              pitch. A pivotal switch to sprinting unlocked raw, explosive
              talent. In 2021 he shattered the African 100m record with a
              blistering 9.77s in Nairobi. He followed it up by capturing
              Commonwealth Games gold in Birmingham — a statement of intent
              heard across the continent.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
              Today he trains with one goal: prove that African sprinters belong
              at the absolute top of the sport.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4FF3F] transition-colors hover:text-[#F5F5F0]"
            >
              Read Full Story →
            </a>
          </div>

          {/* Animated stat counters — MOCK illustrative data */}
          <div className="grid gap-4 sm:grid-cols-2">
            {aboutStats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
