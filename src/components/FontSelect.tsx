"use client";

import { useEffect, useState } from "react";
import {
  COPTIC_FONT_KEY,
  isCopticFace,
  type CopticFace,
} from "@/lib/theme";

function readFace(): CopticFace {
  if (typeof document === "undefined") return "serif";
  const value = document.documentElement.getAttribute("data-coptic-font");
  return value && isCopticFace(value) ? value : "serif";
}

export function FontSelect() {
  const [face, setFace] = useState<CopticFace>("serif");

  useEffect(() => {
    setFace(readFace());
  }, []);

  function onChange(next: CopticFace) {
    document.documentElement.setAttribute("data-coptic-font", next);
    try {
      localStorage.setItem(COPTIC_FONT_KEY, next);
    } catch {
      /* private mode */
    }
    setFace(next);
  }

  return (
    <label className="flex min-h-11 items-center">
      <span className="sr-only">خط الحروف القبطية</span>
      <select
        value={face}
        onChange={(event) => {
          const value = event.target.value;
          if (isCopticFace(value)) onChange(value);
        }}
        className="min-h-11 w-[8.5rem] rounded-full border border-hairline bg-surface-2 px-3 text-sm text-text focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
      >
        <option value="serif">سيريف</option>
        <option value="sans">سانس</option>
        <option value="athanasius">أثناسيوس</option>
      </select>
    </label>
  );
}
