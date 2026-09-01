import { highlightFromGloss } from "@/lib/arabic-highlight";
import { grammarStems } from "@/lib/coptic-affix";
import { normalizeCoptic } from "@/lib/coptic-text";
import { foldCopticLower } from "@/lib/letters";
import { teachingWords } from "@/lib/words";

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

export function lineHighlightForToken(
  token: {
    coptic: string;
    wordId?: string | null;
    gloss?: string;
    arHighlight?: string;
  },
  lineAr: string,
  ctx: { dictionaryAr?: string; teachingGloss: Map<string, string> },
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
