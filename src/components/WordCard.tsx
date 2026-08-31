"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { WordCardModel } from "@/lib/words";
import { CopticPaint } from "@/components/CopticPaint";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function WordCard({ word }: { word: WordCardModel }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const isDrill = word.kind === "drill";
  const isName = word.kind === "name";

  return (
    <article
      data-group={word.group ?? undefined}
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[24px]",
        !isDrill && "group/card",
      )}
    >
      {isDrill ? null : <div className="glow-blob" aria-hidden="true" />}
      <div
        className={cn(
          "relative z-10 min-w-0",
          isDrill ? "card-face-drill" : "card-face",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex w-full min-h-11 min-w-0 flex-col items-center gap-2 px-4 py-5",
            "text-center focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
          )}
        >
          <span className="sr-only">
            {open ? "التفاصيل ظاهرة. اضغط للإخفاء" : "اضغط لعرض التفاصيل"}
          </span>
          {isName ? (
            <span className="chip-fill inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-semibold leading-none">
              اسم علم
            </span>
          ) : null}
          <CopticPaint
            unicode={word.coptic}
            mapped={word.mapped}
            className="word-coptic glyph-fill text-glyph-word inline-block leading-none sm:text-glyph-word-md"
          />
          <span className="text-sm text-text-dim">{word.translitAr}</span>
          {isDrill ? (
            <span className="text-sm font-medium text-text">
              تمرين قراءة — مش كلمة في القاموس
            </span>
          ) : null}
        </button>

        <motion.div
          id={panelId}
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={SPRING}
          className="overflow-hidden"
          inert={!open}
        >
          <div className="flex flex-col items-center gap-3 border-t border-hairline px-4 pt-3 pb-5">
            {word.meaningAr ? (
              <p className="text-base font-semibold text-text">{word.meaningAr}</p>
            ) : null}
            {word.partOfSpeechAr ? (
              <p className="text-sm text-text-dim">{word.partOfSpeechAr}</p>
            ) : null}
            {word.letters.length > 0 ? (
              <ul className="flex max-w-full flex-wrap justify-center gap-2">
                {word.letters.map((letter) => (
                  <li key={letter.id} data-group={letter.group}>
                    <Link
                      href={`/letter/${letter.id}`}
                      aria-label={letter.nameAr}
                      className={cn(
                        "chip-fill inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-base no-underline",
                        "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                      )}
                    >
                      <CopticPaint
                        unicode={letter.glyph}
                        mapped={letter.mapped}
                        className="inline-block"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </motion.div>
      </div>
    </article>
  );
}
