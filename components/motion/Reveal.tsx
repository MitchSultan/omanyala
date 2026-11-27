"use client";

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { splitText, type SplitResult } from "@/lib/splitText";
import { SCROLL_REVEAL } from "@/lib/motion.config";

export type RevealVariant = "fadeUp" | "maskLines" | "imageWipe" | "stagger";

export interface RevealProps {
  as?: ElementType;
  variant?: RevealVariant;
  start?: string;
  once?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  waitForLoader?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Reusable GSAP + ScrollTrigger reveal wrapper.
 * Supports fadeUp, maskLines (split text), imageWipe (clip-path + 1.2->1 scale),
 * and stagger (children or [data-reveal-item]).
 * Respects prefers-reduced-motion and waits for loader:complete when active.
 */
export function Reveal({
  as: Tag = "div",
  variant = "fadeUp",
  start = "top 85%",
  once = true,
  duration = 0.9,
  delay = 0,
  stagger = 0.1,
  ease = "power3.out",
  waitForLoader = true,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ctx: ReturnType<typeof gsap.context> | null = null;
    let splitResult: SplitResult | null = null;
    let cancelled = false;

    const initAnimation = () => {
      if (cancelled || !ref.current) return;

      if (reducedMotion) {
        ctx = gsap.context(() => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.35,
              ease: "power1.out",
              scrollTrigger: {
                trigger: el,
                start,
                once,
              },
            }
          );
        }, el);
        return;
      }

      if (variant === "maskLines") {
        document.fonts.ready.then(() => {
          if (cancelled || !ref.current) return;

          ctx = gsap.context(() => {
            splitResult = splitText(el, "lines");
            if (splitResult.elements.length === 0) return;

            const targets = splitResult.elements.map((elem) => {
              const htmlEl = elem as HTMLElement;
              htmlEl.style.overflow = "hidden";
              const inner =
                htmlEl.querySelector(".split-word, .split-char, span") ||
                htmlEl;
              gsap.set(inner, {
                yPercent: SCROLL_REVEAL.lineYPercent,
                opacity: 0,
              });
              return inner;
            });

            gsap.to(targets, {
              yPercent: 0,
              opacity: 1,
              duration,
              stagger: stagger ?? SCROLL_REVEAL.lineStagger,
              delay,
              ease,
              scrollTrigger: {
                trigger: el,
                start,
                once,
              },
            });
          }, el);
        });
        return;
      }

      ctx = gsap.context(() => {
        if (variant === "imageWipe") {
          const img = el.querySelector("img");
          gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
          if (img) {
            gsap.set(img, { scale: 1.2 });
          }

          const tl = gsap.timeline({
            delay,
            scrollTrigger: {
              trigger: el,
              start,
              once,
            },
          });

          tl.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration,
            ease,
          });

          if (img) {
            tl.to(
              img,
              {
                scale: 1,
                duration: duration * 1.1,
                ease,
              },
              0
            );
          }
          return;
        }

        if (variant === "stagger") {
          const explicitItems = el.querySelectorAll("[data-reveal-item]");
          const items =
            explicitItems.length > 0
              ? Array.from(explicitItems)
              : Array.from(el.children);

          if (items.length === 0) return;

          gsap.fromTo(
            items,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              delay,
              ease,
              scrollTrigger: {
                trigger: el,
                start,
                once,
              },
            }
          );
          return;
        }

        // Default: fadeUp
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease,
            scrollTrigger: {
              trigger: el,
              start,
              once,
            },
          }
        );
      }, el);
    };

    const handleLoaderComplete = () => {
      initAnimation();
      ScrollTrigger.refresh();
    };

    if (!waitForLoader || document.documentElement.dataset.loaded === "true") {
      initAnimation();
    } else {
      window.addEventListener("loader:complete", handleLoaderComplete, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("loader:complete", handleLoaderComplete);
      if (splitResult) {
        splitResult.revert();
      }
      if (ctx) {
        ctx.revert();
      }
    };
  }, [variant, start, once, duration, delay, stagger, ease, waitForLoader]);

  const Component = Tag as ElementType<{
    ref?: RefObject<HTMLElement | null>;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}
