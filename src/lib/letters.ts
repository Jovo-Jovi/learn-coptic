import { cache } from "react";
import { LettersFile, type GroupId, type Letter } from "@/data/schema";
import raw from "@/data/json/letters.json";

export const GROUP_IDS = [1, 2, 3, 4, 5, 6, 7] as const satisfies readonly GroupId[];

export const GROUP_DIGIT_AR: Record<GroupId, string> = {
  1: "١",
  2: "٢",
  3: "٣",
  4: "٤",
  5: "٥",
  6: "٦",
  7: "٧",
};

const EASTERN_DIGIT = "٠١٢٣٤٥٦٧٨٩";

/** Learner-facing numbers. Routes stay ASCII. */
export function easternDigits(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => EASTERN_DIGIT[Number(d)] ?? d);
}

export const getLetters = cache((): Letter[] => LettersFile.parse(raw).letters);

export function lettersInOrder(): Letter[] {
  return getLetters()
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function lettersInGroup(group: GroupId): Letter[] {
  return getLetters()
    .filter((l) => l.group === group)
    .sort((a, b) => a.order - b.order);
}

export function getLetterById(id: string): Letter | undefined {
  return getLetters().find((l) => l.id === id);
}

/** Match a stored letter by its upper or lower Coptic glyph. */
export function getLetterByGlyph(ch: string): Letter | undefined {
  return getLetters().find(
    (letter) => letter.unicode.lower === ch || letter.unicode.upper === ch,
  );
}

/** Match a letter by this project's explorer Athanasius key (upper or lower). */
export function getLetterByAthanasiusKey(key: string): Letter | undefined {
  return getLetters().find(
    (letter) =>
      letter.athanasiusKey != null &&
      (letter.athanasiusKey.upper === key || letter.athanasiusKey.lower === key),
  );
}

export function neighborsByOrder(id: string): {
  prev: Letter | null;
  next: Letter | null;
} {
  const all = lettersInOrder();
  const index = all.findIndex((l) => l.id === id);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: all[index - 1] ?? null,
    next: all[index + 1] ?? null,
  };
}

export function parseGroupId(rawId: string): GroupId | null {
  if (!/^[1-7]$/.test(rawId)) return null;
  return Number(rawId) as GroupId;
}

const COPTIC_LETTER = /[\u2C80-\u2CFF\u03E2-\u03EF]/u;
const JINKIM = "\u0300";
/** Zero-width overlay in Athanasius Plain; must precede the letter (`n → ⲛ̀). */
const ATHANASIUS_JINKIM = "`";

function athanasiusKeyForGlyph(ch: string): string | null {
  const letter = getLetterByGlyph(ch);
  if (letter?.athanasiusKey == null) return null;
  return ch === letter.unicode.upper
    ? letter.athanasiusKey.upper
    : letter.athanasiusKey.lower;
}

/**
 * Explorer keys for a Unicode Coptic string, for manuscript paint.
 * Same convention as stored `words.athanasiusKey`: jinkim is backtick
 * before the base, never combining grave after (harvest-andreas / migrate-vocab).
 * ASCII `:` in source text is punctuation — that cmap slot is capital ti.
 */
export function copticToAthanasiusKey(text: string): string | null {
  let out = "";
  let mappedAny = false;
  for (const ch of text) {
    if (ch === JINKIM) {
      if (out.length === 0) continue;
      out = `${out.slice(0, -1)}${ATHANASIUS_JINKIM}${out.slice(-1)}`;
      continue;
    }
    if (ch === ":") {
      out += "\u00B7";
      continue;
    }
    if (!COPTIC_LETTER.test(ch)) {
      out += ch;
      continue;
    }
    const key = athanasiusKeyForGlyph(ch);
    if (key) {
      mappedAny = true;
      out += key;
    } else {
      out += ch;
    }
  }
  return mappedAny ? out : null;
}
