"use client";

import Image from "next/image";
import { ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/Reveal";
import { contactHero } from "@/data/contact";

export function ContactHero() {
  return (
    <section
      className="relative isolate flex min-h-[55svh] items-end overflow-hidden bg-[#0A0A0A] px-6 pb-16 pt-36 sm:px-8 sm:pb-20 lg:px-12"
    >
      <Image
        src={contactHero.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        onLoad={() => ScrollTrigger.refresh()}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/70 to-[#0A0A0A]/35"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Reveal
          as="p"
          variant="fadeUp"
          delay={0.75}
          className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]"
        >
          {contactHero.eyebrow}
        </Reveal>
        <Reveal
          as="h1"
          variant="maskLines"
          className="mt-4 max-w-4xl text-5xl font-bold tracking-[-0.05em] text-[#ffffff] sm:text-6xl lg:text-8xl"
        >
          {contactHero.headline}
        </Reveal>
        <Reveal
          as="p"
          variant="fadeUp"
          delay={1}
          className="mt-5 max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8"
        >
          {contactHero.subtext}
        </Reveal>
      </div>
    </section>
  );
}
