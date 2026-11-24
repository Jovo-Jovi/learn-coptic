## 2026-09-03 · ship pronounce + gloss
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- ADR-024 and `docs/word-analysis-ux.md`. `src/lib/pronounce.ts` on prayer
  tap, word cards, and `/search`. Teaching translit wins; else stored rules.
  Lab peel is not in this commit.

## 2026-09-02 · S18 · Thabet unique lemmas
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass (unique only)
- `docs/dictionary/` Osama Thabet northern-dialect dump (IA PDM 1.0).
  12333 headwords. Harvested 1534 new rows; skipped 10102 duplicates
  (8533 exact Coptic, 1408 normalized, 161 case-folded) plus regex /
  short / affix / unmapped. Existing glosses untouched. Teaching set 147.
- Words 10324 → 11858. `npm run validate` ✓. Prayer captions 353 → 355
  (129 blank / 117 unique).
- Not ingested: mapped notepad, Andreas PDFs on the same Archive item,
  Dawoud, KELLIA.

Open: human S17 **PASS**. Prayer token blanks. S13c. S15.

## 2026-09-01 · research · Naqlun + Dawoud + Archive
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: checked, not ingested
- مصباح النقلون: church app (`com.naqlun.coptdict`), 50k+ defs, online
  search only. Contact naqluncopdic@gmail.com. No dump.
- داود: Coptic Treasures 197MB PDF + remnqymi page scan. Author died 2000;
  still in copyright. IA scans exist with **no licenseurl**; OCR is Arabic
  Tesseract, unusable Coptic. Did not download into `words.json`.
- Skip Archive z-lib copy of the same book.

Open: human S17 **PASS**. Grant if owner wants Dawoud/Naqlun. S13c. S15.

## 2026-09-01 · S18 · Andreas leftovers 9–17
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass (leftovers only)
- Deeper search: still no second dumpable Coptic–Arabic lexicon. KELLIA /
  Compass / copticmt / Dawoud PDF / Naqlun / copticsite.json not merged.
- Downloaded remnqymi `andreas.json` (CC BY-SA 4.0). Harvested 1689 leftover
  lemmas (9–17 letters). Words 8635 → 10324. `npm run validate` ✓.
- Prayer captions 339 → 353 (131 blank / 119 unique). Conjugations remain.

Open: human S17 **PASS**. Prayer token blanks. S13c. S15.

## 2026-09-01 · docs · GitHub README features
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Root `README.md` lists what is live: letter audio, search, practice/quiz,
  four prayers with tap-highlight, Andreas dictionary, PWA. Badges match.
- Did not advertise S13c audio, S14 art, or S15 grammar UI.

Open: human S17 **PASS**. S18 later. S13c. S15.

## 2026-09-01 · letter · سيما / تاف specials
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Kept class س / ت (`arabicHint`, IPA, quiz, cards). Main rule stays
  دائماً سين / تاء.
- Added special rule cards only: سيما صاد after `A - O - W`, زاي Greek
  after `M`; تاف طاء after `A - O - W`, دال Greek if preceded by `N`.
- Examples from existing ids: `ci`, `cwma`, `kocmoc`, `tebt`, `taio`,
  `entolh`.

Open: human S17 **PASS**. S18 later. S13c. S15.

## 2026-09-01 · letter · غما chip order
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Gamma note + follow rows: حلقية ⲅ ⲝ ⲭ ⲕ, إمالة ⲉ ⲓ ⲏ ⲩ.
  Follow keys `G - { - X - K` and `E - I - H - U`. Janja note matches
  the same vowel order (its follow was already `E - I - H - U`).
- `npm run validate` ✓. `/letter/gamma` note chips: ⲅ ⲝ ⲭ ⲕ then ⲉ…

Open: human S17 **PASS**. S18 later. S13c. S15.

## 2026-09-01 · gaps · GitHub merge inventory
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: recorded, not filled
- No second Coptic–Arabic GitHub dump to merge. Andreas is already in
  `words.json`. KELLIA / Compass / coptic-words have no Arabic.
  copticlingo `copticsite.json` is unlicensed — do not scrape.
- Left gaps blank. `docs/gaps.md`: 145 unmarked prayer tokens (132 unique).
  S18 added to the plan, deferred until S17 PASS.

Open: human S17 **PASS**. S18 later. S13c. S15.

## 2026-09-01 · research · full Coptic–Arabic dump
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: no ingest
- Searched for a downloadable Coptic–Arabic dictionary. The only structured
  dump is remnqymi `andreas.json` (CC BY-SA 4.0), already in `words.json`
  (8488 rows). Dawoud is scans, not JSON. CDO and Coptic Compass have no
  Arabic. Naqlun CopDic is an app with no public dump.
- Did not download Dawoud, scrape Naqlun, or machine-translate CDO.

Open: human S17 **PASS**. Inflected prayer tokens. S13c. S15.

## 2026-09-01 · S17 · dictionary first, then parse
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: partial
- Lookup order is now: unique dictionary row on the full word, then grammar
  peel only if the remainder is still a dictionary stem (or a bound
  preposition + pronoun).
- Prayer tap always shows that stored Arabic under the line. Highlight in
  the prayer translation when the span is unique. ~339/484 tokens have a
  meaning; the rest are inflected forms not in the dictionary (ⲛ̀ϫⲉ, ⲙⲁⲣⲉ-…).
- Did not invent glosses or bulk-fill `words.json`.

Open: human **PASS**. Remaining unmarked liturgical verbs. S13c. S15.
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: partial
- Analyzer `src/lib/coptic-parse.ts`. 13 unambiguous affixes
  `parseReady`. Eight fixtures in the validator. Stub peel stays fallback.
- Prayer tap uses parse + teaching gloss + sourced `arHighlight`. Harvest
  meaning is only a search key into that line (ADR-022).
- Test tokens: khen-efran l2/l3 spans; ⲡⲉⲕⲣⲁⲛ → اسمك. Did not bulk-fill
  `words.json`.
- `npm run validate` and `npm run build` passed.

Open: human **PASS** on S17. More affixes. Rest of prayer tokens. S13c. S15.

## 2026-09-01 · letter · سوو is a numeral, not a sound
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- سوو hint is ٦ not س; dropped the duplicate note. Neighbors render
  once when the letter has no word list.

Open: S13c. S15. S17 parse.

## 2026-09-01 · letter · Coptic in notes was swallowed by parentheses
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- `(ⲅ ⲕ ⲭ ⲝ)` was parsed as Latin so it used the Arabic font. Inner Coptic
  now paints as the same chips as the rule follow row.

Open: S13c. S15. S17 parse.

## 2026-09-01 · letter · notes use Coptic font, no source labels
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Letter `sound.note` paints Coptic with `font-coptic` (inline, not chips).
- Dropped learner copy «مرجع 2026-09-01» / «صف المستكشف». جنجا ⲩ folded
  into follow `E - I - H - U`.

Open: S13c. S15. S17 parse.

## 2026-09-01 · letter · pronunciation notes merged
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Compared owner 32-letter pronunciation notes to `letters.json` (report
  in chat). Explorer `rules[]` kept (ADR-017). Notes added as
  `sound.note`; empty letters got a default rule; جنجا gained ⲩ rule.
  Pinned `exampleWords` only where a dictionary row exists. No invented
  words (ⲛⲓⲃⲓ، ⲑⲙⲁⲩ، ⲫⲛⲟⲩϯ، … stay out).
- `pronunciation.json`: two systems, diphthongs, jinkim, pitfalls, drills.
- Plan: S15 lesson UI; S17 composition parse GATE. Neither started.

Open: human parse (S17). S15 UI. S13c audio.

## 2026-09-01 · grammar · points 7–10 stored (10/10)
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- `grammar-rules.json`: owner notes 7–10 (advanced clauses; particles;
  Bohairic vs Sahidic; exceptions and pitfalls). 10/10 points, 102 affix
  rows. Kinds added: conjunction, object-marker. `parseReady` still false.
- Plural ⲛⲓϩⲓⲟⲙⲓ stored from the notes’ analysis; source line had a
  garbled Latin letter. No highlighter/parser/S15 UI.

Open: human says parse. Then S15 lessons and composition→Arabic gloss.
S13c.

## 2026-09-01 · grammar · points 4–6 stored
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- `grammar-rules.json`: owner notes 4–6 of 10 (verbs/conjugation;
  tenses/moods guide; negation/questions/imperative). Coptic copied.
  Affix kinds added: negation, imperative, interrogative, mood.
  `parseReady` still false. Sections kept as future S15 lesson steps.
- No highlighter change. Parser waits for points 7–10 (ADR-021).

Open: points 7–10. Then parse. S15 illustrated lessons later. S13c.

## 2026-09-01 · grammar · points 1–3 stored
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- `src/data/json/grammar-rules.json`: owner notes 1–3 of 10 (sentence/
  nouns/articles; pronouns/possession; adjectives/adverbs/prepositions).
  Coptic copied from the notes. 48 affix rows, `parseReady: false`.
- No highlighter change. Parser waits for points 4–10 (ADR-021).

Open: points 4–10. Then parse for tap-highlight / read-correct. S13c.

## 2026-09-01 · S13b · tap highlight not black in dark
Model: Cursor Grok 4.6 | Commit: 962330e | Result: pass
- `--highlight` gold wash + `.prayer-hl` so `<mark>` is not UA Mark (black
  under `color-scheme: dark`). Same class on the selected Coptic token.

Open: owner grammar table. S13c audio.

## 2026-09-01 · ship · S16 S13b S11
Model: Cursor Grok 4.6 | Commit: ba8e1b6 | Result: pass
- Pushed remaining local code: word `normalized`/`lemma`, prayer tap
  highlight in place, `/quiz` Leitner. Harvest Arabic still off prayers.
  Unmarked tokens expected until stored grammar rules.

Open: owner grammar table. S13c audio. S14 art. S15 MDX.

## 2026-09-01 · S13b · grammar table later; unmarked tokens expected
Model: Cursor Grok 4.6 | Commit: ca7cc5f | Result: pass
- Documented that many prayer tokens correctly have no Arabic highlight.
  Full prefix/suffix grammar rules will be owner-supplied, stored as data,
  and used later. Stub peel stays; do not invent matches.
- No highlighter behaviour change this turn.

Open: owner grammar table. S13c audio. S14 art. S15 MDX.

## 2026-09-01 · S13b · tap in place, affix peel
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Removed the bottom sheet. Tap highlights Coptic + sourced Arabic in the
  same line; tap again to clear.
- Highlight-only grammar: peel ⲉⲧ/ⲉⲑ, one article, or a possessive
  (ⲡⲉⲕ / ⲡⲉⲛ / …), then match a teaching-set gloss already in the line,
  including a short Arabic suffix (اسمك، ربنا). Not used for `wordId`.
  Harvest stems (ⲱⲓⲕ، ⲫⲉ) still do not highlight.

Open: more `arHighlight` on lines where the stem is harvest-only. S13c.

## 2026-09-01 · S13b · tap highlights line Arabic
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Tapping a prayer token highlights a sourced span in `translation.ar`.
  `arHighlight` on lords-prayer l2 (أبانا / الذي في / السموات). Runtime
  also marks a unique teaching gloss, or ⲉⲧ/ⲉⲑ + teaching stem, when that
  phrase is already in the line. No new dictionary gloss; ⲉⲧ stays off the
  S13b strip list. Sheet: dictionary if any, else «من سطر الصلاة».
- Validator: `arHighlight` must occur exactly once in the line Arabic.

Open: other lines still need `arHighlight` where unique match is not enough.
  S13c audio. S14 art.

## 2026-09-01 · S11 · Leitner quiz
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- `/quiz`: glyph→name, sound/hint→glyph (letter clips), word→meaning on
  teaching-set rows that have Arabic. Boxes 1–5 in `learn-coptic:leitner`.
  Reset on the quiz page. Harvest glosses are not in the deck.
- `/practice` links to the quiz. Meaning tap-deck per group is unchanged.

Open: S13c recording. S14 art. Harvest still unverified.

## 2026-09-01 · S13b · tap-a-word
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Tokenizer exact → lemma → strip one article → null. Two hits → null.
  `wordId` only for unique teaching-set matches. Harvest Arabic stays off
  prayer pages. khen-efran l1 and lords-prayer amen tokens kept.
- 484 tokens on 42 lines; 36 teaching `wordId` after review (ⲛ̀ϫⲉ nulled;
  ⲟⲩ/ϯ strip needs ≥3 letters). Bottom sheet, empty allowed.
- `npm run validate` / `npm run build` run with S11 in the same session.

Open: most liturgical words unglossed on purpose. S13c audio.

## 2026-09-01 · S16 · dictionary hygiene
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: pass
- Added `Word.normalized` and `Word.lemma`. `normalizeCoptic` strips
  U+0300–U+036F only (not NFKC). Validator fails if stored `normalized`
  disagrees. Teaching set still 147 (`isTeachingSet` in `coptic-text.ts`).
- lemma = stored coptic except bound prefixes `{ⲡⲓ, ⲛⲓ, ϩⲁⲛ, ϯ, ⲡ̀, ⲧ̀, ⲛ̀, ⲙ̀}`
  with ≥2 letters left (so ⲛⲓⲙ / ϯϯ stay lemmas). ⲟⲩ kept. No invented stems.
  295 lemma-null; teaching null: `jnkmmon`, `pixrictoc`.
- Report only (build still green): 10 homograph keys; 477 harvest rows
  starting with an S13b article (ϯ 257, ⲟⲩ 182, ⲡⲓ 16, ⲛⲓ 12, ϩⲁⲛ 10).
  File: `src/data/generated/hygiene-report.json`.
- `npm run validate` ✓ · `npm run build` ✓. No UI change.

Open: human unpublish from the report. S13b next session. S11 still
teaching-set for word→meaning.

## 2026-09-01 · plan · S10–S16 amendments
Model: Cursor Grok 4.6 | Commit: uncommitted | Result: n/a (plan only)
- Replaced S10–S15: letter audio done; word audio S10b optional;
  S12/S13a done; S13b tap-a-word; S13c synced audio; S14 teaching-set
  nouns; S16 hygiene before S13b. ADR-019, ADR-020.
- Teaching set is 147 (`translit.ar` or drill), not `group != null`.
- Validator TODO no longer nags 8635 missing word clips/art.

Open: S16 next (blocks S13b). S11 letter quiz unblocked.

## 2026-09-01 · prayers · manuscript keys (jinkim)
Model: Cursor Grok 4.6 | Commit: 07cbea7 | Result: n/a (bugfix)
- Prayer Unicode was already the sourced Coptic. Manuscript paint was
  passing combining grave U+0300 through; Athanasius jinkim is a
  zero-width backtick *before* the letter (same as `words.json`).
- ASCII `:` in Psalm 50 is punctuation; that slot is capital ti, so it
  maps to middle dot for manuscript paint.
- Athanasius `next/font`: `display: "block"`, no Arial metric fallback,
  so punctuation keys do not flash as Latin `]` / `;`.

Open: S11 Leitner. S13 needs a real recording.

## 2026-09-01 · prayers · الربانية، الشكر، المزمور الخمسون
Model: Cursor Grok 4.6 | Commit: 7e79753 | Result: n/a (not a numbered plan step)
- Added three sourced prayers to `prayers.json` plus `/prayers` reader.
  Lord's Prayer and Thanksgiving: Coptic + Arabic from Coptic for All
  named pages. Psalm 50 Coptic: SCRIPTORIUM Bohairic CC BY 4.0; Arabic:
  agpeya.org Prime. Translit empty (not guessed). Audio still null.
- Search can find prayer titles. S13 karaoke audio not started.

Open: S11 Leitner. S13 needs a real recording.

## 2026-09-01 · S12 · Arabic→Coptic search
Model: Cursor Grok 4.6 | Commit: 7e79753 | Result: pass
- `/search` with Fuse over 8667 records. Arabic gloss first
  (`يد` → ⲧⲟⲧ). Index JSON written at `validate` to
  `src/data/generated/search-records.json` (not fetched). Header «بحث».

Open: S11 Leitner still not built.

## 2026-09-01 · vocab · Andreas harvest + practice reading
Model: Cursor Grok 4.6 | Commit: 7e79753 | Result: n/a (not a plan step)
- Harvested 8488 Andreas lemmas into `words.json` (CC BY-SA). Arabic
  gloss copied; translit empty. Validator 8635 words.
- `/vocabulary` is a group index. `/practice` shows 11 reading drills
  plus meaning tap-quiz per group (not S11).

Open: S11 Leitner still next numbered step. Translit on harvested rows
empty until a human writes church pronunciation.

## 2026-09-01 · sources · Word and prayer resource index
Model: Cursor Grok 4.6 | Commit: 7e79753 | Result: n/a (not a plan step)
- Added `docs/sources.md`: largest lexicons, church prayer libraries, SCRIPTORIUM Bohairic ~750k, CDO ~11k lemmas. No JSON ingest.
- Pointed `docs/README.md` at it.

Open: harvest still needs a human grant + Arabic glosses. S11 is next (new session).

## 2026-09-01 · S10 · Audio (letters only)
Model: Cursor Grok 4.6 | Commit: 752d855 | Result: pass (owner waiver)
- 32 Coptic Literacy letter clips, tap-to-play اسمع. Validator 0/32
  letters missing audio. Owner waived example-word recordings.
- All three S10 criteria ticked. Do not start S11 in this session.

Open: S11 is next (new session). Word audio not in S10. GitHub auto-deploy still unhooked.

## 2026-09-01 · S10 · Letter audio accepted; word clips still open
Model: Cursor Grok 4.6 | Commit: 752d855 (letters) | Result: partial
- Owner: letter-name clips are fine. 0/32 letters missing audio.
  Playback is tap-to-play (اسمع). S10 not ticked — still needs one
  example-word clip per letter that has vocabulary.
- Word cards now play `audio.src` when set. No word files yet.
  سوو has no published word (numeral only). 31 letters have a first
  lexicon/drill example.

Open: 31 word recordings. Do not invent clips. S11 not started.

## 2026-09-01 · letter · rule keys as Coptic chips
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Follow rows (`A - E - I - …`) paint Unicode Coptic via CopticPaint,
  not Latin mono and not a mapped font-family. OU is ⲟⲩ. Keys in
  conditions like (O) and حرف X do the same.

Open: S10 word clips.

## 2026-09-01 · letter · rules vs church pages
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Cross-checked all 11 explorer letters plus سوو against St-Takla,
  SUSCopts CPT100, copticchurch.net, OrSoZoX. بيتا/غما/دلتا/كي/جنجا
  match. إبسيلون after A/E is ڤ not ف. غما ن-keys `G - K - { - X`
  (حلقية). ثيتا ت-keys `T - C - ]` (سيما/شاي + تاف from HTML).
  تشيما hint dropped ك. جنجا hint adds چ.

Open: S10 word clips. Theta also has M/U on some diocese sheets; not added.

## 2026-09-01 · letter · pronunciation rules from explorer
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Rewrote the 12 `rules[]` from `interactive_coptic_explorer_ascii.html`.
  بيتا was inverted (ڤ after vowel, ب at end/consonant). غما is now
  غ / ج / ن with `A-O-W`, `U-E-I-H`, `G-K-X-]`. تشيما dropped the extra k
  rule. Cards show result, condition, LTR `follow` keys.
- ADR-017: explorer HTML is the source. Greco-Bohairic, not Old Bohairic.

Open: S10 still needs example-word clips. Not a plan step.

## 2026-09-01 · S10 · Letter audio (partial)
Model: Cursor Grok 4.6 | Commit: — | Result: partial
- 32 Coptic Literacy letter-name MP4s encoded to 64 kbps mono MP3 in
  `public/audio/letters/`. Owner church-reuse (ADR-016). Tap-to-play on
  `/letter/[id]`. Validator: 0/32 letters missing audio. JSON audio fields
  filled; word audio still null.

Open: 32 example-word clips. S10 not ticked. Cloudflare R2 not used (clips
are seconds; R2 is for S13 long prayers).

---

## 2026-08-31 · S9 · Deploy (GATE)
Model: — | Commit: a3fc32b | Result: pass (owner waiver)

- Live: https://learn-coptic.vercel.app · PWA manifest + Ⲁ favicon serving.
- Coptic now renders in GNU FreeSerif (45 KB subset), GPL-3.0-or-later WITH
  Font-exception-2.0. Cmap probe passed: U+2C80, U+2C81, U+03E2, U+03EF,
  overlines U+0304/U+0305. App stays MIT via the font exception.
  Noto Sans Coptic retained as fallback and as the سانس menu option.
- Licence requests sent (2026-08-29) to Coptic Font Standard / copticchurch.net
  and Michael Everson / Evertype. Both logged as grants.
  ADR-013: CS-family fonts fine 
- Fixed max-w-lg cap on /, /letter, /about; shell is now max-w-6xl.
  Responsive: groups 1/2/3, letters 2/3/4/6, words 1/2/3/4. 375px unchanged.
- Letter rules changed from accordion to open cards; all rules visible at once.
  Coptic inside rule text is tappable LTR chips linking to that letter.
- Lighthouse scores and Android install captured. Waived by owner.

Phase 1 closed.
Tick S9. Next: S10 — audio, new session.

---

## 2026-09-01 · S9 · Deploy (GATE)
Model: Cursor Grok 4.6 | Commit: — | Result: pass
- Human approved S9. All four criteria ticked. Live: https://learn-coptic.vercel.app. JSON untouched.

Open: S10 is next. GitHub auto-deploy still unhooked. Do not start S10 in this session.

---

## 2026-09-01 · polish · practice stub + favicon.ico
Model: Cursor Grok 4.6 | Commit: 694d7c0 | Result: pass
- `/practice` is a short “لسه مش جاهز” page so التدريب stops 404. Static `src/app/favicon.ico` for the tab icon. JSON untouched.

Open: S9 GATE still not PASS. Android install unconfirmed.

---

## 2026-09-01 · polish · header below the phone chrome
Model: Cursor Grok 4.6 | Commit: 6eb4bd1 | Result: pass
- Header (تعلّم القبطي / font picker / فاتح) sits below `safe-area-inset-top` plus 2.75rem so it is tappable on a real phone. JSON untouched.

Open: S9 GATE not PASS. Android Add-to-Home-screen not confirmed. GitHub auto-deploy still unhooked.

---

## 2026-08-31 · polish · copy + WhatsApp preview
Model: Cursor Grok 4.6 | Commit: b915616 | Result: pass
- Letter copy: Clipboard API + execCommand fallback, and an error line if both fail (silent catch was “nothing happens” on HTTP phones).
- Link preview: static `public/og.png` (no query string). Dynamic `opengraph-image` removed so WhatsApp gets `/og.png`.

Open: needs a production deploy before WhatsApp cache picks it up. S9 GATE still open.

---

## 2026-08-31 · polish · drop glass banner
Model: Cursor Grok 4.6 | Commit: 0dc9aa3 | Result: pass
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
