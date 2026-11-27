import { TransitionLink } from "@/components/transition/TransitionLink";

const footerLinks = [
  { href: "/#hero", label: "Home" },
  { href: "/about", label: "About" },
  // { href: "/runs", label: "Runs" },
  { href: "/foundation", label: "Foundation" },
  
  { href: "https://ferdiomanyala.com", label: "TrackFerdy" },
  // { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] px-6 py-16 text-white/50 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#F5F5F0]">
              OMANYALA
            </p>
            <p className="mt-4 text-sm leading-7">
              Ferdinand is an olympian, African record holder, African commonwealth champion and an Adidas athlete.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#D4FF3F]"
              >
                {link.label}
              </TransitionLink>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-white/10 p-2.5 transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F]"
            >
              <span className="text-xs font-bold">IG</span>
            </a>
            <a
              href="#"
              aria-label="X (Twitter)"
              className="rounded-full border border-white/10 p-2.5 transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F]"
            >
              <span className="text-xs font-bold">X</span>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="rounded-full border border-white/10 p-2.5 transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F]"
            >
              <span className="text-xs font-bold">YT</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3  pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>hello@ferdinandomanyala.co.ke</p>
          <p>Made by Mitch · © 2026</p>
        </div>
      </div>
    </footer>
  );
}
