/**
 * Fill empty PrayerLine.tokens. Does not overwrite non-empty arrays
 * (reviewed khen-efran l1, lords-prayer amen).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { buildWordIndex, resolveWordId, tokenizeCopticLine } from "../src/lib/resolve-word";
import type { Word } from "../src/data/schema";

const wordsFile = JSON.parse(
  readFileSync(new URL("../src/data/json/words.json", import.meta.url), "utf8"),
) as { words: Word[] };
const prayersPath = new URL("../src/data/json/prayers.json", import.meta.url);
const prayersFile = JSON.parse(readFileSync(prayersPath, "utf8")) as {
  schemaVersion: number;
  updated: string;
  prayers: Array<{
    id: string;
    lines: Array<{
      id: string;
      coptic: string;
      tokens: Array<{ coptic: string; wordId: string | null; gloss?: string; startSec?: number }>;
    }>;
  }>;
};

const KEEP = new Set(["khen-efran:l1", "lords-prayer:l12"]);
const index = buildWordIndex(wordsFile.words);
let filledLines = 0;
let keptLines = 0;
let tokenCount = 0;
let glossed = 0;

for (const prayer of prayersFile.prayers) {
  for (const line of prayer.lines) {
    if (KEEP.has(`${prayer.id}:${line.id}`) && line.tokens.length > 0) {
      keptLines += 1;
      tokenCount += line.tokens.length;
      glossed += line.tokens.filter((t) => t.wordId).length;
      continue;
    }
    line.tokens = tokenizeCopticLine(line.coptic).map((coptic) => {
      const wordId = resolveWordId(coptic, index);
      return { coptic, wordId };
    });
    filledLines += 1;
    tokenCount += line.tokens.length;
    glossed += line.tokens.filter((t) => t.wordId).length;
  }
}

prayersFile.updated = "2026-09-01";
writeFileSync(prayersPath, `${JSON.stringify(prayersFile, null, 2)}\n`);
console.log(
  `s13b-tokens: filled ${filledLines} empty lines, kept ${keptLines} reviewed; ${tokenCount} tokens, ${glossed} with wordId`,
);
