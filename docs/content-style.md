# Content style

## Language

Arabic first, Egyptian register — the way a Sunday school teacher speaks, not
formal MSA. Short sentences. Second person singular.

English, where present, is one small supporting line. Never a parallel column,
never equal weight. This is not a bilingual site with Arabic added.

## Letter names

Use the forms this project's curriculum teaches (live explorer): ألفا، بيتا،
غَما، دلتا، لولا، تاف، سوو، بسي، إبسيلون. Khi is `name.ar` كي with
`name.arDisplay` كي، خي، شي — sort/search use `ar`, the page shows `arDisplay`.
If a later curriculum file disagrees, change the name in `letters.json` once,
not per page.

## Group numbers in the UI

Learner-facing labels use Eastern Arabic digits (المجموعة ٤, chips ١..٧).
Routes stay ASCII (`/group/4`, `?group=4`).

## Coptic font picker

Header control labels: سيريف (GNU FreeSerif), سانس (Noto Sans Coptic),
أثناسيوس (Athanasius Plain, optional manuscript). Default is سيريف.
Do not offer CS / Antinoou faces that are not in `src/app/fonts/`.

## Unicase on cards

Bohairic letters are one shape. Cards show the **lowercase** (reading) glyph
only. The letter page stacks both, labelled كبير and صغير, and says
الشكل واحد، والفرق في الحجم فقط. Never show the upper+lower pair on a card.

## Transliteration

Arabic transliteration is for reading aloud, not for linguistics. Write what a
speaker should say (خين إفران), not a scholarly scheme. IPA is a separate field
and is not shown to beginners.

## Tone

Explain a rule, then show one example. Never more than three examples on a
first pass. No gamified congratulation copy — a learner reading prayers does
not need confetti.

## What is never written

A gloss nobody has verified. A transliteration guessed from spelling. A prayer
line typed from memory. Leave it blank and mark it `published: false`.

If the HTML `arabic` field is only the pronunciation (same string as
`pronunciation`), that is not an unfinished gloss. Put it in `translit.ar`,
set `meaning` to null, and tag `kind: "drill"` when it is a reading set.

`khen` (ϧⲉⲛ): two prepositional senses, written `في / بـ` — not the HTML
string `ب-في`. It is published; `prayers.json` names it in `keyWords`.

## Letter audio

On `/letter/[id]`, a real `<button>` (اسمع) starts playback from a user tap.
No autoplay. iOS Safari only plays after that tap. Native `<audio controls>`
is not used — the chrome is Arabic.

Clips are 64 kbps mono MP3 in `public/audio/letters/{id}.mp3`, sourced from
Coptic Literacy letter-name videos with owner church-reuse authorization
(ADR-016). Owner accepted letter audio 2026-09-01 and waived example-word
clips for S10. Word `audio` may stay null. If a word later has `audio.src`,
the card front shows اسمع (tap, no autoplay) — not inside the meaning-toggle
button.

On `/letter/[id]`, rules are always visible — no accordion. Copy matches
the live explorer layout: result first (`ينطق (ڤ):`), then the condition,
then an optional LTR `follow` row. Explorer keys (`A - E - I - …`) are
painted as Unicode Coptic chips (`ⲁ ⲉ ⲓ …`) via `CopticPaint`. Do not
set a mapped TTF as a Unicode `font-family`. Latin in parentheses that
is not a key (`(ڤ)`, `(TCH)`) stays an LTR isolate.

Two pronunciation systems are documented in `pronunciation.json`: church
modern (عريان / default audio) and old Bohairic (إميل ماهر). Letter
pages teach the church-modern `rules[]`. Do not swap audio to old
Bohairic without a human decision.

`arabicHint` is the letter’s class (سيما سين، تاف تاء). Special
pronunciations stay extra `rules[]` cards. Do not add ص / ز or ط / د
to `arabicHint`, IPA, quiz hints, or letter cards.

## Search

`/search` is Arabic-first lookup: type a gloss, see Coptic. Coptic and letter
names also work. Results show the glyph and the Arabic together — meaning is
not hidden. Empty translit stays hidden.

Meaning stays hidden until the learner taps a real `<button>` (`aria-expanded`).
Not hover. The Coptic word and `translit.ar` stay visible while the back opens.
If `translit.ar` is empty (Andreas harvest), hide the line — do not guess a
pronunciation from spelling.

- `lexicon` — ordinary card.
- `name` — same card plus a small badge: اسم علم.
- `drill` — dashed card, group stripe, and the line
  تمرين قراءة — مش كلمة في القاموس
  on the front. A drill with `meaning: null` shows translit only; never an
  empty meaning slot.

Part of speech, when present: اسم، فعل، ضمير، صفة، حرف جر، أداة، عبارة، أخرى.
Example words on `/letter/[id]` are derived from `words.teaches`, lexicon
first, capped at 6. `letters.json` `exampleWords[]` stays empty.

Harvested Andreas and Thabet rows keep the dictionary Arabic. They are not
reading drills. Credit remnqymi / St Macarius and Osama Thabet on `/about`.
Thabet ids are `thabet-*`. Do not overwrite a stored row when the new dump
repeats the same Coptic.

Word art (S14) is teaching-set concrete nouns only, one prompt template
and one palette, themed batches. A page with two pictures and twenty
blanks looks broken; a page with none, or a finished theme, looks designed.

## Prayers

`/prayers` lists every row in `prayers.json`. Each line is Coptic (LTR
isolate) then the Arabic gloss. Empty `translit.ar` is hidden — do not guess
church pronunciation. English is a small LTR line under the Arabic. Cite the
source URL on the prayer page. Do not type a prayer line from memory.

Tap-a-word (S13b + S17): dictionary first, then grammar peel. Tap shows
the stored Arabic meaning under the line, and highlights a unique span in
the prayer translation when one exists. A token with **no** meaning is
expected when the surface form is not in the dictionary and peel does not
leave a unique stem. Do not invent a match. The wash is
`--highlight` (gold on the card), not `surface-2`: UA `<mark>` is black in
dark mode.

