# Engineering rules

Machine-readable versions live in `.cursor/rules/`. This is the human copy.

## Hard rules

1. Never edit `src/data/json/**` to make a build or test pass. Report and stop.
2. Coptic renders as Unicode only. `athanasiusKey` is metadata, never displayed.
3. No Coptic TTF in the repo. See `security.md`.
4. Never invent a glyph, gloss, transliteration, or codepoint. Leave null, say so.
5. Arabic is primary. `dir="rtl"`, Coptic and Latin wrapped in LTR isolates.
6. No new dependency without stating why first.
7. `npm run validate` passes before any step is called done.

## Done means

`npm run validate` ✓ · `npm run build` ✓ · no TS errors · no new `any` ·
checked at 375px · `IMPLEMENTATION_PLAN.md` checkboxes ticked for the step ·
`session-context.md` and `journal.md` updated · other stale docs updated.

## Branching

`main` is deployable. One branch per step: `s5-alphabet-routes`.
Squash-merge. Commit subject = step id + what changed.
