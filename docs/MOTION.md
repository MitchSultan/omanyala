# Motion System — Omanyala

## 1. Repository Audit Summary

- **Framework & Router:** Next.js `16.2.10` with App Router (`app/`).
- **Language:** TypeScript (`.ts` / `.tsx`) with strict mode enabled and `@/*` path alias.
- **Animation Packages Installed:**
  - `gsap` `3.15.0` (core includes `ScrollTrigger`, `ScrollToPlugin`, `SplitText`, `Flip`).
  - `@gsap/react` `2.1.2` (`useGSAP`).
  - No separate smooth-scroll library (e.g., Lenis) is installed; native `html { scroll-behavior: smooth }` and GSAP `ScrollToPlugin` are used.
- **Root Layout & Chrome:**
  - `app/layout.tsx` defines `<html>` (with `Geist` and `Geist_Mono` CSS variables, `dark antialiased`), `<body>`, and wraps all routes.
  - `components/Navbar.tsx` and `components/sections/Footer.tsx` are mounted per-page (`app/page.tsx`, `app/story/page.tsx`, `app/foundation/page.tsx`, `app/shop/page.tsx`).
- **Design Tokens (`app/globals.css`):**
  - Background: `#0A0A0A` (`--background`)
  - Foreground: `#F5F5F0` (`--foreground`)
  - Accent: `#D4FF3F` (`--accent`)
  - Red / Destructive: `#E4272A` (`--destructive`)
  - Card: `#111111` (`--card`), Secondary: `#1A1A1A` (`--secondary`)
  - Fonts: `--font-geist-sans`, `--font-geist-mono`
- **Existing GSAP Usage:**
  - `Hero.tsx`: staggered word/subheadline/CTA/stat/scroll-indicator entrance timeline (`[data-hero-word]`, `[data-hero-sub]`, `[data-hero-cta]`, `[data-hero-stat]`, `[data-hero-scroll]`).
  - `StatCounter.tsx` & `FoundCounter.tsx`: numeric count-up tweens + `useGSAPReveal`.
  - `MissionVision.tsx`, `PreviousRuns.tsx`, `Products.tsx`: ScrollTrigger card/section entrances (updated to `gsap.context()` cleanup so they do not kill unrelated ScrollTriggers).
  - `Partners.tsx`: Embla Carousel with Autoplay (no GSAP).
- **Internal Links & Routes:**
  - Anchor sections on `/`: `#hero`, `#about`, `#runs`, `#mission`, `#shop`, `#partners`.
  - Existing routes at audit time: `/`, `/about`, `/foundation`.
  - CTAs updated to real routes: *Read Full Story →* (`/story`), *About Foundation →* (`/foundation`), *View Full Store →* (`/shop`).

---

## 2. File Map & Architecture

| File | Purpose |
| --- | --- |
| `lib/motion.config.ts` | Single source of truth for durations, eases, colours, and thresholds. |
| `lib/gsap.ts` | Registers `ScrollTrigger`, `ScrollToPlugin`, `SplitText`, and `useGSAP` once and re-exports `gsap`. |
| `lib/useAssetProgress.ts` | Aggregates real weighted loading signals (`document.fonts.ready`, hero image decode, `/he.mp4` `loadeddata`/`canplay`, `window.load`) with a 6s hard cap. |
| `lib/splitText.ts` | Thin wrapper around GSAP `SplitText` (`autoSplit: true`) with a manual fallback splitter. |
| `components/loader/RunnerLegs.tsx` | Procedural SVG running legs (thigh + shin + foot, pivot at local `0,0`) with stride cycle and vertical bob. |
| `components/loader/Loader.tsx` | Full-screen track loader UI, smoothed integer counter, micro-states (`ON YOUR MARKS` → `SET` → `GO`), ghost trail, and two-half wipe exit. |
| `components/loader/LoaderGate.tsx` | Client gate: checks `sessionStorage["omanyala:loaded"]` and `?loader=1`, locks `html` scroll, emits `loader:complete`. |
| `components/motion/ScrollReveal.tsx` | Reusable scroll-triggered text reveal (`mode="lines"` for headings, `mode="words" scrub` for body copy). |
| `components/transition/TransitionOverlay.tsx` | 8-strip "Lane Wipe" overlay with centre route label. |
| `components/transition/TransitionProvider.tsx` | Context provider coordinating cover → `router.push` → scroll reset → `ScrollTrigger.refresh()` → reveal, failsafe timeout, `popstate` reveal, focus & `aria-live` announcement. |
| `components/transition/TransitionLink.tsx` | Drop-in `next/link` wrapper: uses `ScrollToPlugin` for same-page hash links and `TransitionProvider.navigate` for internal route changes. |

### Connection Flow

1. **Initial Load:** Inline script in `app/layout.tsx` `<head>` adds `html.is-loading` before paint (hiding `main` via `globals.css`, overridden by `<noscript>` when JS is off).
2. **`LoaderGate` → `Loader`:** `useAssetProgress()` feeds real progress to `Loader`. Once `progress >= 1` and `LOADER.minDuration` (2.2s) has elapsed, `Loader` exits with a tape snap and two-half wipe.
3. **`loader:complete`:** `LoaderGate` unlocks scroll, sets `document.documentElement.dataset.loaded = "true"`, removes `is-loading`, and dispatches `window` event `"loader:complete"`.
4. **Hero & ScrollTrigger:** `Hero.tsx` starts its word/nav intro on `loader:complete` (or immediately if skipped). `ScrollReveal` refreshes `ScrollTrigger` on `loader:complete` and debounced window resize.
5. **Navigation:** `TransitionLink` routes in-page `#hash` links to GSAP `ScrollToPlugin` (no overlay) and cross-route links through `TransitionProvider` (`cover` → `router.push` → `ScrollTrigger.refresh()` → `reveal` → focus `h1`/`main`).

---

## 3. Tuning Guide (`lib/motion.config.ts`)

- **Loader timing:** `LOADER.minDuration` (`2.2`s), `LOADER.hardCap` (`6`s), `LOADER.holdAt100` (`0.25`s), `LOADER.exitDuration` (`0.8`s), `LOADER.exitEase` (`"power4.inOut"`).
- **Runner stride:** `LOADER.strideDuration` (`0.42`s), `LOADER.timeScaleRange` (`[0.9, 1.3]`), `LOADER.bobAmplitude` (`3`px), `LOADER.ghostCount` (`3`).
- **Scroll reveal:** `SCROLL_REVEAL.lineDuration`, `SCROLL_REVEAL.lineStagger`, `SCROLL_REVEAL.lineEase`, `SCROLL_REVEAL.lineStart` (`"top 85%"`), `SCROLL_REVEAL.wordInitialOpacity` (`0.15`), `SCROLL_REVEAL.wordStart` (`"top 80%"`), `SCROLL_REVEAL.wordEnd` (`"bottom 45%"`).
- **Page transitions:** `TRANSITION.laneCount` (`8`), `TRANSITION.coverDuration` (`0.6`s), `TRANSITION.revealDuration` (`0.6`s), `TRANSITION.stagger` (`0.045`s), `TRANSITION.ease` (`"power4.inOut"`), `TRANSITION.failsafeTimeout` (`3`s), `TRANSITION.anchorScrollDuration` (`1.1`s).
- **Colours:** `COLORS` mirrors `:root` tokens from `app/globals.css`.

---

## 4. Development & Testing Helpers

- **Force the loader on any load:** Append `?loader=1` to the URL (e.g., `http://localhost:3000/?loader=1`).
- **Reset the session flag:** Open Browser DevTools → **Application** → **Session Storage** → delete `omanyala:loaded` (or run `sessionStorage.removeItem("omanyala:loaded")` in the browser console).

---

## 5. Known Limitations

- **Browser Back/Forward (`popstate`):** Next.js App Router cannot block or delay browser history `popstate` before the URL changes, so back/forward navigation plays a short 0.25s reveal fade (`quickReveal`) rather than a full cover → reveal sweep.
- **Placeholder Routes:** `/story`, `/foundation`, and `/shop` are minimal placeholder pages marked `// TODO: replace with real page` so route transitions can be tested end-to-end.
- **Duplicate `#about` ID in existing `Found.tsx`:** `Found.tsx` inherited `id="about"` from the original prototype; `#about` scrolls to the first matching section (`About.tsx`).
