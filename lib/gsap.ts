/**
 * lib/gsap.ts — Shared GSAP registration file.
 *
 * Purpose: Registers all GSAP plugins ONCE and re-exports them so every
 * component imports from here instead of from "gsap" directly. This avoids
 * duplicate registration and ensures consistent plugin availability.
 *
 * Plugins registered: ScrollTrigger, ScrollToPlugin, SplitText, useGSAP.
 *
 * Connected to: Every component that uses GSAP — Loader, ScrollReveal,
 * TransitionProvider, Hero, StatCounter, MissionVision, Products, PreviousRuns.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, useGSAP };
