/**
 * Writes docs/gaps.md. Does not edit src/data/json/.
 * Refresh: npx tsx scripts/report-gaps.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrayersFile, WordsFile, GrammarFile } from "../src/data/schema/index.js";
import { buildGlossMaps } from "../src/lib/coptic-parse";
import { isTeachingSet } from "../src/lib/coptic-text";
import { tokenParseCaption } from "../src/lib/prayer-line-highlight";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f: string) =>
  JSON.parse(readFileSync(join(root, "src/data/json", f), "utf8"));

const W = WordsFile.parse(read("words.json")).words;
const P = PrayersFile.parse(read("prayers.json")).prayers;
const G = GrammarFile.parse(read("grammar-rules.json"));
const maps = buildGlossMaps(W);
const byId = new Map(W.map((w) => [w.id, w]));

const gaps: { prayerId: string; lineId: string; coptic: string }[] = [];
let tokenCount = 0;
let captionCount = 0;

for (const prayer of P) {
  for (const line of prayer.lines) {
    for (const token of line.tokens) {
      tokenCount += 1;
      const word = token.wordId ? byId.get(token.wordId) : undefined;
      const caption = tokenParseCaption(token.coptic, maps, {
        gloss: token.gloss,
        dictionaryAr: word?.meaning?.ar,
      });
      if (caption) {
        captionCount += 1;
        continue;
      }
      gaps.push({ prayerId: prayer.id, lineId: line.id, coptic: token.coptic });
    }
  }
}

const unique = new Map<string, { n: number; prayers: Set<string> }>();
for (const g of gaps) {
  const cur = unique.get(g.coptic) ?? { n: 0, prayers: new Set<string>() };
  cur.n += 1;
  cur.prayers.add(g.prayerId);
  unique.set(g.coptic, cur);
}

const uniqueGaps = [...unique.entries()].sort(
  (a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0], "en"),
);

const published = W.filter((w) => w.published);
const noAr = published.filter((w) => !w.meaning?.ar);
const drillsNull = noAr.filter((w) => w.kind === "drill");
const otherNull = noAr.filter((w) => w.kind !== "drill");
const parseReady = G.affixes.filter((a) => a.parseReady);
const parseBlocked = G.affixes.filter((a) => !a.parseReady);

const tokenRows = uniqueGaps
  .map(
    ([coptic, v]) =>
      `| ${v.n} | ${[...v.prayers].sort().join(", ")} | ${coptic} |`,
  )
  .join("\n");

const affixRows = parseBlocked
  .map((a) => `| \`${a.id}\` | ${a.form} | ${a.kind} |`)
  .join("\n");

const md = `# Gaps — dictionary merge and unmarked prayers

Recorded 2026-09-01. Refresh the tables with
\`npx tsx scripts/report-gaps.mts\` (does not touch \`src/data/json/\`).

A gap here is a Coptic form the site cannot honestly gloss today. Leave it
blank in the UI until a human sources Arabic or approves a parse peel.

---

## GitHub dictionaries — merge or not

Dumpable Coptic–Arabic lexicons in \`words.json\`: remnqymi Andreas
(**CC BY-SA 4.0**) and unique Osama Thabet northern-dialect lemmas
(Internet Archive **Public Domain Mark 1.0**). Do not merge KELLIA English
into \`meaning.ar\`.

| Repo / file | Arabic? | Licence | Merge? |
|---|---|---|---|
| [pishoyg/coptic](https://github.com/pishoyg/coptic) \`dictionary/stmacariusmonastery_org/data/output/andreas.json\` | Yes | **CC BY-SA 4.0** | **In** \`words.json\` (2–8 then 9–17 letters). Remaining skips: affix hyphen, no Arabic, regex, letter names, unmapped glyphs. |
| [IA CopticArabicDictionary](https://archive.org/details/CopticArabicDictionary) Osama Thabet xlsx | Yes | **PDM 1.0** (uploader mark) | **In** unique lemmas only (\`node scripts/harvest-thabet.mjs\`). Exact / normalized / case-folded duplicates skipped. Notepad Greek-mapped file and bundled Andreas PDFs not ingested. |
| [KELLIA/dictionary](https://github.com/KELLIA/dictionary) (CDO / Comprehensive Coptic Lexicon TEI) | No (EN / FR / DE) | CC BY-SA 4.0 | **No** into \`meaning.ar\`. Do not machine-translate. Optional later: store English as \`meaning.en\` only if a human asks. |
| [louiseyousre2020/coptic-words](https://github.com/louiseyousre2020/coptic-words) | No | Derived from KELLIA | **No** — Bohairic wordlist, not Arabic glosses. |
| [KyroHub/CopticCompass](https://github.com/KyroHub/CopticCompass) | No (EN / NL / Greek) | Code MIT; **content rights reserved** | **No** Arabic merge. |
| [UBC-NLP/copticmt](https://github.com/UBC-NLP/copticmt) CoPARA | Parallel sentences, not lemmas | Research corpus | **No** as a dictionary. Do not split sentences into invented headwords. |
| [CopticScriptorium/corpora](https://github.com/CopticScriptorium/corpora) | Running text | Mostly CC-BY / CC-BY-SA | **No** as a dictionary. Useful later for example lines, not glosses. |
| [iDevMartin/copticlingo](https://github.com/iDevMartin/copticlingo) \`copticsite.json\` (mentioned in their notes) | Coptic–Arabic claimed | **Unlicensed** README; likely a scrape of a church site | **No** without a named grant. Treat like Tasbeha / Reader. |

Not on GitHub as structured data: Dawoud (scans / 197MB PDF), Claudius Labib (scans), Naqlun CopDic (app). See \`docs/sources.md\`.

**Why another lemma dump still would not close most of the prayer table:**
those forms are mostly conjugated / optative / fused (ⲙⲁⲣⲉ-, ⲁϥ-, ⲉⲕⲉ̀-),
not missing headwords. Long leftovers filled a few exact liturgical lemmas
(e.g. ϣⲟⲩϣⲱⲟⲩϣⲓ) only.

---

## Snapshot

| Measure | Count |
|---|---|
| Prayer tokens | ${tokenCount} |
| Tokens with a stored / parse caption | ${captionCount} |
| Tokens with **no** caption (occurrences) | ${gaps.length} |
| Unique unmarked Coptic forms | ${unique.size} |
| Published words | ${published.length} |
| Teaching set | ${published.filter(isTeachingSet).length} |
| Published rows with \`meaning.ar\` null | ${noAr.length} (all ${drillsNull.length} drills; other: ${otherNull.map((w) => w.id).join(", ") || "none"}) |
| Grammar affixes \`parseReady\` | ${parseReady.length} |
| Grammar affixes still blocked | ${parseBlocked.length} |

---

## Later actions

1. **Andreas leftovers (9–17)** — done 2026-09-01. Same CC BY-SA dump.
2. **Thabet unique lemmas** — done 2026-09-02. Duplicates skipped.
3. **Do not** merge KELLIA / Compass / coptic-words / copticlingo / copticmt
   into \`meaning.ar\`.
4. **Prayer tokens below** — human \`gloss\` / \`arHighlight\` on the line,
   or more \`parseReady\` affixes after S17 GATE **PASS** (optative ⲙⲁⲣⲉ-,
   past ⲁ- + subject, ⲛ̀ϫⲉ, object ⲙ̀ⲙⲟ-, ⲉϫⲉⲛ / ⲉϫⲱ-). Never invent Arabic.
5. **Grant track** — Dawoud, Naqlun, or copticsite.json only if the owner
   names the source in writing.

---

## Unmarked prayer forms

Unique Coptic surfaces with no dictionary hit and no parse caption.
Count is how often the form appears across the four prayers.

| n | prayers | coptic |
|---|---|---|
${tokenRows}

---

## Affixes not parseReady yet

Short colliding forms stay false on purpose (S17 test). Do not bulk-flip.

| id | form | kind |
|---|---|---|
${affixRows}
`;

writeFileSync(join(root, "docs/gaps.md"), md, "utf8");
console.log(
  `wrote docs/gaps.md — ${unique.size} unique unmarked forms, ${gaps.length} occurrences`,
);
