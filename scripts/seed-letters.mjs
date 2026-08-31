/**
 * ONE-TIME SEED. Run once, then edit src/data/json/letters.json by hand.
 *
 * Builds the canonical 32-letter Bohairic table in real Unicode.
 * Coptic block = U+2C80–2CFF; the seven Demotic-derived letters
 * (shai, fai, khai, hori, janja, cheema, ti) live at U+03E2–03EF.
 *
 * `athanasiusKey: null` means "the three old sources disagree on this key".
 * scripts/extract-from-html.mjs fills those in from your live explorer.
 */
import { writeFileSync, mkdirSync } from "node:fs";

// id, order, Upper, lower, athUpper|null, athLower|null, nameCoptic, nameAr, nameLatin, group, ipa[], arHint[], numeric|null
const T = [
  ["alpha",   1, "Ⲁ","ⲁ", "A","a", "Ⲁⲗⲫⲁ",     "ألفا",     "Alpha",   2, ["a"],            ["ا"],        1],
  ["vida",    2, "Ⲃ","ⲃ", "B","b", "Ⲃⲏⲧⲁ",      "ڤيدا",     "Vida",    5, ["v","b"],        ["ڤ","ب"],    2],
  ["gamma",   3, "Ⲅ","ⲅ", "G","g", "Ⲅⲁⲙⲙⲁ",    "غَما",     "Gamma",   7, ["ɣ","g","ŋ"],    ["غ","ج","ن"], 3],
  ["dalda",   4, "Ⲇ","ⲇ", "D","d", "Ⲇⲁⲗⲇⲁ",    "دلدا",     "Dalda",   5, ["ð","d"],        ["ذ","د"],    4],
  ["ei",      5, "Ⲉ","ⲉ", "E","e", "Ⲉⲓ",        "إي",       "Ei",      2, ["e"],            ["إ"],        5],
  ["sou",     6, "Ⲋ","ⲋ", null,null,"Ⲥⲟⲟⲩ",     "صو",       "Sou",     6, ["s"],            ["س"],        6],
  ["zeta",    7, "Ⲍ","ⲍ", "Z","z", "Ⲍⲏⲧⲁ",      "زيتا",     "Zeta",    1, ["z"],            ["ز"],        7],
  ["eta",     8, "Ⲏ","ⲏ", null,null,"Ⲏⲧⲁ",      "إيتا",     "Eta",     3, ["iː"],           ["إي"],       8],
  ["theta",   9, "Ⲑ","ⲑ", null,null,"Ⲑⲏⲧⲁ",     "ثيتا",     "Theta",   5, ["t","θ"],        ["ت","ث"],    9],
  ["iota",   10, "Ⲓ","ⲓ", "I","i", "Ⲓⲱⲧⲁ",      "يوتا",     "Iota",    2, ["i","j"],        ["ي"],        10],
  ["kappa",  11, "Ⲕ","ⲕ", "K","k", "Ⲕⲁⲡⲡⲁ",    "كابا",     "Kappa",   1, ["k"],            ["ك"],        20],
  ["lola",   12, "Ⲗ","ⲗ", "L","l", "Ⲗⲟⲗⲁ",      "لولا",     "Lola",    4, ["l"],            ["ل"],        30],
  ["mi",     13, "Ⲙ","ⲙ", "M","m", "Ⲙⲓ",        "مي",       "Mi",      2, ["m"],            ["م"],        40],
  ["ni",     14, "Ⲛ","ⲛ", "N","n", "Ⲛⲓ",        "ني",       "Ni",      1, ["n"],            ["ن"],        50],
  ["eksi",   15, "Ⲝ","ⲝ", null,null,"Ⲉⲝⲓ",      "إكسي",     "Eksi",    6, ["ks"],           ["كس"],       60],
  ["o",      16, "Ⲟ","ⲟ", "O","o", "Ⲟ",         "أو",       "O",       1, ["o"],            ["أو"],       70],
  ["pi",     17, "Ⲡ","ⲡ", "P","p", "Ⲡⲓ",        "بي",       "Pi",      4, ["p"],            ["ب"],        80],
  ["ro",     18, "Ⲣ","ⲣ", "R","r", "Ⲣⲱ",        "رو",       "Ro",      3, ["r"],            ["ر"],        100],
  ["sima",   19, "Ⲥ","ⲥ", "C","c", "Ⲥⲏⲙⲁ",      "سيما",     "Sima",    3, ["s"],            ["س"],        200],
  ["tav",    20, "Ⲧ","ⲧ", "T","t", "Ⲧⲁⲩ",       "تاڤ",      "Tav",     1, ["t"],            ["ت"],        300],
  ["epsilon",21, "Ⲩ","ⲩ", "U","u", "Ⲉⲡⲥⲓⲗⲟⲛ",  "إبسلون",   "Epsilon", 7, ["i","v","w"],    ["إي","ڤ","و"],400],
  ["fi",     22, "Ⲫ","ⲫ", "V","v", "Ⲫⲓ",        "في",       "Fi",      4, ["f"],            ["ف"],        500],
  ["khi",    23, "Ⲭ","ⲭ", null,null,"Ⲭⲓ",       "خي",       "Khi",     7, ["k","x","ʃ"],    ["ك","خ","ش"],600],
  ["epsi",   24, "Ⲯ","ⲯ", null,null,"Ⲯⲓ",       "إبسي",     "Epsi",    6, ["ps"],           ["بس"],       700],
  ["oou",    25, "Ⲱ","ⲱ", "W","w", "Ⲱⲟⲩ",       "أوو",      "Oou",     3, ["oː"],           ["أو"],       800],
  ["shai",   26, "Ϣ","ϣ", null,null,"Ϣⲁⲓ",      "شاي",      "Shai",    4, ["ʃ"],            ["ش"],        null],
  ["fai",    27, "Ϥ","ϥ", "F","f", "Ϥⲁⲓ",       "فاي",      "Fai",     4, ["f"],            ["ف"],        null],
  ["khai",   28, "Ϧ","ϧ", null,null,"Ϧⲁⲓ",      "خاي",      "Khai",    4, ["x"],            ["خ"],        null],
  ["hori",   29, "Ϩ","ϩ", null,null,"Ϩⲟⲣⲓ",     "هوري",     "Hori",    4, ["h"],            ["ه"],        null],
  ["janja",  30, "Ϫ","ϫ", "J","j", "Ϫⲁⲛϫⲁ",    "جنجا",     "Janja",   5, ["g","dʒ"],       ["ج"],        null],
  ["cheema", 31, "Ϭ","ϭ", null,null,"Ϭⲓⲙⲁ",     "تشيما",    "Cheema",  6, ["tʃ","k"],       ["تش","ك"],   null],
  ["ti",     32, "Ϯ","ϯ", null,null,"Ϯ",        "تي",       "Ti",      6, ["ti"],           ["تي"],       null],
];

// Conditional pronunciation rules — the teaching core of the flip-card backs.
const RULES = {
  vida:    [["قبل حرف متحرك أو في أول الكلمة", "تُنطق (b) كالباء"],
            ["في آخر الكلمة أو قبل حرف ساكن", "تُنطق (v) كالڤاء"]],
  dalda:   [["في الكلمات القبطية الأصيلة", "تُنطق (d) دال"],
            ["في الكلمات اليونانية", "تُنطق (th) ذال مفخّمة"]],
  theta:   [["بعد حرف Ⲥ أو Ⲧ", "تُنطق (t) تاء"],
            ["في باقي المواضع", "تُنطق (th) ثاء"]],
  janja:   [["في الكلمات القبطية", "تُنطق (g) جيم مصرية"],
            ["في الكلمات اليونانية", "تُنطق (j) جيم معطشة"]],
  eksi:    [["دائمًا", "حرف مزدوج = Ⲕ + Ⲥ"]],
  epsi:    [["دائمًا", "حرف مزدوج = Ⲡ + Ⲥ"]],
  cheema:  [["في الكلمات القبطية", "تُنطق (ch) تش"],
            ["في بعض الكلمات", "تُنطق (k) كاف"]],
  ti:      [["دائمًا", "حرف مزدوج = Ⲧ + Ⲓ"]],
  sou:     [["لا يُستخدم في الكتابة", "حرف رقمي فقط، قيمته ٦"]],
  epsilon: [["بعد Ⲁ أو Ⲉ وقبل حرف متحرك", "تُنطق (w) واو"],
            ["بعد Ⲁ أو Ⲉ وقبل ساكن", "تُنطق (v) ڤاء"],
            ["في باقي المواضع", "تُنطق (i) ياء"]],
  gamma:   [["قبل Ⲉ Ⲓ Ⲏ", "تُنطق (gh) غين"],
            ["قبل Ⲅ أو Ⲕ", "تُنطق (n) نون"],
            ["في باقي المواضع", "تُنطق (g) جيم مصرية"]],
  khi:     [["في الكلمات القبطية", "تُنطق (k) كاف"],
            ["في الكلمات اليونانية قبل حرف متحرك", "تُنطق (kh) خاء"],
            ["في بعض أسماء الأعلام", "تُنطق (sh) شين"]],
};

const letters = T.map(([id, order, U, l, aU, al, nc, nar, nlat, group, ipa, ar, num]) => ({
  id, order,
  unicode: { upper: U, lower: l },
  athanasiusKey: aU ? { upper: aU, lower: al } : null,
  name: { coptic: nc, ar: nar, latin: nlat },
  group,
  alsoTaughtIn: [],
  sound: { ipa, arabicHint: ar },
  rules: (RULES[id] ?? []).map(([condition, result], i) => ({
    id: `${id}-rule-${i + 1}`,
    condition: { ar: condition },
    result: { ar: result },
    examples: [],
  })),
  numericValue: num,
  audio: null,
  exampleWords: [],
}));

mkdirSync(new URL("../src/data/json/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../src/data/json/letters.json", import.meta.url),
  JSON.stringify({ schemaVersion: 1, updated: new Date().toISOString().slice(0, 10), letters }, null, 2) + "\n",
);

const missing = letters.filter((x) => !x.athanasiusKey).map((x) => x.name.latin);
console.log(`Wrote ${letters.length} letters.`);
console.log(`Athanasius key still unknown for ${missing.length}: ${missing.join(", ")}`);
