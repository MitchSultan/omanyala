"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

const STORAGE_KEY = "omanyala:theme";
const THEME_EVENT = "omanyala:theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  const toggleTheme = () => {
    const next: Theme = isLight ? "dark" : "light";
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors in private browsing
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={isLight}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-current/20 transition-colors hover:border-[#D4FF3F] hover:text-[#D4FF3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF3F] ${
        showLabel ? "h-11 px-4 text-xs font-semibold uppercase tracking-[0.22em]" : "h-9 w-9"
      } ${className}`}
    >
      {isLight ? (
        <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {showLabel && <span>{isLight ? "Dark Mode" : "Light Mode"}</span>}
    </button>
  );
}
