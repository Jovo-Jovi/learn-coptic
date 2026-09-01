import { copticToAthanasiusKey, getLetters } from "@/lib/letters";
import { getPrayers } from "@/lib/prayers";
import type { SlimSearchRecord } from "@/lib/search-core";
import { publishedWords } from "@/lib/words";

export function getSearchRecords(): SlimSearchRecord[] {
  const records: SlimSearchRecord[] = [];

  for (const letter of getLetters()) {
    const ar = letter.name.arDisplay ?? letter.name.ar;
    const extra = [letter.name.ar, letter.name.arDisplay, ...letter.sound.arabicHint]
      .filter((value): value is string => Boolean(value))
      .join("، ");
    records.push({
      type: "letter",
      id: letter.id,
      coptic: letter.unicode.lower,
      mapped: letter.athanasiusKey?.lower ?? null,
      ar: extra,
      label: ar,
      translitAr: letter.name.latin,
      wordKind: null,
      group: letter.group,
      href: `/letter/${letter.id}`,
    });
  }

  for (const word of publishedWords()) {
    records.push({
      type: "word",
      id: word.id,
      coptic: word.coptic,
      mapped: word.athanasiusKey,
      ar: word.meaning?.ar ?? "",
      label: word.meaning?.ar ?? "",
      translitAr: word.translit.ar,
      wordKind: word.kind,
      group: word.group,
      href: word.teaches[0]
        ? `/vocabulary/letter/${word.teaches[0]}`
        : "/vocabulary",
    });
  }

  for (const prayer of getPrayers()) {
    records.push({
      type: "prayer",
      id: prayer.id,
      coptic: prayer.titleCoptic,
      mapped: copticToAthanasiusKey(prayer.titleCoptic),
      ar: [prayer.title.ar, ...prayer.lines.map((line) => line.translation.ar)].join("، "),
      label: prayer.title.ar,
      translitAr: "",
      wordKind: null,
      group: null,
      href: `/prayers/${prayer.id}`,
    });
  }

  return records;
}
