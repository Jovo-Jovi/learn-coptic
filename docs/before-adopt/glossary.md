# Glossary

**Bohairic** — the Coptic dialect used in the Coptic Orthodox Church today.
What this site teaches. Not Sahidic, which is what most academic material uses.

**Sahidic** — the classical literary dialect. Most English apps and grammars
teach it. Different pronunciation, some different letters in practice.

**Agpeya** — the Coptic book of hours. Source for the daily prayers.

**Home group** — the one group (1–7) a letter belongs to for navigation.
Distinct from `alsoTaughtIn`, which lists lessons that revisit it. Chrome
shows Eastern digits (١..٧); URLs stay ASCII.

**Group colors** — the seven colors are pedagogy, not decoration. Learners
recognise a letter's group by color before they recall its name.

**lexicon / drill / name** — word kinds. `lexicon` is real Coptic vocabulary
(including common nouns and titles such as البابا and المسيح). `drill` is a
reading exercise: modern names (`zaki`, `mona`, `iman`, `dina`) or the group-1
ⲟ+ⲛ+ⲧ/ⲕ rhyme set. A drill must never be presented as dictionary content.
The UI marks drills تمرين قراءة — مش كلمة في القاموس. `name` is a proper noun
(people, places such as رشيد and جلجثة), badged اسم علم.

**athanasiusKey** — the Latin keystroke that Athanasius Plain paints as a
Coptic glyph. Stored on letters and words. Default UI never shows it.
Optional manuscript mode (`data-coptic-font="athanasius"`) paints it with
the mapped TTF; Unicode stays in the DOM for copy and screen readers.
Jinkim in those keys is a backtick before the letter (`` `n ``), matching
how the explorer typed; Unicode Coptic keeps the grave after the letter (ⲛ̀).

**Demotic-derived letters** — ϣ ϥ ϧ ϩ ϫ ϭ ϯ. They live at U+03E2–03EF in the
Greek block, not the Coptic block. Naive regexes miss them.

**Teaching set** — the original curriculum vocabulary: 147 rows with
`translit.ar` filled or `kind: drill` (121 lexicon / 11 drill / 15 name).
The 8,488 Andreas harvest rows have empty translit. After that import
**every** word has `group` set, so `group != null` does not mean “lesson
word”. Art, word audio (S10b), and S11 word→meaning use the teaching set.

**normalized / lemma** — `normalized` is the Coptic string with combining
marks stripped (jinkim U+0300–U+036F). Not Unicode NFKC: ϣ stays at
U+03E3. `lemma` is the dictionary headword when the stored Coptic *is*
that form; **null** if a bound article is glued on (do not invent the
stem). Prayer tap-a-word uses exact → lemma → strip one article → null
(ADR-020). Null means no dictionary gloss. Stored `wordId` on prayers is
teaching-set only until harvest Arabic is checked. Tapping highlights a
span already in that line’s Arabic when parse (ADR-022), the stub peel, a
teaching-set gloss, or `arHighlight` uniquely matches. Most liturgical
tokens stay unmarked.

**grammar-rules.json** — owner Bohairic notes, **10/10** stored 2026-09-01.
Each point’s sections are future S15 lesson steps. S17 parse test: 13
unambiguous affix rows are `parseReady`. Short colliding forms stay false.
Harvest Arabic may only search a sourced prayer line (ADR-022).

**pronunciation.json** — two Bohairic systems, diphthongs, jinkim,
pitfalls, reading drills. Letter `rules[]` stay explorer Greco-Bohairic
(ADR-017); this file does not replace them.

