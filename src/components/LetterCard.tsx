"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Letter } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { GROUP_DIGIT_AR } from "@/lib/letters";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export function LetterCard({ letter }: { letter: Letter }) {
  const name = letter.name.arDisplay ?? letter.name.ar;
  const sound = letter.sound.arabicHint.join("، ");

  return (
    <div
      data-group={letter.group}
      className="group/card relative overflow-hidden rounded-[24px]"
    >
      <div className="glow-blob" aria-hidden="true" />
      <MotionLink
        href={`/letter/${letter.id}`}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={SPRING}
        className={cn(
          "card-face relative z-10 flex min-h-[150px] flex-col items-center justify-center gap-2 p-5 no-underline lg:p-7",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        )}
      >
        <span className="chip-fill absolute top-3 start-3 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold leading-none">
          <span className="sr-only">المجموعة </span>
          {GROUP_DIGIT_AR[letter.group]}
        </span>
        <motion.span layoutId={`glyph-${letter.id}`}>
          <CopticPaint
            unicode={letter.unicode.lower}
            mapped={letter.athanasiusKey?.lower}
            className="glyph-fill text-glyph-card sm:text-glyph-card-md lg:text-glyph-card-lg inline-block leading-none"
          />
        </motion.span>
        <span className="text-center text-base font-semibold leading-tight text-text">
          {name}
        </span>
        <span className="text-center text-sm leading-tight text-text-dim">{sound}</span>
      </MotionLink>
    </div>
  );
}
