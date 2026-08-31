/**
 * Reads your two working HTML files and pulls the real data out of them,
 * so the live explorer — not the markdown — becomes the source of truth.
 *
 *   node scripts/extract-from-html.mjs ./legacy/interactive_coptic_explorer_ascii.html \
 *                                      ./legacy/coptic_vocabulary.html
 *
 * Writes:
 *   .extract/raw-arrays.json   every array/object literal it found, for you to eyeball
 *   .extract/ascii-map.json    letterId -> Athanasius key + group, from the live HTML
 *   .extract/key-table.md      machine-made comparison table
 *   .extract/conflicts.md      anything that disagrees with the seeded table
 *
 * Nested `{ … }` literals cannot be cut with `[\s\S]*?` — that stops at the
 * first `}`. We find `const|let|var NAME = {` / `[` then count braces, skipping
 * string contents. It never overwrites src/data/json.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: node scripts/extract-from-html.mjs <file.html> [...]"); process.exit(1); }

const seeded = JSON.parse(readFileSync(new URL("../src/data/json/letters.json", import.meta.url), "utf8")).letters;

/** Walk a `{…}` or `[…]` starting at `start`, ignoring braces inside strings. */
function takeBalanced(src, start) {
  const open = src[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (c === "\\") { escape = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

function extractLiterals(html) {
  const out = {};
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const startRe = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([[{])/g;
  for (const src of scripts) {
    let m;
    while ((m = startRe.exec(src))) {
      const name = m[1];
      const openIdx = m.index + m[0].length - 1;
      const literal = takeBalanced(src, openIdx);
      if (!literal) continue;
      // `{…}` is a block to the parser; wrap objects so they evaluate as literals.
      const code = literal[0] === "{" ? `(${literal})` : literal;
      try { out[name] = vm.runInNewContext(code, {}, { timeout: 2000 }); } catch { /* skip non-literals */ }
    }
  }
  return out;
}

const all = {};
for (const f of files) Object.assign(all, extractLiterals(readFileSync(f, "utf8")));

mkdirSync(new URL("../.extract/", import.meta.url), { recursive: true });
writeFileSync(new URL("../.extract/raw-arrays.json", import.meta.url), JSON.stringify(all, null, 2));

console.log("Literals found:");
for (const [k, v] of Object.entries(all)) {
  const n = Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : "?";
  const sample = Array.isArray(v)
    ? (typeof v[0] === "object" ? Object.keys(v[0] ?? {}).join(", ") : typeof v[0])
    : v && typeof v === "object" ? typeof Object.values(v)[0] : typeof v;
  console.log(`  ${k}  (${n} keys/items)  sample: ${sample}`);
}

/* ---- Letter key reconciliation ------------------------------------ */
const LETTER_OBJECT = process.env.LETTER_ARRAY
  ?? Object.keys(all).find((k) => /letter|alphabet|huruf/i.test(k));

const conflicts = [];
const map = {};
const tableRows = [];

function fmtKey(upper, lower) {
  return `\`${String(upper).replace(/\|/g, "\\|")}\`/\`${String(lower).replace(/\|/g, "\\|")}\``;
}

if (LETTER_OBJECT && all[LETTER_OBJECT] && typeof all[LETTER_OBJECT] === "object" && !Array.isArray(all[LETTER_OBJECT])) {
  const rows = Object.entries(all[LETTER_OBJECT]);
  if (rows.length !== 32) conflicts.push(`- HTML letter object has ${rows.length} entries, expected 32.`);
  rows.forEach(([htmlName, row], i) => {
    const seed = seeded.find((s) => s.order === i + 1);
    if (!seed) { conflicts.push(`- No seeded letter at order ${i + 1} for HTML **${htmlName}**.`); return; }
    const upper = row.ascii_char ?? row.ascii ?? row.upper;
    const lower = row.lowercase ?? row.lower ?? upper;
    const group = row.group;
    map[seed.id] = { upper, lower, group, htmlName, coptic_name: row.coptic_name ?? null };
    const seedKey = seed.athanasiusKey
      ? `${seed.athanasiusKey.upper}/${seed.athanasiusKey.lower}`
      : "null";
    tableRows.push({
      id: seed.id,
      html: `${upper}/${lower}`,
      htmlName,
      group,
      seedKey,
      seedGroup: seed.group,
      seedAr: seed.name.ar,
    });
    if (seed.athanasiusKey) {
      const same =
        String(upper) === seed.athanasiusKey.upper &&
        String(lower) === seed.athanasiusKey.lower;
      const aliased = (seed.athanasiusAliases ?? []).includes(String(upper))
        || (seed.athanasiusAliases ?? []).includes(String(lower));
      if (!same && !aliased) {
        conflicts.push(
          `- **${seed.id}**: HTML says \`${upper}\`/\`${lower}\`, letters.json says \`${seed.athanasiusKey.upper}\`/\`${seed.athanasiusKey.lower}\` — HTML wins.`,
        );
      } else if (!same && aliased) {
        conflicts.push(
          `- **${seed.id}**: HTML card is \`${upper}\`/\`${lower}\`; letters.json primary is \`${seed.athanasiusKey.upper}\`/\`${seed.athanasiusKey.lower}\` with alias. Intentional.`,
        );
      }
    } else {
      conflicts.push(`- **${seed.id}**: letters.json key is null; HTML says \`${upper}\`/\`${lower}\`.`);
    }
    if (group !== seed.group) {
      conflicts.push(`- **${seed.id}**: HTML group ${group}, letters.json group ${seed.group}.`);
    }
  });
  writeFileSync(new URL("../.extract/ascii-map.json", import.meta.url), JSON.stringify(map, null, 2));
} else if (LETTER_OBJECT && Array.isArray(all[LETTER_OBJECT])) {
  conflicts.push("- Letter collection is an array; object path not used. Open raw-arrays.json.");
} else {
  conflicts.push("- Could not find the letter object. Open raw-arrays.json, then re-run with LETTER_ARRAY=<name>.");
}

/* Vocabulary: which keystroke actually appears for hori-like letters. */
const vocab = all.vocabulary;
if (vocab && typeof vocab === "object") {
  const words = Object.values(vocab).flat().map((w) => String(w?.coptic ?? ""));
  const pipe = words.filter((w) => w.includes("|")).length;
  const backslash = words.filter((w) => w.includes("\\")).length;
  conflicts.push(`- Vocabulary scan: ${backslash} word(s) contain \`\\\`, ${pipe} contain \`|\`.`);
  const soic = Object.values(vocab).flat().find((w) => w?.coptic === "soic");
  if (soic) {
    conflicts.push(`- Vocab \`soic\`: arabic=\`${soic.arabic}\` pronunciation=\`${soic.pronunciation}\`. (S2: confirm the gloss; do not edit words.json in S1.)`);
  }
}

const stillMissing = seeded.filter((s) => !s.athanasiusKey && !map[s.id]).map((s) => s.name.latin);
if (stillMissing.length) conflicts.push(`- Still no key for: ${stillMissing.join(", ")}.`);

const mdTable = [
  "| id | htmlName | HTML key | HTML group | letters.json key | letters.json group |",
  "|---|---|---|---|---|---|",
  ...tableRows.map((r) =>
    `| ${r.id} | ${r.htmlName} | ${fmtKey(...r.html.split("/"))} | ${r.group} | ${r.seedKey === "null" ? "null" : fmtKey(...r.seedKey.split("/"))} | ${r.seedGroup} |`,
  ),
].join("\n");

writeFileSync(new URL("../.extract/key-table.md", import.meta.url), `# Machine key table\n\n${mdTable}\n`);
writeFileSync(
  new URL("../.extract/conflicts.md", import.meta.url),
  `# Extraction report\n\n${conflicts.length ? conflicts.join("\n") : "No conflicts. Copy ascii-map.json into letters.json."}\n\n${mdTable}\n`,
);
console.log(`\n${conflicts.length} item(s) need your decision — see .extract/conflicts.md`);
console.log(`Wrote .extract/ascii-map.json (${Object.keys(map).length} letters) and .extract/key-table.md`);
