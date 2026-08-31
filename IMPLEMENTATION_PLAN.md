# Implementation plan

Each step is one Cursor session. Do them in order. A step is **not** done until
its acceptance criteria pass — those criteria are also the review checklist.

Steps marked **GATE** need a human decision or an outside review before the next
step starts. Do not let the agent proceed past a gate on its own.

---

## Phase 1 — get something real on the internet

### S0 · Repo setup
Clean tree, deps installed, validator green.
- [ ] `npx create-next-app` in an **empty** folder — never inside the old Desktop folder
- [ ] Scaffold files copied in; `git init`; first commit
- [ ] `npm run validate` prints ✓ with 32 letters
- [ ] `npm run build` succeeds
- [ ] `.gitignore` covers `.extract/`, `node_modules`, `.next`

### S1 · Freeze the letter map — **GATE**
The whole project rests on this being right.
- [ ] `npm run extract -- ./legacy/*.html` run; `.extract/conflicts.md` read
- [ ] All 32 `athanasiusKey` values filled, or explicitly left null with a reason
- [ ] Every letter has exactly one `group`; groups total 5/4/4/7/4/5/3
- [ ] Arabic letter names checked against the curriculum by a human
- [ ] Validator green
- [ ] **A person who reads Coptic has looked at all 32 glyphs on screen**

### S2 · Migrate vocabulary — **GATE**
- [ ] All words converted from Athanasuis keys to Unicode
- [ ] Every word tagged `lexicon` / `drill` / `name`
- [ ] Real count reported honestly (was advertised 131, arrays held 145)
- [ ] Unfinished Arabic glosses set `published: false`, listed in the report
- [ ] Every `teaches` entry resolves to a real letter id

### S3 · Design tokens and fonts
- [ ] Noto Sans Coptic + Cairo self-hosted via `next/font`; no `<link>` to Google
- [ ] `--group-1`…`--group-7` defined for light and dark
- [ ] Contrast checked; failures listed with the adjusted value
- [ ] A type scale, not ad-hoc font sizes

### S4 · App shell
- [ ] `dir="rtl" lang="ar"`, correct `<title>` and description in Arabic
- [ ] Bottom nav, 4 items, active state, safe-area padding on iOS
- [ ] Dark/light toggle, no flash on load
- [ ] Renders correctly at 375px with no horizontal scroll

### S5 · `/alphabet` and `/group/[id]`
- [ ] All 32 letters, grouped, color-coded, statically generated
- [ ] Group filter works without JavaScript errors
- [ ] `generateStaticParams` for groups 1–7 only — an invalid id 404s

### S6 · `/letter/[id]`
- [ ] Glyph large, upper + lower, Unicode copyable
- [ ] Pronunciation rules rendered for the 12 letters that have them
- [ ] Expanding panel, `aria-expanded`, reduced-motion respected
- [ ] Example words link to `/vocabulary`
- [ ] Prev/next letter navigation

### S7 · `/vocabulary`
- [ ] Tap to reveal meaning; filter by group and by letter
- [ ] `lexicon` and `drill` visually distinct — a drill word is not a dictionary entry
- [ ] `published: false` words hidden

### S8 · `/` and `/about`
- [ ] Landing states the promise in one Arabic line, then "ابدأ من المجموعة ١"
- [ ] `/about` lists font licences, content licence, and how to contribute

### S9 · Deploy — **GATE**
- [ ] Pushed to GitHub, connected to Vercel, production URL live
- [ ] Lighthouse mobile: performance ≥ 90, accessibility ≥ 95
- [ ] PWA manifest + icons; installs on an Android phone
- [ ] Tested on a real phone, not just a narrow browser window

---

## Phase 2 — the things competitors already have

### S10 · Audio for letters and words
- [ ] 32 letter clips + one example word each, 64 kbps mono MP3
- [ ] `audio` field populated; validator reports 0 missing
- [ ] Playback works on iOS Safari (autoplay restrictions)

### S11 · Quiz and progress
- [ ] Leitner boxes 1–5 in `localStorage`, one namespaced key
- [ ] Quiz types: glyph→sound, sound→glyph, word→meaning
- [ ] Progress survives reload; a reset button exists

### S12 · Search
- [ ] Fuse.js over letters + words, Arabic and Coptic queries
- [ ] Index built at build time, not fetched at runtime

---

## Phase 3 — the three additions

### S13 · Prayers with synced audio
- [ ] One prayer end to end, full recording + per-line `startSec`/`endSec`
- [ ] Active line highlights during playback; tapping a line seeks to it
- [ ] Recordings over ~2 minutes go to object storage, not git
- [ ] Works with the audio muted — text alone is still a complete lesson

### S14 · Illustrated vocabulary
- [ ] 800×800 WebP, `next/image`, lazy loaded
- [ ] `alt` in Arabic on every image; `license` field filled on every image
- [ ] Filled in themed batches so the site is never half-illustrated

### S15 · Grammar levels
- [ ] MDX pipeline for `kind: "grammar"` lessons
- [ ] `<LetterChip/>` and `<WordCard/>` usable inline in MDX
- [ ] Level 2 lesson list rendered; prerequisites enforced in the UI
- [ ] No schema change required — if one seems necessary, stop and ask

---

## Definition of done, every step

1. `npm run validate` ✓
2. `npm run build` ✓
3. No TypeScript errors, no new `any`
4. Checked at 375px width
5. No data file modified unless the step explicitly says so
