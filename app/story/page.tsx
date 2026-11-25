/**
 * app/story/page.tsx — Placeholder route for Ferdinand Omanyala's full story.
 *
 * Purpose: Target route for the "Read Full Story →" CTA so page transitions
 * can be verified end-to-end.
 *
 * Connected to: TransitionLink in About.tsx, Navbar.tsx, Footer.tsx
 */

// TODO: replace with real page
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/sections/Footer";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function StoryPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
          Story
        </p>
        <ScrollReveal
          as="h1"
          mode="lines"
          className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-5xl lg:text-6xl"
        >
          From rugby to record books.
        </ScrollReveal>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/60">
          Full biography page coming soon.
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
