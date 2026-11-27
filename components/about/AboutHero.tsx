"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { splitText, type SplitResult } from "@/lib/splitText";
import { HERO_INTRO, SCROLL_REVEAL } from "@/lib/motion.config";
import { heroEyebrow, heroHeading, heroSlides } from "@/data/about";

const AUTOPLAY_MS = 5000;

export function AboutHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const slideCount = heroSlides.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Masked heading reveal on load (waits for loader:complete if active)
  useEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let splitResult: SplitResult | null = null;
    let cancelled = false;

    const playIntro = () => {
      if (cancelled || !headingRef.current) return;

      document.fonts.ready.then(() => {
        if (cancelled || !headingRef.current) return;

        ctx = gsap.context(() => {
          splitResult = splitText(headingRef.current!, "lines");
          const targets = splitResult.elements.map((elem) => {
            const htmlEl = elem as HTMLElement;
            htmlEl.style.overflow = "hidden";
            const inner =
              htmlEl.querySelector(".split-word, .split-char, span") || htmlEl;
            gsap.set(inner, {
              yPercent: SCROLL_REVEAL.lineYPercent,
              opacity: 0,
            });
            return inner;
          });

          const tl = gsap.timeline({ delay: HERO_INTRO.delay });

          if (eyebrowRef.current) {
            tl.fromTo(
              eyebrowRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              0
            );
          }

          if (targets.length > 0) {
            tl.to(
              targets,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.09,
                ease: "power3.out",
              },
              0.08
            );
          }

          if (scrollCueRef.current) {
            tl.fromTo(
              scrollCueRef.current,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              "-=0.3"
            );
          }
        }, sectionRef);
      });
    };

    if (document.documentElement.dataset.loaded === "true") {
      playIntro();
    } else {
      window.addEventListener("loader:complete", playIntro, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", playIntro);
      if (splitResult) splitResult.revert();
      if (ctx) ctx.revert();
    };
  }, []);

  // Autoplay timer + progress bar animation
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

    const bar = progressBarRef.current;
    let barTween: gsap.core.Tween | null = null;

    if (bar && !reducedMotion) {
      barTween = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: AUTOPLAY_MS / 1000,
          ease: "none",
        }
      );
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timer);
      if (barTween) barTween.kill();
    };
  }, [activeIndex, isPaused, reducedMotion, slideCount]);

  // Keyboard navigation when hero section has focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 48) {
      if (delta < 0) goNext();
      else goPrev();
    }
  };

  return (
    <section
      ref={sectionRef}
      data-hero-media="true"
      aria-roledescription="carousel"
      aria-label="Ferdinand Omanyala gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[#0A0A0A] outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]/60"
    >
      {/* Background crossfading slides with Ken Burns zoom */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover object-center transition-transform ease-out ${
                  reducedMotion
                    ? "scale-100 duration-0"
                    : isActive
                      ? "scale-[1.08] duration-[5500ms]"
                      : "scale-100 duration-1000"
                }`}
              />
            </div>
          );
        })}

        {/* Dark gradient overlay for guaranteed legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-[#0A0A0A]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent"
        />
      </div>

      {/* Fixed single heading + controls overlay */}
      <div className="relative z-30 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-14 pt-32 sm:px-8 sm:pb-20 lg:px-12">
        <div className="max-w-4xl">
          <p
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.35em] text-[#D4FF3F]"
          >
            {heroEyebrow}
          </p>
          <h1
            ref={headingRef}
            className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-[#F5F5F0] sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {heroHeading}
          </h1>
        </div>

        {/* Bottom bar: slide progress, prev/next controls, scroll-down cue */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
          {/* Progress indicator & slide selector */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-white/60">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(slideCount).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-2" role="group" aria-label="Choose hero slide">
              {heroSlides.map((slide, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => goTo(idx)}
                    aria-label={`Show slide ${idx + 1}: ${slide.caption ?? slide.alt}`}
                    aria-current={isCurrent ? "true" : undefined}
                    className="group relative flex h-11 items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
                  >
                    <span
                      className={`relative block h-1 overflow-hidden rounded-full transition-all duration-300 ${
                        isCurrent ? "w-10 bg-white/50" : "w-4 bg-white/50 group-hover:bg-white/50"
                      }`}
                    >
                      {isCurrent && (
                        <span
                          ref={progressBarRef}
                          className="absolute inset-0 origin-left bg-[#D4FF3F]"
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {heroSlides[activeIndex]?.caption && (
              <span className="hidden text-xs uppercase tracking-[0.25em] text-white/50 sm:inline">
                {heroSlides[activeIndex].caption}
              </span>
            )}
          </div>

          {/* Prev / Next + Scroll cue */}
          {/* <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous hero image"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#F5F5F0] backdrop-blur-sm transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next hero image"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#F5F5F0] backdrop-blur-sm transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <a
              ref={scrollCueRef}
              href="#story"
              aria-label="Scroll to story timeline"
              className="ml-2 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-xs uppercase tracking-[0.25em] text-white/80 transition-colors hover:border-[#D4FF3F]/60 hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <span>Scroll</span>
              <ChevronDown
                className={`h-4 w-4 text-[#D4FF3F] ${
                  reducedMotion ? "" : "animate-bounce"
                }`}
              />
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}
