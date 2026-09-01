/**
 * Highlight a span that already exists in a prayer line's Arabic.
 * Never invent glosses — only mark text copied from translation.ar.
 */

const GLOSS_SPLIT = /[\/،,]+/;
const BOUNDARY = /[\s\u00A0،,.؛;:؟!()[\]{}«»""''\/]/;

export function highlightKey(lineId: string, index: number): string {
  return `${lineId}:${index}`;
}

export function glossPieces(ar: string): string[] {
  return ar
    .split(GLOSS_SPLIT)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2);
}

function isBoundary(ch: string | undefined): boolean {
  if (ch === undefined) return true;
  return BOUNDARY.test(ch);
}

/** First standalone (space/punct-bounded) index of phrase, or -1. */
export function standaloneIndex(line: string, phrase: string, from = 0): number {
  let start = from;
  while (start <= line.length - phrase.length) {
    const at = line.indexOf(phrase, start);
    if (at < 0) return -1;
    const before = at === 0 ? undefined : line[at - 1];
    const after = line[at + phrase.length];
    if (isBoundary(before) && isBoundary(after)) return at;
    start = at + 1;
  }
  return -1;
}

export function standaloneCount(line: string, phrase: string): number {
  let count = 0;
  let from = 0;
  while (true) {
    const at = standaloneIndex(line, phrase, from);
    if (at < 0) return count;
    count += 1;
    from = at + phrase.length;
  }
}

export function substringCount(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  while (true) {
    const at = haystack.indexOf(needle, from);
    if (at < 0) return count;
    count += 1;
    from = at + needle.length;
  }
}

/**
 * Longest phrase that appears exactly once as a standalone span,
 * else a unique Arabic word that is the stem plus a short suffix (اسمك).
 */
export function uniquePhraseInLine(lineAr: string, phrases: string[]): string | null {
  const unique = phrases.filter((phrase) => standaloneCount(lineAr, phrase) === 1);
  if (unique.length > 0) {
    unique.sort((a, b) => b.length - a.length);
    return unique[0] ?? null;
  }
  return uniqueAffixedWord(lineAr, phrases);
}

const AR_TOKEN = /[^\s،,.؛;:؟!()[\]{}«»]+/gu;

function stripArPunct(token: string): string {
  return token.replace(/[،,.؛;:؟!()[\]{}«»""'']/g, "");
}

/** Stem + 1–2 letters (ك، نا، هم…). Rejects أبانا from أب (3 extra). */
function arabicTokenHasStem(token: string, stem: string): boolean {
  const bare = stripArPunct(token);
  if (bare === stem) return true;
  if (!bare.startsWith(stem)) return false;
  const extra = bare.length - stem.length;
  return extra >= 1 && extra <= 2;
}

function uniqueAffixedWord(lineAr: string, phrases: string[]): string | null {
  const tokens = lineAr.match(AR_TOKEN) ?? [];
  const hits: string[] = [];
  for (const stem of phrases) {
    const matched = tokens.filter((token) => arabicTokenHasStem(token, stem));
    if (matched.length === 1 && matched[0]) hits.push(matched[0]);
  }
  if (hits.length === 0) return null;
  hits.sort((a, b) => b.length - a.length);
  const best = hits[0]!;
  return substringCount(lineAr, best) === 1 ? best : null;
}

const RELATIVE_AR = ["الذي", "التي", "الذين", "اللاتي", "اللواتي"] as const;

export function highlightFromGloss(
  lineAr: string,
  glossAr: string,
  opts?: { relative?: boolean },
): string | null {
  const base = uniquePhraseInLine(lineAr, glossPieces(glossAr));
  if (!base) return null;
  if (opts?.relative) {
    const longer = RELATIVE_AR
      .map((rel) => `${rel} ${base}`)
      .filter((phrase) => standaloneCount(lineAr, phrase) === 1);
    longer.sort((a, b) => b.length - a.length);
    if (longer[0]) return longer[0];
  }
  return base;
}

export function splitHighlight(
  lineAr: string,
  phrase: string,
): { before: string; match: string; after: string } | null {
  const standalone = standaloneIndex(lineAr, phrase);
  const at = standalone >= 0 ? standalone : lineAr.indexOf(phrase);
  if (at < 0) return null;
  return {
    before: lineAr.slice(0, at),
    match: phrase,
    after: lineAr.slice(at + phrase.length),
  };
}
