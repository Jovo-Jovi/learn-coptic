# Implementation plan

Each step is one Cursor session. Do them in order. A step is **not** done until
its acceptance criteria pass — those criteria are also the review checklist.
**S16 before S13b.** Do not auto-gloss prayers against the unverified harvest.

Steps marked **GATE** need a human decision or an outside review before the next
step starts. Do not let the agent proceed past a gate on its own.

---

## Phase 1 — get something real on the internet

### S0 · Repo setup
Clean tree, deps installed, validator green.
- [x] `npx create-next-app` in an **empty** folder — never inside the old Desktop folder
- [x] Scaffold files copied in; `git init`; first commit
- [x] `npm run validate` prints ✓ with 32 letters
- [x] `npm run build` succeeds
- [x] `.gitignore` covers `.extract/`, `node_modules`, `.next`

### S1 · Freeze the letter map — **GATE**
The whole project rests on this being right.
- [x] `npm run extract -- ./legacy/*.html` run; `.extract/conflicts.md` read
- [x] All 32 `athanasiusKey` values filled, or explicitly left null with a reason
- [x] Every letter has exactly one `group`; groups total 5/4/4/7/4/5/3
- [x] Arabic letter names checked against the curriculum by a human
- [x] Validator green
- [x] **A person who reads Coptic has looked at all 32 glyphs on screen**

### S2 · Migrate vocabulary — **GATE**
- [x] All words converted from Athanasuis keys to Unicode
- [x] Every word tagged `lexicon` / `drill` / `name`
- [x] Real count reported honestly (was advertised 131, arrays held 145)
- [x] Unfinished Arabic glosses set `published: false`, listed in the report
- [x] Every `teaches` entry resolves to a real letter id

### S3 · Design tokens and fonts
- [x] Noto Sans Coptic + Cairo self-hosted via `next/font`; no `<link>` to Google
- [x] `--group-1`…`--group-7` defined for light and dark
- [x] Contrast checked; failures listed with the adjusted value
- [x] A type scale, not ad-hoc font sizes

### S4 · App shell
- [x] `dir="rtl" lang="ar"`, correct `<title>` and description in Arabic
- [x] Bottom nav, 4 items, active state, safe-area padding on iOS
- [x] Dark/light toggle, no flash on load
- [x] Renders correctly at 375px with no horizontal scroll

### S5 · `/alphabet` and `/group/[id]`
- [x] All 32 letters, grouped, color-coded, statically generated
- [x] Group filter works without JavaScript errors
- [x] `generateStaticParams` for groups 1–7 only — an invalid id 404s

### S5b · Flat `/alphabet`, `/letter/[id]`, motion
- [x] `/alphabet` is one ungrouped grid in `order`; chips الكل + ١..٧ are links
- [x] Cards: large glyph + Arabic name, group color as border/wash, link to `/letter/[id]`
- [x] `/letter/[id]` SSG for all 32 ids; unknown id 404s; prev/next by `order`
- [x] Rules in a Radix Accordion (one item per rule); `arabicHint` on the surface; `للمطورين` holds `athanasiusKey` / numeric metadata
- [x] Motion: stagger, spring hover/glow, `layoutId` glyph + filter pill; `prefers-reduced-motion`
- [x] `npm run validate` and `npm run build`; 375px no horizontal scroll

### S5c · Visual design pass
- [x] Group tokens are `from`/`to` pairs + glow; `--group-N` aliases `from`
- [x] Dark is the primary skin; light keeps working with darker `to` stops
- [x] Cards: surface + hairline, gradient glyph, hover gradient border + glow
- [x] Grain, ambient radials, pill chips, letter hero wash; spacing opened up
- [x] `/alphabet` is static; `/alphabet/[group]` SSG 1–7; no searchParams SSR
- [x] Contrast table reported; 375px both themes; `npm run validate` and `npm run build`

### S6 · `/letter/[id]`
- [x] Glyph large, upper + lower, Unicode copyable
- [x] `arabicHint` on the letter surface (learner-facing)
- [x] Pronunciation rules rendered for the 12 letters that have them
- [x] Expanding panel, `aria-expanded`, reduced-motion respected
- [x] Example words link to `/vocabulary`
- [x] Prev/next letter navigation

### S7 · `/vocabulary`
- [x] Tap to reveal meaning; filter by group and by letter
- [x] `lexicon` and `drill` visually distinct — a drill word is not a dictionary entry
- [x] `published: false` words hidden

### S8 · `/` and `/about`
- [x] Landing states the promise in one Arabic line, then "ابدأ من المجموعة ١"
- [x] `/about` lists font licences, content licence, and how to contribute

### S9 · Deploy — **GATE**
- [x] Pushed to GitHub, connected to Vercel, production URL live
- [x] Lighthouse mobile: performance ≥ 90, accessibility ≥ 95
- [x] PWA manifest + icons; installs on an Android phone
- [x] Tested on a real phone, not just a narrow browser window

---

## Phase 2 — the things competitors already have

### S10 · Letter audio
Permanent. Word clips are not part of this step.
- [x] 32 letter clips, 64 kbps mono MP3 (Coptic Literacy, owner reuse 2026-09-01)
- [x] letter `audio` field populated; validator reports 0/32 letters missing
- [x] Playback works on iOS Safari (autoplay restrictions)

### S10b · Word audio — optional, no date
Teaching set only (`kind === "drill"` or non-empty `translit.ar` — **147** rows).
`AudioClip` is already nullable. Do not record Andreas harvest rows.
Do not fail the build when word audio is missing.

### S11 · Quiz and progress
- [x] Leitner boxes 1–5 in `localStorage`, one namespaced key
- [x] Quiz types: glyph→sound, sound→glyph; word→meaning **on the teaching
      set only** (harvest Arabic is still unverified after S16)
- [x] Progress survives reload; a reset button exists

Letter sound quizzes are unblocked. Do not quiz Andreas glosses until a
human has checked them.

### S12 · Search
Done out of order, 2026-09-01.
- [x] Fuse.js over letters + words, Arabic and Coptic queries
- [x] Index built at build time, not fetched at runtime
- [x] Prayer titles included in the index

---

## Phase 3 — prayers, art, grammar, dictionary

**Order that matters:** S16 before S13b. Auto-glossing an unverified
harvest would print bad Arabic on prayer pages, where it is hard to walk back.
S11 word→meaning has the same constraint. S14 and S15 do not block S16.

### S13a · Prayer text
- [x] Four prayers on `/prayers` with sourced Coptic + Arabic
  (`khen-efran`, `lords-prayer`, `thanksgiving`, `psalm-50`)
- [x] Empty `translit.ar` left empty — not guessed
- [x] Text-only lesson works with `audio: null`

**Licence gap (open, not a silent pass):** SCRIPTORIUM Ps 50 Coptic is
CC BY 4.0. Coptic for All (الربانية، الشكر) and agpeya.org Arabic still
need a written note on `/about` / `prayers.source` before we treat them
as cleared. Do not dump Tasbeha / Reader / St-Takla.

### S16 · Dictionary hygiene — **before S13b**
Retro-gate the 8,488 Andreas import. Do not invent glosses.
- [x] `Word.normalized`: Coptic with combining marks stripped (U+0300–U+036F).
      Validator checks stored value equals `normalizeCoptic(coptic)`
- [x] `Word.lemma`: nullable headword. Harvest rows that already *are* a
      headword may set `lemma` to `coptic`. Leave null rather than guess
      an inflected form’s dictionary word
- [x] Validator **report** (does not fail the build): duplicate `normalized`
      keys (homographs), harvest rows whose Coptic starts with an article
      listed in S13b. Human decides what to unpublish
- [x] Teaching set stays distinct: 147 rows with `translit.ar` or `kind: drill`.
      After Andreas, **every** word has `group` set — `group != null` is not
      a teaching-set filter
- [x] `npm run validate` and `npm run build`

### S13b · Tap-a-word glossing
Depends on S16. Schema already has `PrayerLine.tokens`.
- [x] Tokenizer, in this order only: exact `coptic` → `lemma` → strip one
      leading article/prefix from `{ⲡⲓ, ϯ, ⲛⲓ, ⲡ̀, ⲧ̀, ⲛ̀, ⲙ̀, ⲟⲩ, ϩⲁⲛ}`
      (after normalize) and retry exact/`lemma` → **null**
- [x] Two matches at any step → null. Null paints the word with **no** gloss.
      Never a guess, never a tooltip
- [x] Tap highlights the Coptic token and the matching sourced span in that
      line's Arabic **in place**. Tap again to clear. No sheet, no tooltip
- [x] Highlight span is `arHighlight`, or a unique teaching gloss after
      peeling relative ⲉⲧ/ⲉⲑ, one article, or a possessive (ⲡⲉⲕ…), including
      a short Arabic suffix (اسم → اسمك). No invented dictionary gloss.
      Affix peel is highlight-only — not S13b `wordId`. Full grammar rules
      to be stored later; unmarked tokens are expected until then.
- [x] Every line of all four prayers has a human-reviewed `tokens` array
      before publish. Keep `wordId: null` where the dictionary does not
      honestly match. Do not overwrite the reviewed `khen-efran` tokens
      with a bulk script
- [x] `npm run validate` and `npm run build`; 375px

### S13c · Synced prayer audio
- [ ] One prayer end to end, full recording + per-line `startSec`/`endSec`
- [ ] Active line highlights during playback; tapping a line seeks to it
- [ ] Recordings over ~2 minutes go to object storage, not git
- [ ] Works with the audio muted — text alone is still a complete lesson

`khen-efran` still points at missing `/audio/prayers/` files. That is not
this step done.

### S14 · Teaching-set word art
Partial coverage. 8,635 illustrated words is not a goal.
- [ ] Scope: teaching set (147), **concrete nouns** only. Tag
      `partOfSpeech` on the 121 curriculum lexicon rows first (only 2
      are tagged today). No particles, no abstract verbs, no drills
- [ ] Schema: add `"ai-generated"` to `Artwork.license`; optional
      `provenance: { model, prompt, date }` — record the prompt
- [ ] One prompt template and one palette for the whole set; fill in
      themed batches so a half-illustrated letter page never ships
- [ ] 800×800 WebP, `next/image`, lazy loaded; `alt.ar` on every image
- [ ] Validator does not require art on harvest rows

### S15 · Grammar levels
- [ ] MDX pipeline for `kind: "grammar"` lessons
- [ ] `<LetterChip/>` and `<WordCard/>` usable inline in MDX
- [ ] Level 2 lesson list rendered; prerequisites enforced in the UI
- [ ] No schema change required — if one seems necessary, stop and ask

Prayer tap-highlight is **not** this step. The owner will supply full
prefix/suffix grammar rules later; those will be stored as data and used
to mark more tokens. Do not invent the table. A token with no highlight
today is expected.

---

## Definition of done, every step

1. `npm run validate` ✓
2. `npm run build` ✓
3. No TypeScript errors, no new `any`
4. Checked at 375px width
5. No data file modified unless the step explicitly says so
6. This file: the step's checkboxes ticked (`[x]`) only for criteria that passed
7. `docs/journal.md` appended and `docs/session-context.md` updated
