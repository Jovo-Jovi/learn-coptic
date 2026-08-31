"use client";

import { useEffect, useState } from "react";
import { THEME_KEY } from "@/lib/theme";

type Mode = "light" | "dark";

function readMode(): Mode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    setMode(readMode());
  }, []);

  function toggle() {
    const next: Mode = readMode() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode */
    }
    setMode(next);
  }

  const label = mode === "dark" ? "فاتح" : "داكن";
  const aria = mode === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      className="min-h-11 rounded-lg px-3 text-sm text-foreground"
    >
      {label}
    </button>
  );
}
