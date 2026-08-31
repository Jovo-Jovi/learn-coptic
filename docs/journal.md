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
