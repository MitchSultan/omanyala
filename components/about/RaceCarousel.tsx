"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { VideoModal } from "@/components/about/VideoModal";
import { races, type RaceVideo } from "@/data/about";

export function RaceCarousel() {
  const [selectedRace, setSelectedRace] = useState<RaceVideo | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
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

  // Track active slide on scroll + announce when scroll settles
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    let settleTimer: number | null = null;

    const handleSettled = () => {
      const idx = getNearestIndex();
      setActiveIndex(idx);
      if (idx !== lastSettledRef.current) {
        lastSettledRef.current = idx;
        setAnnouncement(`Race ${idx + 1} of ${races.length}: ${races[idx]?.title}`);
      }
    };

    const supportsScrollEnd = "onscrollend" in window;

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
      const clamped = ((index % races.length) + races.length) % races.length;
      const target = track.children[clamped] as HTMLElement | undefined;
      if (!target) return;

      setActiveIndex(clamped);
      track.scrollTo({
        left: target.offsetLeft,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  // Mouse drag-to-scroll
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = track.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      hasDraggedRef.current = true;
    }
    track.scrollLeft = dragScrollLeftRef.current - dx;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    window.setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  // Keyboard navigation on the track
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

  return (
    <section
      id="races"
      aria-roledescription="carousel"
      aria-label="Race video highlights"
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header & controls */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
              On The Track
            </p>
            <Reveal
              as="h2"
              variant="maskLines"
              className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl"
            >
              Signature races in motion.
            </Reveal>
          </div>

          {/* <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex - 1)}
              aria-label="Previous race video"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5F5F0] transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(activeIndex + 1)}
              aria-label="Next race video"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5F5F0] transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div> */}
        </div>

        {/* Horizontal scroll-snap track */}
        <Reveal variant="stagger" className="mt-12">
          <div
            ref={trackRef}
            tabIndex={0}
            role="group"
            aria-label="Race video slides. Use left and right arrow keys to navigate."
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
            {races.map((race, idx) => (
              <div
                key={race.id}
                data-reveal-item
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${races.length}`}
                className="w-[85vw] shrink-0 snap-start sm:w-[62vw] md:w-[46vw] lg:w-[31%]"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!hasDraggedRef.current) {
                      setSelectedRace(race);
                    }
                  }}
                  aria-label={`Play ${race.title} video (${race.result})`}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111111] text-left transition-colors hover:border-[#D4FF3F]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <Image
                      src={race.thumbnail}
                      alt={`${race.title} at ${race.venue}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 46vw, 31vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent"
                    />

                    {/* Play icon */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/60 text-[#D4FF3F] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#D4FF3F] group-hover:bg-[#D4FF3F] group-hover:text-[#0A0A0A]">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </span>

                    {/* Result pill */}
                    <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono text-xs font-semibold text-[#D4FF3F] backdrop-blur-sm">
                      {race.result}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                        {race.date}
                      </p>
                      <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] text-[#F5F5F0] transition-colors group-hover:text-[#D4FF3F]">
                        {race.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/60">{race.venue}</p>
                    </div>

                    <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4FF3F]">
                      Watch highlight →
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Marker dots */}
        <nav
          aria-label="Choose a race slide"
          className="mt-6 flex items-center justify-center gap-1"
        >
          {races.map((race, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={race.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${race.title}`}
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

        {/* Visually hidden polite live status */}
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </div>

      {/* Lightbox modal */}
      <VideoModal race={selectedRace} onClose={() => setSelectedRace(null)} />
    </section>
  );
}
