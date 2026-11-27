import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { contactCopy, contactDetails, socials } from "@/data/contact";
import { CopyButton } from "./CopyButton";

const socialLinks = socials.filter((social) =>
  /^https?:\/\//i.test(social.url)
);

export function ContactDetails() {
  return (
    <aside aria-labelledby="contact-details-title" className="min-w-0">
      <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
        {contactCopy.detailsEyebrow}
      </p>
      <h2
        id="contact-details-title"
        className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-3xl"
      >
        {contactCopy.detailsTitle}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">
        {contactCopy.detailsIntro}
      </p>

      <Reveal
        variant="stagger"
        stagger={0.08}
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
      >
        {contactDetails.map((detail) => {
          const Icon = detail.type === "location" ? MapPin : Mail;

          return (
            <div
              key={detail.label}
              data-reveal-item
              className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4 sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <Icon
                    className="h-4 w-4 text-[#D4FF3F]"
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="mt-1 block break-words text-sm text-[#F5F5F0] transition-colors hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-1 break-words text-sm text-[#F5F5F0]">
                      {detail.value}
                    </p>
                  )}
                </div>
              </div>
              <CopyButton value={detail.value} />
            </div>
          );
        })}
      </Reveal>

      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.3em] text-white/45">
          {contactCopy.socialHeading}
        </h3>
        {socialLinks.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-white/65 transition-all hover:-translate-y-0.5 hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
              >
                {social.platform}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/40">{contactCopy.noSocials}</p>
        )}
      </div>
    </aside>
  );
}
