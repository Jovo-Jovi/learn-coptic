# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `e69bb7d`
**Validator:** ✓ 32 letters, 147 words, 1 prayer, 2 levels · 0 unpublished

## Current position

**Done:** S0–S4
**Next:** S5 — `/alphabet` and `/group/[id]`
**Blocked on:** nothing

## Open decisions

- Dark-mode surface contrast for group swatches unverified — resolves at S5 when chips exist.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, no audio
- `words.json` — 147 (121 lexicon / 11 drill / 15 name), Unicode, all teaches[] resolve
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- Tokens `--group-1`..`7` + `--group-N-fg` defined; type scale set
- Shell live; three nav destinations still unbuilt (`/vocabulary`, `/practice`, `/about`)

## Notes

- Theme key `learn-coptic:theme`. All localStorage keys use prefix `learn-coptic:` (S11 too).
- Home is empty until S8.
- `/s1-glyph-check` and `/s3-tokens` deleted.
- Markdown keymap (ADR-007) is an alternative Athanasuis layout. Do not merge it.
- ADR-008: drills may have `meaning: null`. UI must not assume `meaning.ar`.
- Group 1 fill vs `#171717` is 4.90:1 — any future fill darkening breaks it first.
- `legacy/` and `.extract/` are gitignored — inputs, not product.
