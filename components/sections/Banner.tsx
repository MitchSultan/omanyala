"use client";

import { useGSAPReveal } from "@/hooks/useGSAPReveal";
import { Button } from "@/components/ui/button";

export function Banner() {
  const ref = useGSAPReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="bg-[#E4272A] px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/80">
          Momentum
        </p>
        <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.02em] text-[#F5F5F0] sm:text-5xl lg:text-6xl">
          Train like the fastest man in Africa.
        </h2>
        <div className="mt-8">
          <Button className="rounded-full bg-[#0A0A0A] px-8 py-6 text-sm font-semibold text-[#F5F5F0] transition-transform hover:bg-black/90 hover:scale-105">
            Join the Team
          </Button>
        </div>
      </div>
    </section>
  );
}
