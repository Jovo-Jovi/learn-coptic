# Journal

Append only. Newest at the top. One entry per step. Keep entries short — this
is a record of what happened, not an explanation of why.

Format:

```
## YYYY-MM-DD · S# · <title>
Model: <who wrote it> | Commit: <sha> | Result: pass / fail / partial
- what changed
- what was decided
- what is still open
```

---

## 2026-08-31 · S3 · Design tokens and fonts
Model: — | Commit: `cb8d7e9` | Result: pass

- Cairo (Arabic) + Noto Sans Coptic via next/font, self-hosted woff2. No Google <link>.
- All 7 original fills fail 4.5:1 against white. No hue shifted; --group-N-fg is
  #171717 on every fill in both themes. Ratios 4.90 / 8.77 / 7.40 / 11.25 /
  12.31 / 9.00 / 13.63. Group 1 is the tightest.
- Type scale: 12/14/18/20/24/30/36, glyph 64. Base 18 because Cairo reads small at 16.
- /s3-tokens throwaway route, 404 in production. Delete with /s1-glyph-check at S4.
- Fonts confirmed from build CSS only; dev server could not be started here.

Open: dark-mode surface contrast for group swatches unverified.

## 2026-08-31 · S3 · Design tokens and fonts
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Cairo (Arabic, variable) + Noto Sans Coptic (400) via `next/font/google`.
  Build CSS uses `@font-face` + local woff2; no fonts.googleapis.com.
- Group fills kept from the live HTML. White text fails 4.5:1 on all seven
  (group 1 is 3.66:1; 2–7 are pastels). `--group-N-fg` is `#171717` for every
  group in both themes — no hue was shifted.
- Type scale in `@theme`: xs 12 / sm 14 / base 18 / lg 20 / xl 24 / 2xl 30 /
  3xl 36 / glyph 64. Arabic body is 18px because Cairo reads small at 16.
- Throwaway `/s3-tokens` (404 in production). Delete with `/s1-glyph-check` at S4.

Open: nothing blocking S4.

## 2026-08-31 · S2 · Migrate vocabulary (GATE)
Model: — | Commit: `2f0a0b2` | Result: pass

- 145 HTML rows converted to Unicode via the S1 keymap. Zero unknown keystrokes.
- Final count 147 = 145 HTML + efran/efiot, retained from the sample
  prayers.json (keyWords of khen-efran). Provenance recorded in words.json.
- Kinds: 121 lexicon · 11 drill · 15 name. 0 unpublished.
- Six rows (tonk, ton, zont, kont, not, kotk) had arabic === pronunciation:
  they are the ⲟ+ⲛ+ⲧ/ⲕ rhyme drill, not broken glosses. Reclassified drill,
  Arabic moved to translit.ar, meaning null.
- khen restored to lexicon, meaning "في / بـ" — two senses, not a garbled string.
- rashaihd → name; papa, pixrictoc → lexicon; golgoqa stays name.
- Jinkim: base then U+0300. Validator rejects a combining grave with no base.
- ADR-008: meaning is nullable; lexicon and name still require it.

Open: nothing blocking S3.

## 2026-08-31 · S2 · Migrate vocabulary (re-run)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting review)

- HTML group 1: tot/kot/on are lexicon; the next six have arabic = pronunciation
  (ⲟ+ⲛ+ⲧ/ⲕ rhyme). Reclassified drill, translit only, meaning null, published.
- khen meaning `في / بـ`, published (prayers.json keyWords).
- iman stays drill. rashaihd → name. papa and pixrictoc → lexicon. golgoqa stays name.
- words.json `provenance` records efran/efiot as sample-prayer rows, not HTML.
- Jinkim: `mmon` is U+2C99 U+0300 … (base then combining), same as ⲙ̀ⲫⲓⲱⲧ.
- Schema: `meaning` nullable; lexicon/name still require it (ADR-008).
- kind: 121 lexicon, 11 drill, 15 name. 0 unpublished.

Open: human GATE.

## 2026-08-31 · S2 · GATE review
Model: — | Commit: — | Result: fail

- Six -ont/-onk words were unpublished lexicon; they are rhyming drills.
- khen ب-في was treated as garbled; it is two prepositional senses.
- Non-blocking: rashaihd name; البابا/المسيح lexicon; efran/efiot provenance;
  jinkim must be base-then-combining.

## 2026-08-31 · S2 · Migrate vocabulary (GATE)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting review)

- HTML arrays hold **145** rows. Page stats advertised **131**. words.json has
  **147** (145 + `efran` / `efiot` kept for `prayers.json`).
- Converted with letters.json map. Jinkim backtick → U+0300 (as in ⲙ̀ⲫⲓⲱⲧ).
- kind: 125 lexicon, 6 drill, 16 name. 7 unpublished (group-1 transcriptions +
  `khen` gloss ب-في). soic meaning رب, translit تشويس.
- `scripts/migrate-vocab.mjs` one-shot. Validator green.

Open: human GATE — kinds, unpublished list, whether efran/efiot stay.

## 2026-08-31 · S1 · Freeze the letter map (GATE)
Model: — | Commit: `a370f95` | Result: pass

- Extractor rewritten for object literals (brace counting; `({…})` wrap for vm).
- All 32 athanasiusKey values written from `.extract/ascii-map.json`, not by hand.
  Machine table matched the hand-read table 32/32 on keys and groups.
- hori: primary `\` (4 vocab words use it), explorer's `|` kept as alias.
  New field `athanasiusAliases`; alias collisions now checked in validate.mts.
- Arabic names adopted from the HTML: بيتا، دلتا، كبّا، تاف، سوو، بسي، إبسيلون.
- khi: `name.ar: "كي"`, `name.arDisplay: "كي، خي، شي"` — the name states all
  three sounds. New field `arDisplay`.
- Markdown's 11 differing keys are a coherent alternative keymap, not errors.
- All 32 glyph pairs viewed in Noto Sans Coptic at /s1-glyph-check. No tofu.
  Route 404s in production; delete at S4.
- `apply-s1-from-extract.mjs` marked one-shot.

Open: nothing blocking S2.

## 2026-08-31 · S1 · Glyph check
Model: Cursor Grok 4.6 | Commit: — | Result: pass (keys frozen; page is throwaway)

- Looked at all 32 rows on `/s1-glyph-check` under `next dev` (Noto Sans Coptic). No tofu. Demotic seven at U+03E2–03EF included.
- khi: `name.ar` كي, `name.arDisplay` كي، خي، شي.
- Validator now collides aliases with primary keys. `/s1-glyph-check` 404s in production; delete at S4.
- apply-s1-from-extract.mjs marked one-shot.

Open: S2 soic pronunciation vs meaning. Delete glyph page at S4.

## 2026-08-31 · S1 · Freeze the letter map (re-run)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting human glyph check + khi name)

- Extract now parses object literals (brace count + `({…})` for vm). Machine table in `.extract/key-table.md`.
- All 32 `athanasiusKey` values written from that map. Hori primary `\` (vocab), alias `|` (explorer).
- Arabic names from HTML: بيتا، دلتا، كبّا، تاف، سوو، بسي، إبسيلون. khi left خي.
- ADR-007: markdown's 11 keys are an alternative layout, not errors.
- Throwaway `/s1-glyph-check` with Noto Sans Coptic.

Open: khi Arabic name (كي vs خي vs كي، خي، شي); a Coptic reader must confirm the 32 glyphs on `/s1-glyph-check`. S2: soic meaning in HTML is رب, pronunciation تشويس.

## 2026-08-31 · S0 · Repo setup
Model: — | Commit: `8df36c5` | Result: pass

- `create-next-app` (TS, Tailwind, App Router, `src/`, `@/*`, ESLint, npm) in a
  clean folder. Next 16, Turbopack is the default so there was nothing to decline.
- Scaffold mapped into `.cursor/rules/`, `src/data/schema/`, `src/data/json/`,
  `scripts/`, plus the three root markdown files. Downloaded `package.json` and
  `tsconfig.json` deliberately not used.
- Deps: `zod`, `fuse.js`, `tsx`, `node-html-parser`. Scripts: `prebuild`,
  `validate`, `seed:letters`, `extract`.
- Only the two working HTML files copied to `legacy/`. No TTF, no summary
  markdown. `legacy/` and `.extract/` gitignored.
- Default branch `main`; `master` removed from the remote.
- Stock `AGENTS.md` and `CLAUDE.md` from the template are in the commit.
- Validator green: 32 letters, 8 words, 1 prayer, 2 levels.

Open: the 11 unconfirmed `athanasiusKey` values, and no Coptic reader has
checked the glyphs yet.
