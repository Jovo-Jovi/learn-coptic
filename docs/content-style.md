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
(ADR-016). Word audio is still empty.

On `/letter/[id]`, rules are always visible — no accordion. Copy matches
the live explorer layout: result first (`ينطق (ڤ):`), then the condition,
then an optional LTR `follow` row. Explorer keys (`A - E - I - …`) are
painted as Unicode Coptic chips (`ⲁ ⲉ ⲓ …`) via `CopticPaint`. Do not
set a mapped TTF as a Unicode `font-family`. Latin in parentheses that
is not a key (`(ڤ)`, `(TCH)`) stays an LTR isolate.

## Vocabulary cards

Meaning stays hidden until the learner taps a real `<button>` (`aria-expanded`).
Not hover. The Coptic word and `translit.ar` stay visible while the back opens.

- `lexicon` — ordinary card.
- `name` — same card plus a small badge: اسم علم.
- `drill` — dashed card, group stripe, and the line
  تمرين قراءة — مش كلمة في القاموس
  on the front. A drill with `meaning: null` shows translit only; never an
  empty meaning slot.

Part of speech, when present: اسم، فعل، ضمير، صفة، حرف جر، أداة، عبارة، أخرى.
Example words on `/letter/[id]` are derived from `words.teaches`, lexicon
first, capped at 6. `letters.json` `exampleWords[]` stays empty.
