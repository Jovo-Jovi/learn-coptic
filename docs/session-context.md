# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `<sha>`
**Validator:** ✓ 32 letters, 147 words, 1 prayer, 2 levels · 0 unpublished

## Current position

**Done:** S0–S3
**Next:** S4 — app shell
**Blocked on:** nothing

## Open decisions

- `/s1-glyph-check` and `/s3-tokens` to be deleted at S4.
- Dark-mode surface contrast for group swatches unverified.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, no audio
- `words.json` — 147 (121 lexicon / 11 drill / 15 name), Unicode, all teaches[] resolve
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- Tokens `--group-1`..`7` + `--group-N-fg` defined; type scale set

## Notes

- Markdown keymap (ADR-007) is an alternative Athanasuis layout. Do not merge it.
- Generic font converters are a reference only — this keymap is font-specific.
- ADR-008: drills may have `meaning: null`. UI must not assume `meaning.ar`.
- Group fills: live HTML hues. Text on a fill is `#171717` (`--group-N-fg`). Group 1 is 4.90:1 — any future fill darkening breaks it first.
- `legacy/` and `.extract/` are gitignored — inputs, not product.
