"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { CopticPaint } from "@/components/CopticPaint";
import { SpeakLines } from "@/components/SpeakLines";
import {
  FUSE_OPTIONS,
  SEARCH_LIMIT,
  hydrateRecord,
  rankSearch,
  type SearchRecord,
  type SlimSearchRecord,
} from "@/lib/search-core";
import { easternDigits } from "@/lib/letters";
import { learnerSpeak } from "@/lib/pronounce";
import { cn } from "@/lib/utils";
import records from "@/data/generated/search-records.json";

export function WordSearch() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 120);
    return () => window.clearTimeout(timer);
  }, [query]);

  const hydrated = useMemo(
    () => (records as SlimSearchRecord[]).map(hydrateRecord),
    [],
  );

  const fuse = useMemo(
    () => new Fuse(hydrated, FUSE_OPTIONS),
    [hydrated],
  );

  const hits = useMemo(
    () =>
      rankSearch(debounced, hydrated, (q) =>
        fuse.search(q, { limit: SEARCH_LIMIT }),
      ),
    [debounced, fuse, hydrated],
  );

  return (
    <div className="w-full min-w-0">
      <label htmlFor={inputId} className="mb-3 block text-base font-semibold text-text">
        دور بالعربي
      </label>
      <p className="mb-4 text-sm text-text-dim">
        اكتب المعنى بالعربي، يطلع القبطي. ينفع كمان حرف قبطي أو اسم حرف.
      </p>
      <input
        id={inputId}
        type="search"
        dir="rtl"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="يد، اسم، ألفا"
        className={cn(
          "w-full min-h-11 rounded-full border border-hairline bg-surface-2 px-4 text-base text-text",
          "placeholder:text-text-dim",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        )}
      />
      {debounced.trim() ? (
        <p className="mt-4 text-sm text-text-dim" aria-live="polite">
          {hits.length === 0
            ? "مفيش نتيجة بالكلمة دي"
            : `${easternDigits(hits.length)} نتيجة`}
        </p>
      ) : (
        <p className="mt-4 text-sm text-text-dim">اكتب كلمة بالعربي، زي «يد» أو «اسم».</p>
      )}
      {hits.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {hits.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <SearchHitCard hit={hit} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SearchHitCard({ hit }: { hit: SearchRecord }) {
  const isLetter = hit.type === "letter";
  const speak = learnerSpeak(hit.coptic, {
    storedTranslit: hit.type === "word" ? hit.translitAr : null,
    isProperName: hit.wordKind === "name",
  });
  return (
    <article
      data-group={hit.group ?? undefined}
      className="card-face flex flex-col gap-2 px-4 py-5"
    >
      {isLetter ? (
        <p className="text-xs font-semibold text-text-dim">حرف</p>
      ) : hit.type === "prayer" ? (
        <p className="text-xs font-semibold text-text-dim">صلاة</p>
      ) : hit.wordKind === "name" ? (
        <p className="text-xs font-semibold text-text-dim">اسم علم</p>
      ) : hit.wordKind === "drill" ? (
        <p className="text-xs font-semibold text-text-dim">تمرين قراءة</p>
      ) : null}
      <CopticPaint
        unicode={hit.coptic}
        mapped={hit.mapped}
        className="word-coptic glyph-fill text-glyph-word inline-block leading-none"
      />
      {hit.label ? (
        <p className="text-base font-semibold text-text">{hit.label}</p>
      ) : null}
      <SpeakLines speak={speak} />
      <p>
        <Link
          href={hit.href}
          className="inline-flex min-h-11 items-center text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          {isLetter ? "صفحة الحرف" : hit.type === "prayer" ? "اقرأ الصلاة" : "في الكلمات"}
        </Link>
      </p>
    </article>
  );
}
