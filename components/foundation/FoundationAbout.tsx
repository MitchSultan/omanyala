"use client";

import Image from "next/image";
import { ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/about/StatCounter";
import { foundationAbout, foundationStats } from "@/data/foundation";

export function FoundationAbout() {
  return (
    <section
      id="foundation-about"
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        {/* Image with imageWipe reveal (clip-path + 1.2 -> 1 scale) */}
        <Reveal
          variant="imageWipe"
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111]"
        >
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={foundationAbout.image}
              alt={foundationAbout.imageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </Reveal>

        {/* Copy + Impact Stats */}
        <div className="min-w-0 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              {foundationAbout.eyebrow}
            </p>
            <Reveal
              as="h2"
              variant="maskLines"
              className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
            >
              {foundationAbout.heading}
            </Reveal>

            <div className="mt-6 space-y-4">
              {foundationAbout.paragraphs.map((paragraph, idx) => (
                <Reveal
                  key={idx}
                  as="p"
                  variant="maskLines"
                  stagger={0.05}
                  className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8"
                >
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>

          {/* Headline impact stats */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Foundation impact statistics"
            tabIndex={0}
            className="-mx-6 flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]/60 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0"
          >
            {foundationStats.map((stat) => (
              <div
                key={stat.label}
                className="w-[80vw] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none"
              >
                <StatCounter {...stat} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
