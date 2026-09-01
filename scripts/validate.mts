/**
 * Runs on every build (`prebuild`) and in CI.
 * Schema errors OR broken cross-references => exit 1 => nothing deploys.
 * This is what permanently ends the "three sources disagree" problem.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { LettersFile, WordsFile, PrayersFile, CurriculumFile } from "../src/data/schema/index.js";
import { copticToAthanasiusKey } from "../src/lib/letters";
import { getSearchRecords } from "../src/lib/search";

const read = (f: string) => JSON.parse(readFileSync(new URL(`../src/data/json/${f}`, import.meta.url), "utf8"));

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

// ---- 1. Shape -------------------------------------------------------
const letters = LettersFile.safeParse(read("letters.json"));
const words = WordsFile.safeParse(read("words.json"));
const prayers = PrayersFile.safeParse(read("prayers.json"));
const curriculum = CurriculumFile.safeParse(read("curriculum.json"));

for (const [name, r] of [["letters", letters], ["words", words], ["prayers", prayers], ["curriculum", curriculum]] as const) {
  if (!r.success) r.error.issues.forEach((i) => fail(`${name}.json ${i.path.join(".")}: ${i.message}`));
}
if (errors.length) { errors.forEach((e) => console.error("✗", e)); process.exit(1); }

const L = letters.data!.letters, W = words.data!.words, P = prayers.data!.prayers, C = curriculum.data!.levels;
const letterIds = new Set(L.map((x) => x.id));
const wordIds = new Set(W.map((x) => x.id));
const prayerIds = new Set(P.map((x) => x.id));

// ---- 2. Letter invariants -------------------------------------------
if (new Set(L.map((x) => x.order)).size !== 32) fail("letter `order` values are not 1..32 unique");
for (const g of [1, 2, 3, 4, 5, 6, 7]) if (!L.some((x) => x.group === g)) fail(`group ${g} is empty`);
const dupKeys = new Map<string, string[]>();
L.forEach((x) => {
  const claimed = new Set<string>();
  if (x.athanasiusKey) {
    claimed.add(x.athanasiusKey.upper);
    claimed.add(x.athanasiusKey.lower);
  }
  for (const a of x.athanasiusAliases) claimed.add(a);
  for (const k of claimed) dupKeys.set(k, [...(dupKeys.get(k) ?? []), x.id]);
});
dupKeys.forEach((ids, k) => {
  if (ids.length > 1) fail(`Athanasius key ${JSON.stringify(k)} claimed by ${ids.join(" and ")}`);
});

// ---- 3. Cross-references --------------------------------------------
L.forEach((l) => l.exampleWords.forEach((w) => { if (!wordIds.has(w)) fail(`letter ${l.id} → unknown word ${w}`); }));
W.forEach((w) => {
  w.teaches.forEach((t) => { if (!letterIds.has(t)) fail(`word ${w.id} → unknown letter ${t}`); });
  if ((w.kind === "lexicon" || w.kind === "name") && w.meaning == null) {
    fail(`${w.kind} ${w.id} must have a meaning`);
  }
  const cps = [...w.coptic];
  for (let i = 0; i < cps.length; i++) {
    if (cps[i] === "\u0300" && (i === 0 || cps[i - 1] === " " || cps[i - 1] === "\u0300")) {
      fail(`word ${w.id} jinkim is not after a base letter`);
    }
  }
});
P.forEach((p) => {
  p.keyWords.forEach((w) => { if (!wordIds.has(w)) fail(`prayer ${p.id} → unknown word ${w}`); });
  p.lines.forEach((ln) => ln.tokens.forEach((t) => {
    if (t.wordId && !wordIds.has(t.wordId)) fail(`prayer ${p.id}/${ln.id} → unknown word ${t.wordId}`);
  }));
  // audio timings must be ordered and inside the recording
  let prev = 0;
  p.lines.forEach((ln) => {
    if (ln.startSec === undefined) return;
    if (ln.startSec < prev) fail(`prayer ${p.id}/${ln.id} startSec goes backwards`);
    if (ln.endSec !== undefined && ln.endSec < ln.startSec) fail(`prayer ${p.id}/${ln.id} ends before it starts`);
    const dur = p.audio?.full.durationSec;
    if (dur && (ln.endSec ?? 0) > dur) fail(`prayer ${p.id}/${ln.id} runs past the recording`);
    prev = ln.startSec;
  });
  p.lines.forEach((ln) => {
    const mapped = copticToAthanasiusKey(ln.coptic);
    if (mapped?.includes("\u0300")) {
      fail(`prayer ${p.id}/${ln.id} manuscript keys still contain combining jinkim`);
    }
    if (ln.coptic.includes("\u0300") && mapped && !mapped.includes("`")) {
      fail(`prayer ${p.id}/${ln.id} has Unicode jinkim but no Athanasius backtick`);
    }
  });
});

// ---- 4. Curriculum ---------------------------------------------------
const lessonIds = new Set(C.flatMap((lv) => lv.lessons.map((x) => x.id)));
C.forEach((lv) => lv.lessons.forEach((ls) => {
  ls.refs.letters.forEach((x) => { if (!letterIds.has(x)) fail(`lesson ${ls.id} → unknown letter ${x}`); });
  ls.refs.words.forEach((x) => { if (!wordIds.has(x)) fail(`lesson ${ls.id} → unknown word ${x}`); });
  ls.refs.prayers.forEach((x) => { if (!prayerIds.has(x)) fail(`lesson ${ls.id} → unknown prayer ${x}`); });
  ls.requires.forEach((x) => { if (!lessonIds.has(x)) fail(`lesson ${ls.id} requires missing lesson ${x}`); });
  if (ls.kind === "grammar" && !ls.body) fail(`grammar lesson ${ls.id} has no MDX body`);
}));
// every published letter-lesson must cover letters that exist exactly once overall
const covered = C.flatMap((lv) => lv.lessons).filter((l) => l.kind === "letters").flatMap((l) => l.refs.letters);
if (new Set(covered).size !== covered.length) fail("a letter appears in two different letter-lessons");
if (covered.length && new Set(covered).size !== 32) fail(`letter lessons cover ${new Set(covered).size}/32 letters`);

// ---- Report ----------------------------------------------------------
if (errors.length) { errors.forEach((e) => console.error("✗", e)); process.exit(1); }

const todo = [
  `${L.filter((x) => !x.athanasiusKey).length} letters missing legacy key`,
  `${L.filter((x) => !x.audio).length}/32 letters missing audio`,
  `${W.filter((x) => !x.audio).length}/${W.length} words missing audio`,
  `${W.filter((x) => !x.art).length}/${W.length} words missing artwork`,
  `${W.filter((x) => !x.published).length} words unpublished (incomplete gloss)`,
];
console.log(`✓ data valid — ${L.length} letters, ${W.length} words, ${P.length} prayers, ${C.length} levels`);
todo.forEach((t) => console.log(`  · ${t}`));

const searchRecords = getSearchRecords();
mkdirSync(new URL("../src/data/generated", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../src/data/generated/search-records.json", import.meta.url),
  `${JSON.stringify(searchRecords)}\n`,
);
console.log(`  · search index ${searchRecords.length} records`);
