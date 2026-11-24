# Scope — learn-coptic

## Baseline (what exists today)

The product as it is on `main` at adoption (`9f6ae1b`, live at https://learn-coptic.vercel.app). It is recorded once,
as it is (OD-01, PR-68), and **nothing in this list is planned again**. A later task changes one of these only when its
fence says so, and then only new or changed code must pass DEV_OS's checks.

| Feature (brief, "What is done") | Where it lives | S-step |
|---|---|---|
| Alphabet: 32 letters in 7 colour groups, a flat grid, group filter pages | `src/app/alphabet/`, `src/app/alphabet/[group]/`, `src/app/group/[id]/`; `src/components/AlphabetView.tsx`, `LetterGrid.tsx`, `LetterCard.tsx`, `GroupFilter.tsx`, `GroupCard.tsx`; `src/lib/letters.ts` | S5, S5b, S5c |
| Letter pages: a large glyph copyable as Unicode, the Arabic name, pronunciation rules in an accordion, example words, previous and next | `src/app/letter/[id]/`; `src/components/LetterHero.tsx`, `RulesAccordion.tsx`, `ExampleWords.tsx`, `LetterNeighbors.tsx`, `LetterBackNav.tsx`; `src/lib/copy-text.ts` | S6 |
| Letter audio: 32 clips, playback that works on iOS Safari | `public/audio/letters/`; `src/components/AudioButton.tsx` | S10 |
| Vocabulary: tap to reveal the meaning, filters by group and by letter, drills apart from dictionary entries, unpublished words hidden | `src/app/vocabulary/` (and its `group/[id]`, `letter/[id]`); `src/components/VocabularyHome.tsx`, `VocabularyView.tsx`, `VocabularyFilter.tsx`, `WordGrid.tsx`, `WordCard.tsx`, `FilterableWordGrid.tsx`, `HarvestLetterLinks.tsx`; `src/lib/words.ts` | S7 |
| Dictionary: 11,858 words (the 147-word teaching set, Andreas of St Macarius lemmas, unique Osama Thabet lemmas) | `src/data/json/words.json`; `scripts/harvest-andreas.mjs`, `scripts/harvest-thabet.mjs` | S2, S16, S18 |
| Search: Fuse.js over letters, words and prayer titles, Arabic or Coptic, index built at build time | `src/app/search/`; `src/components/WordSearch.tsx`; `src/lib/search.ts`, `search-core.ts`; `src/data/generated/search-records.json` | S12 |
| Practice and quiz: reading practice by group; Leitner-box quizzes (glyph→sound, sound→glyph, word→meaning on the teaching set) with a reset button | `src/app/practice/`, `src/app/practice/group/[id]/`, `src/app/quiz/`; `src/components/MeaningPractice.tsx`, `QuizSession.tsx`; `src/lib/leitner.ts` | S11 |
| Prayers: four prayers in Coptic and Arabic; tapping a Coptic word highlights its meaning in the Arabic line where a sourced match exists | `src/app/prayers/`, `src/app/prayers/[id]/`; `src/components/PrayerReader.tsx`, `PrayerLines.tsx`, `MixedCopticText.tsx`; `src/lib/prayers.ts`, `resolve-word.ts`, `prayer-line-highlight.ts`, `arabic-highlight.ts` | S13a, S13b |
| Grammar-parse test slice: 13 affixes `parseReady`, used for prayer highlighting | `src/data/json/grammar-rules.json`; `src/lib/coptic-parse.ts`, `coptic-affix.ts`, `grammar-rules.ts` | S17 (built; its GATE is recorded by T01, OD-06) |
| `/about`: font, content and audio licences, how to contribute | `src/app/about/` | S8 |
| Dark theme by default with a light toggle; a Coptic font picker (serif, sans, Athanasius manuscript mode) | `src/app/globals.css`, `src/app/fonts.ts`, `src/app/fonts/`; `src/components/ThemeToggle.tsx`, `FontSelect.tsx`, `CopticPaint.tsx`; `src/lib/theme.ts` | S3, S4 |
| PWA: manifest, icons, a service worker with an offline fallback, a WhatsApp/Open Graph preview image | `src/app/manifest.ts`, `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `public/sw.js`, `public/icons/`, `public/og.png`; `src/components/PwaRegister.tsx`; `scripts/render-brand-images.tsx` | S9 |
| Security headers on every route (CSP, nosniff, frame deny, referrer and permissions policy) | `next.config.ts` | S9 |
| The data validator stops the build when content is broken | `scripts/validate.mts` (`prebuild`); `src/data/schema/index.ts` | S0 |
| The app shell: RTL Arabic, bottom navigation, landing page | `src/app/layout.tsx`, `src/app/page.tsx`; `src/components/BottomNav.tsx`, `HeroGlyphs.tsx`, `MotionProvider.tsx` | S4, S8 |

## 1. New work (in `docs/PHASES.md` order)

| # | Work | Rows | Source |
|---|---|---|---|
| 1 | DEV_OS's checks run on the code as it is | T01 | adoption (PR-49, PR-68) |
| 2 | Unit tests for the logic that has none: Leitner boxes, Coptic normalising, search, the prayer tokenizer, affix peel and Arabic highlighting | T02, T03 | brief, "What DEV_OS will add" |
| 3 | The browser evidence tools and one end-to-end test of the core flow (home → alphabet → a letter → its audio button; a quiz answer) | T04 | brief; PR-51, PR-58 |
| 4 | S18: refresh `docs/gaps.md` from the current data | T05 | brief, "What is open" |
| 5 | S15: grammar lessons (Level 2 lesson list, stepped lessons from `grammar-rules.json`, prerequisites enforced, `LetterChip`/`WordCard` inline) and pronunciation lessons from `pronunciation.json`; no schema change | T06, T07 | brief; `IMPLEMENTATION_PLAN.md` S15 |
| 6 | S14: tag `partOfSpeech` on the 121 teaching lexicon rows; the artwork schema (`ai-generated` licence, provenance); art on teaching-set concrete nouns, 800×800 WebP through `next/image`, lazy, `alt.ar`, shown a whole theme at a time | T08, T09, T10 | brief; S14; OD-28 |
| 7 | S13c: one prayer end to end with a full recording and per-line `startSec`/`endSec`; the active line highlights during playback; tapping a line seeks; the text alone stays a complete lesson with the audio muted | T11 | brief; S13c; OD-25 |
| 8 | The launch task: production readiness of the live pages (headers, audit, accessibility, speed), no feature | T12 | scope `full`; PR-88 |

The plan has 12 tasks: four for the tests the developer asked for, eight for the open S-steps and readiness. Each
fits one builder run (`devos-fence-writing` §1).

## 2. How the open S-steps map

| S-step | State at adoption | Rows |
|---|---|---|
| S13c synced prayer audio | not started; `khen-efran` points at missing `/audio/prayers/` files | T11 |
| S14 teaching-set word art | not started; 2 of 121 lexicon rows tagged | T08, T09, T10 |
| S15 grammar lesson UI | not started; Level 2 stubbed | T06, T07 |
| S17 composition parse GATE | built; PASS given on the condition that the checks are green | recorded by T01 (OD-06) |
| S18 dictionary and prayer gaps | harvests done; gaps refresh open | T05 (the rest is §3) |
| S10b word audio | optional, no date | §Later |

## 3. Human decisions and content (no task; DEV_OS waits for them where a row depends on them)

- **S16:** which of the 10 homograph keys and article-shaped harvest rows to unpublish.
- **S18:** sourcing the 129 unmarked prayer tokens (117 unique forms): a human `gloss`/`arHighlight`, or more
  `parseReady` affixes (ⲙⲁⲣⲉ-, ⲁ- + subject, ⲛ̀ϫⲉ, ⲙ̀ⲙⲟ-, ⲉϫⲉⲛ); grants for KELLIA, Coptic Compass, coptic-words,
  copticmt and copticlingo before any merge.
- **Licences:** a written note for the Coptic for All text and the agpeya.org Arabic; a written grant for Athanasius
  Plain (its shipping is the owner's authorisation, OD-24); written consent from any word or prayer reciter before
  their audio is published (T11 needs one).
- **Images** for S14: who makes the first themed batch (T10 shows nothing until one is complete).

## Later

Built only when the developer asks with a change request:

- **S10b word audio** — teaching set only (147 rows); `AudioClip` is already nullable; no Andreas row is recorded; the
  build never fails on missing word audio.
- A check on pull requests the developer opens by hand (OD-08 §4).
- Moving the whole project to one package manager (OD-05).

## Out of scope

Accounts, sign-in, cross-device sync, a backend or database (OD-11); analytics of any kind beyond what
`docs/security.md` allows; art for the whole dictionary (OD-28); auto-glossing prayers from unverified harvest Arabic
(OD-29); harvesting Dawoud, Naqlun, Coptic Reader, Tasbeha or St-Takla without a grant (OD-27).
