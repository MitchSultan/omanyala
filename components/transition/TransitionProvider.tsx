/**
 * components/transition/TransitionProvider.tsx — Route transition coordinator.
 *
 * Purpose: Provides `{ navigate, isAnimating }` context for App Router page
 * transitions using the cover → navigate → reveal pattern.
 *
 * Mechanics:
 *   1. Locks interaction, plays TransitionOverlay.cover(label)
 *   2. Calls router.push(href) and awaits pathname change + mount effect
 *   3. Failsafe timeout (TRANSITION.failsafeTimeout) ensures overlay never sticks
 *   4. Resets scroll to top while covered, cleans up/refreshes ScrollTriggers
 *   5. Plays TransitionOverlay.reveal(), moves focus to h1/main, announces route
 *   6. Handles browser back/forward (popstate) with quickReveal()
 *
 * Connected to: TransitionOverlay.tsx, TransitionLink.tsx, app/layout.tsx,
 *   motion.config.ts, gsap.ts
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { TRANSITION } from "@/lib/motion.config";
import {
  TransitionOverlay,
  type TransitionOverlayHandle,
} from "./TransitionOverlay";

interface TransitionContextValue {
  navigate: (href: string, label?: string) => Promise<void>;
  isAnimating: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: async () => {},
  isAnimating: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/** Derive a clean display label from a pathname when none is provided */
function labelFromHref(href: string): string {
  const path = href.split("#")[0].split("?")[0].replace(/^\/+|\/+$/g, "");
  if (!path) return "HOME";
  return path.split("/").pop()?.toUpperCase() || "HOME";
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<TransitionOverlayHandle>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const isAnimatingRef = useRef(false);
  const isPopstateRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const pendingResolveRef = useRef<(() => void) | null>(null);
  const expectedPathRef = useRef<string | null>(null);

  // Listen for browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (!isAnimatingRef.current) {
        isPopstateRef.current = true;
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Resolve pending route navigation or play popstate reveal on pathname change
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    // Programmatic transition waiting for this pathname
    if (pendingResolveRef.current) {
      if (!expectedPathRef.current || pathname === expectedPathRef.current) {
        const resolve = pendingResolveRef.current;
        pendingResolveRef.current = null;
        expectedPathRef.current = null;
        // Wait one animation frame so the new page DOM has mounted
        requestAnimationFrame(() => resolve());
      }
      return;
    }

    // Browser back/forward navigation
    if (isPopstateRef.current) {
      isPopstateRef.current = false;
      overlayRef.current?.quickReveal().then(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [pathname]);

  const moveFocusAndAnnounce = useCallback((targetPath: string) => {
    const heading =
      document.querySelector<HTMLElement>("main h1, h1") ||
      document.querySelector<HTMLElement>("main");

    if (heading) {
      if (!heading.hasAttribute("tabindex")) {
        heading.setAttribute("tabindex", "-1");
      }
      heading.focus({ preventScroll: true });
    }

    const pageTitle = document.title || labelFromHref(targetPath);
    setAnnouncement(`Navigated to ${pageTitle}`);
  }, []);

  const navigate = useCallback(
    async (href: string, label?: string) => {
      if (isAnimatingRef.current) return;

      const targetPath = href.split("#")[0].split("?")[0] || "/";
      const hashIndex = href.indexOf("#");
      const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";

      isAnimatingRef.current = true;
      setIsAnimating(true);

      try {
        // 1. Cover the viewport
        await overlayRef.current?.cover(label || labelFromHref(href));

        // 2. Trigger route change and wait for mount (with failsafe timeout)
        const waitForRoute = new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(failsafeTimer);
            pendingResolveRef.current = null;
            expectedPathRef.current = null;
            resolve();
          };

          const failsafeTimer = window.setTimeout(
            finish,
            TRANSITION.failsafeTimeout * 1000
          );

          expectedPathRef.current = targetPath;
          pendingResolveRef.current = finish;
          // Clean up outgoing route's ScrollTriggers while covered
          ScrollTrigger.getAll().forEach((t) => t.kill());
          router.push(href);
        });

        await waitForRoute;

        // 3. Reset scroll while fully covered, or scroll to hash if present
        if (hash) {
          let targetEl: HTMLElement | null = null;
          try {
            targetEl = document.getElementById(decodeURIComponent(hash));
          } catch {
            targetEl = null;
          }

          if (targetEl) {
            const headerOffset =
              document.querySelector("nav")?.getBoundingClientRect().height || 72;
            const y =
              targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: "instant" as ScrollBehavior });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          }
        } else {
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }

        // 4. Refresh ScrollTrigger for the new route
        ScrollTrigger.refresh();

        // 5. Reveal the new page
        await overlayRef.current?.reveal();

        // 6. Accessibility: focus & announce
        moveFocusAndAnnounce(targetPath);
      } finally {
        isAnimatingRef.current = false;
        setIsAnimating(false);
      }
    },
    [moveFocusAndAnnounce, router]
  );

  return (
    <TransitionContext.Provider value={{ navigate, isAnimating }}>
      {children}
      <TransitionOverlay ref={overlayRef} />
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </TransitionContext.Provider>
  );
}
