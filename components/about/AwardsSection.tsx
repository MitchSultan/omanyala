"use client";

import { Award, Medal, Trophy, Zap } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StatCounter } from "@/components/about/StatCounter";
import { awards, stats, type AwardCategory, type AwardItem } from "@/data/about";

const CATEGORIES: AwardCategory[] = ["Records", "Medals", "Honours"];

function AwardIcon({ icon }: { icon: AwardItem["icon"] }) {
  const props = { className: "h-4 w-4 text-[#D4FF3F]", "aria-hidden": true as const };
  switch (icon) {
    case "zap":
      return <Zap {...props} />;
    case "medal":
      return <Medal {...props} />;
    case "trophy":
      return <Trophy {...props} />;
    case "award":
    default:
      return <Award {...props} />;
  }
}

export function AwardsSection() {
  return (
    <section
      id="awards"
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
            Awards &amp; Accolades
          </p>
          <Reveal
            as="h2"
            variant="maskLines"
            className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
          >
            Milestones etched in time.
          </Reveal>
        </div>

        {/* Headline stat counters */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Athlete statistics"
          tabIndex={0}
          className="mt-12 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]/60 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="w-[80vw] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none"
            >
              <StatCounter {...stat} />
            </div>
          ))}
        </div>

        {/* Grouped awards */}
        <div className="mt-20 space-y-16">
          {CATEGORIES.map((category) => {
            const groupItems = awards.filter((item) => item.category === category);
            if (groupItems.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="border-b border-white/10 pb-4 font-mono text-xs uppercase tracking-[0.35em] text-white/50">
                  {category}
                </h3>

                <Reveal variant="stagger" stagger={0.08} className="divide-y divide-white/10">
                  {groupItems.map((item) => (
                    <div
                      key={item.id}
                      data-reveal-item
                      className="group relative flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Hover accent line wipe */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#D4FF3F] transition-transform duration-500 ease-out group-hover:scale-x-100"
                      />

                      <div className="flex items-start gap-4 sm:items-center">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111111] transition-colors group-hover:border-[#D4FF3F]/50">
                          <AwardIcon icon={item.icon} />
                        </span>
                        <div>
                          <p className="text-lg font-semibold tracking-[-0.01em] text-[#F5F5F0] transition-colors group-hover:text-[#D4FF3F]">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-sm text-white/55">
                            {item.organisation}
                          </p>
                        </div>
                      </div>

                      <span className="pl-14 font-mono text-sm font-medium tracking-widest text-white/60 sm:pl-0">
                        {item.year}
                      </span>
                    </div>
                  ))}
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
