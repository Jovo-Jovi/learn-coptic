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
