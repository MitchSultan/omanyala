"use client";

import { ArrowDownRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { contactCopy, routingCards } from "@/data/contact";

function chooseEnquiry(enquiryType: string) {
  window.dispatchEvent(
    new CustomEvent("contact:select-enquiry", { detail: enquiryType })
  );

  const form = document.getElementById("contact-form");
  if (!form) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  form.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

export function RoutingCards() {
  return (
    <section
      aria-labelledby="contact-routing-title"
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
            {contactCopy.routingEyebrow}
          </p>
          <h2
            id="contact-routing-title"
            className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl"
          >
            {contactCopy.routingTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/60">
            {contactCopy.routingIntro}
          </p>
        </div>

        <Reveal
          variant="stagger"
          stagger={0.08}
          className="mt-10 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
        >
          {routingCards.map((card) => (
            <article
              key={card.enquiryType}
              data-reveal-item
              className="group relative flex min-h-72 w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4FF3F]/35 hover:bg-[#D4FF3F]/[0.03] sm:w-auto sm:shrink sm:snap-align-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#D4FF3F] transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <h3 className="text-lg font-bold text-[#F5F5F0] transition-colors group-hover:text-[#D4FF3F]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {card.description}
              </p>
              <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
                {card.responseTime}
              </p>
              <button
                type="button"
                onClick={() => chooseEnquiry(card.enquiryType)}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
              >
                {contactCopy.routingButtonLabel}
                <ArrowDownRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
                <span className="sr-only">: {card.title}</span>
              </button>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
