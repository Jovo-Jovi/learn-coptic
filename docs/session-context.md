# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `TBDSHA`
**Validator:** ✓ 32 letters (0 missing keys), 8 words, 1 prayer, 2 levels

## Current position

**Done:** S0, S1
**Next:** S2 — migrate vocabulary (GATE)
**Blocked on:** nothing

## Open decisions

- soic gloss: HTML arabic: رب is the meaning, تشويس is pronunciation. Keep them in separate fields in S2.
- /s1-glyph-check to be deleted at S4.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, no audio
- `words.json` — 8 sample words only; the real ~145 arrive in S2
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed

## Notes

- Markdown keymap (ADR-007) is an alternative Athanasuis layout. Do not merge it.
- `legacy/` and `.extract/` are gitignored — inputs, not product.
