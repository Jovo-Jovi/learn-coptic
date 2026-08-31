/**
 * ONE-SHOT S2. Run once, then stop. Re-running overwrites hand edits in words.json.
 *
 * Reads legacy/coptic_vocabulary.html via the extract object parser (re-run extract
 * first if .extract/raw-arrays.json is empty), converts Athanasuis keystrokes with
 * letters.json, writes src/data/json/words.json and .extract/s2-report.md.
 *
 * Athanasuis backtick precedes the letter it marks (`m → ⲙ). Unicode combining
 * grave U+0300 follows the base (ⲙ + U+0300). Never mark-then-base. Same sequence
 * as prayers.json ⲙ̀ⲫⲓⲱⲧ. It is not a 33rd letter.
 *
 * Provenance: 145 rows from the HTML. efran and efiot are not in that HTML; they
 * were kept from the scaffold sample in prayers.json (keyWords of khen-efran).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
spawnSync("node", [
  "scripts/extract-from-html.mjs",
  "./legacy/interactive_coptic_explorer_ascii.html",
  "./legacy/coptic_vocabulary.html",
], {
  cwd: root,
  stdio: "inherit",
});

const letters = JSON.parse(readFileSync(new URL("../src/data/json/letters.json", import.meta.url), "utf8")).letters;
const prevWords = JSON.parse(readFileSync(new URL("../src/data/json/words.json", import.meta.url), "utf8")).words;
const raw = JSON.parse(readFileSync(new URL("../.extract/raw-arrays.json", import.meta.url), "utf8"));
const vocabulary = raw.vocabulary;
if (!vocabulary || typeof vocabulary !== "object") {
  throw new Error("extract did not produce vocabulary — open .extract/raw-arrays.json");
}

const JINKIM = "\u0300"; // after the base letter, as in prayers.json ⲙ̀ⲫⲓⲱⲧ

const PROVENANCE =
  "145 rows from legacy/coptic_vocabulary.html. efran and efiot are not in that HTML; they were kept from the scaffold sample in prayers.json (keyWords of khen-efran) so the sample prayer still resolves.";

/** Athanasuis keystroke → { glyph, letterId, case } */
const byStroke = new Map();
for (const L of letters) {
  if (!L.athanasiusKey) continue;
  byStroke.set(L.athanasiusKey.upper, { glyph: L.unicode.upper, id: L.id });
  byStroke.set(L.athanasiusKey.lower, { glyph: L.unicode.lower, id: L.id });
  for (const a of L.athanasiusAliases ?? []) {
    byStroke.set(a, { glyph: L.unicode.lower, id: L.id });
  }
}

const GROUP_NUM = {
  group1: 1, group2: 2, group3: 3, group4: 4,
  group5b: 5, group5d: 5, group5q: 5, group5j: 5,
  group6: 6, group7u: 7, group7g: 7, group7x: 7,
};

/**
 * Drill: modern-name reading set (group 2 + dina) and the group-1 ⲟ+ⲛ+ⲧ/ⲕ
 * rhyme set (HTML arabic === pronunciation; they sit after tot/kot/on).
 * rashaihd (رشيد) is a place name, not a drill.
 */
const DRILL = new Set([
  "zaki", "mona", "iman", "zaki nem iman", "dina",
  "tonk", "ton", "zont", "kont", "not", "kotk",
]);

/** Reading drills with no dictionary gloss — Arabic is pronunciation only. */
const DRILL_NO_MEANING = new Set([
  "tonk", "ton", "zont", "kont", "not", "kotk",
]);

/**
 * papa (البابا) and pixrictoc (المسيح) are lexicon, not name.
 * golgoqa stays name. ra]hd (رشيد) is a place name.
 */
const NAME = new Set([
  "antwn", "mhna", "apakir", "pa]onc", "Aqanacioc", "Matqeoc",
  "adam", "Ma[imoc", "yaria", "ludia", "eua", "dauid", "kurilloc",
  "golgoqa", "ra]hd",
]);

/** Human S2 review: HTML 'ب-في' is two prepositional senses, not a broken string. */
const MEANING_OVERRIDE = {
  "'en": "في / بـ",
};

function codepoints(s) {
  return [...s]
    .map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"))
    .join(" ");
}

function assertJinkimAfterBase(coptic, ascii) {
  const cps = [...coptic];
  for (let i = 0; i < cps.length; i++) {
    if (cps[i] !== JINKIM) continue;
    if (i === 0 || cps[i - 1] === " " || cps[i - 1] === JINKIM) {
      throw new Error(`jinkim not after a base letter in ${JSON.stringify(ascii)}: ${codepoints(coptic)}`);
    }
  }
}

function convertAscii(ascii) {
  const unknown = [];
  let coptic = "";
  const teaches = [];
  const seen = new Set();
  let pendingJinkim = false;

  const pushLetter = (glyph, id) => {
    coptic += glyph;
    if (pendingJinkim) {
      coptic += JINKIM;
      pendingJinkim = false;
    }
    if (id && !seen.has(id)) {
      seen.add(id);
      teaches.push(id);
    }
  };

  for (const ch of ascii) {
    if (ch === "`") {
      pendingJinkim = true;
      continue;
    }
    if (ch === " ") {
      coptic += " ";
      continue;
    }
    const hit = byStroke.get(ch);
    if (!hit) {
      unknown.push(ch);
      continue;
    }
    pushLetter(hit.glyph, hit.id);
  }
  if (pendingJinkim) unknown.push("` (trailing jinkim)");
  assertJinkimAfterBase(coptic, ascii);
  return { coptic, teaches, unknown };
}

function slugFromAscii(ascii) {
  let s = "";
  for (const ch of ascii) {
    if (ch === " ") {
      s += "-";
      continue;
    }
    if (ch === "`") {
      s += "jnk";
      continue;
    }
    if (/[a-z0-9]/i.test(ch)) {
      s += ch.toLowerCase();
      continue;
    }
    const hit = byStroke.get(ch);
    s += hit ? hit.id : "x";
  }
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) {
    s = s.replace(/[^a-z0-9-]/g, "") || "word";
  }
  return s;
}

const KEEP_ID = {
  anok: "anok",
  ran: "ran",
  zaki: "zaki",
  tonk: "tonk",
  xhmi: "khimi",
  "'en": "khen",
};

const unfinished = [];
const unknownChars = [];
const usedIds = new Set();
const words = [];
const jinkimSamples = [];

for (const [bucket, rows] of Object.entries(vocabulary)) {
  const group = GROUP_NUM[bucket];
  if (group == null) throw new Error(`unmapped bucket ${bucket}`);
  for (const row of rows) {
    const ascii = String(row.coptic);
    const arabic = String(row.arabic ?? "").trim();
    const pronunciation = String(row.pronunciation ?? "").trim();
    const { coptic, teaches, unknown } = convertAscii(ascii);
    if (unknown.length) unknownChars.push({ ascii, unknown, arabic });
    if (ascii.includes("`")) {
      jinkimSamples.push({ ascii, coptic, cps: codepoints(coptic) });
    }

    let kind = "lexicon";
    if (DRILL.has(ascii)) kind = "drill";
    else if (NAME.has(ascii)) kind = "name";

    const meaningAr = MEANING_OVERRIDE[ascii] ?? (arabic || null);
    const meaning = DRILL_NO_MEANING.has(ascii)
      ? null
      : meaningAr
        ? { ar: meaningAr }
        : { ar: "—" };

    let published = true;
    let unpublishedReason = null;
    if (!DRILL_NO_MEANING.has(ascii) && !arabic && !MEANING_OVERRIDE[ascii]) {
      published = false;
      unpublishedReason = "empty gloss";
    }

    let id = KEEP_ID[ascii] ?? slugFromAscii(ascii);
    if (usedIds.has(id)) {
      let n = 2;
      while (usedIds.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    usedIds.add(id);

    const prev = prevWords.find((w) => w.id === id);
    const rec = {
      id,
      coptic,
      athanasiusKey: ascii,
      translit: { ar: pronunciation || arabic },
      meaning,
      kind,
      teaches,
      group,
      art: prev?.art ?? null,
      audio: null,
      published,
    };
    if (!published) unfinished.push({ id, ascii, coptic, arabic, pronunciation, reason: unpublishedReason });
    words.push(rec);
  }
}

// Prayer keyWords not present as HTML rows (efran, efiot). khen is 'en in the HTML.
for (const extraId of ["efran", "efiot"]) {
  const prev = prevWords.find((w) => w.id === extraId);
  if (!prev) throw new Error(`seed word ${extraId} missing and not in HTML`);
  if (!usedIds.has(extraId)) {
    words.push({
      id: prev.id,
      coptic: prev.coptic,
      athanasiusKey: prev.athanasiusKey,
      translit: prev.translit,
      meaning: { ar: prev.meaning.ar },
      kind: prev.kind,
      teaches: prev.teaches,
      group: prev.group,
      partOfSpeech: prev.partOfSpeech,
      art: prev.art ?? null,
      audio: null,
      published: prev.published,
    });
    usedIds.add(extraId);
  }
}

const out = {
  schemaVersion: 1,
  updated: new Date().toISOString().slice(0, 10),
  provenance: PROVENANCE,
  words,
};
writeFileSync(new URL("../src/data/json/words.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");

const byKind = { lexicon: 0, drill: 0, name: 0 };
for (const w of words) byKind[w.kind]++;
const fromHtml = words.length - 2;
const nullMeaning = words.filter((w) => w.meaning == null);
const mmon = jinkimSamples.find((s) => s.ascii === "`mmon");
const prayerMfiot = JSON.parse(
  readFileSync(new URL("../src/data/json/prayers.json", import.meta.url), "utf8"),
).prayers[0].lines[0].coptic;
const report = [
  `# S2 vocabulary report`,
  ``,
  `- HTML array rows: **${fromHtml}**`,
  `- Page \`<div class="stats">\` advertised: 9+12+13+22+28+20+27 = **131**`,
  `- words.json written: **${words.length}**`,
  `- provenance: ${PROVENANCE}`,
  `- kind: lexicon ${byKind.lexicon}, drill ${byKind.drill}, name ${byKind.name}`,
  `- published: false: **${unfinished.length}**`,
  `- meaning null (rhyming drills): ${nullMeaning.map((w) => w.id).join(", ") || "(none)"}`,
  `- unknown keystrokes: **${unknownChars.length}**`,
  `- jinkim order: base then U+0300 (Athanasuis \\\` precedes the letter)`,
  mmon ? `- \`mmon → ${mmon.coptic} (${mmon.cps})` : `- \`mmon not found`,
  `- prayers.json l1: ${prayerMfiot} (${codepoints(prayerMfiot)})`,
  ``,
  `## Unpublished`,
  unfinished.length
    ? unfinished.map((u) => `- \`${u.id}\` ascii=\`${u.ascii}\` coptic=${u.coptic} ar=${u.arabic} (${u.reason})`).join("\n")
    : "(none)",
  ``,
  `## Unknown keystrokes`,
  unknownChars.length ? unknownChars.map((u) => `- \`${u.ascii}\` chars=${JSON.stringify(u.unknown)}`).join("\n") : "(none)",
  ``,
].join("\n");

mkdirSync(new URL("../.extract/", import.meta.url), { recursive: true });
writeFileSync(new URL("../.extract/s2-report.md", import.meta.url), report);
console.log(report);
