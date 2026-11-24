# DEV_OS fit — learn-coptic

The fit research of handbook §17, for an **adoption**: DEV_OS is added to a product that is already live. It decides
what of the method the project needs, what it drops and what it adapts. Unverified points are marked
**assumption** (§11). The developer approves it by merging the adoption pull request.

## 1. The project

A free, Arabic-first site that teaches Bohairic Coptic to church learners: 32 letters with audio, a 11,858-word
dictionary behind a 147-word teaching set, four prayers with tap-a-word highlighting, Leitner quizzes, a PWA. Next.js
16.3 (App Router), React 19, TypeScript, Tailwind 4, shadcn/Radix, Motion, Zod, Fuse.js; npm; Vercel through its
GitHub integration. No backend, no database, no sign-in. Built in three days by one person; no tests and no CI before
the adoption. Inputs read: `.devos/adopt/brief.md` and `brief.json` (the authority), `.devos/adopt/survey.json`,
`devos/answers.json`, `.devos/adopt/aside.json` and the three files it moved, the code, `README.md`,
`IMPLEMENTATION_PLAN.md`, `AGENTS.md`, `.cursor/rules/` and `docs/`.

## 2. Profile and data classification

- **Profile A** (OD-01). The product collects no personal data (brief, "Personal data"). The **Boundary gate** is
  non-waivable; `docs/BOUNDARY_MODEL.md` declares the three zones the code already has (learner progress,
  preferences, the search box), none with personal data.
- **Data classes:** public content (`src/data/json/`, published under the licences of `docs/security.md`); the
  visitor's own device-local state (`localStorage` `learn-coptic:*`), never sent. No secret exists or is needed.
- **Domain gate — content:** the Coptic and Arabic content is the developer's to decide, like a client's clinical
  content in the reference project: every change to `src/data/json/**` or its schema stops at the developer's gate
  (OD-07), and nothing is invented (`docs/STACK.md` §6).

## 3. Layers — Include · Omit · Adapt

| Layer / module | Decision | Reason |
|---|---|---|
| Framework (Next.js App Router) | Include, as it is | the project's stack (survey `stack`); `docs/STACK.md` |
| `[locale]` routing, message catalogues | **Omit** | one interface language (Arabic); `docs/I18N_MODEL.md`; the default `en` catalogue is removed from `guard:i18n` |
| Styling (tokens, logical properties) | Include, as it is | `docs/DESIGN_SYSTEM.md` |
| Backend module (Supabase), `DATA_MODEL.md`, `PROTECTION_MODEL.md` | **Omit** | `stores_data` false; no database (OD-11) |
| Storage (R2), Firebase | **Omit** now | none in use; OD-25 allows object storage for a recording over two minutes, which would be a new OD and module |
| Sign-in, payments, email, jobs, product AI | **Omit** | none in the brief |
| Search | Include, as it is | Fuse.js over a build-time index (S12) |
| Hosting / deploy | **Adapt**: the project's own | Vercel's Git integration stays (OD-04); DEV_OS's `devos-deploy` is never switched on |
| Observability (logger, error tracking) | **Omit** | `modules.observability` is `none`; no server to log; the blueprint's T01 logger does not apply |
| Security headers | Include, as they are | already set in `next.config.ts` (S9); risk 3 and the developer's gate to change |
| Media generation | **Omit** | `modules.media` is `none`; art and recordings are content the developer supplies with their licence |
| UI evidence (Playwright, axe) | **Adapt** | added by T04, not T01: T01 fixes only what stops a check from running |
| Feature modules (`structure.modules`) | **Adapt** | `src/data` is declared with its public entries; the flat `src/lib` and `src/components` stay as the baseline; new areas go in `src/features/<name>/` |
| Package manager | **Adapt** (OD-05) | the engine checks with pnpm; the project keeps npm; two lockfiles of the same versions |
| CI | **Adapt** (OD-08) | DEV_OS's task checks (`devos/checks`) and `ci` on `main`; no workflow on hand-opened pull requests |
| Content gate | **Include** (OD-07) | the developer's rule that data changes are a human decision |

## 4. Obligations

- **Licensing is the main legal risk** (`docs/security.md`): FreeSerif GPL-3.0-or-later WITH Font-exception-2.0 and
  its extended exception (OD-22); Noto Sans Coptic and Cairo under the SIL OFL 1.1; Athanasius Plain shipped on the
  owner's authorisation with no written grant (OD-24); letter audio on the owner's church-reuse decision (OD-25);
  Andreas lemmas CC BY-SA 4.0 (OD-27); Thabet lemmas labelled Public Domain Mark 1.0 (OD-32); Psalm 50 Coptic from
  SCRIPTORIUM CC BY 4.0; the Coptic for All text and the agpeya.org Arabic still need a written note; reciters need
  written consent. Each open item is in `docs/SCOPE.md` §3. Source: the project's own `docs/security.md` and
  `docs/sources.md`.
- **Personal data law:** the product processes no personal data, so no data-protection regime's duties are triggered
  by it. **Assumption:** the learners are mostly in Egypt, whose Personal Data Protection Law (Law 151 of 2020) would
  apply only if the product started to collect personal data; a zone with personal data is a signed OD that brings
  the Personal-Data Protection gate first (PR-19).
- **Public repository:** no operational weakness assessment of third-party systems in the repository; no CI trigger
  that runs fork code with repository context (handbook §7). DEV_OS's workflows hold to that (PR-90).

## 5. Stack fit

- The Next.js 16 stack is the method's reference stack, so every guard reads it (`guards.source_roots` `src`).
- **The engine runs Node projects with pnpm**; this project uses npm. T01 bridges it (OD-05) without changing the
  deploy, once the developer sets two Vercel settings.
- **The engine wants five scripts**; the project has `lint` and `build`. T01 adds `typecheck`
  (`next typegen && tsc --noEmit`: the routes use the generated `PageProps`/`LayoutProps` helpers) and `test` (Node's
  test runner through `tsx`, no new dependency).
- **Cairo and Noto Sans Coptic** come from `next/font/google` at build time, so PR-24's font retry applies.
- **Next.js 16 has breaking changes** (`AGENTS.md`): every fence that writes Next code tells the builder to read
  `node_modules/next/dist/docs/` first.

## 6. Stations, gates, documents and guards this project needs

- **Stations:** J0–J3 are done (the baseline: the product, its scope, models and design exist). J4 foundation →
  T01–T04. J7 content → T08. J8 features → T05–T07, T10, T11. J9 hardening → T12. J10 handover does not apply (the
  developer is the owner and the product is live). J11 is the running state.
- **Gates:** G-Checks (T01), G-Tests (T04), G-Lessons (T07), G-Art (T10), G-Prayer-Audio (T11), G-Readiness (T12);
  the non-waivable Boundary gate at every task that touches routes, storage or forms; the content gate of OD-07.
- **Documents:** `PRODUCT_BRIEF`, `GLOSSARY`, `DECISIONS`, `SCOPE`, `CONTENT_MODEL`, `BOUNDARY_MODEL`,
  `SECURITY_MODEL`, `I18N_MODEL`, `DESIGN_SYSTEM` with `design/UI_ACCEPTANCE` and `design/REFERENCES`, `STACK`,
  `PHASES`, `SESSION_CONTEXT`, `DEVELOPMENT_JOURNAL`, `OPEN_QUESTIONS`, this file. Not needed: `DATA_MODEL`,
  `PROTECTION_MODEL`, `ADMIN_SPEC` (no dashboard), `CUTOVER_RUNBOOK` (already live; the deploy is not moved).
- **Guards that bite here:** `secrets`, `phases`, `naming` (GLOSSARY §3), `design`, `i18n`, `boundary` (the zones),
  `literals`, `imports` (the `data` module), `scope`, `deps` (with `pnpm audit`), `fences`, `design-spec`. N/A:
  `data`, `services`, `media`. `naming`, `design`, `i18n`, `literals` and `imports` start from the baseline
  (PR-68); `secrets` and `boundary` never do.

## 7. Modules

`devos/answers.json` `modules` are all `none`: no provider is planned, and no setup key is needed for the product.
`devos/project.json` `structure.modules`: `data` (exists), `lessons`, `word-art`, `prayer-audio` (built by T06–T07,
T10, T11).

## 7a. Tooling review

The adoption rule forbids opening a web page in this run, so `https://cursor.com/marketplace` and
`https://cursor.com/docs/models` were **not read**; the decisions below rest on the tools DEV_OS already ships and
on the project's needs (**assumption**: nothing on the marketplace would change them). Every tool is judged against
the Boundary gate, "a tool is never authority", "a connected MCP is not permission" and the runner owning git.

| Tool | Decision | Reason |
|---|---|---|
| Context7 MCP (current library docs) | **Include** — cycle (`devos/ci/mcp.ci.json`, `mcp.claude.json`) and local | read-only; Next.js 16 changed its APIs (`AGENTS.md`); PR-47 |
| Playwright MCP | **Include** — local only (`.cursor/mcp.example.json`) | lets the developer look at a screen interactively; the cycle's own evidence is `screens.mjs` (`docs/method/DESIGN_METHOD.md` §6) |
| Vercel MCP | **Omit** | production deploys on every push to `main`; no agent may touch the deploy (OD-04) |
| GitHub MCP | **Omit** | the runner owns git and pull requests (PR-04) |
| Supabase, Firebase MCP | **Omit** | no backend |
| Chrome DevTools MCP, shadcn MCP | **Omit** | the runner's captures and axe are the evidence; the components are already chosen |
| Cursor rules | **Include** — DEV_OS's (`00`, `10`, `20`, `30`, `40`, `50`, `60`, `70`–`72`) beside the project's `10-step-closeout.mdc` and `20-ui.mdc` | the project's two rules stay in force; DEV_OS's `10-security-data` and `30-vocabulary` are filled for this project |
| DEV_OS skills (`devos/skills/`) | **Include** as shipped | selected by each fence's layers (PR-55) |

`.cursor/mcp.example.json` and `devos/ci/mcp.ci.json` already hold exactly these servers, so they stay as installed.

## 8. How this adoption differs from a new project's blueprint

- T01 is not the scaffold: it makes DEV_OS's checks run on the code as it is and builds nothing.
- No logger, no health route and no observability provider: the product has no server (§3).
- The project's `README.md` is kept as it is: it is the project's own document, and the adoption changes none.
- `CLAUDE.md` is written to `.devos/adopt/CLAUDE.md`; devos places it after the project's own `CLAUDE.md`.
- `docs/method/CARRY_FORWARDS.md` is not written: in an adoption only PR-01 of `docs/method/` changes. There is no
  open carry-forward; the first one a task lands creates the file.
- `docs/DECISIONS.md` and `docs/GLOSSARY.md` replace the project's lower-case files on case-insensitive disks; devos
  moved those to `docs/before-adopt/`, and their content is carried in full (OD-10 to OD-32; GLOSSARY §2). The brief
  had expected DEV_OS to write into the lower-case files; the move made that impossible, and nothing was lost.

## 9. Rules of the project, and of the handbook, that change or drop

- **Carried** from `docs/before-adopt/cursor-rules/00-project.mdc` and `docs/rules.md`: the seven non-negotiable
  rules (`docs/STACK.md` §6), the data model, the closeout rule (`docs/STACK.md` §7).
- **Superseded**, because it would weaken who runs git: "one branch per step `s<n>-<name>`, squash-merge" and "Show
  the diff … ask one question" as a session protocol. Branches, commits and merges are the runner's and the
  developer's (OD-02, OD-06).
- **Kept as the project's**: "Do not tick a GATE step until the human has said PASS" — in DEV_OS the developer's merge
  is that PASS.
- **Handbook rules dropped:** owner form, estate inventory, quotation and cutover (J0, J1, J10): the developer is the
  owner and the product is already live. Private repository by default (§16.6): the repository is public by the
  developer's choice and holds no personal data.

## 10. Questions

The brief had none. The four the adoption raised are in `docs/OPEN_QUESTIONS.md`; for each, the plan takes the safer
option until the developer answers.

## 11. Assumptions

1. Vercel picks pnpm over npm when both lockfiles exist; the Install and Build Command overrides of OD-05 §3 keep
   production on npm. (Not verified in this run.)
2. `next typegen` exists in Next.js 16.3 and generates the route types `tsc` needs; T01 tells the builder to use the
   documented command if it differs.
3. Node 22's test runner expands the glob in `tsx --test "tests/**/*.test.ts"`.
4. `pnpm import` reproduces `package-lock.json`'s versions, and pnpm's layout builds the project as npm's does; T01
   HALTs and reports if not.
5. The existing code passes `tsc --noEmit` and `eslint` with DEV_OS's folders ignored (the Vercel build type-checks
   it today); T01 HALTs and reports any finding in product code rather than editing it.
6. `pnpm audit` finds no high or critical advisory in the current dependencies; if it does, T01 HALTs and the
   developer decides.
7. The builder id in T01 (`default`) is a placeholder: the developer's agents are chosen at `devos adopt` (PR-99), and
   the runner uses the pool's default builder for an id it does not know.
8. The learners are mostly in Egypt (§4).
9. No marketplace tool would change §7a (§7a).
