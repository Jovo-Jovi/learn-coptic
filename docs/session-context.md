# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `0c0cc3d`. S9 GATE passed 2026-09-01.
**Live:** https://learn-coptic.vercel.app
**Validator:** ✓ 32 letters, 11858 words, 4 prayers, 2 levels · teaching 147 · grammar 10/10 · 13 parseReady (S17 test) · S16 hygiene report · every prayer line has tokens

## Current position

**Done:** S0–S12, S13a, **S16**, **S13b**, **S11**. S17 parse **test slice**
(GATE not PASS). S18 Andreas leftovers + unique Thabet lemmas harvested.
**Next:** human S17 **PASS**. Prayer-token blanks in `docs/gaps.md`. S13c
audio. S14. S15.
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
- `pronunciation.json` — two systems, diphthongs, jinkim, pitfalls, drills
- Routes: previous plus **`/quiz`**. Leitner key `learn-coptic:leitner`.
- Production: https://learn-coptic.vercel.app.
- GitHub `README.md` lists live learner features (audio, search, quiz,
  prayers, dictionary). S13c / S14 / S15 stay in Next, not as shipped.

## Notes

- Theme `learn-coptic:theme`. Font `learn-coptic:coptic-font`. Quiz `learn-coptic:leitner`.
- ADR-020: never guess prayer glosses; teaching-set `wordId` only.
- ADR-022: S17 test parse; harvest is a search key into the prayer line only.
- ADR-023: Thabet unique lemmas only; never overwrite stored rows.
- `legacy/` and `.extract/` are gitignored.
