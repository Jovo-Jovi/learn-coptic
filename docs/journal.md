# Journal

Append only. Newest at the top. One entry per step. Keep entries short — this
is a record of what happened, not an explanation of why.

Format:

```
## YYYY-MM-DD · S# · <title>
Model: <who wrote it> | Commit: <sha> | Result: pass / fail / partial
- what changed
- what was decided
- what is still open
```

## 2026-08-31 · polish · drop glass banner
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Removed glass tiles from landing glyphs and `docs/readme-hero.png`. Floating letters only. README marketing/badges kept.

Open: S9 GATE still open.

---

## 2026-08-31 · polish · README glass hero + repo description
Model: Cursor Grok 4.6 | Commit: 0b2be44 | Result: pass
- Landing floating letters: glass tiles (`.glyph-glass`) + hover lift/glow. README banner regenerated with the same six glyphs in glass plates + Cairo title.
- README marketing/colour (badges, Arabic-first promise). GitHub repo description + topics set. Hover cannot run on a GitHub `<img>` — it lives on the site. JSON untouched.

Open: S9 GATE still needs Android install + real phone + human PASS.

---

## 2026-08-31 · S9 leftover · production URL + Lighthouse
Model: Cursor Grok 4.6 | Commit: 0a210eb | Result: partial
- Pushed `main` to GitHub. Vercel project `learn-coptic` live at https://learn-coptic.vercel.app. GitHub auto-deploy did not connect (Vercel GitHub app / repo access).
- Lighthouse mobile on that URL: performance 97, accessibility 100, best-practices 96, SEO 100. README hero snap + PWA files shipped in 6965c77.
- JSON untouched.

Open: GATE — GitHub↔Vercel git hook, Android install, real phone. Do not tick GATE until human PASS.

---

## 2026-08-31 · S9 leftover · PWA + README hero snap
Model: Cursor Grok 4.6 | Commit: 6965c77 | Result: partial
- README banner `docs/readme-hero.png`: same six landing glyphs (ⲁ ϣ ⲛ ⲅ ϯ ⲑ) in group colours / RTL slots, painted with FreeSerif from letters.json. Opacity raised vs the live 0.18 so GitHub can see them.
- PWA: `manifest.ts`, 192/512/maskable icons, `public/sw.js` registered in production only. Headers in `next.config.ts` (CSP, nosniff, referrer, frame-ancestors/DENY).
- `npm run validate` and `npm run build` passed. JSON untouched.

Open: GATE — push, Vercel URL, Lighthouse mobile, real-phone install. Do not tick until human PASS.

---

## 2026-08-31 · S9 leftover · favicon + WhatsApp preview
Model: Cursor Grok 4.6 | Commit: 6965c77 | Result: pass
- Favicon / Apple icon: Coptic Ⲁ on #0A0A0F via `icon.tsx` / `apple-icon.tsx`.
- Open Graph 1200×630 with Arabic title (Cairo subset) + Ⲁ ϣ Ⲛ (FreeSerif). WhatsApp uses this when a link is pasted.
- `metadataBase` from `NEXT_PUBLIC_SITE_URL` / Vercel URL. JSON untouched.

Open: S9 still GATE — push, Vercel URL, Lighthouse, real phone.

---

## 2026-08-31 · letter · pronunciation rules UX
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Rules always visible (no accordion). Coptic in conditions like قبل Ⲉ Ⲓ Ⲏ is LTR glyph chips; Latin `(gh)` isolated. JSON untouched.
- Letter page: رجوع + الحروف + المجموعة at top. Prev/next with glyphs after rules and at page end.

Open: S9 deploy GATE.

---

## 2026-08-31 · fonts · ship Athanasius manuscript mode
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Owner granted optional mapped picker faces. Shipped `Athanasuis-Plain.ttf` (Athanasius Plain, 33 596 B, mapped, no U+2C80). `Coptic1.ttf` and other CS files not shipped.
- Header picker: سيريف / سانس / أثناسيوس. `CopticPaint` shows `athanasiusKey` only in manuscript mode; Unicode stays for copy/AT.
- ADR-015. Rules, security.md, /about, ATHANASIUS.txt updated. JSON untouched. No new deps.

Open: S9 deploy GATE. CS Avva / Pope Shenouda III / Pishoi / New Athanasius / Antinoou still missing files. copticchurch.net still a request.

---

## 2026-08-31 · fonts · CS/Athanasius cmap probe
Model: Cursor Grok 4.6 | Commit: — | Result: fail (gate)
- Asked to add CS Avva Shenouda, Pope Shenouda III, CS Pishoi, CS New Athanasius, Athanasius. None of those files exist on this PC (Windows Fonts, user Fonts, old project folders).
- Old explorer "great font" is `Athanasuis-Plain.ttf` (family Athanasius Plain, Fontographer 3.3, 33 596 B, same file in `coptic قبطي` and `unicode to coptic`). Cmap: U+2C80/2C81/03E2/03EF **absent**. Coptic block 0/128. Latin A–z present. `Coptic1.ttf` same fail.
- `unicode to coptic` is ASCII→Unicode for mapped typing, not a Unicode face. Site data is already Unicode. Converter not added.
- No TTF copied. Picker stays سيريف / سانس. JSON untouched.

Open: Unicode-cmap files + written grant still required (ADR-012/013/014).

---

## 2026-08-31 · desktop width + Coptic font picker
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Shell is `max-w-6xl` (was page-level `max-w-lg` on `/`, `/letter`, `/about` — looked like a phone in a desktop window). 375px still 2-col letters / 1-col words.
- Header select: سيريف (FreeSerif, default) / سانس (Noto). `learn-coptic:coptic-font`. ADR-014. No mapped fonts in the picker.
- JSON untouched. No new deps.

Open: S9 deploy GATE.

---

## 2026-08-31 · S6 leftover + S7 · vocabulary
Model: Cursor Grok 4.6 | Commit: 75f9f4c (TASK 0 docs); S7 uncommitted | Result: pass
- TASK 0: security.md + ADR-013 — subset is a GPL modification; Font-exception-2.0 extended in NOTICE. Antinoou/CS are requests, not grants.
- `/vocabulary` SSG: 147 published (121 lexicon / 11 drill / 15 name). Tap-to-reveal `<button aria-expanded>`. Filters `/vocabulary/group/[1-7]` and `/vocabulary/letter/[id]`.
- Drills: dashed card, group stripe, note تمرين قراءة — مش كلمة في القاموس. Names: badge اسم علم.
- `/letter/[id]` example words from `words.teaches`, lexicon first, cap 6, link for the rest. JSON untouched.
- validate ✓. build ✓ — 92 static routes. 375px scrollWidth=375 both themes.

Open: S9 deploy GATE. Prompt said 11 drills have meaning null; data has 6 null, 5 with meaning.

---

## 2026-08-31 · fonts · FreeSerif + permission record
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Corrected CS status: request emailed to copticchurch.net 2026-08-29, not a
  grant. Antinoou permission is Everson/Evertype. Neither ships until U+2C80.
- Shipped GNU FreeSerif subset (45 KB). Cmap: U+2C80/2C81/03E2/03EF/0304/0305.
  GPL-3.0-or-later WITH Font-exception-2.0. Noto remains fallback.
- No new npm deps. JSON untouched.

Open: S6 example-words → /vocabulary. S7 vocabulary.

## 2026-08-31 · S8 · landing + card scale-up
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Pulled ahead of S6/S7 at request. No JSON edits. No new deps.
- LetterCard: lowercase glyph only. `/letter/[id]`: stacked كبير/صغير +
  الشكل واحد، والفرق في الحجم فقط.
- Cards: 2/3/4 cols, glyph 88/96/104px, min-h 150, gap 14, pad 20/28,
  radius 24, corner group pill (chip-fill).
- `/` SSG: hero, seven group cards from CurriculumFile.parse, three lines,
  footer. `/about`: OFL fonts, CC BY-SA 4.0, MIT, GitHub.
- chip-fill uses `from` mixed with `--chip-tint`, not `to` (light `to` vs
  `--g-fg` was 2.82–3.62). Group wash 10% `from`.
- validate ✓. build ✓ — `/` and `/about` ○. 375px `/` scrollWidth=375 both themes.

Open: S6 example-words → /vocabulary. S7 vocabulary. Font probe still needs a path.

## 2026-08-31 · S5c · visual design pass
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Group tokens are from/to pairs + glow. `--group-N` aliases from.
  Dark `to` for group 1 lightened #764ba2 → #8f6bb3 (3.10 → 4.63 vs #0A0A0F).
  Light mode uses darker `to` stops; from unchanged.
- Dark is the primary skin (#0A0A0F / #13131A / #1C1C26). Light is secondary.
- Cards: surface + hairline, gradient glyph (clip + --text fallback), hover
  gradient border and glow. Grain 3%, ambient group-1/4 radials. Pill chips.
  /letter hero wash at 12%. Grid gap 16px; 2 columns at 375px for 56px glyphs.
- `/alphabet` static again. `/alphabet/[group]` SSG 1–7. `?group=` ignored.
- arabicHint is learner-facing (S5b PASS). Logged in the plan, not a deviation.
- shadcn extra deps logged as ADR-009. No new packages this step. No JSON edits.
- validate ✓. build ✓ — every route ○ or ●, no ƒ. 375px both themes, no x-scroll.

Open: S6 example-words → /vocabulary. Font probe still needs a path.

## 2026-08-31 · S5b · flat /alphabet, /letter/[id], motion
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- TASK 0: no font path given. No cmap probe. Noto Sans Coptic stays default.
  Manuscript mode not wired. Did not remap data to Latin keys.
- /alphabet is one ungrouped 32-letter grid in `order`. Filter chips الكل +
  ١..٧ are links (`?group=N`). Invalid `?group=` 404s. /group/[1-7] same grid.
- Cards: Unicode glyph + Arabic name, `--group-N` as border/wash, to /letter/[id].
- /letter/[id]: SSG 32 ids, unknown 404. Glyph copyable. arDisplay when present.
  Rules: Radix Accordion, spring height. Prev/next by order. Group link /group/N.
  athanasiusKey only in للمطورين (Latin, never Coptic). arabicHint also shown
  on the letter surface for learners.
- motion + Radix. MotionConfig reducedMotion="user" + CSS reduce. Stagger 30ms,
  spring hover/glow, layoutId glyph and filter pill. No confetti/SFX/parallax.
- New deps: motion, shadcn/ui (Radix accordion, tw-animate-css, CVA). No JSON edits.
- validate ✓ 32 letters. build ✓. 375px scrollWidth=375 on /alphabet and /letter/shai.

Open: S6 example-words → /vocabulary. Manuscript font still needs a path + cmap probe.

## 2026-08-31 · S5 · /alphabet and /group/[id]
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Letters loaded through LettersFile.parse, not raw JSON.
- /alphabet lists all 32 in groups 5/4/4/7/4/5/3, colored with --group-N.
- Filter is links (الكل + 1–7), no client JS. /group/8, /group/foo, /group/01 404.
- generateStaticParams emits 1–7 only; dynamicParams = false.
- Group chips use outline (black/20, dark white/35) so fills have an edge on
  near-black. 375×812 /alphabet: scrollWidth = 375.
- Letter cards link to /letter/[id] (404 until S6).

Open: nothing blocking S6.

## 2026-08-31 · S4 · App shell
Model: — | Commit: `e69bb7d` | Result: pass

- Root layout dir="rtl" lang="ar", title تعلّم القبطي البحيري.
- Bottom nav (الحروف · الكلمات · التدريب · عن الموقع) with aria-current and
  safe-area-inset-bottom; viewport-fit=cover.
- Theme toggle with no flash: blocking head script writes learn-coptic:theme
  onto <html> before paint.
- /s1-glyph-check and /s3-tokens deleted, after the S3 commit preserved them.
- Home left empty; S8 owns the landing.
- Verified from prerendered HTML: RTL root, Arabic metadata, four nav links,
  theme script, local woff2 preloads.
- Live 375×812 Chrome: scrollWidth = clientWidth = 375. No horizontal scroll.

Open: dark-mode swatch edges resolve at S5 when chips exist.

## 2026-08-31 · S4 · App shell
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Root layout: `dir="rtl" lang="ar"`, title تعلّم القبطي البحيري.
- Bottom nav: الحروف / الكلمات / التدريب / عن الموقع. `aria-current` on the
  active item. `pb-[env(safe-area-inset-bottom)]`, `viewport-fit=cover`.
- Theme: `learn-coptic:theme` in localStorage. Blocking script in `<head>`
  before paint. `.dark` / `.light` override OS; no-JS still follows
  `prefers-color-scheme` via `:root:not(.light)`.
- Deleted `/s1-glyph-check` and `/s3-tokens` (committed in `cb8d7e9` first).
- 375px: overflow-x clip, min-w-0, 4-column nav. Checked from prerendered
  HTML, not a live 375 viewport.

Open: dark-mode surface contrast for group swatches still unverified. S8
replaces the empty home.

## 2026-08-31 · S3 · Design tokens and fonts
Model: — | Commit: `cb8d7e9` | Result: pass

- Cairo (Arabic) + Noto Sans Coptic via next/font, self-hosted woff2. No Google <link>.
- All 7 original fills fail 4.5:1 against white. No hue shifted; --group-N-fg is
  #171717 on every fill in both themes. Ratios 4.90 / 8.77 / 7.40 / 11.25 /
  12.31 / 9.00 / 13.63. Group 1 is the tightest.
- Type scale: 12/14/18/20/24/30/36, glyph 64. Base 18 because Cairo reads small at 16.
- /s3-tokens throwaway route, 404 in production. Delete with /s1-glyph-check at S4.
- Fonts confirmed from build CSS only; dev server could not be started here.

Open: dark-mode surface contrast for group swatches unverified.

## 2026-08-31 · S3 · Design tokens and fonts
Model: Cursor Grok 4.6 | Commit: — | Result: pass

- Cairo (Arabic, variable) + Noto Sans Coptic (400) via `next/font/google`.
  Build CSS uses `@font-face` + local woff2; no fonts.googleapis.com.
- Group fills kept from the live HTML. White text fails 4.5:1 on all seven
  (group 1 is 3.66:1; 2–7 are pastels). `--group-N-fg` is `#171717` for every
  group in both themes — no hue was shifted.
- Type scale in `@theme`: xs 12 / sm 14 / base 18 / lg 20 / xl 24 / 2xl 30 /
  3xl 36 / glyph 64. Arabic body is 18px because Cairo reads small at 16.
- Throwaway `/s3-tokens` (404 in production). Delete with `/s1-glyph-check` at S4.

Open: nothing blocking S4.

## 2026-08-31 · S2 · Migrate vocabulary (GATE)
Model: — | Commit: `2f0a0b2` | Result: pass

- 145 HTML rows converted to Unicode via the S1 keymap. Zero unknown keystrokes.
- Final count 147 = 145 HTML + efran/efiot, retained from the sample
  prayers.json (keyWords of khen-efran). Provenance recorded in words.json.
- Kinds: 121 lexicon · 11 drill · 15 name. 0 unpublished.
- Six rows (tonk, ton, zont, kont, not, kotk) had arabic === pronunciation:
  they are the ⲟ+ⲛ+ⲧ/ⲕ rhyme drill, not broken glosses. Reclassified drill,
  Arabic moved to translit.ar, meaning null.
- khen restored to lexicon, meaning "في / بـ" — two senses, not a garbled string.
- rashaihd → name; papa, pixrictoc → lexicon; golgoqa stays name.
- Jinkim: base then U+0300. Validator rejects a combining grave with no base.
- ADR-008: meaning is nullable; lexicon and name still require it.

Open: nothing blocking S3.

## 2026-08-31 · S2 · Migrate vocabulary (re-run)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting review)

- HTML group 1: tot/kot/on are lexicon; the next six have arabic = pronunciation
  (ⲟ+ⲛ+ⲧ/ⲕ rhyme). Reclassified drill, translit only, meaning null, published.
- khen meaning `في / بـ`, published (prayers.json keyWords).
- iman stays drill. rashaihd → name. papa and pixrictoc → lexicon. golgoqa stays name.
- words.json `provenance` records efran/efiot as sample-prayer rows, not HTML.
- Jinkim: `mmon` is U+2C99 U+0300 … (base then combining), same as ⲙ̀ⲫⲓⲱⲧ.
- Schema: `meaning` nullable; lexicon/name still require it (ADR-008).
- kind: 121 lexicon, 11 drill, 15 name. 0 unpublished.

Open: human GATE.

## 2026-08-31 · S2 · GATE review
Model: — | Commit: — | Result: fail

- Six -ont/-onk words were unpublished lexicon; they are rhyming drills.
- khen ب-في was treated as garbled; it is two prepositional senses.
- Non-blocking: rashaihd name; البابا/المسيح lexicon; efran/efiot provenance;
  jinkim must be base-then-combining.

## 2026-08-31 · S2 · Migrate vocabulary (GATE)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting review)

- HTML arrays hold **145** rows. Page stats advertised **131**. words.json has
  **147** (145 + `efran` / `efiot` kept for `prayers.json`).
- Converted with letters.json map. Jinkim backtick → U+0300 (as in ⲙ̀ⲫⲓⲱⲧ).
- kind: 125 lexicon, 6 drill, 16 name. 7 unpublished (group-1 transcriptions +
  `khen` gloss ب-في). soic meaning رب, translit تشويس.
- `scripts/migrate-vocab.mjs` one-shot. Validator green.

Open: human GATE — kinds, unpublished list, whether efran/efiot stay.

## 2026-08-31 · S1 · Freeze the letter map (GATE)
Model: — | Commit: `a370f95` | Result: pass

- Extractor rewritten for object literals (brace counting; `({…})` wrap for vm).
- All 32 athanasiusKey values written from `.extract/ascii-map.json`, not by hand.
  Machine table matched the hand-read table 32/32 on keys and groups.
- hori: primary `\` (4 vocab words use it), explorer's `|` kept as alias.
  New field `athanasiusAliases`; alias collisions now checked in validate.mts.
- Arabic names adopted from the HTML: بيتا، دلتا، كبّا، تاف، سوو، بسي، إبسيلون.
- khi: `name.ar: "كي"`, `name.arDisplay: "كي، خي، شي"` — the name states all
  three sounds. New field `arDisplay`.
- Markdown's 11 differing keys are a coherent alternative keymap, not errors.
- All 32 glyph pairs viewed in Noto Sans Coptic at /s1-glyph-check. No tofu.
  Route 404s in production; delete at S4.
- `apply-s1-from-extract.mjs` marked one-shot.

Open: nothing blocking S2.

## 2026-08-31 · S1 · Glyph check
Model: Cursor Grok 4.6 | Commit: — | Result: pass (keys frozen; page is throwaway)

- Looked at all 32 rows on `/s1-glyph-check` under `next dev` (Noto Sans Coptic). No tofu. Demotic seven at U+03E2–03EF included.
- khi: `name.ar` كي, `name.arDisplay` كي، خي، شي.
- Validator now collides aliases with primary keys. `/s1-glyph-check` 404s in production; delete at S4.
- apply-s1-from-extract.mjs marked one-shot.

Open: S2 soic pronunciation vs meaning. Delete glyph page at S4.

## 2026-08-31 · S1 · Freeze the letter map (re-run)
Model: Cursor Grok 4.6 | Commit: — | Result: partial (waiting human glyph check + khi name)

- Extract now parses object literals (brace count + `({…})` for vm). Machine table in `.extract/key-table.md`.
- All 32 `athanasiusKey` values written from that map. Hori primary `\` (vocab), alias `|` (explorer).
- Arabic names from HTML: بيتا، دلتا، كبّا، تاف، سوو، بسي، إبسيلون. khi left خي.
- ADR-007: markdown's 11 keys are an alternative layout, not errors.
- Throwaway `/s1-glyph-check` with Noto Sans Coptic.

Open: khi Arabic name (كي vs خي vs كي، خي، شي); a Coptic reader must confirm the 32 glyphs on `/s1-glyph-check`. S2: soic meaning in HTML is رب, pronunciation تشويس.

## 2026-08-31 · S0 · Repo setup
Model: — | Commit: `8df36c5` | Result: pass

- `create-next-app` (TS, Tailwind, App Router, `src/`, `@/*`, ESLint, npm) in a
  clean folder. Next 16, Turbopack is the default so there was nothing to decline.
- Scaffold mapped into `.cursor/rules/`, `src/data/schema/`, `src/data/json/`,
  `scripts/`, plus the three root markdown files. Downloaded `package.json` and
  `tsconfig.json` deliberately not used.
- Deps: `zod`, `fuse.js`, `tsx`, `node-html-parser`. Scripts: `prebuild`,
  `validate`, `seed:letters`, `extract`.
- Only the two working HTML files copied to `legacy/`. No TTF, no summary
  markdown. `legacy/` and `.extract/` gitignored.
- Default branch `main`; `master` removed from the remote.
- Stock `AGENTS.md` and `CLAUDE.md` from the template are in the commit.
- Validator green: 32 letters, 8 words, 1 prayer, 2 levels.

Open: the 11 unconfirmed `athanasiusKey` values, and no Coptic reader has
checked the glyphs yet.
