# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · branch `test/layered-word-analysis`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `9f6ae1b` on main. This branch ships learner pronounce + gloss
(ADR-024). Lab peel is not in this commit.
**Live:** https://learn-coptic.vercel.app (production still S17 test slice)
**Validator:** ✓ 32 letters, 11858 words · teaching 147 · 13 parseReady

## Current position

**Done:** S0–S12, S13a, **S16**, **S13b**, **S11**. S17 parse **test slice**
(GATE not PASS). S18 Andreas leftovers + unique Thabet lemmas harvested.
Learner النطق + gloss on prayer tap, word cards, search (`src/lib/pronounce.ts`).
Greek letter rules use six endings ⲁⲥ ⲟⲥ ⲓⲥ ⲁⲛ ⲟⲛ ⲓⲛ (as os is an on in)
plus `pronunciation.json` `spellList` for كي stems those endings miss.
**Next:** human S17 **PASS** before merging lab peel. Pronounce embed is the
only analysis piece meant for main (see `docs/word-analysis-ux.md`).
**Blocked on:** Coptic for All / agpeya.org grant note. Harvest Arabic
unverified as dictionary. Most prayer tokens still unmarked (ADR-022).
**Not started:** S10b (optional), S13c, S14, S15. S18 prayer blanks / grants.

## Open decisions

- Owner authorized shipping Athanasius Plain (mapped) as optional manuscript
  mode on 2026-08-31 (ADR-015). copticchurch.net request is still not a grant.
- Other CS faces (Avva, Pope Shenouda III, Pishoi, New Athanasius) and
  Antinoou / Coptic1 stay out until the file is in `src/app/fonts/`.
- Coptic face default: GNU FreeSerif. Picker: سيريف / سانس / أثناسيوس.
  Key `learn-coptic:coptic-font`.
- S16 report: 10 homograph keys; harvest article-shaped rows in hygiene
  report. Human unpublished list still open.
- S17: dictionary first, then parse. Prayer tap shows stored meaning.
  GATE needs **PASS**. Remaining blanks in `docs/gaps.md`. Thabet unique
  lemmas merged; KELLIA English still not merged.

## Known state of the data

- `letters.json` — 32, keys complete, all 32 have rules + notes,
  **letter audio filled**. Explorer rows kept; owner 2026-09-01 notes merged.
  Gamma حلقية display ⲅ ⲝ ⲭ ⲕ; إمالة ⲉ ⲓ ⲏ ⲩ.
  سيما / تاف class stays س / ت; specials are extra rules only.
- `words.json` — 11858 · teaching 147 + Andreas 2–17 + Thabet unique 1534
  · `normalized` + `lemma`
- `prayers.json` — 4 prayers, tokens on every line. khen-efran l2/l3 and
  ⲡⲉⲕⲣⲁⲛ have sourced `arHighlight` for the S17 test. Tap highlights Coptic
  + sourced Arabic (ADR-022). Most liturgical tokens still unmarked
  (129 / 117 unique after Thabet harvest).
  `khen-efran` still points at missing `/audio/prayers/` (S13c).
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- `grammar-rules.json` — **10/10** owner notes; **13** affixes parseReady (test)
- `pronunciation.json` — two systems, diphthongs, jinkim, pitfalls, drills,
  **spellList** (كي Coptic vs Greek stems the six endings miss)
- Routes: previous plus **`/quiz`**. Leitner key `learn-coptic:leitner`.
- Production: https://learn-coptic.vercel.app.
- GitHub `README.md` lists live learner features (audio, search, quiz,
  prayers, dictionary). S13c / S14 / S15 stay in Next, not as shipped.

## Notes

- Theme `learn-coptic:theme`. Font `learn-coptic:coptic-font`. Quiz `learn-coptic:leitner`.
- ADR-020: never guess prayer glosses; teaching-set `wordId` only.
- ADR-022: S17 test parse; harvest is a search key into the prayer line only.
- ADR-023: Thabet unique lemmas only; never overwrite stored rows.
- Production speak: `src/lib/pronounce.ts` + `SpeakLines` on prayers,
  word cards, search. Six Greek endings turn on stored Greek letter
  rules. No `analyzeWord` on those surfaces (ADR-024).
- `legacy/` and `.extract/` are gitignored.
