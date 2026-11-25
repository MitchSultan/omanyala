/**
 * components/transition/TransitionLink.tsx — Drop-in replacement for next/link.
 *
 * Purpose: Wraps Next.js <Link> to coordinate route transitions via
 * TransitionProvider and smooth-scroll in-page anchor links via GSAP
 * ScrollToPlugin without triggering the route overlay.
 *
 * Behaviour:
 *   - Modifier keys, non-left clicks, target="_blank", external origins → native
 *   - Hash-only (#about) or same-path hash (/#about on /) → GSAP ScrollToPlugin
 *   - Different internal pathname → TransitionProvider.navigate(href, label)
 *   - Rapid clicks while isAnimating → ignored
 *
 * Props: All standard next/link props plus optional `transitionLabel` for the
 *   overlay display text.
 *
 * Connected to: TransitionProvider.tsx, gsap.ts (ScrollToPlugin), motion.config.ts
 */

"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { TRANSITION } from "@/lib/motion.config";
import { usePageTransition } from "./TransitionProvider";

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    transitionLabel?: string;
  };

export function TransitionLink({
  href,
  onClick,
  target,
  transitionLabel,
  children,
  ...rest
}: TransitionLinkProps) {
  const pathname = usePathname();
  const { navigate, isAnimating } = usePageTransition();

  const hrefString = typeof href === "string" ? href : href.pathname || "/";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Allow native browser handling for modifier clicks, non-left clicks, new tabs
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target === "_blank"
    ) {
      return;
    }

    // Parse URL to check origin, pathname, and hash
    let url: URL;
    try {
      url = new URL(hrefString, window.location.origin);
    } catch {
      return;
    }

    // External origin → let browser handle natively
    if (url.origin !== window.location.origin) {
      return;
    }

    const isHashOnly = hrefString.startsWith("#");
    const isSamePath = url.pathname === pathname;

    // In-page anchor link → smooth scroll with ScrollToPlugin, NO overlay
    if (isHashOnly || (isSamePath && url.hash)) {
      const targetEl = document.querySelector(url.hash || hrefString);
      if (targetEl) {
        e.preventDefault();
        const headerOffset =
          document.querySelector("nav")?.getBoundingClientRect().height || 72;
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
          const y =
            targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo(0, Math.max(0, y));
        } else {
          gsap.to(window, {
            scrollTo: { y: targetEl, offsetY: headerOffset },
            duration: TRANSITION.anchorScrollDuration,
            ease: TRANSITION.anchorScrollEase,
          });
        }
      }
      return;
    }

    // Same path without hash → no-op or scroll to top
    if (isSamePath) {
      return;
    }

    // Different internal pathname → trigger Lane Wipe transition
    e.preventDefault();
    if (isAnimating) return;

    navigate(hrefString, transitionLabel);
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
