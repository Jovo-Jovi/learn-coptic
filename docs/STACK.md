# Stack — learn-coptic

The stack the project uses today, in one page. It is not a new stack: every version below is the one `package.json`
pins on `main` at adoption (`9f6ae1b`). A change of stack is a decision (OD), never part of a feature task.

## 1. What it is built with

| Layer | Choice | Version (package.json) | Why it is here |
|---|---|---|---|
| Framework | Next.js, App Router, statically generated pages | `next` 16.3.3 | the whole site; `AGENTS.md`: its APIs differ from older Next.js, read `node_modules/next/dist/docs/` first |
| UI | React | `react`, `react-dom` 19.2.8 | — |
| Language | TypeScript, `strict` | `typescript` ^5 | — |
| Styling | Tailwind CSS 4 over the tokens in `src/app/globals.css` | `tailwindcss` ^4, `@tailwindcss/postcss` ^4 | `docs/DESIGN_SYSTEM.md` |
| Components | shadcn/ui on Radix primitives (accordion, button) | `shadcn` ^4.19.1, `radix-ui` ^1.6.7, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react` | OD-18 (ADR-009) names each |
| Motion | Motion, with `prefers-reduced-motion` respected | `motion` ^13.1.1 | S5b |
| Data checks | Zod schema of every JSON file | `zod` ^4.5.4 | OD-13 (ADR-004) |
| Search | Fuse.js over an index built at build time | `fuse.js` ^7.5.0 | S12 |
| Scripts | `tsx` for the TypeScript scripts; `node-html-parser` for the legacy extractor | `tsx` ^4.23.13, `node-html-parser` ^9.0.2 | — |
| Lint | ESLint 9 with `eslint-config-next` (core web vitals, TypeScript) | `eslint` ^9, `eslint-config-next` 16.3.3 | — |
| Fonts | served from the site itself: GNU FreeSerif and Athanasius Plain with `next/font/local` (files in `src/app/fonts/`); Cairo and Noto Sans Coptic with `next/font/google`, which downloads them at build time and self-hosts them | `src/app/fonts.ts` | `docs/security.md`; the build-time download is why a Google Fonts failure is retried (PR-24) |
| Hosting | Vercel, connected to the GitHub repository | — | OD-04: every push to `main` deploys production |
| Storage of learner state | the visitor's own browser, `localStorage` keys `learn-coptic:*` | — | OD-11 (ADR-002); `docs/BOUNDARY_MODEL.md` |

There is no backend, no database, no sign-in, no route handler, no payment and no analytics. DEV_OS's backend,
storage and Firebase modules are not used (`devos/answers.json` `modules` are all `none`).

## 2. Package managers: npm for the project, pnpm for DEV_OS's checks (OD-05)

- **npm is the project's package manager.** The developer runs `npm install`, `npm run dev`, `npm run validate` and
  `npm run build` as `README.md` says, and Vercel builds production with npm from `package-lock.json`.
- **DEV_OS's checks run the same `package.json` scripts with pnpm**, from `pnpm-lock.yaml`, which T01 generates from
  `package-lock.json` with `pnpm import`. The engine runs every Node project this way.
- **Both lockfiles describe the same versions.** A task that adds, removes or upgrades a package changes
  `package.json` with npm (`npm install <pkg>@<version>`), then regenerates the pnpm lockfile with `pnpm import`, and
  names both lockfiles' changes in its report. A task never edits a lockfile by hand.
- `"prebuild": "npm run validate"` stays as it is: the validator runs inside every build, with either manager.

## 3. Folder layout

| Folder | What it holds |
|---|---|
| `src/app/` | the routes (`/`, `/alphabet`, `/alphabet/[group]`, `/group/[id]`, `/letter/[id]`, `/vocabulary` with its `group/[id]` and `letter/[id]` pages, `/search`, `/practice`, `/practice/group/[id]`, `/quiz`, `/prayers`, `/prayers/[id]`, `/about`), `layout.tsx`, `manifest.ts`, `robots.ts`, the icons and `fonts/` |
| `src/components/` | the UI pieces; `src/components/ui/` the shadcn components |
| `src/lib/` | the logic: letters, words, curriculum, prayers, search, Leitner boxes, Coptic text, parse and affix peel, Arabic highlighting, theme |
| `src/data/` | **the data module** (`structure.modules.data`): `json/` the content, `schema/index.ts` the Zod schema, `generated/` the search index and the hygiene report the validator writes |
| `src/features/<name>/` | new feature areas the phases build, each a folder with an `index.ts` public entry (`lessons`, `word-art`, `prayer-audio`); the task that first builds one creates its folder and entry |
| `scripts/` | the validator (`validate.mts`), the harvest, seed, migrate and gaps scripts, the brand image renderer |
| `tests/` | the product's tests (T01 adds the first) |
| `public/` | letter audio, icons, the Open Graph image, the service worker `sw.js` |
| `docs/` | the project's own documents and DEV_OS's, side by side; `docs/before-adopt/` keeps the three files DEV_OS's names displaced |

**Architecture rules.** The logic and the data sit below the UI: nothing in `src/lib/` or `src/data/` imports from
`src/components/` or `src/app/` (`tests/architecture.test.ts`, T01). Code outside a declared module reaches it only
through its public entry (`guard:imports`, PR-58): for `src/data`, the schema and the JSON files listed in
`devos/project.json`. The flat files of `src/lib/` and `src/components/` are the baseline (PR-68) and stay where they
are; a task moves one only when its fence says so.

## 4. Commands

The five checks DEV_OS runs (`devos.config.json` `stack.commands`), and the developer's own equivalents:

| Check | DEV_OS runs | The developer runs | What it does |
|---|---|---|---|
| install | `pnpm install --frozen-lockfile` | `npm ci` | installs exactly the locked versions |
| typecheck | `pnpm run typecheck` | `npm run typecheck` | `next typegen && tsc --noEmit` (T01): generates the route types, then checks every TypeScript file |
| lint | `pnpm run lint` | `npm run lint` | `eslint`, DEV_OS's method folders ignored (T01) |
| test | `pnpm run test` | `npm test` | `tsx --test "tests/**/*.test.ts"`: Node's own test runner (T01) |
| build | `pnpm run build` | `npm run build` | `prebuild` runs the validator, then `next build` |

Also: `npm run validate` (the data validator alone), `npm run dev` (local server), `npx tsx scripts/report-gaps.mts`
(rewrites `docs/gaps.md`, never touches `src/data/json/`). T04 adds an `e2e` script (Playwright), DEV_OS's optional
check.

## 5. How to test

- **Unit tests** use `node:test` and `node:assert/strict`, run by `tsx --test`, in `tests/**/*.test.ts`. A test
  imports the module it tests through `@/…` or a relative path, never a copy of its code.
- **Fixtures are synthetic or copied from the committed JSON**, never typed from memory: a test that needs a Coptic
  word reads it from `src/data/json/` or quotes a string that is already there. A test never writes to
  `src/data/json/`.
- **The validator is a test of the data.** It checks the shape, the cross-references and eight grammar-parse
  fixtures, and stops the build when they fail. It is not replaced by unit tests.
- **Browser tests** (T04 onward) use `@playwright/test` against the production build, with `@axe-core/playwright`
  for accessibility. The runner captures every screen a fence names (`docs/method/DESIGN_METHOD.md` §4).
- Every Done-when item a task claims is proved by a test or a command whose output is in its report (PR-22).

## 6. The project's rules (carried from `docs/before-adopt/cursor-rules/00-project.mdc` and `docs/rules.md`)

1. **Never edit `src/data/json/` to make a build or a test pass.** If the validator fails, report the conflict and
   stop. Data changes are the developer's decision (OD-07). This is the most important rule in the repository.
2. **The default Coptic paint is Unicode.** Manuscript mode (Athanasius Plain) paints the stored `athanasiusKey`
   with the mapped TTF while the Unicode stays in the DOM for copy and screen readers. Never invent a key; never use
   a mapped face as a Unicode `font-family` (OD-24).
3. **A mapped Coptic TTF ships only as an optional picker face**, when the file is in `src/app/fonts/` and its keymap
   is this project's explorer `athanasiusKey`. Files not in the repository stay out (CS Avva Shenouda, Pope Shenouda
   III, CS Pishoi, CS New Athanasius, Antinoou, Coptic1). The default Coptic faces stay GNU FreeSerif and Noto Sans
   Coptic.
4. **Never invent a Coptic letter, word, gloss, transliteration or Unicode codepoint.** Leave it null and say so. A
   wrong glyph teaches a person the wrong thing; a blank is better.
5. **Arabic is the primary language.** Page chrome is `dir="rtl"`. Every Coptic or Latin string inside Arabic text is
   in an LTR isolate. English is one small secondary line, never a parallel column.
6. **No new dependency without the reason stated first**, in the fence (`- Dependencies:`, PR-85) and the report:
   `npm audit` clean, a look at anything with fewer than about 100k weekly downloads, zero-dependency preferred.
7. **The validator passes before a task is reported done.**

## 7. Conventions every task follows

- **Phone first.** Design at 375 px, then widen; no horizontal scroll at 375 px in either theme. The runner captures
  at 390 and 1280.
- **No new `any`.** TypeScript stays strict.
- **No hex colour in a component.** Colours come from the tokens in `src/app/globals.css`, through Tailwind.
- **Learner progress format.** `localStorage` `learn-coptic:leitner` is format version 1. A change to its shape keeps
  the learners' saved progress: it reads version 1, migrates it and writes the new version, and its test proves it.
  Silently dropping progress is a defect.
- **The service worker.** `public/sw.js` reaches every phone that installed the app; its cache name is fixed
  (`learn-coptic-v1`). A change to it bumps the cache name and is reviewed deep at the developer's gate (OD-07).
- **The headers.** The CSP and the other headers in `next.config.ts` stay as strict as they are. No outside script,
  font, image host or analytics is added (`docs/SECURITY_MODEL.md`).
- **Licences.** A new font, audio file, image or dictionary source records its licence in the same task that adds
  it (`docs/security.md`). Without a recorded licence or the owner's written decision, it does not ship.
- **Logging.** The product has no server, so it has no logger: a client error is handled where it happens and the
  learner sees a calm Arabic message. No log leaves the browser, and no error tracker is added without a decision.
- **Closeout.** Every task also keeps the project's own record, as `.cursor/rules/10-step-closeout.mdc` says: an entry
  at the top of `docs/journal.md`, `docs/session-context.md` brought up to date, and the S-step's criteria ticked in
  `IMPLEMENTATION_PLAN.md` when its fence says so (OD-06). Its fence names those files in its Paths.
- **Commit and branch names are the runner's** (PR-04): the old `s<n>-<name>` branches and squash-merge convention of
  `docs/rules.md` give way to DEV_OS's `task/Tnn` branches and units (OD-02).
