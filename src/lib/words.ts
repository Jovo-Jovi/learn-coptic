import { cache } from "react";
import { WordsFile, type GroupId, type Word } from "@/data/schema";
import raw from "@/data/json/words.json";
import { getLetterById } from "@/lib/letters";

export const getWords = cache((): Word[] => WordsFile.parse(raw).words);

export function publishedWords(): Word[] {
  return getWords().filter((word) => word.published);
}

export function wordsInGroup(group: GroupId): Word[] {
  return publishedWords().filter((word) => word.group === group);
}

export function wordsTeaching(letterId: string): Word[] {
  return publishedWords().filter((word) => word.teaches.includes(letterId));
}

const KIND_RANK: Record<Word["kind"], number> = {
  lexicon: 0,
  name: 1,
  drill: 2,
};

export function exampleWordsForLetter(
  letterId: string,
  cap = 6,
): { shown: Word[]; total: number } {
  const all = wordsTeaching(letterId)
    .slice()
    .sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind]);
  return { shown: all.slice(0, cap), total: all.length };
}

const POS_AR: Record<NonNullable<Word["partOfSpeech"]>, string> = {
  noun: "اسم",
  verb: "فعل",
  pronoun: "ضمير",
  adjective: "صفة",
  preposition: "حرف جر",
  particle: "أداة",
  phrase: "عبارة",
  other: "أخرى",
};

export type TaughtLetterChip = {
  id: string;
  glyph: string;
  mapped: string | null;
  nameAr: string;
  group: GroupId;
};

export type WordCardModel = {
  id: string;
  coptic: string;
  mapped: string | null;
  translitAr: string;
  meaningAr: string | null;
  kind: Word["kind"];
  partOfSpeechAr: string | null;
  group: GroupId | null;
  letters: TaughtLetterChip[];
};

export function toWordCardModel(word: Word): WordCardModel {
  const letters: TaughtLetterChip[] = [];
  for (const id of word.teaches) {
    const letter = getLetterById(id);
    if (!letter) continue;
    letters.push({
      id: letter.id,
      glyph: letter.unicode.lower,
      mapped: letter.athanasiusKey?.lower ?? null,
      nameAr: letter.name.ar,
      group: letter.group,
    });
  }
  return {
    id: word.id,
    coptic: word.coptic,
    mapped: word.athanasiusKey,
    translitAr: word.translit.ar,
    meaningAr: word.meaning?.ar ?? null,
    kind: word.kind,
    partOfSpeechAr: word.partOfSpeech ? POS_AR[word.partOfSpeech] : null,
    group: word.group,
    letters,
  };
}

export function countByKind(
  words: { kind: Word["kind"] }[],
): Record<Word["kind"], number> {
  return {
    lexicon: words.filter((w) => w.kind === "lexicon").length,
    drill: words.filter((w) => w.kind === "drill").length,
    name: words.filter((w) => w.kind === "name").length,
  };
}
