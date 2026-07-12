"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#runs", label: "Runs" },
  { href: "#mission", label: "Mission" },
  { href: "#shop", label: "Shop" },
  { href: "#partners", label: "Partners" },
];

export function Navbar() {
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
              <Link
                href="#hero"
                className="text-sm font-semibold uppercase tracking-[0.35em] text-[#F5F5F0]"
              >
                OMANYALA
              </Link>
              <div className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm text-white/60 transition-colors hover:text-[#D4FF3F]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* Mobile hamburger */}
              <button
                type="button"
                className="text-white/70 md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer (Sheet-style) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto flex h-full w-72 flex-col border-l border-white/10 bg-[#0A0A0A] p-8">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="self-end text-white/70 transition-colors hover:text-[#D4FF3F]"
              aria-label="Close navigation menu"
            >
              <X className="h-6 w-6" />
            </button>
            <nav className="mt-12 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-semibold text-[#F5F5F0] transition-colors hover:text-[#D4FF3F]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto text-xs uppercase tracking-[0.3em] text-white/30">
              Fast. Focused. Forward.
            </div>
          </div>
        </div>
      )}
    </>
  );
}