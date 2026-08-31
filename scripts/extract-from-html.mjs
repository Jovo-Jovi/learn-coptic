/**
 * Reads your two working HTML files and pulls the real data out of them,
 * so the live explorer — not the markdown — becomes the source of truth.
 *
 *   node scripts/extract-from-html.mjs ./legacy/interactive_coptic_explorer_ascii.html \
 *                                      ./legacy/coptic_vocabulary.html
 *
 * Writes:
 *   .extract/raw-arrays.json   every array literal it found, for you to eyeball
 *   .extract/ascii-map.json    letterId -> Athanasius key, merged with letters.json
 *   .extract/conflicts.md      anything that disagrees with the seeded table
 *
 * It never overwrites src/data/json. You copy across after reading the report.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: node scripts/extract-from-html.mjs <file.html> [...]"); process.exit(1); }

const seeded = JSON.parse(readFileSync(new URL("../src/data/json/letters.json", import.meta.url), "utf8")).letters;

/** Grab every `const|let|var NAME = [ ... ];` out of the <script> blocks and
 *  evaluate it in a sandbox. Safer and far more reliable than regex-scraping. */
function extractArrays(html) {
  const out = {};
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  for (const src of scripts) {
    const decls = [...src.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(\[[\s\S]*?\])\s*;/g)];
    for (const [, name, literal] of decls) {
      try { out[name] = vm.runInNewContext(literal, {}, { timeout: 1000 }); } catch { /* skip non-literals */ }
    }
  }
  return out;
}

const all = {};
for (const f of files) Object.assign(all, extractArrays(readFileSync(f, "utf8")));

mkdirSync(new URL("../.extract/", import.meta.url), { recursive: true });
writeFileSync(new URL("../.extract/raw-arrays.json", import.meta.url), JSON.stringify(all, null, 2));

console.log("Arrays found:");
for (const [k, v] of Object.entries(all)) {
  console.log(`  ${k}  (${Array.isArray(v) ? v.length : "?"} items)  keys: ${
    Array.isArray(v) && typeof v[0] === "object" ? Object.keys(v[0] ?? {}).join(", ") : typeof v[0]
  }`);
}

/* ---- Letter key reconciliation ------------------------------------ */
// Adjust these two field names once you've looked at raw-arrays.json.
const LETTER_ARRAY = process.env.LETTER_ARRAY ?? Object.keys(all).find((k) => /letter|alphabet|huruf/i.test(k));
const KEY_FIELD = process.env.KEY_FIELD ?? "ascii";
const NAME_FIELD = process.env.NAME_FIELD ?? "name";

const conflicts = [];
const map = {};
if (LETTER_ARRAY && Array.isArray(all[LETTER_ARRAY])) {
  for (const row of all[LETTER_ARRAY]) {
    const name = String(row[NAME_FIELD] ?? "").toLowerCase().trim();
    const key = row[KEY_FIELD];
    const seed = seeded.find((s) => s.name.latin.toLowerCase() === name || s.id === name);
    if (!seed) { conflicts.push(`- No seeded letter matches HTML name **${name}** — check spelling.`); continue; }
    map[seed.id] = key;
    if (seed.athanasiusKey && String(key).toLowerCase() !== seed.athanasiusKey.lower.toLowerCase()) {
      conflicts.push(`- **${seed.name.latin}**: HTML says \`${key}\`, seeded table says \`${seed.athanasiusKey.lower}\` — HTML wins, update letters.json.`);
    }
  }
  writeFileSync(new URL("../.extract/ascii-map.json", import.meta.url), JSON.stringify(map, null, 2));
} else {
  conflicts.push("- Could not find the letter array. Open raw-arrays.json, then re-run with LETTER_ARRAY=<name> KEY_FIELD=<field>.");
}

const stillMissing = seeded.filter((s) => !s.athanasiusKey && !map[s.id]).map((s) => s.name.latin);
if (stillMissing.length) conflicts.push(`- Still no key for: ${stillMissing.join(", ")}. Read them off the font directly.`);

writeFileSync(
  new URL("../.extract/conflicts.md", import.meta.url),
  `# Extraction report\n\n${conflicts.length ? conflicts.join("\n") : "No conflicts. Copy ascii-map.json into letters.json."}\n`,
);
console.log(`\n${conflicts.length} item(s) need your decision — see .extract/conflicts.md`);
