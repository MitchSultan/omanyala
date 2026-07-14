"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAPReveal } from "@/hooks/useGSAPReveal";

export function FoundCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useGSAPReveal<HTMLDivElement>();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    const tween = gsap.to({ value: 0 }, {
      value,
      duration: 1.1,
      ease: "power2.out",
      delay: 0.1,
      onUpdate() {
        const current = (this as unknown as { targets: () => { value: number }[] }).targets()[0].value;
        setDisplayValue(Number(current.toFixed(decimals)));
      },
    });

    return () => {
      tween.kill();
    };
  }, [decimals, value]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="font-mono text-3xl font-semibold tracking-tight text-[#D4FF3F] sm:text-4xl">
        {prefix}
        {displayValue.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.3em] text-white/70">{label}</p>
    </div>
  );
}
