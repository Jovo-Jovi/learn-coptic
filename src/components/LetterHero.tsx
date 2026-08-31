"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Letter } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { copyText } from "@/lib/copy-text";

export function LetterHero({ letter }: { letter: Letter }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const text = `${letter.unicode.upper}${letter.unicode.lower}`;

  async function copy() {
    setFailed(false);
    const ok = await copyText(text);
    if (!ok) {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 3000);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div data-group={letter.group} className="relative mb-8 flex flex-col items-center">
      <div className="hero-wash" aria-hidden="true" />
      <button
        type="button"
        onClick={() => void copy()}
        aria-label="نسخ الحرف"
        className="relative z-10 rounded-[24px] px-6 py-4 select-all focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
      >
        <span className="flex flex-col items-center gap-6">
          <span className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-text">كبير</span>
            <CopticPaint
              unicode={letter.unicode.upper}
              mapped={letter.athanasiusKey?.upper}
              className="glyph-fill text-glyph inline-block leading-none"
            />
          </span>
          <span className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-text">صغير</span>
            <motion.span layoutId={`glyph-${letter.id}`}>
              <CopticPaint
                unicode={letter.unicode.lower}
                mapped={letter.athanasiusKey?.lower}
                className="glyph-fill text-glyph inline-block leading-none"
              />
            </motion.span>
          </span>
        </span>
      </button>
      <p aria-live="polite" className="relative z-10 min-h-5 text-xs text-text-dim">
        {failed
          ? "ماقدرناش ننسخ — ظلّل الحرف وانسخه بإيدك"
          : copied
            ? "تم النسخ"
            : "اضغط للنسخ"}
      </p>
      <p className="relative z-10 mt-4 text-center text-base text-text">
        الشكل واحد، والفرق في الحجم فقط.
      </p>
    </div>
  );
}
