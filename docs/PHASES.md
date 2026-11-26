# Phases — learn-coptic

The open work, in the order the developer needs it. What exists today is the baseline (`docs/SCOPE.md`
§Baseline) and is never planned again. Each S-step of `IMPLEMENTATION_PLAN.md` that is still open maps to the rows
named in `docs/SCOPE.md` §2 (OD-06). A row with a Gate ends a unit: its tasks reach `main` only by the developer's
merge of that unit's acceptance pull request.

| Phase | Name | What the developer can use when it ends |
|---|---|---|
| P01 | Checks and tests | DEV_OS's checks run on every task; the logic that had no tests has them; one browser test walks the core flow |
| P02 | Lessons | `docs/gaps.md` is current; Level 2 grammar lessons and the pronunciation lessons are on screen (S15) |
| P03 | Word art | Teaching-set concrete nouns are tagged and the site can show their art, a whole theme at a time (S14) |
| P04 | Prayer audio | One prayer plays with its lines highlighted in time (S13c) |
| P05 | Readiness | The live pages pass the production-readiness checks |

| Task | Phase | Station | Name | Risk | Gate | Done | Verdict |
|---|---|---|---|---|---|---|---|
| T01 | P01 | J4 | DEV_OS checks run on the code as it is | 3 | G-Checks | [ ] | FAIL a1 — docs/reviews/T01-a1.md |
| T02 | P01 | J4 | Unit tests: Leitner boxes, Coptic text normalising and search | 2 | — | [ ] | — |
| T03 | P01 | J4 | Unit tests: prayer tokenizer, affix peel and Arabic highlighting | 2 | — | [ ] | — |
| T04 | P01 | J4 | Browser evidence tools and one end-to-end test of the core flow | 2 | G-Tests | [ ] | — |
| T05 | P02 | J8 | Refresh the prayer-gap inventory in docs/gaps.md | 1 | — | [ ] | — |
| T06 | P02 | J8 | Grammar lessons: Level 2 lesson list and stepped lesson pages | 2 | — | [ ] | — |
| T07 | P02 | J8 | Pronunciation lessons from pronunciation.json | 2 | G-Lessons | [ ] | — |
| T08 | P03 | J7 | Tag partOfSpeech on the 121 teaching-set lexicon rows | 3 | — | [ ] | — |
| T09 | P03 | J4 | Artwork schema: ai-generated licence and provenance | 3 | — | [ ] | — |
| T10 | P03 | J8 | Word art on teaching-set cards, shown a whole theme at a time | 2 | G-Art | [ ] | — |
| T11 | P04 | J8 | Synced prayer audio for one prayer | 3 | G-Prayer-Audio | [ ] | — |
| T12 | P05 | J9 | Production readiness of the live pages (launch task) | 3 | G-Readiness | [ ] | — |

## Notes on the rows

- **T01** is risk 3: it adds `pnpm-lock.yaml` beside `package-lock.json`, and Vercel picks its package manager from
  the lockfiles, so it touches how production builds (OD-04, OD-05). It builds no feature.
- **T02–T04** are the tests the developer asked for. T04 also adds `@playwright/test` and `@axe-core/playwright`,
  the tools of the runner's UI evidence (`docs/method/DESIGN_METHOD.md` §4); every later screen task needs them.
- **T08** changes `src/data/json/words.json` (domain content): it stops at the developer's gate (OD-07), and no tag
  is guessed.
- **T09** is a schema change (`src/data/schema/index.ts`): risk 3 and the developer's gate.
- **T10** needs a complete themed batch of images with their licence to show anything; until one exists the cards
  stay as they are (`docs/OPEN_QUESTIONS.md`).
- **T11** needs one prayer recording whose reciter gave written consent; it changes `prayers.json` timings
  (domain content) and stays in `public/` only while the file is under about two minutes (ADR-016, OD-25).
- **T12** is the launch task of PR-88 for a site that is already live: it adds no feature.
- Not rows: S10b word audio (optional, no date) and the human decisions listed in `docs/SCOPE.md` §3.
