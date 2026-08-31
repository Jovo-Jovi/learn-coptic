"use client";

import { WordCard } from "@/components/WordCard";
import type { WordCardModel } from "@/lib/words";

export function WordGrid({ words }: { words: WordCardModel[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {words.map((word) => (
        <li key={word.id} className="min-w-0">
          <WordCard word={word} />
        </li>
      ))}
    </ul>
  );
}
