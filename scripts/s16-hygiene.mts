/**
 * One-shot S16. Adds `normalized` + `lemma` to every words.json row.
 * Does not invent stems. Re-running is idempotent.
 *
 * Lemma = stored coptic when the row is already a headword (Andreas /
 * teaching stems). Null when a bound article is glued on (CDO: lemmas,
 * not inflected forms — W18-4502).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { lemmaForStoredCoptic, normalizeCoptic } from "../src/lib/coptic-text";

const path = new URL("../src/data/json/words.json", import.meta.url);
const file = JSON.parse(readFileSync(path, "utf8")) as {
  schemaVersion: number;
  updated: string;
  provenance: string;
  words: Array<Record<string, unknown> & { id: string; coptic: string }>;
};

file.updated = "2026-09-01";
file.words = file.words.map((word) => {
  const { id, coptic, normalized: _n, lemma: _l, ...rest } = word;
  return {
    id,
    coptic,
    normalized: normalizeCoptic(coptic),
    lemma: lemmaForStoredCoptic(coptic),
    ...rest,
  };
});

writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`);
const withLemma = file.words.filter((w) => w.lemma != null).length;
const nullLemma = file.words.length - withLemma;
console.log(
  `s16-hygiene: ${file.words.length} words, lemma set ${withLemma}, lemma null ${nullLemma}`,
);
