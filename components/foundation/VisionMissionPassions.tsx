"use client";

import { useEffect, useRef } from "react";
import {
  Flame,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import {
  mission,
  passions,
  vision,
  type PassionIconKey,
} from "@/data/foundation";

function PassionIcon({ icon }: { icon: PassionIconKey }) {
  const cls =
    "h-5 w-5 text-[#D4FF3F] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5";
  switch (icon) {
    case "users":
      return <Users className={cls} aria-hidden="true" />;
    case "flame":
      return <Flame className={cls} aria-hidden="true" />;
    case "graduationCap":
      return <GraduationCap className={cls} aria-hidden="true" />;
    case "heartHandshake":
      return <HeartHandshake className={cls} aria-hidden="true" />;
    case "target":
      return <Target className={cls} aria-hidden="true" />;
    case "sparkles":
    default:
      return <Sparkles className={cls} aria-hidden="true" />;
  }
}

export function VisionMissionPassions() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const visionCardRef = useRef<HTMLDivElement>(null);
  const missionCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pinWrap = pinSectionRef.current;
    const vCard = visionCardRef.current;
    const mCard = missionCardRef.current;
    if (!pinWrap || !vCard || !mCard) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let cancelled = false;

    const initPin = () => {
      if (cancelled || !pinSectionRef.current) return;

      mm = gsap.matchMedia();

      // Desktop + motion allowed: pin & scrub takeover between Vision and Mission
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(vCard, { opacity: 1, y: 0, scale: 1 });
          gsap.set(mCard, { opacity: 0.25, y: 48, scale: 0.96 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinWrap,
              start: "top 18%",
              end: "+=70%",
              pin: true,
              scrub: 0.6,
            },
          });

          tl.to(
            vCard,
            { opacity: 0.35, y: -24, scale: 0.97, ease: "power2.out" },
            0
          ).to(
            mCard,
            { opacity: 1, y: 0, scale: 1, ease: "power2.out" },
            0
          );
        }
      );

      // Mobile or reduced motion: simple staggered entrance without pin
      mm.add(
        "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        () => {
          const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

          if (reduced) {
            gsap.set([vCard, mCard], { opacity: 1, y: 0, scale: 1 });
            return;
          }

          gsap.fromTo(
            [vCard, mCard],
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: pinWrap,
                start: "top 85%",
                once: true,
              },
            }
          );
        }
      );
    };

    const handleLoaderComplete = () => {
      initPin();
      ScrollTrigger.refresh();
    };

    if (document.documentElement.dataset.loaded === "true") {
      initPin();
    } else {
      window.addEventListener("loader:complete", handleLoaderComplete, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", handleLoaderComplete);
      if (mm) mm.revert();
    };
  }, []);

  return (
    <section
      id="purpose"
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Vision & Mission pinned takeover on desktop */}
        <div ref={pinSectionRef} className="space-y-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Purpose
            </p>
            <Reveal
              as="h2"
              variant="maskLines"
              className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
            >
              Guided by vision. Driven by mission.
            </Reveal>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision Card */}
            <div
              ref={visionCardRef}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] p-8 sm:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-6 select-none font-mono text-[8rem] font-bold leading-none tracking-tighter text-white/[0.04] sm:text-[10rem]"
              >
                {vision.numeral}
              </span>
              <p className="relative z-10 font-mono text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
                {vision.numeral} · {vision.title}
              </p>
              <p className="relative z-10 mt-6 text-2xl font-semibold leading-snug tracking-[-0.02em] text-[#F5F5F0] sm:text-3xl">
                {vision.statement}
              </p>
            </div>

            {/* Mission Card */}
            <div
              ref={missionCardRef}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#141414] p-8 sm:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 -top-6 select-none font-mono text-[8rem] font-bold leading-none tracking-tighter text-white/[0.04] sm:text-[10rem]"
              >
                {mission.numeral}
              </span>
              <p className="relative z-10 font-mono text-xs uppercase tracking-[0.35em] text-[#E4272A]">
                {mission.numeral} · {mission.title}
              </p>
              <p className="relative z-10 mt-6 text-2xl font-semibold leading-snug tracking-[-0.02em] text-[#F5F5F0] sm:text-3xl">
                {mission.statement}
              </p>
            </div>
          </div>
        </div>

        {/* What We're Passionate About */}
        <div className="mt-24 border-t border-white/10 pt-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Core Pillars
            </p>
            <Reveal
              as="h3"
              variant="maskLines"
              className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl lg:text-4xl"
            >
              What We&apos;re Passionate About
            </Reveal>
          </div>

          <Reveal
            variant="stagger"
            stagger={0.08}
            className="mt-12 -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
          >
            {passions.map((item) => (
              <div
                key={item.id}
                data-reveal-item
                className="group relative w-[80vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-7 transition-colors hover:border-[#D4FF3F]/35 sm:w-auto sm:shrink sm:snap-align-none"
              >
                {/* Hover accent line wipe */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#D4FF3F] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />

                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0A0A0A]">
                  <PassionIcon icon={item.icon} />
                </div>

                <h4 className="mt-5 text-lg font-bold tracking-[-0.01em] text-[#F5F5F0] transition-colors group-hover:text-[#D4FF3F]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {item.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
