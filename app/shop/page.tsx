/**
 * app/shop/page.tsx — Placeholder route for the Omanyala store.
 *
 * Purpose: Target route for the "View Full Store →" CTA so page transitions
 * can be verified end-to-end.
 *
 * Connected to: TransitionLink in Products.tsx, Navbar.tsx, Footer.tsx
 */

// TODO: replace with real page
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
          Store
        </p>
        <ScrollReveal
          as="h1"
          mode="lines"
          className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-5xl lg:text-6xl"
        >
          Gear for the next rep.
        </ScrollReveal>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
          Full store catalogue coming soon.
        </p>
        <TransitionLink
          href="/"
          transitionLabel="HOME"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#D4FF3F] transition-colors hover:border-[#D4FF3F]/50"
        >
          ← Back Home
        </TransitionLink>
      </main>
      <Footer />
    </>
  );
}
