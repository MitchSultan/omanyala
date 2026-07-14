"use client";

import Image from "next/image";
import { foundStats } from "@/lib/mock-data";
import { FoundCounter } from "@/components/FoundCounter";
import { useGSAPReveal } from "@/hooks/useGSAPReveal";

export function Found() {
  const sectionRef1 = useGSAPReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={sectionRef1}
      className=" px-6 pt-4  pb-16 sm:px-8 md:pb-32 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Portrait image */}
        

        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              About the Foundation
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl">
              
Omanyala Foundation Trust
            </h2>
            {/* MOCK BIO: grounded in public facts for authentic feel */}
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              The Omanyala Foundation Trust is a nonprofit organization dedicated to advancing sports and physical activity by running various programs, raising funds, and engaging with the community.

These activities play a crucial role in promoting sports and athletic development, particularly among underserved populations with an aim of creating a positive impact on individuals and communities in Kenya.
            </p>
            
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4FF3F] transition-colors hover:text-[#F5F5F0]"
            >
              About Foundation →
            </a>
          </div>

          {/* Animated stat counters — MOCK illustrative data */}
          <div className="grid gap-4 sm:grid-cols-2">
            {foundStats.map((stat) => (
              <FoundCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>


        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
          {/* PLACEHOLDER: Replace with real portrait of Ferdinand Omanyala */}
          <div className="relative aspect-[4/5]">
            <Image
              src="/found.jpeg"
              alt="Portrait of Ferdinand Omanyala in a sprint-ready pose"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
