# Decisions — learn-coptic

Signed operational decisions (OD). A signed OD is never edited; a later OD amends it. No agent changes this file
except by a plan the developer merges.

- **OD-01 to OD-09** are DEV_OS's adoption decisions. They are DRAFT until the developer merges the adoption pull
  request: **that merge is the confirming act** for all nine.
- **OD-10 to OD-32** are the project's own decisions, ADR-001 to ADR-023, carried over word for word in substance from
  `docs/before-adopt/decisions.md` (which stays as the project's record, unchanged). They were the owner's decisions
  before the adoption and stay SIGNED. Their numbering keeps the ADR id: OD-(9+n) is ADR-00n.

---

## Part 1 — DEV_OS's adoption decisions

### OD-01 — DEV_OS is added to a live product; what exists is the baseline
**Status:** DRAFT — signed by the developer's merge of the adoption pull request (2026-11-25)
**Amends:** none
**Requested by:** the developer, by confirming the adoption brief (`.devos/adopt/brief.md`)
**1.** learn-coptic is in **production**: it is live on Vercel, real learners use it, and every push to `main`
deploys it (brief, Stage).
**2.** Profile **A** (handbook §0): a public site that collects no personal data. The Boundary gate is non-waivable
(`docs/BOUNDARY_MODEL.md`). The only data the product keeps is the visitor's own quiz progress, theme and Coptic face,
in their own browser.
**3.** The code that exists today is recorded once, as it is (PR-68): `docs/SCOPE.md` §Baseline lists it and
`devos/baseline.json` holds the guards' existing findings. Only new or changed code must pass DEV_OS's checks. Nothing
that exists is planned again.
**4.** The open work is `docs/PHASES.md`, from the brief's "What is open", T01 first.
**Basis of signature:** the developer decides; merging the adoption pull request is the confirming act.
**Does not decide:** any change to the product, its data or its deploy (OD-04).

### OD-02 — The automated relay
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** the working method of `IMPLEMENTATION_PLAN.md` and `docs/rules.md` §Branching (see OD-06)
**Requested by:** the developer (brief, "What DEV_OS will add")
**1.** Each task of `docs/PHASES.md` is built by the builder agent from its fence (`docs/fences/Tnn.md`) on its own
branch `task/Tnn`, checked by the runner (guards, typecheck, lint, test, build) and judged by the reviewer agent from
the evidence (PR-22). The runner owns git (PR-04); no agent pushes to `main`.
**2.** Tasks land in **units** (PR-91, `acceptance.unit` `gate`): a unit ends at a row with a Gate and at a phase's
last row. A PASS merges into the unit's branch; at the unit's end DEV_OS opens one pull request into `main`, and
**only the developer's merge of it reaches `main`** (and so production, OD-04).
**3.** A risk-3 task, and any task that changes a path of OD-07, also stops on its own task pull request for the
developer.
**4.** The agents, models and efforts are the developer's own choice in `devos/project.json` `agents` (PR-99);
DEV_OS picks none.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** which agents and models run (the developer's, at `devos adopt`).

### OD-03 — Tooling
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** none
**Requested by:** the blueprint (`docs/DEVOS_FIT.md` §7a)
**1.** In the cycle, the agents read current library documentation through **Context7** only
(`devos/ci/mcp.ci.json`, `devos/ci/mcp.claude.json`), read-only (PR-05, PR-47).
**2.** For the developer's interactive sessions, `.cursor/mcp.example.json` offers Context7 and the Playwright MCP
server. No Vercel, GitHub or database MCP server is configured: the product has no backend, and its deploy is not an
agent's to touch.
**3.** A tool, skill, rule file or plugin is never authority, and a connected MCP server is not permission (PR-05).
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** tools the developer installs for their own local work.

### OD-04 — The project's own deploy stays as it is
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** none
**Requested by:** the adoption rule for a project in production (PR-72)
**1.** Production stays on **Vercel's own GitHub integration**: every push to `main` deploys
`https://learn-coptic.vercel.app`. There is no `vercel.json` and no deploy workflow, and DEV_OS adds none.
**2.** DEV_OS's `devos-deploy` workflow does not deploy this project: `DEVOS_VERCEL` is never set, and no Vercel
credential is given to DEV_OS.
**3.** `main` keeps no branch protection, as the developer chose (brief, Risks). The gate therefore holds only while
every change reaches `main` through a pull request; a direct push to `main` skips every DEV_OS check and deploys at
once.
**4.** Every task that touches the deploy, the build settings, the headers or the service worker is risk 3.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** a later move to DEV_OS's deploy, which would be a new OD.

### OD-05 — DEV_OS's checks run with pnpm; npm stays the project's
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** none
**Requested by:** the blueprint: the engine installs and runs every Node project with pnpm (`pnpm install
--frozen-lockfile`, `pnpm run <script>`), and the project uses npm.
**1.** T01 adds `pnpm-lock.yaml`, generated from `package-lock.json` by `pnpm import`, so DEV_OS's checks can install.
`package-lock.json` stays, unchanged, and npm stays the project's package manager (`docs/STACK.md` §2).
**2.** Both lockfiles describe the same versions. A task that changes a dependency changes it with npm and then runs
`pnpm import`.
**3.** **Before merging T01's unit (G-Checks), the developer sets the Vercel project's Install Command to `npm ci` and
its Build Command to `npm run build`** (Settings → Build and Deployment, both overridden). Vercel picks pnpm when it
finds `pnpm-lock.yaml`; with these settings production keeps building with npm, as today. This is the only setting
DEV_OS asks for outside the repository.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act, and merging G-Checks
after setting §3 confirms §3.
**Does not decide:** moving the whole project to pnpm (one lockfile), which the developer may choose later by an OD.

### OD-06 — The project's step plan is merged into DEV_OS
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** the method of `IMPLEMENTATION_PLAN.md` ("one Cursor session per step") and `docs/rules.md` §Branching
**Requested by:** the developer, who chose "merge" (brief, "What DEV_OS will add")
**1.** The open steps of `IMPLEMENTATION_PLAN.md` are DEV_OS tasks: S15 → T06, T07; S14 → T08, T09, T10; S13c → T11;
S18 (the gaps refresh) → T05. S10b stays optional with no date (`docs/SCOPE.md` §Later). The developer's request for
tests and a check (brief) → T01–T04.
**2.** A step's **GATE** is the developer's merge: of the task pull request for a risk-3 task, and of the unit's
acceptance pull request for every unit.
**3.** **S17** (composition parse) was given PASS on the condition that the checks are green. T01's checks run
`npm run validate` (inside `pnpm run build`) and `next build`; when they are green, the developer's merge of G-Checks
records S17 as PASS, and T01's journal entry says so.
**4.** `IMPLEMENTATION_PLAN.md`, `docs/journal.md`, `docs/session-context.md` and `.cursor/rules/` are kept and still
updated, so the project's record stays in one place: each fence names the S-step criteria it ticks and adds the
journal and session-context updates to its Paths. DEV_OS's ledgers (`docs/PHASES.md`, `docs/SESSION_CONTEXT.md`,
`docs/DEVELOPMENT_JOURNAL.md`) run beside them; `docs/PHASES.md` is the order of work.
**5.** Branches and commits are the runner's (`task/Tnn`, units); the `s<n>-<name>` branch and squash-merge convention
of `docs/rules.md` no longer applies.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** the content of any step; each fence carries its step's criteria.

### OD-07 — The developer's gate on content, headers and the service worker
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** none
**Requested by:** the developer ("your data files are a human gate", brief) and the production rule (PR-72)
**1.** A task whose change touches `src/data/json/**` (the content) or `src/data/schema/**` (its shape) stops at the
developer's gate and is reviewed deep. DEV_OS never merges it on its own. This keeps the project's first rule: data
changes are a human decision.
**2.** The same holds for `next.config.ts` (the CSP and the security headers every visitor gets) and `public/sw.js`
(the service worker every installed phone runs).
**3.** `devos/project.json` `reviewer.human_gate_paths_extra` lists these four paths; `deep_paths_extra` adds
`src/data/**`, `public/sw.js`, `scripts/validate.mts` and `src/app/manifest.ts`.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** what any data change says; the developer decides each at its gate.

### OD-08 — What DEV_OS gives for "a test runner and a CI check"
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** the brief's "a GitHub workflow on every pull request"
**Requested by:** the developer (brief, "What DEV_OS will add")
**1.** **The test runner** is Node's own (`node:test`) run through `tsx`, which the project already has, so it adds no
dependency (T01). T02 and T03 add the first unit tests (Leitner boxes, search, Coptic normalising, the prayer
tokenizer and highlighting); T04 adds `@playwright/test` and `@axe-core/playwright`, with its reason stated in its
fence, and one end-to-end test of the core flow.
**2.** **The check on every task's pull request** is DEV_OS's: the cycle runs guards, typecheck, lint, test and build
(the build runs the validator) on every task and posts the result as the commit status `devos/checks` (PR-25); a red
check fails the task whatever the review says (PR-08).
**3.** **The check on `main`** is `.github/workflows/ci.yml` (DEV_OS's), which runs the same checks on every push to
`main`. It cannot pass until T01 lands; until then a red `ci` on `main` is expected and changes nothing in production.
**4.** **A pull request the developer opens by hand is not checked before its merge**: DEV_OS runs no workflow on
pull requests (PR-25: on a public repository GitHub holds those runs for an approval), and no task may add or change a
workflow file (PR-90). Vercel's own build still runs the validator before every deploy, as today. The developer's
answer on this is asked in `docs/OPEN_QUESTIONS.md`.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** a workflow for hand-opened pull requests, which the developer would add by hand.

### OD-09 — The design that exists is the design contract
**Status:** DRAFT — signed by the developer's merge of the adoption pull request
**Amends:** none
**Requested by:** the blueprint (`docs/method/DESIGN_METHOD.md` §1, §5.6)
**1.** `docs/DESIGN_SYSTEM.md` describes the design the site has today (dark first, the seven group gradients, Cairo
and the Coptic faces, the phone-first layout) and is the contract every screen task follows.
**2.** A new look, a new reference or a new token family is a change request: a DRAFT OD amending this one.
**Basis of signature:** the developer; merging the adoption pull request is the confirming act.
**Does not decide:** the look of the screens the phases add, beyond following the contract.

---

## Part 2 — The project's decisions before the adoption (carried from `docs/before-adopt/decisions.md`)

Each was a one-way door the owner decided while building S0–S18. Format: what, why, what it costs.

### OD-10 — Unicode is the default rendering, not the mapped font (ADR-001)
**Status:** SIGNED — carried from ADR-001. The old site painted Latin keystrokes as Coptic through a custom TTF, which
blocks copy-paste, search and screen readers. Coptic is rendered as Unicode. `athanasiusKey` is kept on every letter so
a manuscript mode stays possible. **Cost:** Noto (sans) looked too plain; GNU FreeSerif is the Coptic face (OD-21).

### OD-11 — No backend (ADR-002)
**Status:** SIGNED — carried from ADR-002. The site is statically generated on Vercel; progress is kept in
`localStorage`. **Cost:** no cross-device sync, no server-side progress. Revisit only if learners ask for it.

### OD-12 — One home group per letter (ADR-003)
**Status:** SIGNED — carried from ADR-003. Navigation needs a single home group; `alsoTaughtIn[]` carries the extra
appearances. The live explorer is the tiebreaker (Beta was in groups 3 and 5, Chi in 3 and 7 in the markdown).
**Cost:** the markdown must be corrected, not merged.

### OD-13 — Data lives in JSON, validated by Zod at build time (ADR-004)
**Status:** SIGNED — carried from ADR-004. HTML stops being the database. `prebuild` runs the validator, so invalid
data cannot deploy. **Cost:** editing content means editing JSON, not a CMS.

### OD-14 — The curriculum is levels → lessons from day one (ADR-005)
**Status:** SIGNED — carried from ADR-005. Grammar arrives as Level 2+ and needs no schema change. **Cost:** slightly
more structure than the alphabet alone requires. (OD-30 later stored the grammar notes as JSON rather than MDX.)

### OD-15 — `main` is the default branch (ADR-006)
**Status:** SIGNED — carried from ADR-006. Set at scaffold time; `master` removed from the remote.

### OD-16 — The live explorer's keymap, not coptic-groups.md (ADR-007)
**Status:** SIGNED — carried from ADR-007. The 11 keys where `coptic-groups.md` disagrees with the live explorer (Sou,
Eta, Theta, Eksi, Khi, Epsi, Shai, Khai, Hori, Cheema, Ti) are a coherent alternative Athanasuis layout, not typos.
`letters.json` freezes the explorer map (the vocabulary corroborates it). Hori is the one split: words are typed with
`\`, the explorer card shows `|`; the primary key is `\`, the alias `|`. Do not "reconcile" the two maps. Do not add a
generic Coptic font converter as a dependency: hori `\`, cheema `S`, shai `}` and eksi `{` match no standard legacy map,
and a generic converter would silently mangle them. StMarkus/coptic-font-unicode-converter is a reference only, for
prayer texts typed in a standard legacy font. **Cost:** anyone typing from the markdown table hits the wrong glyphs.

### OD-17 — Reading drills may have `meaning: null` (ADR-008)
**Status:** SIGNED — carried from ADR-008. The group-1 ⲟ+ⲛ+ⲧ/ⲕ set (تونك، تون، زونت، كونت، نوت، كوتك) is pronunciation,
not unfinished lexicon: those rows are `kind: "drill"`, Arabic in `translit.ar`, `meaning: null`, `published: true`.
Lexicon and name rows still require a meaning. **Cost:** every UI that shows a word must not assume `meaning.ar`
exists. (The six drill words without an Arabic meaning are this decision, not a gap.)

### OD-18 — The shadcn/ui extras from S5b (ADR-009)
**Status:** SIGNED — carried from ADR-009. `npx shadcn init` installed `class-variance-authority`, `clsx`,
`tailwind-merge` (the `cn()` helper the shadcn components need), `lucide-react` (the accordion chevrons) and
`tw-animate-css` (imported by `globals.css`; removing it breaks the build). Do not add more of this family (shine kits,
particle libraries, extra icon packs) without a new reason. **Cost:** small utilities, an icon set and an animation CSS
package sit in `package.json` even when unused directly.

### OD-19 — Dark first; group colours are gradient pairs (ADR-010)
**Status:** SIGNED — carried from ADR-010. Tokens are `--group-N-from` / `--group-N-to`, with `--group-N` an alias of
`from`. Dark (`#0A0A0F`) is the primary skin. Light does not invert the pair; it only darkens `to` so gradient text
clears 4.5:1. Group 1's dark `to` was lightened `#764ba2` → `#8f6bb3` (3.10 → 4.63 against `--bg`). **Cost:**
light-mode glyphs are a deeper shade than the marketing pastels.

### OD-20 — Cards show the reading form only (ADR-011)
**Status:** SIGNED — carried from ADR-011. Coptic is unicase: a card that shows upper and lower teaches the Latin habit
of two letters. `LetterCard` renders `unicode.lower` only; `/letter/[id]` keeps both, stacked, labelled كبير / صغير.
Group lesson titles on `/` and `/alphabet/[n]` are read from `curriculum.json` (Level 1, `kind: "letters"`, `order`
1–7), never hardcoded. **Cost:** a shared `layoutId` transition can only morph the lowercase glyph.

### OD-21 — FreeSerif for Coptic, not mapped CS fonts (ADR-012)
**Status:** SIGNED — carried from ADR-012. Noto Sans Coptic is legal and Unicode but too plain; the CS, Athanasius and
Antinoou faces are mapped (no U+2C80) or need written permission from copticchurch.net / Evertype (requested
2026-08-29, not a grant; a grant still does nothing until a cmap covers U+2C80). GNU FreeSerif (GPL-3.0-or-later WITH
Font-exception-2.0) is Unicode, serif, handles the combining overline and is redistributable: it is the Coptic
`font-family`, with Noto as fallback. The site licence stays MIT; the font exception keeps embedding from infecting
the app. **Cost:** a 45 KB subset in git; GPL notices on `/about`; the Coptic combining numerals U+2CEF–U+2CF1 are
missing in this release.

### OD-22 — The FreeSerif subset is GPL; Font-exception-2.0 is extended (ADR-013)
**Status:** SIGNED — carried from ADR-013. The shipped file is a subset, which is a modification; the README lets a
modifier extend the exception, and `src/app/fonts/NOTICE` does. The subset stays GPL-3.0-or-later; `COPYING` and
`README` stay beside the TTF. A permission email is a request, not a grant, and a grant is not a cmap: Antinoou and the
CS faces are not recorded as licensed until a reply exists. **Cost:** any later subset or font swap keeps those three
files and the exception; dropping them drops the licence.

### OD-23 — The Coptic face is the learner's choice (ADR-014)
**Status:** SIGNED — carried from ADR-014. The header offers سيريف (GNU FreeSerif, default), سانس (Noto Sans Coptic)
and أثناسيوس (Athanasius Plain, OD-24). The choice lives in `localStorage` `learn-coptic:coptic-font` and is applied
before paint. **Cost:** the header control is one control wider on a phone.

### OD-24 — Optional mapped Athanasius manuscript mode (ADR-015)
**Status:** SIGNED — carried from ADR-015. The only mapped TTF in the repository is Athanasius Plain
(`Athanasuis-Plain.ttf`), with no Coptic Unicode cmap. The owner authorised shipping that local copy on 2026-08-31.
Default paint stays Unicode; manuscript mode sets `data-coptic-font="athanasius"` and `CopticPaint` shows the stored
`athanasiusKey` through the mapped face, with the Unicode still in the DOM. Missing keys fall back to Unicode.
Reverse-mapped prayer strings use the same keystrokes as `words.json`: jinkim is a backtick before the letter, never a
combining grave after; ASCII `:` in a source line is punctuation (that cmap slot is capital ti). A second mapped face
with a different keymap needs a new decision. copticchurch.net has not granted a licence and `/about` must not say it
has. **Cost:** selecting the visible glyph in manuscript mode can copy Latin (the copy button still writes Unicode);
redistributing Athanasius Plain is an owner decision, not a third-party grant.

### OD-25 — Letter-name clips from Coptic Literacy (ADR-016)
**Status:** SIGNED — carried from ADR-016. No CC pack of the 32 letter recordings exists; the owner decided on
2026-09-01 that Coptic Literacy's letter-name videos are church material the site may reuse. The audio is stripped
from those MP4s and shipped as 64 kbps mono MP3 in `public/audio/letters/{id}.mp3`; `reciter` is `Coptic Literacy`,
dialect `bohairic-modern`. Never hotlink copticliteracy.org (the CSP is `media-src 'self'`); never put the raw videos
in git. Word clips are out of S10 (owner waiver 2026-09-01). **Long prayer recordings (over about two minutes) go to
object storage (Cloudflare R2 is fine), not git.** **Cost:** a written grant from Coptic Literacy is not on file; this
is an owner church-reuse decision, credited on `/about`. St-Takla was not copied.

### OD-26 — Pronunciation rules copy the live explorer (ADR-017)
**Status:** SIGNED — carried from ADR-017. Letter `rules[]` are Greco-Bohairic: the Arabic layout and most conditions
come from `interactive_coptic_explorer_ascii.html`, with the sound letters and the "what follows" rows cross-checked
against St-Takla's written pronunciation, SUSCopts CPT100 and the deacon Coptic lessons, the copticchurch.net alphabet
table (too short; its Veeta row is wrong) and OrSoZoX's Sunday-school hymn. `follow` keys are this project's explorer
map (`]` = shai, `{` = eksi, `X` = khi); the church throat letters غما كبا إكسي كي are `G - K - { - X`; epsilon after
A/E is ڤ. **Cost:** this is church-school Greco-Bohairic, not Old Bohairic. Owner notes of 2026-09-01 document both
systems in `pronunciation.json`; letter `rules[]` keep the explorer copy and add notes. Audio stays
`bohairic-modern`. Where the notes invert دلتا or add ⲩ to جنجا, the explorer rows stay and the extra is a note or an
added rule. سيما stays سين and تاف stays تاء (`arabicHint`, IPA, quiz); the Sunday-school extras (صاد/زاي، طاء/دال)
are added rules, not a reclassification.

### OD-27 — The Andreas harvest for Arabic glosses (ADR-018)
**Status:** SIGNED — carried from ADR-018. Learner-length lemmas (2–8 Coptic letters), and on 2026-09-01 the leftover
9–17 letter lemmas, from Andreas of St Macarius via remnqymi `andreas.json` (**CC BY-SA 4.0**) were appended to
`words.json`. Coptic and `meaning.ar` are copied; `translit.ar` stays empty (the source has no church pronunciation,
and guessing from spelling is forbidden); the UI hides an empty translit. Filters: Arabic required, no hyphen affixes,
mapped glyphs only. `group` is the highest letter group in the word; `teaches` lists only the letters of that home
group. `/vocabulary` is a group index loading 48 cards at a time; `/practice` shows the HTML reading drills and a
tap-to-reveal deck (80 shortest words per group). **Cost:** about 8.5k rows, many without pronunciation. Do not harvest
Dawoud, Reader or St-Takla without a grant.

### OD-28 — Word art is the teaching set, not the dictionary (ADR-019)
**Status:** SIGNED — carried from ADR-019. Art covers the **147** curriculum words (`translit.ar` filled or
`kind: drill`), **concrete nouns only**. `group != null` is not a filter (every harvest row has a group). Tag
`partOfSpeech` on the 121 lexicon teaching rows before drawing. Drills, particles and abstract verbs stay
unillustrated. Generated images are allowed when `license` is `ai-generated` and `provenance: { model, prompt, date }`
is filled. One prompt template and one palette; themed batches, so a letter page is never half-illustrated.
**Cost:** most of the site has no pictures. That is the design.

### OD-29 — Prayer tokens never guess; S16 before S13b (ADR-020)
**Status:** SIGNED — carried from ADR-020. Tap-a-word resolves a surface form in this order only: exact `coptic` →
`lemma` → strip one leading article from `ⲡⲓ ϯ ⲛⲓ ⲡ̀ ⲧ̀ ⲛ̀ ⲙ̀ ⲟⲩ ϩⲁⲛ` (after `normalized`) → null. Two hits at any step are
null; null shows the Coptic with no Arabic. Tap highlights the Coptic token and a sourced span in the same line's
Arabic; no tooltip, no bottom sheet. ϯ and ⲟⲩ are also verbs and stems: stripping is best-effort, and when unsure
`wordId` stays null. ⲉⲧ / ⲉⲑ are not added to the strip list without a new decision. Stored `lemma` is the row's own
`coptic` when that string is a headword, and **null** when a bound article from `{ⲡⲓ, ⲛⲓ, ϩⲁⲛ, ϯ, ⲡ̀, ⲧ̀, ⲛ̀, ⲙ̀}` is
glued on and at least two letters remain (so ⲛⲓⲙ and ϯϯ stay lemmas); ⲟⲩ- rows keep `lemma = coptic` and are listed in
the hygiene report. `normalized` strips the combining marks U+0300–U+036F; it is not NFKC (ϣ stays U+03E3). S13b
stores `wordId` only on a unique teaching-set hit; strip of ⲟⲩ/ϯ needs at least three letters left; ⲛ̀ϫⲉ is not
article + ϫⲉ. A sourced substring of the line's `translation.ar` may be stored as `token.arHighlight` (exactly once in
that line). The runtime stub may mark a unique piece of a teaching-set gloss after peeling ⲉⲧ/ⲉⲑ, one article or a
bound possessive, for highlight only. **Cost:** many liturgical words stay unglossed. Blank is better than wrong.

### OD-30 — Grammar notes are JSON; parse after a human says so (ADR-021)
**Status:** SIGNED — carried from ADR-021. The owner's Bohairic notes (10/10) are `src/data/json/grammar-rules.json`,
not MDX. Two uses: **S15 lessons** (each point's sections are stepped lessons) and **composition analysis** (peel
affixes to attach an Arabic gloss from stored rules and teaching-set data). `parseReady` on affix rows is the gate.
Coptic in examples is copied from the notes; nothing is invented. **Cost:** the S15 lesson UI is still to build (T06,
T07); parse is the S17 test set (OD-31).

### OD-31 — The parse test uses prayer Arabic; harvest is a search key only (ADR-022)
**Status:** SIGNED — carried from ADR-022. S17 starts with a test set: thirteen unambiguous affix rows are
`parseReady` (ⲡⲓ ⲛⲓ, ⲉⲧ ⲉⲑ, ⲡⲉⲕ ⲧⲉⲕ ⲡⲉⲛ, ϧⲉⲛ ⲛⲉⲙ ϩⲓϫⲉⲛ, ϫⲉ ⲟⲩⲟϩ ⲁⲗⲗⲁ); short colliding forms (ⲡⲉ, ϯ, ⲁ-, ⲛ̀) stay false.
The analyzer peels those affixes. A prayer tap highlights a span already in that line's `translation.ar`; a unique
harvest meaning may only be used to *find* that span after a peel (و/ال clitics allowed). The learner sees the
prayer's Arabic highlight when it uniquely matches, and the stored dictionary meaning (teaching first, else a unique
harvest row) when the tap has no unique span. That is not a new gloss and not in the quiz; `wordId` stays
teaching-set. **Cost:** most liturgical tokens still have no highlight; filling them is a later human pass.

### OD-32 — Thabet unique lemmas only; never overwrite (ADR-023)
**Status:** SIGNED — carried from ADR-023. The `docs/dictionary/` dump is Osama Thabet's northern-dialect spreadsheet
on Internet Archive (`CopticArabicDictionary`), labelled **Public Domain Mark 1.0** by its uploader. Unique Unicode
lemmas may enter `words.json`; rows whose exact Coptic, combining-stripped `normalized` or case-folded normalized key
already exist are skipped, and no existing gloss changes. `translit.ar` stays empty (not a quiz word). ASCII backtick
jinkim becomes a combining grave, as in the Andreas rows. The Greek-mapped notepad file and the Andreas grammar PDFs
on that Archive item stay out; PDM is a mark, not a licence grant for Dawoud. **Cost:** the harvest Arabic is still
unverified; two Coptic–Arabic dumps sit in one lexicon.
