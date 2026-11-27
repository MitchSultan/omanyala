"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { contactCopy, faqs } from "@/data/contact";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const previousOpenIndex = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const panelsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const previous = previousOpenIndex.current;
    previousOpenIndex.current = openIndex;
    const panels = panelsRef.current;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const context = gsap.context(() => {
      if (reducedMotion) {
        panels.forEach((panel, index) => {
          if (!panel) return;
          gsap.set(panel, {
            height: openIndex === index ? "auto" : 0,
            opacity: openIndex === index ? 1 : 0,
          });
        });
        if (previous !== openIndex) ScrollTrigger.refresh();
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => ScrollTrigger.refresh(),
      });
      let hasAnimation = false;

      panels.forEach((panel, index) => {
        if (!panel) return;
        if (openIndex === index && previous !== index) {
          timeline.fromTo(
            panel,
            { height: 0, opacity: 0 },
            {
              height: "auto",
              opacity: 1,
              duration: 0.4,
              ease: "power3.out",
            },
            0
          );
          hasAnimation = true;
        } else if (previous === index && openIndex !== index) {
          timeline.to(
            panel,
            { height: 0, opacity: 0, duration: 0.3, ease: "power3.inOut" },
            0
          );
          hasAnimation = true;
        } else if (openIndex !== index) {
          gsap.set(panel, { height: 0, opacity: 0 });
        }
      });

      if (!hasAnimation) timeline.kill();
    }, section);

    return () => context.revert();
  }, [openIndex]);

  const focusQuestion = (index: number) => {
    buttonsRef.current[index]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let targetIndex: number | null = null;
    if (event.key === "ArrowDown") {
      targetIndex = (index + 1) % faqs.length;
    } else if (event.key === "ArrowUp") {
      targetIndex = (index - 1 + faqs.length) % faqs.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = faqs.length - 1;
    }

    if (targetIndex !== null) {
      event.preventDefault();
      focusQuestion(targetIndex);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-faq-title"
      className="border-t border-white/10 bg-[#0A0A0A] px-6 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
          {contactCopy.faqEyebrow}
        </p>
        <h2
          id="contact-faq-title"
          className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl"
        >
          {contactCopy.faqTitle}
        </h2>

        <p className="sr-only">{contactCopy.accordionInstructions}</p>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((faq, index) => {
            const expanded = openIndex === index;
            const triggerId = `contact-faq-trigger-${index}`;
            const panelId = `contact-faq-panel-${index}`;

            return (
              <div key={faq.question}>
                <h3>
                  <button
                    ref={(element) => {
                      buttonsRef.current[index] = element;
                    }}
                    id={triggerId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index
                      )
                    }
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left text-base font-semibold text-[#F5F5F0] transition-colors hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4FF3F] sm:text-lg"
                  >
                    {faq.question}
                    <Plus
                      className={`h-5 w-5 shrink-0 text-[#D4FF3F] transition-transform duration-300 motion-reduce:transition-none ${
                        expanded ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  ref={(element) => {
                    panelsRef.current[index] = element;
                  }}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-white/60 sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
