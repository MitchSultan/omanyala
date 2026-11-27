"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import { storyChapters } from "@/data/about";

export function StoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineWrapRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(storyChapters[0]?.year ?? "");
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const timelineWrap = timelineWrapRef.current;
    const lineFill = lineFillRef.current;
    if (!section || !timelineWrap || !lineFill) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let cancelled = false;

    const initTimeline = () => {
      if (cancelled || !timelineWrapRef.current) return;

      if (reducedMotion) {
        gsap.set(lineFill, { scaleY: 1 });
        setActiveChapterIdx(storyChapters.length - 1);
        return;
      }

      ctx = gsap.context(() => {
        // 1. Central line scrub draw
        gsap.fromTo(
          lineFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineWrap,
              start: "top 65%",
              end: "bottom 75%",
              scrub: true,
            },
          }
        );

        // 2. Per-chapter node activation, active sticky year, and parallax numerals/images
        const chapterEls =
          timelineWrap.querySelectorAll<HTMLElement>("[data-chapter]");

        chapterEls.forEach((chapterEl, idx) => {
          const year = chapterEl.dataset.year || "";
          const numeral = chapterEl.querySelector<HTMLElement>(
            "[data-chapter-numeral]"
          );
          const parallaxImg = chapterEl.querySelector<HTMLElement>(
            "[data-chapter-parallax]"
          );

          ScrollTrigger.create({
            trigger: chapterEl,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => {
              setActiveYear(year);
              setActiveChapterIdx((prev) => Math.max(prev, idx));
            },
            onEnterBack: () => {
              setActiveYear(year);
            },
          });

          if (numeral) {
            gsap.fromTo(
              numeral,
              { yPercent: 18 },
              {
                yPercent: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: chapterEl,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }

          if (parallaxImg) {
            gsap.fromTo(
              parallaxImg,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: chapterEl,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      }, section);
    };

    const handleLoaderComplete = () => {
      initTimeline();
      ScrollTrigger.refresh();
    };

    if (document.documentElement.dataset.loaded === "true") {
      initTimeline();
    } else {
      window.addEventListener("loader:complete", handleLoaderComplete, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", handleLoaderComplete);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#0A0A0A] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header + sticky year progress indicator */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              The Story
            </p>
            <Reveal
              as="h2"
              variant="maskLines"
              className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
            >
              From local fields to the fastest man in Africa.
            </Reveal>
          </div>

          <div className="md:sticky md:top-24 md:self-start">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#D4FF3F]" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.28em] text-black">
                Chapter
              </span>
              <span className="font-mono text-sm font-semibold text-[#D4FF3F]">
                {activeYear}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline chapters */}
        <div ref={timelineWrapRef} className="relative mt-20 space-y-24 lg:space-y-32">
          {/* Central vertical track (left-aligned on mobile, centered on lg) */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-3.5 top-0 w-px bg-white/10 lg:left-1/2 lg:-translate-x-1/2"
          >
            <div
              ref={lineFillRef}
              className="h-full w-full origin-top bg-gradient-to-b from-[#D4FF3F] via-[#D4FF3F] to-[#E4272A]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {storyChapters.map((chapter, index) => {
            const isEven = index % 2 === 0;
            const isNodeFilled = index <= activeChapterIdx;

            return (
              <article
                key={chapter.year + chapter.title}
                data-chapter
                data-year={chapter.year}
                className="relative pl-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:pl-0"
              >
                {/* Faint parallax year numeral behind the chapter */}
                <span
                  data-chapter-numeral
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-8 select-none font-mono text-7xl font-bold tracking-tighter text-white/[0.04] sm:text-8xl lg:-top-10 lg:text-[9rem] ${
                    isEven ? "right-4 lg:right-auto lg:left-4" : "right-4"
                  }`}
                >
                  {chapter.year}
                </span>

                {/* Central timeline node */}
                <div
                  aria-hidden="true"
                  className={`absolute left-3.5 top-3 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border transition-colors duration-500 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 ${
                    isNodeFilled
                      ? "border-[#D4FF3F] bg-[#0A0A0A]"
                      : "border-white/25 bg-[#0A0A0A]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-transform duration-500 ${
                      isNodeFilled
                        ? "scale-100 bg-[#D4FF3F]"
                        : "scale-0 bg-transparent"
                    }`}
                  />
                </div>

                {/* Text column */}
                <Reveal
                  variant="fadeUp"
                  className={`relative z-10 space-y-4 ${
                    isEven ? "lg:pr-10 lg:text-right" : "lg:order-2 lg:pl-10"
                  }`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
                    {chapter.year} · Chapter{" "}
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#F5F5F0] sm:text-3xl">
                    {chapter.title}
                  </h3>
                  <p className="text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                    {chapter.body}
                  </p>
                </Reveal>

                {/* Image column */}
                <div
                  className={`relative z-10 mt-8 lg:mt-0 ${
                    isEven ? "lg:pl-10" : "lg:order-1 lg:pr-10"
                  }`}
                >
                  <Reveal
                    variant="imageWipe"
                    className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111111]"
                  >
                    <div
                      data-chapter-parallax
                      className="relative aspect-[4/3] w-full"
                    >
                      <Image
                        src={chapter.image}
                        alt={chapter.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 44vw"
                        className="object-cover"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    </div>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
