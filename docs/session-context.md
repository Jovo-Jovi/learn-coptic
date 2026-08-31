# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `8df36c5` scaffold
**Validator:** ✓ 32 letters, 8 words, 1 prayer, 2 levels

## Current position

**Done:** S0 setup
**Next:** S1 — freeze the letter map (GATE)
**Blocked on:** nothing

## Open decisions

- 11 letters have no confirmed `athanasiusKey`: Sou, Eta, Theta, Eksi, Khi,
  Epsi, Shai, Khai, Hori, Cheema, Ti. Resolve in S1 from the live HTML.
- Arabic letter names in `letters.json` use standard Egyptian church forms.
  Not yet checked against the project's own curriculum.
- Nobody has yet rendered all 32 glyphs on screen for a Coptic reader to check.

## Known state of the data

- `letters.json` — 32, groups 5/4/4/7/4/5/3, 12 letters carry rules, no audio
- `words.json` — 8 sample words only; the real ~145 arrive in S2
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed

## Notes

- `create-next-app` also added stock `AGENTS.md` and `CLAUDE.md`. Left as-is.
- `legacy/` and `.extract/` are gitignored — inputs, not product.
