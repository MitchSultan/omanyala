"use client";

import { ArrowUpRight } from "lucide-react";
import { socials } from "@/lib/mock-data";
import { useGSAPReveal } from "@/hooks/useGSAPReveal";

const platformIcons: Record<string, string> = {
  Instagram: "📸",
  X: "𝕏",
  TikTok: "♪",
  YouTube: "▶",
};

/**
 * MOCK: Static tiles — no live embeds/iframes for performance.
 * Replace with curated content before production.
 */
export function SocialMedia() {
  const ref = useGSAPReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="border-t border-white/10 bg-[#0F0F0F] px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
            Social
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl">
            Fast updates, built for the feed.
          </h2>
        </div>

        {/* Social platform cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social) => (
            <a
              key={social.platform}
              href="#"
              className="group rounded-[1.5rem] border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:border-[#D4FF3F]/30 hover:bg-[#D4FF3F]/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {platformIcons[social.platform]}
                </span>
                <ArrowUpRight className="h-4 w-4 text-white/30 transition-all duration-200 group-hover:text-[#D4FF3F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#F5F5F0]">
                {social.platform}
              </p>
              <p className="mt-1 text-sm text-white/50">{social.handle}</p>
              <p className="mt-4 font-mono text-3xl font-bold text-[#D4FF3F]">
                {social.followers}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/30">
                followers
              </p>
            </a>
          ))}
        </div>

        {/* Mock post grid — placeholder tiles */}
        {/* <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-white/5 bg-[#1A1A1A] flex items-center justify-center text-white/15 text-xs"
            >
              Post {i + 1}
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
