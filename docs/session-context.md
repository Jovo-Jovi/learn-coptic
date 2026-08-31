# Session context

Paste this file at the top of a new review chat. Keep it under one screen.
Update it in the same commit as the work it describes.

---

**Repo:** https://github.com/Jovo-Jovi/learn-coptic · `main` · local `C:\Users\Marco\Desktop\learn-coptic`
**Stack:** Next 16, App Router, TS, Tailwind, Zod, Fuse.js. No backend.
**Last commit:** `b915616` (copy fallback + /og.png). S9 GATE still open.
**Live:** https://learn-coptic.vercel.app
**Validator:** ✓ 32 letters, 147 words, 1 prayer, 2 levels · 0 unpublished

## Current position

**Done:** S0–S8. S9: GitHub + Vercel URL live, Lighthouse 97/100, real-phone test. Header inset for tap targets. GATE not passed.
**Next:** Android Add to Home screen, then say **PASS**. Optional: hook Vercel GitHub app so pushes auto-deploy.
**Blocked on:** human GATE PASS. Android install not confirmed. Other CS/Antinoou files still missing.

## Open decisions

- Owner authorized shipping Athanasius Plain (mapped) as optional manuscript
  mode on 2026-08-31 (ADR-015). copticchurch.net request is still not a grant.
- Other CS faces (Avva, Pope Shenouda III, Pishoi, New Athanasius) and
  Antinoou / Coptic1 stay out until the file is in `src/app/fonts/`.
- Coptic face default: GNU FreeSerif. Picker: سيريف / سانس / أثناسيوس.
  Key `learn-coptic:coptic-font`.

## Known state of the data

- `letters.json` — 32, keys complete, 12 carry rules, no audio, `exampleWords[]` empty
- `words.json` — 147 (121 lexicon / 11 drill / 15 name), Unicode, all teaches[] resolve
  · 6 drills have `meaning: null`; 5 drills have a meaning
- `prayers.json` — 1 sample, no real recording
- `curriculum.json` — Level 1 complete, Level 2 stubbed
- Group tokens `--group-N-from`/`to`/`glow`; `--group-N` aliases from
- Shell live. `/` `/about` `/alphabet` `/alphabet/[1-7]` `/group/[1-7]`
  `/letter/[id]` `/vocabulary` `/vocabulary/group/[1-7]` `/vocabulary/letter/[id]`.
  `/practice` still unbuilt.
- Cards show lowercase only. Letter page stacks كبير/صغير. Example words
  derived from `words.teaches`, not `letters.exampleWords`.
- Letter rules are always-on cards; Coptic in the condition is LTR chips.
- PWA: `/manifest.webmanifest`, `/icons/icon-{192,512}.png`, SW `/sw.js` (prod).
- README hero snap: `docs/readme-hero.png` (landing floating glyphs, no glass tiles).
- Production: https://learn-coptic.vercel.app. Lighthouse mobile 97 / a11y 100 (2026-08-31).
- GitHub description + topics set 2026-08-31.
- Letter copy uses Clipboard + execCommand fallback. Link preview is `public/og.png`.

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
- Shell `max-w-6xl`. Phone first, then widen.
- `arabicHint` belongs on the letter surface.
- UI group numbers are Eastern digits (١..٧); routes stay ASCII (`/alphabet/4`).
- `legacy/` and `.extract/` are gitignored.
