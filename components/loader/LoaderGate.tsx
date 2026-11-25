/**
 * components/loader/LoaderGate.tsx — Client wrapper that decides whether to
 * show the sprint loader, locks scroll while loading, and emits "done".
 *
 * Purpose:
 *   - Checks sessionStorage to show loader only once per session
 *   - Supports ?loader=1 URL param to force-show for development
 *   - Locks scroll (overflow:hidden on <html>) while loading
 *   - On completion: removes loader from DOM, unlocks scroll, sets
 *     document.documentElement.dataset.loaded = "true", dispatches
 *     window custom event "loader:complete"
 *
 * Mount: Once in app/layout.tsx, above page content.
 *
 * Connected to: Loader.tsx (child), useAssetProgress.ts (progress),
 *   motion.config.ts (session key, force param), Hero.tsx (listens for
 *   loader:complete to start hero intro)
 *
 * Tweakables: LOADER.sessionKey and LOADER.forceParam in motion.config.ts
 */

"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useAssetProgress } from "@/lib/useAssetProgress";
import { LOADER } from "@/lib/motion.config";
import { Loader } from "./Loader";

const emptySubscribe = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

export function LoaderGate() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientMounted,
    getServerMounted
  );
  const [isDone, setIsDone] = useState(false);
  const progress = useAssetProgress();
  const searchParams = useSearchParams();

  const shouldShow = (() => {
    if (!isClient) return null;
    const forceLoader = searchParams?.get(LOADER.forceParam) === "1";
    let alreadyLoaded = false;
    try {
      alreadyLoaded = sessionStorage.getItem(LOADER.sessionKey) === "1";
    } catch {
      alreadyLoaded = false;
    }
    return forceLoader || !alreadyLoaded;
  })();

  // Apply scroll lock or mark loaded on mount
  useEffect(() => {
    if (shouldShow === null) return;

    if (shouldShow) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("is-loading");
      document.documentElement.dataset.loaded = "true";
      window.dispatchEvent(new CustomEvent("loader:complete"));
    }
  }, [shouldShow]);

  const handleComplete = useCallback(() => {
    // Unlock scroll
    document.documentElement.style.overflow = "";
    // Mark as loaded
    document.documentElement.classList.remove("is-loading");
    document.documentElement.dataset.loaded = "true";
    // Remember for session
    try {
      sessionStorage.setItem(LOADER.sessionKey, "1");
    } catch {
      // sessionStorage may be unavailable (private browsing)
    }
    // Dispatch event for hero intro and ScrollTrigger refresh
    window.dispatchEvent(new CustomEvent("loader:complete"));
    // Remove from DOM
    setIsDone(true);
  }, []);

  // Cleanup: always restore scroll on unmount (safety net)
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Don't render anything if we haven't decided yet, or shouldn't show, or done
  if (shouldShow === null || !shouldShow || isDone) return null;

  return <Loader progress={progress} onComplete={handleComplete} />;
}
