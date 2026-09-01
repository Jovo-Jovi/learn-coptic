import { highlightFromGloss } from "@/lib/arabic-highlight";
import { grammarStems } from "@/lib/coptic-affix";
import {
  buildGlossMaps,
  composeParseAr,
  firstGlossPiece,
  parseCoptic,
  type GlossMaps,
  type ParseResult,
} from "@/lib/coptic-parse";
import { normalizeCoptic } from "@/lib/coptic-text";
import { getGrammarRules } from "@/lib/grammar-rules";
import { foldCopticLower } from "@/lib/letters";
import { getWords, teachingWords } from "@/lib/words";

export type TokenHighlightCtx = {
  dictionaryAr?: string;
  teachingGloss: Map<string, string>;
  maps: GlossMaps;
};

/** Unique teaching-set gloss keyed by folded / normalized Coptic. Two hits → omit. */
export function uniqueTeachingGlossByCoptic(): Map<string, string> {
  const buckets = new Map<string, string[]>();
  function push(key: string, ar: string) {
    const list = buckets.get(key);
    if (list) list.push(ar);
    else buckets.set(key, [ar]);
  }
  for (const word of teachingWords()) {
    const ar = word.meaning?.ar;
    if (!ar) continue;
    const folded = foldCopticLower(word.coptic);
    push(folded, ar);
    const norm = normalizeCoptic(folded);
    if (norm !== folded) push(norm, ar);
  }
  const out = new Map<string, string>();
  for (const [key, ars] of buckets) {
    const uniq = [...new Set(ars)];
    if (uniq.length === 1 && uniq[0]) out.set(key, uniq[0]);
  }
  return out;
}

function teachingArFor(
  remainder: string,
  teachingGloss: Map<string, string>,
): string | undefined {
  return teachingGloss.get(remainder) ?? teachingGloss.get(normalizeCoptic(remainder));
}

function highlightFromParse(parsed: ParseResult, lineAr: string): string | null {
  if (parsed.stemAr) {
    const fromStem = highlightFromGloss(lineAr, parsed.stemAr, {
      relative: parsed.relative,
    });
    if (fromStem) return fromStem;
  }
  if (parsed.relative && parsed.pieces.length > 0) {
    const relShort = firstGlossPiece(parsed.pieces[0]!.glossAr);
    const next =
      parsed.stemAr != null
        ? firstGlossPiece(parsed.stemAr)
        : parsed.pieces[1]
          ? firstGlossPiece(parsed.pieces[1].glossAr)
          : "";
    if (relShort && next) {
      const joined = highlightFromGloss(lineAr, `${relShort} ${next}`);
      if (joined) return joined;
    }
  }
  for (const piece of parsed.pieces) {
    const fromAffix = highlightFromGloss(lineAr, piece.glossAr);
    if (fromAffix) return fromAffix;
  }
  return null;
}

export function parsePrayerToken(coptic: string, maps: GlossMaps): ParseResult {
  return parseCoptic(coptic, maps, getGrammarRules().affixes);
}

export function lineHighlightForToken(
  token: {
    coptic: string;
    wordId?: string | null;
    gloss?: string;
    arHighlight?: string;
  },
  lineAr: string,
  ctx: TokenHighlightCtx,
): string | null {
  if (token.arHighlight && lineAr.includes(token.arHighlight)) {
    return token.arHighlight;
  }

  if (token.gloss) {
    const fromGloss = highlightFromGloss(lineAr, token.gloss);
    if (fromGloss) return fromGloss;
  }

  if (ctx.dictionaryAr) {
    const fromDict = highlightFromGloss(lineAr, ctx.dictionaryAr);
    if (fromDict) return fromDict;
  }

  const parsed = parseCoptic(token.coptic, ctx.maps);
  const fromParse = highlightFromParse(parsed, lineAr);
  if (fromParse) return fromParse;

  for (const attempt of grammarStems(token.coptic)) {
    const teachingAr = teachingArFor(attempt.stem, ctx.teachingGloss);
    if (!teachingAr) continue;
    const fromStem = highlightFromGloss(lineAr, teachingAr, {
      relative: attempt.relative,
    });
    if (fromStem) return fromStem;
  }

  return null;
}

export function tokenParseCaption(
  coptic: string,
  maps: GlossMaps,
  extra?: { gloss?: string; dictionaryAr?: string },
): string | null {
  if (extra?.gloss) return firstGlossPiece(extra.gloss);
  if (extra?.dictionaryAr) return firstGlossPiece(extra.dictionaryAr);
  return composeParseAr(parseCoptic(coptic, maps));
}

export function prayerGlossMaps(): GlossMaps {
  return buildGlossMaps(getWords());
}
