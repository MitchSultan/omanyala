"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <div className="flex min-h-11 items-center gap-2">
      <button
        type="button"
        onClick={copyValue}
        aria-label={`Copy ${value}`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-[#D4FF3F]/50 hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F]"
      >
        {status === "copied" ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <span
        aria-live="polite"
        className={`text-xs ${
          status === "failed" ? "text-[#FF8B8B]" : "text-[#D4FF3F]"
        }`}
      >
        {status === "copied"
          ? "Copied"
          : status === "failed"
            ? "Copy failed"
            : ""}
      </span>
    </div>
  );
}
