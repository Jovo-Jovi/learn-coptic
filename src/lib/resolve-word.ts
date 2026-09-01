import type { Word } from "@/data/schema";
import {
  isTeachingSet,
  normalizeCoptic,
  stripOneArticle,
} from "@/lib/coptic-text";
import { foldCopticLower } from "@/lib/letters";

const LINE_SPLIT = /[\s.,:;·\u00B7?!()\-]+/u;

/** Lexicon/name rows used for prayer glossing. Drills are not dictionary. */
export function dictionaryWords(words: Word[]): Word[] {
  return words.filter(
    (word) => word.published && word.kind !== "drill",
  );
}

function fold(text: string): string {
  return foldCopticLower(text);
}

function push(map: Map<string, Word[]>, key: string, word: Word): void {
  const list = map.get(key);
  if (list) list.push(word);
  else map.set(key, [word]);
}

export type WordIndex = {
  exact: Map<string, Word[]>;
  lemma: Map<string, Word[]>;
  exactNorm: Map<string, Word[]>;
  lemmaNorm: Map<string, Word[]>;
};

export function buildWordIndex(words: Word[]): WordIndex {
  const exact = new Map<string, Word[]>();
  const lemma = new Map<string, Word[]>();
  const exactNorm = new Map<string, Word[]>();
  const lemmaNorm = new Map<string, Word[]>();
  for (const word of dictionaryWords(words)) {
    const folded = fold(word.coptic);
    push(exact, folded, word);
    push(exactNorm, normalizeCoptic(folded), word);
    if (word.lemma) {
      const lemmaFold = fold(word.lemma);
      push(lemma, lemmaFold, word);
      push(lemmaNorm, normalizeCoptic(lemmaFold), word);
    }
  }
  return { exact, lemma, exactNorm, lemmaNorm };
}

function unique(hits: Word[] | undefined): Word[] {
  if (!hits || hits.length === 0) return [];
  const seen = new Set<string>();
  const out: Word[] = [];
  for (const word of hits) {
    if (seen.has(word.id)) continue;
    seen.add(word.id);
    out.push(word);
  }
  return out;
}

/**
 * ADR-020: exact coptic → lemma → strip one article → retry exact/lemma → null.
 * Two ids at any step → null.
 * Harvest-only hits are skipped (unverified Arabic). Later steps may still
 * find a teaching-set stem after stripping one article.
 */
export function resolveWordId(surface: string, index: WordIndex): string | null {
  const folded = fold(surface);
  if (!folded) return null;
  if (folded === "ⲛ̀ϫⲉ") return null;

  const exact = decide(unique(index.exact.get(folded)));
  if (exact !== "continue") return exact;

  const lemma = decide(unique(index.lemma.get(folded)));
  if (lemma !== "continue") return lemma;

  const stripped = stripOneArticle(folded);
  if (!stripped) return null;
  const strippedFold = fold(stripped);
  const strippedNorm = normalizeCoptic(strippedFold);

  const stripExactHits = unique(index.exact.get(strippedFold));
  const stripExact =
    stripExactHits.length > 0
      ? stripExactHits
      : unique(index.exactNorm.get(strippedNorm));
  const stripExactDecision = decide(stripExact);
  if (stripExactDecision !== "continue") return stripExactDecision;

  const stripLemmaHits = unique(index.lemma.get(strippedFold));
  const stripLemma =
    stripLemmaHits.length > 0
      ? stripLemmaHits
      : unique(index.lemmaNorm.get(strippedNorm));
  const stripLemmaDecision = decide(stripLemma);
  return stripLemmaDecision === "continue" ? null : stripLemmaDecision;
}

function decide(hits: Word[]): string | null | "continue" {
  if (hits.length > 1) return null;
  if (hits.length === 0) return "continue";
  const word = hits[0]!;
  if (isTeachingSet(word)) return word.id;
  return "continue";
}

export function tokenizeCopticLine(coptic: string): string[] {
  return coptic
    .split(LINE_SPLIT)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
