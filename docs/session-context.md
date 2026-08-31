# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `2f0a0b2`
**Validator:** ✓ 32 letters, 147 words, 1 prayer, 2 levels · 0 unpublished

## Current position

**Done:** S0, S1, S2
**Next:** S3 — design tokens and fonts
**Blocked on:** nothing

## Open decisions

- /s1-glyph-check to be deleted at S4.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, no audio
- `words.json` — 147 (121 lexicon / 11 drill / 15 name), Unicode, all teaches[] resolve
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed

## Notes

- Markdown keymap (ADR-007) is an alternative Athanasuis layout. Do not merge it.
- Generic font converters are a reference only — this keymap is font-specific.
- ADR-008: drills may have `meaning: null`. UI must not assume `meaning.ar`.
- Jinkim is base then U+0300 (`mmon` = U+2C99 U+0300 …), same as prayers.json.
- `legacy/` and `.extract/` are gitignored — inputs, not product.
