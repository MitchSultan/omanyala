"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGSAPReveal } from "@/hooks/useGSAPReveal";

export function FinalCta() {
  const ref = useGSAPReveal<HTMLElement>();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    // MOCK: No backend connected
  };

  return (
    <section
      ref={ref}
      className="border-t border-white/10 bg-[#0A0A0A] px-6 pt-24 sm:px-8 sm:pt-32 lg:px-12"
    >
      <div className="mx-auto flex flex-col md:flex-row justify-space items-center max-w-full text-center">
        <div className="md:max-w-1/2 text-left">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4FF3F]">
          Stay close
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[#F5F5F0] sm:text-4xl lg:text-5xl">
          Get race notes, updates, and reminders.
        </h2>
        {/* <p className="mt-4 text-lg text-white/60">
          Join the mailing list. Be the first to know when Ferdinand lines up.
        </p> */}
        </div>
        <div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 max-w-md border-white/10 bg-white/5 text-[#F5F5F0] placeholder:text-white/40 sm:flex-1"
            required
          />
          <Button
            type="submit"
            className="h-12 rounded-full bg-[#E4272A] px-8 text-sm font-semibold text-[#F5F5F0] transition-transform hover:bg-[#E4272A]/90 hover:scale-105"
          >
            {submitted ? "You're In ✓" : "Notify Me"}
          </Button>
        </form>
        </div>
        {submitted && (
          <p className="mt-4 text-sm text-[#D4FF3F]">
            Mock success: your email has been (not really) added.
          </p>
        )}
      </div>
    </section>
  );
}
