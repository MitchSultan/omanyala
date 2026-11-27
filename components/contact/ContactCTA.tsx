import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { contactCopy, socials } from "@/data/contact";

const socialLinks = socials.filter((social) =>
  /^https?:\/\//i.test(social.url)
);

export function ContactCTA() {
  return (
    <section className="border-t border-white/10 bg-[#111111] px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
      <Reveal
        variant="fadeUp"
        className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12"
      >
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
            {contactCopy.closingEyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl">
            {contactCopy.closingTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/55">
            {contactCopy.closingText}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm text-[#F5F5F0] transition-colors hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
            >
              {social.platform}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
          <TransitionLink
            href="/foundation"
            transitionLabel="FOUNDATION"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#D4FF3F] px-5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#D4FF3F]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            {contactCopy.foundationLinkLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </TransitionLink>
        </div>
      </Reveal>
    </section>
  );
}
