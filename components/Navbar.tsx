"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/foundation", label: "Foundation" },
  
  // { href: "/runs", label: "Runs" },
  // { href: "/mission", label: "Mission" },
  { href: "https://ferdiomanyala.com", label: "TrackFerdy" },
  { href: "/contact", label: "Contact" },
  // { href: "/partners", label: "Partners" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    handleScroll(); // set initial state in case page loads mid-scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Nav is always mounted/visible. On the hero it sits flush and transparent;
          past the hero it drops into a floating pill with a blurred background. */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "px-6 py-3 sm:px-8 lg:px-12"
              : "px-6 py-5 sm:px-10 lg:px-16"
          }`}
        >
          <div
            className={`flex w-full items-center transition-all duration-500 ease-out ${
              scrolled
                ? "rounded-full border border-white/10 bg-[#0A0A0A]/80 px-6 py-2.5 backdrop-blur-xl"
                : "border border-transparent bg-transparent px-0 py-0"
            }`}
          >
            <div className="flex w-full items-center justify-between gap-8">
              <TransitionLink
                href="/#hero"
                className="text-sm font-semibold uppercase tracking-[0.35em] text-[#F5F5F0]"
              >
                OMANYALA
              </TransitionLink>
              <div className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <TransitionLink
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative py-1 text-sm transition-colors hover:text-[#D4FF3F] ${
                        isActive ? "font-medium text-[#D4FF3F]" : "text-white/60"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 -bottom-0.5 h-px bg-[#D4FF3F]"
                        />
                      )}
                    </TransitionLink>
                  );
                })}
                <ThemeToggle className="ml-2 text-white/75" />
              </div>
              {/* Mobile controls */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle className="text-white/75" />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center text-white/70"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation menu"
                  aria-controls="mobile-navigation-drawer"
                  aria-expanded={mobileOpen}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer (Sheet-style) */}
      <div
        id="mobile-navigation-drawer"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`fixed inset-0 z-[60] flex transition-[visibility] duration-0 motion-reduce:delay-0 ${
          mobileOpen ? "visible delay-0" : "invisible delay-300"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          className={`relative ml-auto flex h-full w-72 flex-col border-l border-white/10 bg-[#0A0A0A] p-8 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="self-end text-white/70 transition-colors hover:text-[#D4FF3F]"
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="mt-12 flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-2xl font-semibold transition-colors hover:text-[#D4FF3F] ${
                    isActive ? "text-[#D4FF3F]" : "text-[#F5F5F0]"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </TransitionLink>
              );
            })}
          </nav>
          <div className="mt-auto space-y-4">
            <ThemeToggle showLabel className="w-full text-[#F5F5F0]" />
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Fast. Focused. Forward.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}