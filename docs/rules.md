# Engineering rules

Machine-readable versions live in `.cursor/rules/`. This is the human copy.

## Hard rules

1. Never edit `src/data/json/**` to make a build or test pass. Report and stop.
2. Default Coptic paint is Unicode. Manuscript mode may paint stored
   `athanasiusKey` through Athanasius Plain. Never invent keys.
3. Mapped TTFs ship only as optional picker faces when the file is in
   `src/app/fonts/` and uses this project's keymap. See `security.md`.
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
