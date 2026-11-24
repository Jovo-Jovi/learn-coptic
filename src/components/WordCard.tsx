"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { WordCardModel } from "@/lib/words";
import { CopticPaint } from "@/components/CopticPaint";
import { AudioButton } from "@/components/AudioButton";
import { SpeakLines } from "@/components/SpeakLines";
import { getLetterById } from "@/lib/letters";
import { SPRING } from "@/lib/motion";
import { learnerSpeak } from "@/lib/pronounce";
import { cn } from "@/lib/utils";

export function WordCard({ word }: { word: WordCardModel }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const isDrill = word.kind === "drill";
  const isName = word.kind === "name";
  const speak = useMemo(
    () =>
      learnerSpeak(word.coptic, {
        storedTranslit: word.translitAr,
        isProperName: isName,
      }),
    [word.coptic, word.translitAr, isName],
  );
  const reading = word.translitAr || speak.text;

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
            "flex w-full min-h-11 min-w-0 flex-col items-center gap-2 px-4 text-center",
            word.audioSrc ? "pt-5 pb-2" : "py-5",
            "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
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
          {reading ? (
            <span className="text-sm text-text-dim">{reading}</span>
          ) : null}
          {isDrill ? (
            <span className="text-sm font-medium text-text">
              تمرين قراءة — مش كلمة في القاموس
            </span>
          ) : null}
        </button>
        {word.audioSrc ? (
          <div className="flex justify-center pb-4">
            <AudioButton
              src={word.audioSrc}
              ariaLabel={`اسمع ${word.translitAr}`}
            />
          </div>
        ) : null}

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
            <SpeakLines speak={speak} showText={false} align="center" />
            {word.letterIds.length > 0 ? (
              <ul className="flex max-w-full flex-wrap justify-center gap-2">
                {word.letterIds.map((id) => {
                  const letter = getLetterById(id);
                  if (!letter) return null;
                  return (
                    <li key={letter.id} data-group={letter.group}>
                      <Link
                        href={`/letter/${letter.id}`}
                        aria-label={letter.name.ar}
                        className={cn(
                          "chip-fill inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-base no-underline",
                          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                        )}
                      >
                        <CopticPaint
                          unicode={letter.unicode.lower}
                          mapped={letter.athanasiusKey?.lower ?? null}
                          className="inline-block"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </motion.div>
      </div>
    </article>
  );
}
