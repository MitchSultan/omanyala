/**
 * lib/splitText.ts — Thin wrapper around GSAP SplitText.
 *
 * Purpose: Since GSAP 3.15+ bundles SplitText with core, this wrapper uses
 * the native GSAP SplitText directly. If for some reason SplitText is
 * unavailable, it falls back to a simple manual word splitter that wraps
 * each word in overflow:hidden masks.
 *
 * Usage: import { splitText, revertSplit } from "@/lib/splitText";
 *
 * Connected to: ScrollReveal.tsx (consumer), gsap.ts (SplitText import)
 *
 * Accessibility: When using the manual fallback, the original text is
 * preserved in aria-label on the parent, and split spans are aria-hidden.
 */

import { SplitText } from "@/lib/gsap";

export type SplitMode = "lines" | "words" | "chars";

export interface SplitResult {
  /** The split elements (lines, words, or chars) */
  elements: Element[];
  /** Reverts the split, restoring original DOM */
  revert: () => void;
  /** Whether native SplitText was used */
  isNative: boolean;
}

/**
 * Split text content of an element by lines, words, or chars.
 *
 * @param element The DOM element whose text to split
 * @param mode Which granularity to split at
 * @returns SplitResult with elements array and revert function
 */
export function splitText(element: HTMLElement, mode: SplitMode): SplitResult {
  // Try native GSAP SplitText first
  if (typeof SplitText !== "undefined" && SplitText) {
    try {
      const typeMap: Record<SplitMode, string> = {
        lines: "lines",
        words: "words",
        chars: "chars",
      };

      const split = SplitText.create(element, {
        type: typeMap[mode],
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        autoSplit: true,
      });

      const elements =
        mode === "lines"
          ? Array.from(split.lines || [])
          : mode === "words"
            ? Array.from(split.words || [])
            : Array.from(split.chars || []);

      return {
        elements,
        revert: () => split.revert(),
        isNative: true,
      };
    } catch {
      // Fall through to manual
    }
  }

  // ── Manual fallback splitter ───────────────────────────────────────────────
  return manualSplit(element, mode);
}

function manualSplit(element: HTMLElement, mode: SplitMode): SplitResult {
  const originalHTML = element.innerHTML;
  const text = element.textContent || "";

  // Preserve original text for accessibility
  element.setAttribute("aria-label", text);

  if (mode === "words" || mode === "lines") {
    const words = text.split(/\s+/).filter(Boolean);
    element.innerHTML = "";

    const spans: HTMLSpanElement[] = [];
    words.forEach((word, i) => {
      // Wrapper for overflow:hidden masking
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "top";
      wrapper.className = mode === "lines" ? "split-line" : "split-word";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = word;
      inner.setAttribute("aria-hidden", "true");

      wrapper.appendChild(inner);
      element.appendChild(wrapper);

      // Add space between words (not after last)
      if (i < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }

      spans.push(mode === "lines" ? wrapper : inner);
    });

    return {
      elements: spans,
      revert: () => {
        element.innerHTML = originalHTML;
        element.removeAttribute("aria-label");
      },
      isNative: false,
    };
  }

  // chars mode
  const chars = text.split("");
  element.innerHTML = "";

  const spans: HTMLSpanElement[] = [];
  chars.forEach((char) => {
    if (char === " ") {
      element.appendChild(document.createTextNode(" "));
      return;
    }
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = char;
    span.setAttribute("aria-hidden", "true");
    span.className = "split-char";
    element.appendChild(span);
    spans.push(span);
  });

  return {
    elements: spans,
    revert: () => {
      element.innerHTML = originalHTML;
      element.removeAttribute("aria-label");
    },
    isNative: false,
  };
}
