# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `ca7cc5f`. Quiz, hygiene, and prayer tap-highlight code still uncommitted. S9 GATE passed 2026-09-01.
**Live:** https://learn-coptic.vercel.app
**Validator:** ✓ 32 letters, 8635 words, 4 prayers, 2 levels · teaching 147 · S16 hygiene report · every prayer line has tokens

## Current position

**Done:** S0–S12, S13a, **S16**, **S13b**, **S11**.
**Next:** S13c (synced prayer audio). S14 teaching-set nouns. S15 grammar.
**Blocked on:** Coptic for All / agpeya.org grant note. Harvest Arabic unverified.
  Owner will supply full prefix/suffix grammar rules to store; until then
  many prayer tokens correctly have no Arabic highlight.
**Not started:** S10b (optional), S13c, S14, S15.

## Open decisions

- Owner authorized shipping Athanasius Plain (mapped) as optional manuscript
  mode on 2026-08-31 (ADR-015). copticchurch.net request is still not a grant.
- Other CS faces (Avva, Pope Shenouda III, Pishoi, New Athanasius) and
  Antinoou / Coptic1 stay out until the file is in `src/app/fonts/`.
- Coptic face default: GNU FreeSerif. Picker: سيريف / سانس / أثناسيوس.
  Key `learn-coptic:coptic-font`.
- S16 report: 10 homograph keys; 477 harvest article-shaped rows. Human
  unpublished list still open.
- Prayer `wordId` is teaching-set only (ADR-020). Prayer tap-highlight uses
  a stub affix peel. Full grammar rules are not in the repo yet — owner
  will supply them to store as data. Blank highlight is expected.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, **letter audio filled**
- `words.json` — 8635 · teaching 147 + Andreas 8488 · `normalized` + `lemma`
- `prayers.json` — 4 prayers, tokens on every line. khen-efran l1 reviewed
  glosses kept. Tap highlights Coptic + sourced Arabic in the same line (no
  sheet). Many tokens stay unmarked until stored grammar rules exist.
  `khen-efran` still points at missing `/audio/prayers/` (S13c).
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- Routes: previous plus **`/quiz`**. Leitner key `learn-coptic:leitner`.
- Production: https://learn-coptic.vercel.app.

## Notes

- Theme `learn-coptic:theme`. Font `learn-coptic:coptic-font`. Quiz `learn-coptic:leitner`.
- ADR-020: never guess prayer glosses; teaching-set `wordId` only.
- `legacy/` and `.extract/` are gitignored.
