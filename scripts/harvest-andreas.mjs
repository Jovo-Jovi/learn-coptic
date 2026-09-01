/**
 * One-shot harvest: Andreas Coptic–Arabic dictionary (remnqymi CC BY-SA 4.0).
 * Appends learner-length lemmas to words.json. Does not invent glosses or
 * pronunciation — translit.ar is left empty when the source has none.
 *
 * Input: .tmp/andreas.json (or ./andreas.json).
 * Does not touch letters.json.
 *
 * `node scripts/harvest-andreas.mjs --leftovers` appends the 9–17 letter
 * rows skipped by the first 2–8 harvest. Same filters otherwise.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = join(root, ".tmp");
const tmpPath = join(tmpDir, "andreas.json");
const rootPath = join(root, "andreas.json");
const wordsPath = join(root, "src/data/json/words.json");
const lettersPath = join(root, "src/data/json/letters.json");

if (existsSync(rootPath) && !existsSync(tmpPath)) {
  mkdirSync(tmpDir, { recursive: true });
  copyFileSync(rootPath, tmpPath);
}

const andreasPath = existsSync(tmpPath) ? tmpPath : rootPath;
if (!existsSync(andreasPath)) {
  throw new Error("missing Andreas JSON — expected .tmp/andreas.json");
}

const COPTIC_RE =
  /^[\u2C80-\u2CFF\u03E2-\u03EF\u0300-\u036F.,:;·\u0374\u00B7?!]+$/u;
const AR_RE = /[\u0600-\u06FF]/;
const JINKIM = "\u0300";
const COMBINING = /[\u0300-\u036F]/gu;
const BOUND_FOR_LEMMA = new Set(["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ϯ", "ⲡ̀", "ⲧ̀", "ⲛ̀", "ⲙ̀"]);
const ARTICLE_PREFIXES = ["ϩⲁⲛ", "ⲡⲓ", "ⲛⲓ", "ⲟⲩ", "ϯ", "ⲡ̀", "ⲧ̀", "ⲛ̀", "ⲙ̀"];

/** Keep in sync with src/lib/coptic-text.ts */
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
const existingCoptic = new Set(file.words.map((w) => w.coptic));
const usedIds = new Set(file.words.map((w) => w.id));

const byGlyph = new Map();
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

function plain(row, side) {
  try {
    return String(row[side][0][0][1] ?? "");
  } catch {
    return "";
  }
}

function extractCoptic(front) {
  let s = String(front).trim();
  s = s.replace(/\([^)]*\)/g, " ");
  s = s.replace(/\([^)]*$/g, " ");
  s = s.split(/\s*[=,;]\s*/)[0] ?? "";
  const token = s.trim().split(/\s+/)[0] ?? "";
  return token.trim();
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

function arabicClean(back) {
  let s = String(back).trim();
  s = s.replace(/^[^\u0600-\u06FF]+/, "").trim();
  s = s.replace(/[ \t\r\n]+/g, " ").trim();
  s = s.replace(/^[،,;.\s]+|[،,;.\s]+$/g, "");
  return s;
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
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  usedIds.add(id);
  return id;
}

const leftoverPass = process.argv.includes("--leftovers");

const raw = JSON.parse(readFileSync(andreasPath, "utf8"));
const rows = raw.data;
if (!Array.isArray(rows)) throw new Error("andreas.json data is not a list");

const reasons = {};
const bump = (why) => {
  reasons[why] = (reasons[why] ?? 0) + 1;
};

const added = [];
for (const row of rows) {
  const coptic = extractCoptic(plain(row, "FRONT"));
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
  if (leftoverPass) {
    if (n < 9 || n > 17) {
      bump("not-leftover-length");
      continue;
    }
  } else {
    if (n < 2) {
      bump("short");
      continue;
    }
    if (n > 8) {
      bump("long");
      continue;
    }
  }
  const meaningAr = arabicClean(plain(row, "BACK"));
  if (!AR_RE.test(meaningAr)) {
    bump("no-arabic");
    continue;
  }
  if (meaningAr.includes("الحرف") && n <= 4) {
    bump("letter-name");
    continue;
  }
  if (existingCoptic.has(coptic)) {
    bump("dup");
    continue;
  }
  const mapped = mapWord(coptic);
  if (!mapped) {
    bump("unmap");
    continue;
  }

  const first = [...coptic].find((ch) => byGlyph.has(ch));
  const kind = first && isUpperCoptic(first) ? "name" : "lexicon";

  const rec = {
    id: uniqueId(slugFromKey(mapped.key)),
    coptic,
    normalized: normalizeCoptic(coptic),
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
  existingCoptic.add(coptic);
  added.push(rec);
}

file.words.push(...added);
file.updated = "2026-09-01";
if (leftoverPass) {
  file.provenance = `${file.provenance} Plus ${added.length} leftover lemmas (9–17 letters) from the same dump.`;
} else {
  file.provenance =
    "145 rows from legacy/coptic_vocabulary.html. efran and efiot from prayers.json keyWords. " +
    `${added.length} lemmas from Andreas (St Macarius) via remnqymi andreas.json, CC BY-SA 4.0. ` +
    "Arabic gloss copied; translit left empty (source has none).";
}

writeFileSync(wordsPath, `${JSON.stringify(file, null, 2)}\n`);
console.log(`harvested ${added.length} Andreas rows`);
console.log("skipped", reasons);
const byKind = { lexicon: 0, name: 0, drill: 0 };
for (const w of file.words) byKind[w.kind] += 1;
console.log("file totals", {
  words: file.words.length,
  ...byKind,
});
