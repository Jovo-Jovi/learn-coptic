"use client";

import { useMemo, useState } from "react";
import { WordGrid } from "@/components/WordGrid";
import { easternDigits } from "@/lib/letters";
import type { WordCardModel } from "@/lib/words";
import { cn } from "@/lib/utils";

const PAGE = 48;

const KINDS = [
  { id: "all", label: "الكل" },
  { id: "lexicon", label: "قاموس" },
  { id: "drill", label: "تدريب قراءة" },
  { id: "name", label: "أسماء" },
] as const;

type KindFilter = (typeof KINDS)[number]["id"];

const CHIP =
  "relative inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none";

export function FilterableWordGrid({ words }: { words: WordCardModel[] }) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    if (kind === "all") return words;
    return words.filter((word) => word.kind === kind);
  }, [kind, words]);

  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;

  return (
    <div>
      <nav aria-label="نوع الكلمة" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          {KINDS.map((item) => {
            const active = kind === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setKind(item.id);
                    setShown(PAGE);
                  }}
                  className={cn(
                    CHIP,
                    active ? "bg-text text-bg" : "bg-surface-2 text-text",
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {visible.length > 0 ? (
        <WordGrid words={visible} />
      ) : (
        <p className="text-base text-text-dim">مفيش كلمات في التصفية دي.</p>
      )}
      {remaining > 0 ? (
        <p className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="inline-flex min-h-11 items-center rounded-full bg-surface-2 px-4 text-sm text-text focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            كمان {easternDigits(Math.min(PAGE, remaining))} كلمة
          </button>
        </p>
      ) : null}
    </div>
  );
}
