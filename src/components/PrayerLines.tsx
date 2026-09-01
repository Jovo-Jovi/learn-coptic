import type { Prayer } from "@/data/schema";
import { PrayerReader } from "@/components/PrayerReader";
import { highlightKey } from "@/lib/arabic-highlight";
import {
  lineHighlightForToken,
  uniqueTeachingGlossByCoptic,
} from "@/lib/prayer-line-highlight";
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
  const highlights: Record<string, string> = {};
  for (const line of prayer.lines) {
    line.tokens.forEach((token, index) => {
      const phrase = lineHighlightForToken(token, line.translation.ar, {
        dictionaryAr: token.wordId ? glosses[token.wordId]?.ar : undefined,
        teachingGloss,
      });
      if (phrase) highlights[highlightKey(line.id, index)] = phrase;
    });
  }

  return <PrayerReader prayer={prayer} highlights={highlights} />;
}
