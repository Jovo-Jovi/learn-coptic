/**
 * S17 composition parse.
 * Order: unique dictionary hit on the full surface, then grammar peel
 * only if the remainder is still a unique dictionary stem (or a whole affix).
 */
import type { GrammarAffix, Word } from "@/data/schema";
import { ARTICLE_PREFIXES, copticLetterCount, isTeachingSet, normalizeCoptic } from "@/lib/coptic-text";
import { getGrammarRules } from "@/lib/grammar-rules";
import { foldCopticLower } from "@/lib/letters";
import { getWords } from "@/lib/words";

export type ParsePiece = {
  id: string;
  form: string;
  glossAr: string;
  attach: GrammarAffix["attach"];
  kind: GrammarAffix["kind"] | "article-jinkim";
};

export type ParseResult = {
  surface: string;
  folded: string;
  pieces: ParsePiece[];
  stem: string;
  stemAr: string | null;
  stemSource: "teaching" | "lexicon" | null;
  relative: boolean;
};

export type GlossMaps = {
  teaching: Map<string, string>;
  lexicon: Map<string, string>;
};

function pushUnique(map: Map<string, string[]>, key: string, ar: string) {
  const list = map.get(key);
  if (list) list.push(ar);
  else map.set(key, [ar]);
}

function freezeUnique(buckets: Map<string, string[]>): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, ars] of buckets) {
    const uniq = [...new Set(ars)];
    if (uniq.length === 1 && uniq[0]) out.set(key, uniq[0]);
  }
  return out;
}

function addWordKeys(word: Word, buckets: Map<string, string[]>, ar: string) {
  const folded = foldCopticLower(word.coptic);
  pushUnique(buckets, folded, ar);
  const norm = normalizeCoptic(folded);
  if (norm !== folded) pushUnique(buckets, norm, ar);
  if (word.lemma) {
    const lemmaFold = foldCopticLower(word.lemma);
    pushUnique(buckets, lemmaFold, ar);
    const lemmaNorm = normalizeCoptic(lemmaFold);
    if (lemmaNorm !== lemmaFold) pushUnique(buckets, lemmaNorm, ar);
  }
}

export function buildGlossMaps(words: Word[] = getWords()): GlossMaps {
  const teachingBuckets = new Map<string, string[]>();
  const lexiconBuckets = new Map<string, string[]>();
  for (const word of words) {
    if (!word.published || word.kind === "drill") continue;
    const ar = word.meaning?.ar;
    if (!ar) continue;
    addWordKeys(word, lexiconBuckets, ar);
    if (isTeachingSet(word)) addWordKeys(word, teachingBuckets, ar);
  }
  return {
    teaching: freezeUnique(teachingBuckets),
    lexicon: freezeUnique(lexiconBuckets),
  };
}

export function lookupStemAr(
  stem: string,
  maps: GlossMaps,
): { ar: string; source: "teaching" | "lexicon" } | null {
  if (!stem) return null;
  const folded = foldCopticLower(stem);
  const keys = [folded, normalizeCoptic(folded)];
  for (const key of keys) {
    const teaching = maps.teaching.get(key);
    if (teaching) return { ar: teaching, source: "teaching" };
  }
  for (const key of keys) {
    const lexicon = maps.lexicon.get(key);
    if (lexicon) return { ar: lexicon, source: "lexicon" };
  }
  return null;
}

function pieceFromAffix(affix: GrammarAffix): ParsePiece {
  return {
    id: affix.id,
    form: affix.form,
    glossAr: affix.gloss.ar,
    attach: affix.attach,
    kind: affix.kind,
  };
}

const JINKIM_ARTICLES: ParsePiece[] = [
  {
    id: "jinkim-p",
    form: "ⲡ̀",
    glossAr: "تعريف مذكر",
    attach: "prefix",
    kind: "article-jinkim",
  },
  {
    id: "jinkim-t",
    form: "ⲧ̀",
    glossAr: "تعريف مؤنث",
    attach: "prefix",
    kind: "article-jinkim",
  },
  {
    id: "jinkim-n",
    form: "ⲛ̀",
    glossAr: "إضافة / تعريف جمع خفيف",
    attach: "prefix",
    kind: "article-jinkim",
  },
  {
    id: "jinkim-m",
    form: "ⲙ̀",
    glossAr: "إضافة قبل شفهي",
    attach: "prefix",
    kind: "article-jinkim",
  },
];

const SPECIAL_ARTICLES: ParsePiece[] = [
  {
    id: "art-fi-jinkim",
    form: "ⲫ̀",
    glossAr: "تعريف مذكر خاص",
    attach: "prefix",
    kind: "article-definite",
  },
  {
    id: "art-thi-jinkim",
    form: "ⲑ̀",
    glossAr: "تعريف مؤنث خاص",
    attach: "prefix",
    kind: "article-definite",
  },
  {
    id: "art-fi",
    form: "ⲫ",
    glossAr: "تعريف مذكر خاص",
    attach: "prefix",
    kind: "article-definite",
  },
  {
    id: "art-thi",
    form: "ⲑ",
    glossAr: "تعريف مؤنث خاص",
    attach: "prefix",
    kind: "article-definite",
  },
];

const PAST_SUBJECTS = ["ⲧⲉⲧⲉⲛ", "ⲧⲉⲛ", "ⲓ", "ⲕ", "ϥ", "ⲥ", "ⲩ"] as const;

function minRestFor(form: string): number {
  if (form === "ⲟⲩ" || form === "ϯ") return 3;
  return 2;
}

function readyPrefixes(affixes: GrammarAffix[]): GrammarAffix[] {
  return affixes
    .filter(
      (affix) =>
        affix.parseReady &&
        (affix.attach === "prefix" || affix.attach === "clitic"),
    )
    .slice()
    .sort((a, b) => b.form.length - a.form.length);
}

function readySuffixes(affixes: GrammarAffix[]): GrammarAffix[] {
  return affixes
    .filter((affix) => affix.parseReady && affix.attach === "suffix")
    .slice()
    .sort((a, b) => b.form.length - a.form.length);
}

function readyFree(affixes: GrammarAffix[]): GrammarAffix[] {
  return affixes
    .filter((affix) => affix.parseReady && affix.attach === "free")
    .slice()
    .sort((a, b) => b.form.length - a.form.length);
}

function hasUniqueStem(rest: string, maps: GlossMaps): boolean {
  return lookupStemAr(rest, maps) != null;
}

function isWholeAffix(
  rest: string,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
): boolean {
  return [...frees, ...prefixes].some(
    (affix) => foldCopticLower(affix.form) === rest,
  );
}

function leafOk(
  rest: string,
  maps: GlossMaps,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
): boolean {
  return (
    hasUniqueStem(rest, maps) ||
    hasUniqueStem(normalizeCoptic(rest), maps) ||
    isWholeAffix(rest, prefixes, frees)
  );
}

function restOk(
  rest: string,
  maps: GlossMaps,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
): boolean {
  if (leafOk(rest, maps, prefixes, frees)) return true;
  const inner =
    peelLongestPrefix(rest, prefixes, frees, maps, true) ??
    peelListed(rest, [...JINKIM_ARTICLES, ...SPECIAL_ARTICLES], maps, prefixes, frees, true) ??
    peelS13bArticle(rest, prefixes, frees, maps, true);
  return inner != null;
}

function peelListed(
  folded: string,
  listed: ParsePiece[],
  maps: GlossMaps,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
  leafOnly = false,
): { piece: ParsePiece; rest: string } | null {
  const ok = leafOnly ? leafOk : restOk;
  const sorted = listed.slice().sort((a, b) => b.form.length - a.form.length);
  for (const article of sorted) {
    if (!folded.startsWith(article.form) || folded.length <= article.form.length) {
      continue;
    }
    const rest = folded.slice(article.form.length);
    if (copticLetterCount(normalizeCoptic(rest)) < minRestFor(article.form)) continue;
    if (!ok(rest, maps, prefixes, frees)) continue;
    return { piece: article, rest };
  }
  return null;
}

function peelLongestPrefix(
  folded: string,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
  maps: GlossMaps,
  leafOnly = false,
): { piece: ParsePiece; rest: string } | null {
  const ok = leafOnly ? leafOk : restOk;
  for (const affix of prefixes) {
    const form = foldCopticLower(affix.form);
    if (!folded.startsWith(form) || folded.length <= form.length) continue;
    const rest = folded.slice(form.length);
    if (copticLetterCount(normalizeCoptic(rest)) < minRestFor(form)) continue;
    if (!ok(rest, maps, prefixes, frees)) continue;
    return { piece: pieceFromAffix(affix), rest };
  }
  return null;
}

function peelS13bArticle(
  folded: string,
  prefixes: GrammarAffix[],
  frees: GrammarAffix[],
  maps: GlossMaps,
  leafOnly = false,
): { piece: ParsePiece; rest: string } | null {
  const ok = leafOnly ? leafOk : restOk;
  const already = new Set(prefixes.map((affix) => foldCopticLower(affix.form)));
  for (const form of ARTICLE_PREFIXES) {
    if (already.has(form)) continue;
    if (!folded.startsWith(form) || folded.length <= form.length) continue;
    const rest = folded.slice(form.length);
    if (copticLetterCount(normalizeCoptic(rest)) < minRestFor(form)) continue;
    if (!ok(rest, maps, prefixes, frees)) continue;
    return {
      piece: {
        id: `article-${form}`,
        form,
        glossAr: "أداة تعريف أو تنكير",
        attach: "prefix",
        kind: form === "ⲟⲩ" || form === "ϩⲁⲛ" ? "article-indefinite" : "article-definite",
      },
      rest,
    };
  }
  return null;
}

const OBJECT_SUFFIXES = ["ⲧⲉⲧⲉⲛ", "ⲧⲉⲛ", "ⲟⲩ", "ⲓ", "ⲕ", "ϥ", "ⲥ", "ⲛ", "ⲩ"] as const;

function jinkimFirst(form: string): string {
  const chars = [...form];
  if (chars.length === 0 || chars[1] === "\u0300") return form;
  return `${chars[0]}\u0300${form.slice(chars[0]!.length)}`;
}

function peelPrepPronoun(
  folded: string,
  affixes: GrammarAffix[],
): ParseResult | null {
  const preps = affixes
    .filter((affix) => affix.kind === "preposition" && affix.formBeforePronoun)
    .slice()
    .sort(
      (a, b) =>
        (b.formBeforePronoun?.length ?? 0) - (a.formBeforePronoun?.length ?? 0),
    );
  for (const prep of preps) {
    const base = foldCopticLower(prep.formBeforePronoun ?? "");
    if (!base) continue;
    for (const form of [base, jinkimFirst(base)]) {
      if (!folded.startsWith(form) || folded.length <= form.length) continue;
      const rest = folded.slice(form.length);
      if (!(OBJECT_SUFFIXES as readonly string[]).includes(rest)) continue;
      const piece = pieceFromAffix(prep);
      return {
        surface: folded,
        folded,
        pieces: [piece],
        stem: "",
        stemAr: piece.glossAr,
        stemSource: "teaching",
        relative: false,
      };
    }
  }
  return null;
}

function peelPastTense(
  folded: string,
  maps: GlossMaps,
  affixes: GrammarAffix[],
): { pieces: ParsePiece[]; rest: string } | null {
  if (!folded.startsWith("ⲁ") || folded.startsWith("ⲁ̀")) return null;
  const tense = affixes.find((affix) => affix.id === "tense-a");
  if (!tense) return null;
  for (const subject of PAST_SUBJECTS) {
    const prefix = `ⲁ${subject}`;
    if (!folded.startsWith(prefix) || folded.length <= prefix.length) continue;
    const rest = folded.slice(prefix.length);
    if (!hasUniqueStem(rest, maps) && !hasUniqueStem(normalizeCoptic(rest), maps)) {
      continue;
    }
    const subj = affixes.find(
      (affix) =>
        affix.kind === "subject-pronoun" && foldCopticLower(affix.form) === subject,
    );
    const pieces = [pieceFromAffix(tense)];
    if (subj) pieces.push(pieceFromAffix(subj));
    return { pieces, rest };
  }
  return null;
}

export function parseCoptic(
  surface: string,
  maps: GlossMaps,
  affixes: GrammarAffix[] = getGrammarRules().affixes,
): ParseResult {
  const folded = foldCopticLower(surface);
  const pieces: ParsePiece[] = [];
  const prefixes = readyPrefixes(affixes);
  const frees = readyFree(affixes);
  const suffixes = readySuffixes(affixes);

  if (folded === "ⲛ̀ϫⲉ") {
    return {
      surface,
      folded,
      pieces: [],
      stem: folded,
      stemAr: null,
      stemSource: null,
      relative: false,
    };
  }

  const exactDict = lookupStemAr(folded, maps);
  if (exactDict) {
    return {
      surface,
      folded,
      pieces: [],
      stem: folded,
      stemAr: exactDict.ar,
      stemSource: exactDict.source,
      relative: false,
    };
  }

  const exactWhole = [...frees, ...prefixes].find(
    (affix) => foldCopticLower(affix.form) === folded,
  );
  if (exactWhole) {
    const piece = pieceFromAffix(exactWhole);
    return {
      surface,
      folded,
      pieces: [piece],
      stem: "",
      stemAr: piece.glossAr,
      stemSource: "teaching",
      relative: exactWhole.kind === "relative",
    };
  }

  const boundPrep = peelPrepPronoun(folded, affixes);
  if (boundPrep) {
    return { ...boundPrep, surface };
  }

  const past = peelPastTense(folded, maps, affixes);
  if (past) {
    pieces.push(...past.pieces);
    const found = lookupStemAr(past.rest, maps);
    return {
      surface,
      folded,
      pieces,
      stem: past.rest,
      stemAr: found?.ar ?? null,
      stemSource: found?.source ?? null,
      relative: false,
    };
  }

  let rest = folded;
  for (let i = 0; i < 4; i++) {
    const hit =
      peelLongestPrefix(rest, prefixes, frees, maps) ??
      peelListed(rest, [...JINKIM_ARTICLES, ...SPECIAL_ARTICLES], maps, prefixes, frees) ??
      peelS13bArticle(rest, prefixes, frees, maps);
    if (!hit) break;
    pieces.push(hit.piece);
    rest = hit.rest;
    if (isWholeAffix(rest, prefixes, frees)) {
      const wholeRest = [...frees, ...prefixes].find(
        (affix) => foldCopticLower(affix.form) === rest,
      );
      if (wholeRest) {
        pieces.push(pieceFromAffix(wholeRest));
        rest = "";
      }
      break;
    }
  }

  if (rest) {
    for (const affix of suffixes) {
      const form = foldCopticLower(affix.form);
      if (!rest.endsWith(form) || rest.length <= form.length) continue;
      const head = rest.slice(0, rest.length - form.length);
      if (copticLetterCount(normalizeCoptic(head)) < 2) continue;
      if (!hasUniqueStem(head, maps) && !hasUniqueStem(normalizeCoptic(head), maps)) {
        continue;
      }
      pieces.push(pieceFromAffix(affix));
      rest = head;
      break;
    }
  }

  const stem = rest;
  const found = lookupStemAr(stem, maps);
  return {
    surface,
    folded,
    pieces,
    stem,
    stemAr: found?.ar ?? null,
    stemSource: found?.source ?? null,
    relative: pieces.some((piece) => piece.kind === "relative"),
  };
}

export function firstGlossPiece(ar: string): string {
  if (ar.includes("الذي")) return "الذي";
  if (ar.includes("التي")) return "التي";
  const withoutNote = ar.replace(/\([^)]*\)/g, " ").trim();
  return (
    withoutNote
      .split(/[/،,—–؛;]+/)
      .map((part) => part.trim())
      .find((part) => part.length > 0) ?? ar
  );
}

/** Learner line: dictionary stem first, then stored affix glosses. */
export function composeParseAr(parsed: ParseResult): string | null {
  if (parsed.stemAr) {
    const stem = firstGlossPiece(parsed.stemAr);
    const poss = parsed.pieces.find((piece) => piece.kind === "possessive-adjective");
    if (poss) {
      const tag = firstGlossPiece(poss.glossAr);
      if (tag.startsWith("ـ")) {
        const suffix = tag.slice(1).split(/\s+/)[0] ?? "";
        if (suffix) return `${stem}${suffix}`;
      }
    }
    return stem;
  }
  const parts: string[] = [];
  for (const piece of parsed.pieces) {
    const short = firstGlossPiece(piece.glossAr);
    if (short) parts.push(short);
  }
  const text = parts.join(" + ");
  return text.length > 0 ? text : null;
}

export const PARSE_FIXTURES: {
  coptic: string;
  affixIds: string[];
  stem: string;
}[] = [
  { coptic: "ⲡⲉⲕⲣⲁⲛ", affixIds: ["poss-pek"], stem: "ⲣⲁⲛ" },
  { coptic: "ⲉⲑⲟⲩⲁⲃ", affixIds: [], stem: "ⲉⲑⲟⲩⲁⲃ" },
  { coptic: "ⲉⲧϧⲉⲛ", affixIds: ["rel-et", "prep-khen"], stem: "" },
  { coptic: "ⲡ̀ϣⲏⲣⲓ", affixIds: ["jinkim-p"], stem: "ϣⲏⲣⲓ" },
  { coptic: "ⲛⲓⲫⲏⲟⲩⲓ", affixIds: ["art-ni"], stem: "ⲫⲏⲟⲩⲓ" },
  { coptic: "ⲡⲉⲛⲓⲱⲧ", affixIds: ["poss-pen"], stem: "ⲓⲱⲧ" },
  { coptic: "ϧⲉⲛ", affixIds: [], stem: "ϧⲉⲛ" },
  { coptic: "ⲛⲉⲙ", affixIds: [], stem: "ⲛⲉⲙ" },
  { coptic: "ⲓⲏⲥⲟⲩⲥ", affixIds: [], stem: "ⲓⲏⲥⲟⲩⲥ" },
  { coptic: "ⲉ̀ⲃⲟⲗ", affixIds: [], stem: "ⲉ̀ⲃⲟⲗ" },
  { coptic: "ⲉ̀ⲣⲟⲛ", affixIds: ["prep-e"], stem: "" },
];
