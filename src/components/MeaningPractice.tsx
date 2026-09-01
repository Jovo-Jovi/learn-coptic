"use client";

import { useEffect, useState } from "react";
import { CopticPaint } from "@/components/CopticPaint";
import type { WordCardModel } from "@/lib/words";
import { easternDigits } from "@/lib/letters";

function shuffle<T>(items: T[]): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

export function MeaningPractice({ words }: { words: WordCardModel[] }) {
  const [deck, setDeck] = useState(words);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDeck(shuffle(words));
    setIndex(0);
    setOpen(false);
  }, [words]);

  if (deck.length === 0) {
    return <p className="text-base text-text-dim">مفيش كلمات للتمرين هنا.</p>;
  }

  const word = deck[index];
  if (!word) {
    return <p className="text-base text-text-dim">مفيش كلمات للتمرين هنا.</p>;
  }

  const last = index >= deck.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      <p className="text-sm text-text-dim">
        {easternDigits(index + 1)} من {easternDigits(deck.length)}
      </p>
      <div
        data-group={word.group ?? undefined}
        className="card-face flex w-full flex-col items-center gap-3 px-4 py-8"
      >
        <CopticPaint
          unicode={word.coptic}
          mapped={word.mapped}
          className="word-coptic glyph-fill text-glyph-word inline-block leading-none sm:text-glyph-word-md"
        />
        {word.translitAr ? (
          <p className="text-sm text-text-dim">{word.translitAr}</p>
        ) : null}
        {open && word.meaningAr ? (
          <p className="text-base font-semibold text-text">{word.meaningAr}</p>
        ) : null}
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-text px-4 text-sm font-semibold text-bg focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          {open ? "خبّي المعنى" : "المعنى"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (last) {
              setIndex(0);
            } else {
              setIndex((value) => value + 1);
            }
            setOpen(false);
          }}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-surface-2 px-4 text-sm text-text focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          {last ? "من الأول" : "اللي بعده"}
        </button>
      </div>
    </div>
  );
}
