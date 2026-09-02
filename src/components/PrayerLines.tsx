import type { Prayer } from "@/data/schema";
import { PrayerReader } from "@/components/PrayerReader";
import { highlightKey } from "@/lib/arabic-highlight";
import { normalizeCoptic } from "@/lib/coptic-text";
import { foldCopticLower } from "@/lib/letters";
import {
  foldedNameKeys,
  lineHighlightForToken,
  prayerGlossMaps,
  tokenParseCaption,
  uniqueTeachingGlossByCoptic,
  uniqueTeachingTranslitByCoptic,
} from "@/lib/prayer-line-highlight";
import { learnerSpeak, type LearnerSpeak } from "@/lib/pronounce";
import { getWordById } from "@/lib/words";

export function PrayerLines({ prayer }: { prayer: Prayer }) {
  const glosses: Record<string, { ar: string }> = {};
  for (const line of prayer.lines) {
    for (const token of line.tokens) {
      if (!token.wordId || glosses[token.wordId]) continue;
      const word = getWordById(token.wordId);
      if (word?.meaning?.ar) glosses[token.wordId] = { ar: word.meaning.ar };
    }
  }

  const teachingGloss = uniqueTeachingGlossByCoptic();
  const teachingTranslit = uniqueTeachingTranslitByCoptic();
  const nameKeys = foldedNameKeys();
  const maps = prayerGlossMaps();
  const highlights: Record<string, string> = {};
  const captions: Record<string, string> = {};
  const speaks: Record<string, LearnerSpeak> = {};
  for (const line of prayer.lines) {
    line.tokens.forEach((token, index) => {
      const key = highlightKey(line.id, index);
      const phrase = lineHighlightForToken(token, line.translation.ar, {
        dictionaryAr: token.wordId ? glosses[token.wordId]?.ar : undefined,
        teachingGloss,
        maps,
      });
      if (phrase) highlights[key] = phrase;
      const caption = tokenParseCaption(token.coptic, maps, {
        gloss: token.gloss,
        dictionaryAr: token.wordId ? glosses[token.wordId]?.ar : undefined,
      });
      if (caption) captions[key] = caption;
      const folded = foldCopticLower(token.coptic);
      const norm = normalizeCoptic(folded);
      speaks[key] = learnerSpeak(token.coptic, {
        storedTranslit: teachingTranslit.get(folded) ?? teachingTranslit.get(norm),
        isProperName: nameKeys.has(folded) || nameKeys.has(norm),
      });
    });
  }

  return (
    <PrayerReader
      prayer={prayer}
      highlights={highlights}
      captions={captions}
      speaks={speaks}
    />
  );
}
