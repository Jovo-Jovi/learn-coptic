"use client";

import { useEffect, useState } from "react";
import type { Prayer } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { highlightKey, splitHighlight } from "@/lib/arabic-highlight";
import { copticToAthanasiusKey } from "@/lib/letters";
import { cn } from "@/lib/utils";

const ROLE_AR: Record<Prayer["lines"][number]["role"], string | null> = {
  priest: "الكاهن",
  deacon: "الشماس",
  congregation: "الشعب",
  narration: null,
  none: null,
};

function TranslationAr({
  text,
  highlight,
}: {
  text: string;
  highlight: string | null;
}) {
  const parts = highlight ? splitHighlight(text, highlight) : null;
  if (!parts) {
    return (
      <p dir="rtl" className="mt-3 text-base text-text">
        {text}
      </p>
    );
  }
  return (
    <p dir="rtl" className="mt-3 text-base text-text">
      {parts.before}
      <mark className="prayer-hl rounded-sm px-0.5">
        {parts.match}
      </mark>
      {parts.after}
    </p>
  );
}

export function PrayerReader({
  prayer,
  highlights,
  captions = {},
}: {
  prayer: Prayer;
  highlights: Record<string, string>;
  captions?: Record<string, string>;
}) {
  const [open, setOpen] = useState<{ lineId: string; index: number } | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <ol className="mt-8 flex list-none flex-col gap-6 p-0">
      {prayer.lines.map((line) => {
        const role = ROLE_AR[line.role];
        const tokens = line.tokens;
        return (
          <li key={line.id} className="card-face px-4 py-5">
            {role ? (
              <p className="mb-3 text-xs font-semibold text-text-dim">{role}</p>
            ) : null}
            {tokens.length > 0 ? (
              <p className="flex flex-wrap gap-x-2 gap-y-2" dir="ltr">
                {tokens.map((token, index) => {
                  const selected =
                    open?.lineId === line.id && open.index === index;
                  return (
                    <button
                      key={`${line.id}-${index}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setOpen((prev) =>
                          prev?.lineId === line.id && prev.index === index
                            ? null
                            : { lineId: line.id, index },
                        );
                      }}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-lg px-1 text-start",
                        "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                        selected ? "prayer-hl" : null,
                      )}
                    >
                      <CopticPaint
                        unicode={token.coptic}
                        mapped={copticToAthanasiusKey(token.coptic)}
                        className="word-coptic text-[1.65rem] leading-snug"
                      />
                    </button>
                  );
                })}
              </p>
            ) : (
              <CopticPaint
                unicode={line.coptic}
                mapped={copticToAthanasiusKey(line.coptic)}
                className="word-coptic text-[1.65rem] leading-snug"
              />
            )}
            {line.translit.ar ? (
              <p className="mt-3 text-sm text-text-dim">{line.translit.ar}</p>
            ) : null}
            <TranslationAr
              text={line.translation.ar}
              highlight={
                open?.lineId === line.id
                  ? (highlights[highlightKey(line.id, open.index)] ?? null)
                  : null
              }
            />
            {open?.lineId === line.id &&
            captions[highlightKey(line.id, open.index)] ? (
              <p className="mt-2 text-base font-semibold text-text">
                {captions[highlightKey(line.id, open.index)]}
              </p>
            ) : open?.lineId === line.id ? (
              <p className="mt-2 text-sm text-text-dim">
                مفيش معنى في القاموس للكلمة دي بعد.
              </p>
            ) : null}
            {line.translation.en ? (
              <p className="mt-1 text-sm text-text-dim" dir="ltr">
                {line.translation.en}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
