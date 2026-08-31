/**
 * ONE-SHOT. Same rule as seed-letters.mjs: run once during S1, then stop.
 * Re-running overwrites hand edits in letters.json (names, arDisplay, aliases).
 *
 * Copies keys from .extract/ascii-map.json. Hori primary is vocabulary `\`;
 * explorer `|` is an alias. ADOPT_AR names come from the HTML htmlName field.
 */
import { readFileSync, writeFileSync } from "node:fs";

const file = JSON.parse(readFileSync(new URL("../src/data/json/letters.json", import.meta.url), "utf8"));
const map = JSON.parse(readFileSync(new URL("../.extract/ascii-map.json", import.meta.url), "utf8"));

const ADOPT_AR = new Set(["vida", "dalda", "kappa", "tav", "sou", "epsi", "epsilon"]);

for (const letter of file.letters) {
  const row = map[letter.id];
  if (!row) throw new Error(`ascii-map missing ${letter.id}`);
  letter.athanasiusKey = { upper: row.upper, lower: row.lower };
  if (ADOPT_AR.has(letter.id)) letter.name.ar = row.htmlName;
}

const hori = file.letters.find((l) => l.id === "hori");
if (!hori) throw new Error("hori missing");
hori.athanasiusKey = { upper: "\\", lower: "\\" };
hori.athanasiusAliases = ["|"];

file.updated = new Date().toISOString().slice(0, 10);
writeFileSync(
  new URL("../src/data/json/letters.json", import.meta.url),
  JSON.stringify(file, null, 2) + "\n",
);
console.log(`Wrote ${file.letters.length} letters. Null keys left: ${file.letters.filter((l) => !l.athanasiusKey).length}`);
console.log("hori", JSON.stringify(hori.athanasiusKey), "aliases", hori.athanasiusAliases);
console.log("ar names", Object.fromEntries(file.letters.filter((l) => ADOPT_AR.has(l.id) || l.id === "khi").map((l) => [l.id, l.name.ar])));
