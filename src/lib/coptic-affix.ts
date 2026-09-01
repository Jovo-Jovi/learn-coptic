/**
 * Grammatical affixes for prayer highlight (not S13b wordId).
 * Owner notes live in `src/data/json/grammar-rules.json`.
 * S17 parse uses parseReady rows; this stub peel stays the fallback.
 * Harvest Arabic is a search key into sourced prayer lines only.
 */
import {
  copticLetterCount,
  normalizeCoptic,
  stripOneArticle,
} from "@/lib/coptic-text";
import { foldCopticLower } from "@/lib/letters";

/** Relative converter. Longest first. */
export const RELATIVE_PREFIXES = ["ⲉⲑ", "ⲉⲧ"] as const;

/**
 * Bound possessives (Bohairic ⲡ-/ⲧ-/ⲛ- series). Longest first.
 * Not an S13b article list — ⲡⲉⲕⲣⲁⲛ is not article + ⲕⲣⲁⲛ.
 */
export const POSSESSIVE_PREFIXES = [
  "ⲡⲉⲧⲉⲛ",
  "ⲧⲉⲧⲉⲛ",
  "ⲛⲉⲧⲉⲛ",
  "ⲡⲉⲛ",
  "ⲧⲉⲛ",
  "ⲛⲉⲛ",
  "ⲡⲟⲩ",
  "ⲧⲟⲩ",
  "ⲛⲟⲩ",
  "ⲡⲉⲕ",
  "ⲧⲉⲕ",
  "ⲛⲉⲕ",
  "ⲡⲉϥ",
  "ⲧⲉϥ",
  "ⲛⲉϥ",
  "ⲡⲉⲥ",
  "ⲧⲉⲥ",
  "ⲛⲉⲥ",
  "ⲡⲁ",
  "ⲧⲁ",
  "ⲛⲁ",
] as const;

function restAfter(
  folded: string,
  prefixes: readonly string[],
  minLetters: number,
): string | null {
  for (const prefix of prefixes) {
    if (!folded.startsWith(prefix) || folded.length <= prefix.length) continue;
    const rest = folded.slice(prefix.length);
    if (copticLetterCount(normalizeCoptic(rest)) >= minLetters) return rest;
  }
  return null;
}

export function stripRelative(folded: string): string | null {
  return restAfter(folded, RELATIVE_PREFIXES, 2);
}

export function stripPossessive(folded: string): string | null {
  return restAfter(folded, POSSESSIVE_PREFIXES, 2);
}

export type GrammarStem = { stem: string; relative: boolean };

/**
 * Surface plus one grammatical peel. First hit that maps to a unique
 * teaching gloss wins at the call site. Two peels only when the first
 * was the relative converter (ⲉⲧⲛⲓ… → article, ⲉⲧⲡⲉⲕ… → possessive).
 */
export function grammarStems(surface: string): GrammarStem[] {
  const folded = foldCopticLower(surface);
  const out: GrammarStem[] = [];
  const seen = new Set<string>();

  function add(stem: string, relative: boolean) {
    if (!stem) return;
    const key = `${relative ? 1 : 0}:${stem}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ stem, relative });
  }

  add(folded, false);

  const relative = stripRelative(folded);
  if (relative) add(relative, true);

  const article = stripOneArticle(folded);
  if (article) add(foldCopticLower(article), false);

  const possessive = stripPossessive(folded);
  if (possessive) add(possessive, false);

  if (relative) {
    const relArticle = stripOneArticle(relative);
    if (relArticle) add(foldCopticLower(relArticle), true);
    const relPossessive = stripPossessive(relative);
    if (relPossessive) add(relPossessive, true);
  }

  return out;
}
