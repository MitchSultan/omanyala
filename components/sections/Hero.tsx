"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReminderDialog } from "@/components/ReminderDialog";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { heroData } from "@/lib/mock-data";
import { gsap } from "@/lib/gsap";
import { HERO_INTRO } from "@/lib/motion.config";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  /* Detect prefers-reduced-motion and observe hero visibility for video pause */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      observer.disconnect();
    };
  }, []);

  /* Play/pause hero video based on visibility — saves CPU/battery */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion || !isVisible) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => undefined);
    }
  }, [reducedMotion, isVisible]);

  /* GSAP headline reveal — starts on loader:complete (or immediately if skipped) */
  useEffect(() => {
    if (reducedMotion) return;

    let tl: gsap.core.Timeline | null = null;
    let played = false;

    const playIntro = () => {
      if (played) return;
      played = true;

      tl = gsap.timeline({ delay: HERO_INTRO.delay });

      const navEl = document.querySelector("nav");
      if (navEl) {
        tl.fromTo(
          navEl,
          { y: -16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
          0
        );
      }

      tl.fromTo(
        "[data-hero-word]",
        { y: 60, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: HERO_INTRO.wordDuration,
          stagger: HERO_INTRO.wordStagger,
          ease: HERO_INTRO.wordEase,
        },
        0
      );

      tl.fromTo(
        "[data-hero-sub]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );

      tl.fromTo(
        "[data-hero-cta]",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: "power3.out" },
        "-=0.15"
      );

      tl.fromTo(
        "[data-hero-stat]",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
        "-=0.3"
      );

      tl.fromTo(
        "[data-hero-scroll]",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.1"
      );
    };

    if (document.documentElement.dataset.loaded === "true") {
      playIntro();
    } else {
      window.addEventListener("loader:complete", playIntro, { once: true });
    }

    return () => {
      window.removeEventListener("loader:complete", playIntro);
      tl?.kill();
    };
  }, [reducedMotion]);

  const headlineWords = useMemo(
    () => heroData.headline.split(" "),
    []
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative isolate bg-white flex min-h-screen items-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background video — NOT the LCP element; poster loads first */}
      {/* PLACEHOLDER: Replace /videos/hero-loop.mp4 and .webm with real compressed assets (<3MB loop) */}
      <video
        ref={videoRef}
        src="/he.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        poster="/hero.jpeg"
        autoPlay={!reducedMotion}
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        {/* <source src="/videos/hero-loop.webm" type="video/webm" /> */}
        {/* <source src="/he.mp4" type="video/mp4" /> */}
      </video>

      {/* Dark gradient overlay for text legibility (WCAG AA) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/75 to-[#0A0A0A]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(228,39,42,0.12),transparent_50%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between px-6 py-20 sm:px-8 lg:px-12">
        {/* Hero top nav — only visible in hero section */}
        

        <div className="grid gap-12 pt-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pt-24">
          {/* Left: headline + CTAs */}
          <div className="max-w-4xl">
            {/* <p className="text-xs uppercase tracking-[0.4em] text-[#D4FF3F]">
              Fastest Man
            </p> */}

            {/* H1 is the LCP element — rendered immediately, animated with GSAP */}
            <h1 className="mt-5 overflow-hidden text-[clamp(2.5rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#ffffff]">
              {headlineWords.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  data-hero-word
                  className="mr-[0.25em] inline-block"
                  style={{ opacity: reducedMotion ? 1 : 0 }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              data-hero-sub
              className="mt-6 max-w-md text-lg leading-relaxed text-white sm:text-xl"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              {heroData.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div data-hero-cta style={{ opacity: reducedMotion ? 1 : 0 }}>
                <TransitionLink
                  href="#runs"
                  className="inline-flex items-center justify-center rounded-full bg-[#E4272A] px-7 py-4 text-sm font-semibold text-[#F5F5F0] transition-transform hover:bg-[#E4272A]/90 hover:scale-[1.04] active:scale-[0.98]"
                >
                  See Last Run
                </TransitionLink>
              </div>

              {/* <div data-hero-cta style={{ opacity: reducedMotion ? 1 : 0 }}>
                <ReminderDialog
                  trigger={
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 bg-white/5 px-7 py-6 text-sm font-semibold text-[#Ffffff] transition-all hover:bg-white/10 hover:text-[#D4FF3F] hover:scale-[1.04] active:scale-[0.98]"
                    >
                      Set Reminder for Next Race
                    </Button>
                  }
                  defaultRace={heroData.upcomingRace}
                />
              </div> */}
            </div>
          </div>

          {/* Right: last race stat card with stopwatch treatment */}
          {/* <div
            data-hero-stat
            className="self-end display:none lg:display:block rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-md"
            style={{ opacity: reducedMotion ? 1 : 0 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Last race
            </p>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              <p className="text-xl font-semibold text-white/90">
                {heroData.event}
              </p>
              <p>
                {heroData.location} · {heroData.date}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-4xl font-black tracking-tight text-[#D4FF3F]">
                  {heroData.time}
                </span>
                <span className="rounded-full border border-[#D4FF3F]/30 bg-[#D4FF3F]/10 px-3 py-1 text-sm font-semibold text-[#D4FF3F]">
                  {heroData.place}
                </span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Bottom scroll indicator */}
        <div
          data-hero-scroll
          className="mt-12 flex items-center justify-between text-sm text-white/50 sm:mt-16"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#D4FF3F]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#FFFFFF]">
              Fast. Focused. Forward.
            </span>
          </div>
          {/* <TransitionLink
            href="#about"
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] transition-colors hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F]"
          >
            <span>Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </TransitionLink> */}
        </div>
      </div>
    </section>
  );
}
