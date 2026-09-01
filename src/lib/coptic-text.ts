/**
 * Coptic string hygiene for dictionary lookup (S16 / ADR-020).
 *
 * Combining jinkim is U+0300 (Bohairic grave), also macron U+0304 /
 * dot-above U+0307 in other dialects (Unicode N2636). We strip the whole
 * combining-marks block U+0300–U+036F. We do **not** NFKC-fold letters:
 * ϣ lives at U+03E3, not the Coptic-block lookalike.
 *
 * CDO/KELLIA store lemmas, not inflected forms
 * (https://coptic-dictionary.org/help.py, W18-4502). Andreas harvest rows
 * are already dictionary headwords (remnqymi / pishoyg andreas.json).
 * Bound articles on a row mean we do not claim that string is the lemma.
 */

const COMBINING = /[\u0300-\u036F]/gu;

function isCombiningMark(ch: string): boolean {
  const cp = ch.codePointAt(0);
  return cp != null && cp >= 0x0300 && cp <= 0x036f;
}

/** S13b strip list. Longest first. */
export const ARTICLE_PREFIXES = [
  "ϩⲁⲛ",
  "ⲡⲓ",
  "ⲛⲓ",
  "ⲟⲩ",
  "ϯ",
  "ⲡ̀",
  "ⲧ̀",
  "ⲛ̀",
  "ⲙ̀",
] as const;

/** Prefixes that mean “this row looks determined / not a bare headword”. */
const BOUND_FOR_LEMMA = new Set(["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ϯ", "ⲡ̀", "ⲧ̀", "ⲛ̀", "ⲙ̀"]);

export function normalizeCoptic(text: string): string {
  return text.replace(COMBINING, "");
}

export function isTeachingSet(word: {
  kind: string;
  translit: { ar: string };
}): boolean {
  return word.kind === "drill" || word.translit.ar.length > 0;
}

export function copticLetterCount(text: string): number {
  return [...text].filter((ch) => !isCombiningMark(ch)).length;
}

/** Which listed article the surface starts with, or null. */
export function leadingArticle(coptic: string): string | null {
  const chars = [...coptic];
  if (
    chars.length >= 3 &&
    chars[1] === "\u0300" &&
    (chars[0] === "ⲡ" || chars[0] === "ⲧ" || chars[0] === "ⲛ" || chars[0] === "ⲙ")
  ) {
    return `${chars[0]}\u0300`;
  }
  for (const prefix of ARTICLE_PREFIXES) {
    if (coptic.startsWith(prefix) && coptic.length > prefix.length) {
      return prefix;
    }
  }
  return null;
}

/**
 * Headword when the stored Coptic *is* the dictionary form.
 * Null when a bound article is glued on — do not invent the stem.
 * Remainder must be at least two letters, or we keep the row (ⲛⲓⲙ, ϯϯ).
 * ⲟⲩ stays a possible lemma (ⲟⲩⲟϩ and many stems); those rows are reported.
 */
export function lemmaForStoredCoptic(coptic: string): string | null {
  const article = leadingArticle(coptic);
  if (!article || !BOUND_FOR_LEMMA.has(article)) return coptic;
  const rest = coptic.slice(article.length);
  if (copticLetterCount(rest) < 2) return coptic;
  return null;
}

/**
 * One leading article from the S13b list. Jinkim forms (ⲡ̀) are stripped
 * from the surface; long forms (ⲡⲓ ϯ ⲛⲓ ⲟⲩ ϩⲁⲛ) are stripped after
 * combining marks are gone. Bare ⲡ/ⲧ/ⲛ/ⲙ without jinkim are not articles.
 */
export function stripOneArticle(surface: string): string | null {
  const article = leadingArticle(surface);
  if (article) {
    const rest = surface.slice(article.length);
    if (!rest) return null;
    const minLetters = article === "ⲟⲩ" || article === "ϯ" ? 3 : 2;
    if (copticLetterCount(rest) >= minLetters) return rest;
  }
  const norm = normalizeCoptic(surface);
  for (const prefix of ["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ⲟⲩ", "ϯ"] as const) {
    if (!norm.startsWith(prefix) || norm.length <= prefix.length) continue;
    const rest = norm.slice(prefix.length);
    const minLetters = prefix === "ⲟⲩ" || prefix === "ϯ" ? 3 : 2;
    if (copticLetterCount(rest) >= minLetters) return rest;
  }
  return null;
}
