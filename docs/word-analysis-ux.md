# Word analysis — what ships, what stays lab

Record of the 2026-09-03 product cut. Engine peel lives on
`test/layered-word-analysis`. Production may use **stored-rule pronunciation**
and **existing Arabic gloss** only (ADR-024).

## Ready now (this slice)

- Connected Coptic spelling (already on cards / prayer tokens / search hits).
- Arabic gloss already stored: teaching-set meaning, unique lexicon on a word
  card, prayer tap caption (teaching first, else unique harvest as ADR-022).
- النطق from `src/lib/pronounce.ts`: unique teaching `translit.ar` wins;
  otherwise letter `rules[]` + `pronunciation.json` diphthongs / jinkim.
  Greek كي / سيما-زاي / تاف-دال use the six endings ⲁⲥ ⲟⲥ ⲓⲥ ⲁⲛ ⲟⲛ ⲓⲛ
  (as os is an on in), plus a stored `spellList` for stems those endings
  miss (ⲭⲉⲣⲉ ش، ⲭⲱⲣⲁ خ، ⲭⲏⲙⲓ ك). Do not add ⲏⲥ / ⲏⲛ unless the owner
  names them. Coptic حالة خاصة (صاد/طاء) stay unused.
- Quiet notes only when a stored extra changes the reading (ϫ ج then چ,
  كسرة طويلة). Not `فتحة صريحة` / `طويلة` / `قصيرة` on every vowel.
- Surfaces: prayer tap (stay on the line), word-card expand, `/search` hit.
- Blank meaning stays: «مفيش معنى في القاموس للكلمة دي بعد.»

## Not ready — do not ship

- Lab morphology (`analyzeWord`, peel layers, numbered steps).
- Replacing prayer `parseCoptic` / S17 GATE. Still needs human **PASS**.
- Harvest Arabic composed as a new dictionary gloss (ADR-022).
- POS heuristics (teaching lexicon → noun; harvest → present).
- Invented hortative forms `ⲙⲁⲣⲓ-` / `ⲙⲁⲣⲟⲩ-`.
- Homograph guessing.
- A fifth bottom-nav tab, `/lab` in the public nav, or «مختبر» copy.
- Unicode paste, engine gaps string, «مقاطع النطق» chips, vertical letter dump.
- Lab links on word cards or prayer tap.

## Learner UI (when morphology is later allowed)

Default: Coptic + المعنى (honest) + النطق (one sound line).

On «ليه؟»: short formula `ⲡⲉⲕ` لكَ + `ⲣⲁⲛ` اسم — not numbered layers.

If peel is partial: show known pieces, then «الباقي لسة مش متقسم».

## How to add the rest to main later

1. Pronounce + gloss on cards / prayer / search — **this slice**.
2. Same skin on prayer tap next to today’s highlight. Do not replace
   `parseCoptic`.
3. Morphology for teaching-set + the 13 `parseReady` affixes only.
4. Lab peel replaces prayer parse only after GATE **PASS**.

Until step 4, `/lab/analyze` stays noindex (`robots` disallows `/lab`).
