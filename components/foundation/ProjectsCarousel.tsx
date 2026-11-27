"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { foundationCta, projects } from "@/data/foundation";

const AUTOPLAY_MS = 5500;

export function ProjectsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const lastSettledRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const getNearestIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return 0;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - trackCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });

    return bestIdx;
  }, []);

  // Scroll tracking & settled announcement
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    let settleTimer: number | null = null;
    const supportsScrollEnd = "onscrollend" in window;

    const handleSettled = () => {
      const idx = getNearestIndex();
      setActiveIndex(idx);
      if (idx !== lastSettledRef.current) {
        lastSettledRef.current = idx;
        setAnnouncement(
          `Project ${idx + 1} of ${projects.length}: ${projects[idx]?.name}`
        );
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          setActiveIndex(getNearestIndex());
        });
      }

      if (!supportsScrollEnd) {
        if (settleTimer !== null) window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(handleSettled, 140);
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    if (supportsScrollEnd) {
      track.addEventListener("scrollend", handleSettled);
    }

    return () => {
      track.removeEventListener("scroll", onScroll);
      if (supportsScrollEnd) {
        track.removeEventListener("scrollend", handleSettled);
      }
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
    };
  }, [getNearestIndex]);

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = ((index % projects.length) + projects.length) % projects.length;
      const target = track.children[clamped] as HTMLElement | undefined;
      if (!target) return;

      setActiveIndex(clamped);
      const targetLeft =
        target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;

      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  // Autoplay (pauses on hover/focus and disabled under reduced motion)
  useEffect(() => {
    if (isPaused || reducedMotion || projects.length <= 1) return;

    const timer = window.setInterval(() => {
      scrollToSlide((activeIndex + 1) % projects.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, reducedMotion, scrollToSlide]);

  // Mouse drag-to-scroll
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = track.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = dragScrollLeftRef.current - (e.clientX - dragStartXRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Keyboard navigation
  const handleTrackKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToSlide(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToSlide(activeIndex - 1);
    }
  };

  // Subtle pointer parallax on active slide image (desktop only)
  const handleImageParallax = (
    e: React.PointerEvent<HTMLDivElement>,
    isActive: boolean
  ) => {
    if (!isActive || reducedMotion || e.pointerType !== "mouse") return;
    const img = e.currentTarget.querySelector("img");
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.06) translate3d(${xRatio * -12}px, ${yRatio * -12}px, 0)`;
  };

  const resetImageParallax = (e: React.PointerEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector("img");
    if (!img) return;
    img.style.transform = "";
  };

  return (
    <section
      id="projects"
      aria-roledescription="carousel"
      aria-label="Flagship foundation projects"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              Flagship Projects
            </p>
            <Reveal
              as="h2"
              variant="maskLines"
              className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
            >
              Programs built for lasting impact.
            </Reveal>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex - 1)}
              aria-label="Previous project"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5F5F0] transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex + 1)}
              aria-label="Next project"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5F5F0] transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scroll-snap track */}
        <Reveal variant="stagger" className="mt-12">
          <div
            ref={trackRef}
            tabIndex={0}
            role="group"
            aria-label="Foundation project slides. Use left and right arrow keys to navigate."
            onKeyDown={handleTrackKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              overscrollBehaviorX: "contain",
              touchAction: "manipulation",
              scrollBehavior: reducedMotion ? "auto" : "smooth",
            }}
            className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-4 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]/60"
          >
            {projects.map((project, idx) => {
              const isActive = idx === activeIndex;
              return (
                <article
                  key={project.slug}
                  data-reveal-item
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${idx + 1} of ${projects.length}`}
                  className={`flex w-[88vw] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border bg-[#111111] transition-all duration-500 sm:w-[72vw] lg:w-[60vw] xl:w-[52rem] ${
                    isActive
                      ? "scale-100 border-[#D4FF3F]/40 opacity-100"
                      : "scale-[0.94] border-white/10 opacity-55"
                  }`}
                >
                  {/* Project Image with pointer parallax when active */}
                  <div
                    onPointerMove={(e) => handleImageParallax(e, isActive)}
                    onPointerLeave={resetImageParallax}
                    className="relative aspect-[16/9] w-full overflow-hidden bg-black"
                  >
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 52rem"
                      className="object-cover transition-transform duration-300 ease-out"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent"
                    />
                    <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/70 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#D4FF3F] backdrop-blur-sm">
                      {project.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-7 sm:p-9">
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#F5F5F0] sm:text-3xl">
                        {project.name}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-white/70">
                        {project.description}
                      </p>

                      {/* Key details */}
                      <dl className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-xs text-white/60 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-[#D4FF3F]" aria-hidden="true" />
                          <dt className="sr-only">Location</dt>
                          <dd>{project.details.location}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-[#D4FF3F]" aria-hidden="true" />
                          <dt className="sr-only">Frequency</dt>
                          <dd>{project.details.frequency}</dd>
                        </div>
                      </dl>

                      {project.details.partners.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.details.partners.map((partner) => (
                            <span
                              key={partner}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60"
                            >
                              {partner}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-7">
                      {project.href ? (
                        <TransitionLink
                          href={project.href}
                          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#D4FF3F]/40 bg-[#D4FF3F]/10 px-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4FF3F] transition-colors hover:bg-[#D4FF3F] hover:text-[#0A0A0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
                        >
                          <span>Learn More</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </TransitionLink>
                      ) : (
                        // TODO: replace with TransitionLink when project detail route is ready
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          title="Project detail page coming soon"
                          className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/40"
                        >
                          <span>Learn More · Coming Soon</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Reveal>

        {/* Marker dots */}
        <nav
          aria-label="Choose a foundation project"
          className="mt-6 flex items-center justify-center gap-1"
        >
          {projects.map((project, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to project ${idx + 1}: ${project.name}`}
                aria-current={isCurrent ? "true" : undefined}
                className="flex h-11 min-w-11 items-center justify-center px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-8 bg-[#D4FF3F]"
                      : "w-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>

        {/* Closing CTA Band */}
        <Reveal
          variant="fadeUp"
          className="mt-20 rounded-[2rem] border border-white/10 bg-white p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              {foundationCta.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-black sm:text-3xl lg:text-4xl">
              {foundationCta.heading}
            </h3>
            <p className="mt-4 text-base leading-7 text-black/70">
              {foundationCta.body}
            </p>
          </div>

          <div className="mt-8 shrink-0 lg:mt-0">
            <a
              href={foundationCta.primaryHref}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#E4272A] px-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#F5F5F0] transition-transform hover:scale-[1.03] hover:bg-[#E4272A]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <span>{foundationCta.primaryLabel}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
