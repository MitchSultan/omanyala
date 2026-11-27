"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDownRight, ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { splitText, type SplitResult } from "@/lib/splitText";
import { HERO_INTRO, SCROLL_REVEAL, TRANSITION } from "@/lib/motion.config";
import { foundationHero } from "@/data/foundation";

export function FoundationHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgWrapRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bgWrap = bgWrapRef.current;
    const heading = headingRef.current;
    if (!section || !bgWrap || !heading) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let splitResult: SplitResult | null = null;
    let cancelled = false;

    const playIntro = () => {
      if (cancelled || !headingRef.current || !sectionRef.current) return;

      document.fonts.ready.then(() => {
        if (cancelled || !headingRef.current || !sectionRef.current) return;

        ctx = gsap.context(() => {
          // 1. Background slow scale-down from 1.1 -> 1
          gsap.fromTo(
            bgWrap,
            { scale: 1.1 },
            { scale: 1, duration: 1.4, ease: "power3.out" }
          );

          // 2. Gentle parallax on scroll away
          gsap.to(bgWrap, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // 3. Split headline into lines for masked slide-up
          splitResult = splitText(headingRef.current!, "lines");
          const lineTargets = splitResult.elements.map((elem) => {
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

          if (lineTargets.length > 0) {
            tl.to(
              lineTargets,
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.09,
                ease: "power3.out",
              },
              0
            );
          }

          if (eyebrowRef.current) {
            tl.fromTo(
              eyebrowRef.current,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              0.15
            );
          }

          if (subtextRef.current) {
            tl.fromTo(
              subtextRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
              0.3
            );
          }

          if (ctasRef.current) {
            tl.fromTo(
              ctasRef.current,
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" },
              0.42
            );
          }

          if (scrollCueRef.current) {
            tl.fromTo(
              scrollCueRef.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.5 },
              0.55
            );
          }
        }, sectionRef);
      });
    };

    const handleLoaderComplete = () => {
      playIntro();
      ScrollTrigger.refresh();
    };

    if (document.documentElement.dataset.loaded === "true") {
      playIntro();
    } else {
      window.addEventListener("loader:complete", handleLoaderComplete, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", handleLoaderComplete);
      if (splitResult) splitResult.revert();
      if (ctx) ctx.revert();
    };
  }, []);

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(foundationHero.primaryCta.href);
    if (!target) return;
    e.preventDefault();

    const headerOffset =
      document.querySelector("nav")?.getBoundingClientRect().height || 72;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo(0, Math.max(0, y));
      return;
    }

    gsap.to(window, {
      scrollTo: { y: target, offsetY: headerOffset },
      duration: TRANSITION.anchorScrollDuration,
      ease: TRANSITION.anchorScrollEase,
    });
  };

  return (
    <section
      ref={sectionRef}
      data-hero-media="true"
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background image with scale-down + parallax */}
      <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
        <Image
          src={foundationHero.image}
          alt={foundationHero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark gradient overlays for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/40 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 sm:px-8 sm:pb-24 lg:px-12">
        <div className="max-w-3xl">
          <p
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.35em] text-[#D4FF3F]"
          >
            {foundationHero.eyebrow}
          </p>

          <h1
            ref={headingRef}
            className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-[#F5F5F0] sm:text-6xl lg:text-7xl"
          >
            {foundationHero.headline}
          </h1>

          <p
            ref={subtextRef}
            className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8"
          >
            {foundationHero.subtext}
          </p>

          <div
            ref={ctasRef}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href={foundationHero.primaryCta.href}
              onClick={handleScrollToProjects}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#D4FF3F] px-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
            >
              <span>{foundationHero.primaryCta.label}</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>

            {/* <a
              href={foundationHero.secondaryCta.href}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#F5F5F0] backdrop-blur-sm transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              {foundationHero.secondaryCta.label}
            </a> */}
          </div>
        </div>

        {/* Scroll cue */}
        {/* <div className="mt-12 flex justify-end border-t border-white/10 pt-6">
          <a
            ref={scrollCueRef}
            href="#foundation-about"
            aria-label="Scroll to about the foundation"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-xs uppercase tracking-[0.25em] text-white/75 transition-colors hover:border-[#D4FF3F]/60 hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
          >
            <span>Scroll</span>
            <ChevronDown className="h-4 w-4 text-[#D4FF3F]" aria-hidden="true" />
          </a>
        </div> */}
      </div>
    </section>
  );
}
