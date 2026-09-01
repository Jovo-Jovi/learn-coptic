/**
 * Harvest unique lemmas from the Osama Thabet northern-dialect spreadsheet
 * (Internet Archive CopticArabicDictionary, Public Domain Mark 1.0).
 *
 * Dedupes against words.json on exact Coptic, combining-stripped
 * `normalized`, and case-folded normalized. Never overwrites an existing
 * row. translit.ar stays empty so harvest cannot enter the quiz.
 * Spreadsheet ASCII ` before a letter is stored as combining grave
 * (same jinkim encoding as Andreas rows).
 *
 * Input: docs/dictionary/coptic_arabic_dictionary_dataset/output/
 *        coptic_arabic_dictionary.json
 * Does not touch letters.json or prayer tokens.
 *
 * `node scripts/harvest-thabet.mjs --dry-run` prints skip counts only.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wordsPath = join(root, "src/data/json/words.json");
const lettersPath = join(root, "src/data/json/letters.json");
const dictPath = join(
  root,
  "docs/dictionary/coptic_arabic_dictionary_dataset/output/coptic_arabic_dictionary.json",
);
const dictAlt = join(root, "docs/dictionary/coptic_arabic_dictionary.json");

const sourcePath = existsSync(dictPath) ? dictPath : dictAlt;
if (!existsSync(sourcePath)) {
  throw new Error("missing Thabet dictionary JSON under docs/dictionary/");
}

const COPTIC_RE =
  /^[\u2C80-\u2CFF\u03E2-\u03EF\u0300-\u036F.,:;·\u0374\u00B7?!]+$/u;
const AR_RE = /[\u0600-\u06FF]/;
const JINKIM = "\u0300";
const COMBINING = /[\u0300-\u036F]/gu;
const BOUND_FOR_LEMMA = new Set(["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ϯ", "ⲡ̀", "ⲧ̀", "ⲛ̀", "ⲙ̀"]);
const ARTICLE_PREFIXES = ["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ⲟⲩ", "ϯ", "ⲡ̀", "ⲧ̀", "ⲛ̀", "ⲙ̀"];

function normalizeCoptic(text) {
  return text.replace(COMBINING, "");
}
function leadingArticle(coptic) {
  const chars = [...coptic];
  if (
    chars.length >= 3 &&
    chars[1] === JINKIM &&
    (chars[0] === "ⲡ" || chars[0] === "ⲧ" || chars[0] === "ⲛ" || chars[0] === "ⲙ")
  ) {
    return `${chars[0]}${JINKIM}`;
  }
  for (const prefix of ARTICLE_PREFIXES) {
    if (coptic.startsWith(prefix) && coptic.length > prefix.length) {
      return prefix;
    }
  }
  return null;
}
function lemmaForStoredCoptic(coptic) {
  const article = leadingArticle(coptic);
  if (!article || !BOUND_FOR_LEMMA.has(article)) return coptic;
  const rest = coptic.slice(article.length);
  const letters = [...rest].filter((ch) => {
    const cp = ch.codePointAt(0);
    return cp < 0x0300 || cp > 0x036f;
  }).length;
  if (letters < 2) return coptic;
  return null;
}

const letters = JSON.parse(readFileSync(lettersPath, "utf8")).letters;
const file = JSON.parse(readFileSync(wordsPath, "utf8"));
const usedIds = new Set(file.words.map((w) => w.id));

const byGlyph = new Map();
const lowerOf = new Map();
for (const L of letters) {
  byGlyph.set(L.unicode.upper, {
    id: L.id,
    key: L.athanasiusKey.upper,
    group: L.group,
  });
  byGlyph.set(L.unicode.lower, {
    id: L.id,
    key: L.athanasiusKey.lower,
    group: L.group,
  });
  lowerOf.set(L.unicode.upper, L.unicode.lower);
  lowerOf.set(L.unicode.lower, L.unicode.lower);
}

function foldLower(text) {
  return [...text].map((ch) => lowerOf.get(ch) ?? ch).join("");
}

const existingCoptic = new Set(file.words.map((w) => w.coptic));
const existingNormalized = new Set();
const existingFolded = new Set();
for (const w of file.words) {
  const n = w.normalized ?? normalizeCoptic(w.coptic);
  existingNormalized.add(n);
  existingFolded.add(foldLower(n));
}

const KEY_SLUG = {
  "]": "shai",
  "[": "eks",
  "{": "eksu",
  "\\": "hori",
  "'": "khai",
  ",": "sou",
  "`": "jnk",
};

/** Spreadsheet jinkim is ASCII ` before the letter; store combining grave after. */
function convertBacktickJinkim(s) {
  return s.replace(/`([\u2C80-\u2CFF\u03E2-\u03EF])/gu, (_, ch) => `${ch}\u0300`);
}

function extractCoptic(headword) {
  let s = convertBacktickJinkim(String(headword).trim());
  s = s.replace(/\([^)]*\)/g, " ");
  s = s.replace(/\([^)]*$/g, " ");
  s = s.split(/\s*[=,;\/|]\s*/)[0] ?? "";
  return (s.trim().split(/\s+/)[0] ?? "").trim();
}

function copticLetterCount(s) {
  let n = 0;
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (
      (cp >= 0x2c80 && cp <= 0x2cff) ||
      (cp >= 0x3e2 && cp <= 0x3ef)
    ) {
      n++;
    }
  }
  return n;
}

function arabicClean(value) {
  let s = String(value).trim();
  s = s.replace(/[ \t\r\n]+/g, " ").trim();
  s = s.replace(/^[،,;.\s]+|[،,;.\s]+$/g, "");
  return s;
}

function joinSenses(senses) {
  const seen = new Set();
  const out = [];
  for (const sense of senses ?? []) {
    const ar = arabicClean(sense.arabic ?? "");
    if (!AR_RE.test(ar) || seen.has(ar)) continue;
    seen.add(ar);
    out.push(ar);
  }
  return out.join(" ؛ ");
}

function mapPos(senses) {
  const mapped = new Set();
  for (const sense of senses ?? []) {
    const raw = String(sense.part_of_speech ?? "");
    if (/فعل/.test(raw)) mapped.add("verb");
    else if (/ضمير/.test(raw)) mapped.add("pronoun");
    else if (/صفة|نعت/.test(raw)) mapped.add("adjective");
    else if (/جر/.test(raw)) mapped.add("preposition");
    else if (/أداة/.test(raw)) mapped.add("particle");
    else if (/اسم/.test(raw)) mapped.add("noun");
  }
  if (mapped.size === 1) return [...mapped][0];
  return null;
}

function isUpperCoptic(ch) {
  const cp = ch.codePointAt(0);
  if (cp >= 0x2c80 && cp <= 0x2cff) return cp % 2 === 0;
  if (cp >= 0x3e2 && cp <= 0x3ef) return cp % 2 === 0;
  return false;
}

function mapWord(coptic) {
  let key = "";
  const teaches = [];
  const seen = new Set();
  let maxGroup = 1;

  for (const ch of coptic) {
    if (ch === JINKIM) {
      if (!key) return null;
      key = `${key.slice(0, -1)}\`${key.slice(-1)}`;
      continue;
    }
    const hit = byGlyph.get(ch);
    if (!hit) return null;
    if (hit.id === "sou") return null;
    key += hit.key;
    if (!seen.has(hit.id)) {
      seen.add(hit.id);
      teaches.push(hit.id);
    }
    if (hit.group > maxGroup) maxGroup = hit.group;
  }
  if (teaches.length === 0 || !key) return null;
  const home = teaches.filter((id) => {
    const L = letters.find((x) => x.id === id);
    return L && L.group === maxGroup;
  });
  return { key, teaches: home.length ? home : teaches, group: maxGroup };
}

function slugFromKey(ascii) {
  let s = "";
  for (const ch of ascii) {
    if (ch === " ") {
      s += "-";
      continue;
    }
    if (/[a-z0-9]/i.test(ch)) {
      s += ch.toLowerCase();
      continue;
    }
    s += KEY_SLUG[ch] ?? "";
  }
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) {
    s = s.replace(/[^a-z0-9-]/g, "") || "word";
  }
  return s;
}

function uniqueId(base) {
  let id = `thabet-${base}`;
  let n = 2;
  while (usedIds.has(id)) {
    id = `thabet-${base}-${n}`;
    n += 1;
  }
  usedIds.add(id);
  return id;
}

const dryRun = process.argv.includes("--dry-run");
const raw = JSON.parse(readFileSync(sourcePath, "utf8"));
const entries = raw.entries;
if (!Array.isArray(entries)) throw new Error("dictionary entries is not a list");

const reasons = {};
const bump = (why) => {
  reasons[why] = (reasons[why] ?? 0) + 1;
};

const added = [];
const samples = [];
for (const entry of entries) {
  const coptic = extractCoptic(entry.headword);
  if (!coptic) {
    bump("empty");
    continue;
  }
  if (coptic.includes("-")) {
    bump("affix");
    continue;
  }
  if (!COPTIC_RE.test(coptic)) {
    bump("regex");
    continue;
  }
  const n = copticLetterCount(coptic);
  if (n < 2) {
    bump("short");
    continue;
  }
  if (n > 24) {
    bump("long");
    continue;
  }
  const meaningAr = joinSenses(entry.senses);
  if (!AR_RE.test(meaningAr)) {
    bump("no-arabic");
    continue;
  }
  if (meaningAr.includes("الحرف") && n <= 4) {
    bump("letter-name");
    continue;
  }
  const normalized = normalizeCoptic(coptic);
  const folded = foldLower(normalized);
  if (existingCoptic.has(coptic)) {
    bump("dup-coptic");
    continue;
  }
  if (existingNormalized.has(normalized)) {
    bump("dup-normalized");
    continue;
  }
  if (existingFolded.has(folded)) {
    bump("dup-folded");
    continue;
  }
  const mapped = mapWord(coptic);
  if (!mapped) {
    bump("unmap");
    continue;
  }

  const first = [...coptic].find((ch) => byGlyph.has(ch));
  const kind = first && isUpperCoptic(first) ? "name" : "lexicon";
  const pos = mapPos(entry.senses);

  const rec = {
    id: uniqueId(slugFromKey(mapped.key)),
    coptic,
    normalized,
    lemma: lemmaForStoredCoptic(coptic),
    athanasiusKey: mapped.key,
    translit: { ar: "" },
    meaning: { ar: meaningAr },
    kind,
    teaches: mapped.teaches,
    group: mapped.group,
    art: null,
    audio: null,
    published: true,
  };
  if (pos) rec.partOfSpeech = pos;

  existingCoptic.add(coptic);
  existingNormalized.add(normalized);
  existingFolded.add(folded);
  added.push(rec);
  if (samples.length < 12) {
    samples.push({ coptic, ar: meaningAr.slice(0, 80), id: rec.id });
  }
}

console.log("source", sourcePath.replace(root + "\\", "").replace(root + "/", ""));
console.log("entries", entries.length);
console.log("new unique", added.length);
console.log("skipped", reasons);
console.log("samples", samples);
if (dryRun) {
  console.log("dry-run: words.json unchanged");
  process.exit(0);
}

file.words.push(...added);
file.updated = "2026-09-02";
file.provenance = `${file.provenance} Plus ${added.length} unique lemmas from Osama Thabet northern-dialect Unicode spreadsheet (Internet Archive CopticArabicDictionary, Public Domain Mark 1.0). Exact / normalized / case-folded duplicates of existing rows were skipped.`;

writeFileSync(wordsPath, `${JSON.stringify(file, null, 2)}\n`);
const byKind = { lexicon: 0, name: 0, drill: 0 };
for (const w of file.words) byKind[w.kind] += 1;
console.log("harvested", added.length, "Thabet rows");
console.log("file totals", { words: file.words.length, ...byKind });
