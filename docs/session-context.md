# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `07cbea7` (prayer manuscript jinkim). S9 GATE passed 2026-09-01.
**Live:** https://learn-coptic.vercel.app
**Validator:** ✓ 32 letters, 8635 words, 4 prayers, 2 levels · 0 unpublished · 0/32 letters missing audio · 8635/8635 words missing audio

## Current position

**Done:** S0–S10, S12. Andreas harvest. `/search`. `/practice`. Four prayers
on `/prayers` (text + Arabic gloss, no audio).
**Next:** S11 quiz and progress — Leitner / sound quiz still not built.
**Blocked on:** nothing for S10. Other CS/Antinoou files still missing.

## Open decisions

- Owner authorized shipping Athanasius Plain (mapped) as optional manuscript
  mode on 2026-08-31 (ADR-015). copticchurch.net request is still not a grant.
- Other CS faces (Avva, Pope Shenouda III, Pishoi, New Athanasius) and
  Antinoou / Coptic1 stay out until the file is in `src/app/fonts/`.
- Coptic face default: GNU FreeSerif. Picker: سيريف / سانس / أثناسيوس.
  Key `learn-coptic:coptic-font`.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, **letter audio filled**
  (Coptic Literacy, `public/audio/letters/{id}.mp3`), `exampleWords[]` empty
- `words.json` — 8635 (8420 lexicon / 11 drill / 204 name), Unicode, all teaches[] resolve
  · HTML 147 + Andreas harvest. Harvested rows have empty translit.
  · 6 drills have `meaning: null`; 5 drills have a meaning
- `prayers.json` — 4 prayers (`khen-efran`, `lords-prayer`, `thanksgiving`,
  `psalm-50`). No real recording. Translit empty on the three new ones.
  Manuscript keys via `copticToAthanasiusKey` (backtick jinkim, not U+0300).
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- Group tokens `--group-N-from`/`to`/`glow`; `--group-N` aliases from
- Shell live. `/` `/about` `/alphabet` `/alphabet/[1-7]` `/group/[1-7]`
  `/letter/[id]` `/vocabulary` `/vocabulary/group/[1-7]` `/vocabulary/letter/[id]`
  `/practice` `/practice/group/[1-7]` `/search` `/prayers` `/prayers/[id]`.
- Cards show lowercase only. Letter page stacks كبير/صغير. Example words
  derived from `words.teaches`, not `letters.exampleWords`.
- Letter rules are always-on cards (ADR-017). Follow keys paint as
  Unicode Coptic chips (`ⲁ - ⲉ - ⲓ …`), not ASCII. Manuscript mode
  still uses stored athanasiusKey.
- PWA: `/manifest.webmanifest`, `/icons/icon-{192,512}.png`, SW `/sw.js` (prod).
- README hero snap: `docs/readme-hero.png` (landing floating glyphs, no glass tiles).
- Production: https://learn-coptic.vercel.app. Lighthouse mobile 97 / a11y 100 (2026-08-31).
- GitHub description + topics set 2026-08-31.
- Letter copy uses Clipboard + execCommand fallback. Link preview is `public/og.png`.
- Harvest refs: `docs/sources.md`. Andreas lemmas in `words.json` (ADR-018).
  Do not dump Reader / Tasbeha / Dawoud.

## Notes

- Theme key `learn-coptic:theme`. Dark is the primary skin. Prefix `learn-coptic:`.
- ADR-007 keymap; ADR-008 drills may have `meaning: null`.
- ADR-009 shadcn extras (lucide, tw-animate-css, CVA/clsx/twMerge).
- ADR-010 dark-first gradient pairs. Group 1 dark `to` is `#8f6bb3`.
- ADR-011 unicase cards; group titles from curriculum.json.
- ADR-012 FreeSerif is the default Unicode Coptic face.
- ADR-013 subset is GPL; Font-exception-2.0 extended; a request is not a grant.
- ADR-014 Coptic face picker: سيريف / سانس / أثناسيوس. Key `learn-coptic:coptic-font`.
- ADR-015 optional mapped Athanasius manuscript mode via `CopticPaint`.
- ADR-016 church letter clips from Coptic Literacy (owner reuse).
- ADR-018 Andreas harvest: Arabic glosses CC BY-SA; translit empty.
- Shell `max-w-6xl`. Phone first, then widen.
- `arabicHint` belongs on the letter surface.
- UI group numbers are Eastern digits (١..٧); routes stay ASCII (`/alphabet/4`).
- `legacy/` and `.extract/` are gitignored.
