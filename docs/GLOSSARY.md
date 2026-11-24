# Glossary — learn-coptic

The terms of the product and the vocabulary its code may use. §2 carries the project's own glossary
(`docs/before-adopt/glossary.md`, kept unchanged as its record) and adds the terms DEV_OS's documents use.

## 1. Entities

The PascalCase names below are the product's entities, as `src/data/schema/index.ts` and `src/lib/` name them. Use
them exactly.

| Entity | What it is | Where |
|---|---|---|
| `Letter` | one of the 32 Bohairic letters: Unicode upper and lower, Arabic name, home group, rules, audio, `athanasiusKey` | `letters.json` |
| `Word` | one row of the lexicon: `kind` `lexicon`, `drill` or `name`, Coptic, `normalized`, `lemma`, meaning, translit, `published` | `words.json` |
| `Prayer`, `PrayerLine` | a prayer with its source, and one line of it: Coptic, Arabic translation, tokens, `startSec`/`endSec` | `prayers.json` |
| `Level`, `Lesson` | the curriculum: levels → lessons (Level 1 the letter groups, Level 2 grammar, stubbed) | `curriculum.json` |
| `GrammarPoint`, `GrammarSection`, `GrammarTable`, `GrammarExample`, `GrammarAffix` | the owner's grammar notes and the affix rows (`parseReady`) | `grammar-rules.json` |
| `PronunciationFile`, `PronunciationExample` | the two pronunciation systems, diphthongs, jinkim, pitfalls, drills | `pronunciation.json` |
| `AudioClip` | a recording: source, reciter, dialect, licence | inside `Letter`, `Word`, `Prayer` |
| `Artwork` | an image for a word, with its licence (and, from T09, its provenance) | inside `Word` |
| `GroupId` | a letter group, 1–7 | everywhere |
| `LeitnerBox`, `LeitnerCard`, `LeitnerState` | the quiz's spaced-repetition boxes 1–5 and the learner's saved state | `src/lib/leitner.ts` |
| `SearchRecord`, `SlimSearchRecord` | one entry of the build-time search index | `src/lib/search-core.ts` |

## 2. Terms

**Bohairic** — the Coptic dialect used in the Coptic Orthodox Church today. What this site teaches. Not Sahidic,
which is what most academic material uses.

**Sahidic** — the classical literary dialect. Most English apps and grammars teach it. Different pronunciation, some
different letters in practice.

**Agpeya** — the Coptic book of hours. Source for the daily prayers.

**Home group** — the one group (1–7) a letter belongs to for navigation. Distinct from `alsoTaughtIn`, which lists
lessons that revisit it. Chrome shows Eastern digits (١..٧); URLs stay ASCII.

**Group colours** — the seven colours are pedagogy, not decoration. Learners recognise a letter's group by colour
before they recall its name.

**lexicon / drill / name** — word kinds. `lexicon` is real Coptic vocabulary (including common nouns and titles such
as البابا and المسيح). `drill` is a reading exercise: modern names (`zaki`, `mona`, `iman`, `dina`) or the group-1
ⲟ+ⲛ+ⲧ/ⲕ rhyme set. A drill must never be presented as dictionary content. The UI marks drills تمرين قراءة — مش كلمة في
القاموس. `name` is a proper noun (people, places such as رشيد and جلجثة), badged اسم علم.

**athanasiusKey** — the Latin keystroke that Athanasius Plain paints as a Coptic glyph. Stored on letters and words.
The default UI never shows it. Optional manuscript mode (`data-coptic-font="athanasius"`) paints it with the mapped
TTF; Unicode stays in the DOM for copy and screen readers. Jinkim in those keys is a backtick before the letter
(`` `n ``), matching how the explorer typed; Unicode Coptic keeps the grave after the letter (ⲛ̀).

**Demotic-derived letters** — ϣ ϥ ϧ ϩ ϫ ϭ ϯ. They live at U+03E2–03EF in the Greek block, not the Coptic block. Naive
regexes miss them.

**Teaching set** — the original curriculum vocabulary: 147 rows with `translit.ar` filled or `kind: drill` (121
lexicon / 11 drill / 15 name). The Andreas and Thabet harvest rows have empty translit. Every word has `group` set, so
`group != null` does not mean "lesson word". Art, word audio (S10b) and the quiz's word→meaning use the teaching set.

**Harvest rows** — the dictionary rows appended from Andreas of St Macarius (OD-27) and Osama Thabet (OD-32). Their
Arabic is unverified as dictionary content: it is never quizzed and never guessed into a prayer gloss.

**normalized / lemma** — `normalized` is the Coptic string with combining marks stripped (jinkim U+0300–U+036F). Not
Unicode NFKC: ϣ stays at U+03E3. `lemma` is the dictionary headword when the stored Coptic *is* that form; **null** if
a bound article is glued on (do not invent the stem). Prayer tap-a-word uses exact → lemma → strip one article → null
(OD-29). Null means no dictionary gloss. Stored `wordId` on prayers is teaching-set only until harvest Arabic is
checked. Tapping highlights a span already in that line's Arabic when the parse (OD-31), the stub peel, a teaching-set
gloss or `arHighlight` uniquely matches. Most liturgical tokens stay unmarked.

**grammar-rules.json** — the owner's Bohairic notes, **10/10**, stored 2026-09-01. Each point's sections are the
future S15 lesson steps. S17 parse test: 13 unambiguous affix rows are `parseReady`; short colliding forms stay false.
Harvest Arabic may only search a sourced prayer line (OD-31).

**pronunciation.json** — two Bohairic systems, diphthongs, jinkim, pitfalls, reading drills. Letter `rules[]` stay
explorer Greco-Bohairic (OD-26); this file does not replace them.

**النطق** — the learner sound line (`src/lib/pronounce.ts`). Teaching `translit.ar` if unique and filled; else stored
rules. Greek letter rules need one of six endings (ⲁⲥ ⲟⲥ ⲓⲥ ⲁⲛ ⲟⲛ ⲓⲛ) or a `spellList` stem. Quiet notes (ج / چ,
كسرة طويلة) sit beside it. فتحة صريحة is lab-only.

**Learner** — the person using the site. There is no account, so there is no "user" record of any kind: a learner's
progress, theme and Coptic face exist only in their own browser.

**S-step** — a step of the project's own plan in `IMPLEMENTATION_PLAN.md` (S0–S18). Its open steps are DEV_OS tasks
(`docs/PHASES.md`, OD-06); a step's **GATE** is the developer's merge.

**Task, fence, unit** — DEV_OS's words: a task is one row of `docs/PHASES.md`; its fence (`docs/fences/Tnn.md`) is
the task's whole instruction; a unit is the tasks up to a Gate, accepted into `main` by one merge (OD-02).

## 3. Forbidden bare nouns

These nouns are ambiguous in this product, or would name data it must not hold. None may be the whole name of a type,
interface, class, enum or route segment (`guard:naming`); qualify it (`LeitnerCard`, `SearchRecord`, `GrammarSection`).

```
item · items · entry · entries · data · info · record · records · user · users · account · accounts · profile · card · cards · text · term
```

Qualified replacements:

- `item`, `entry`, `record`, `data`, `info` → name the entity: `Word`, `SearchRecord`, `GrammarAffix`, `PrayerLine`.
- `user`, `account`, `profile` → **forbidden.** The product has no accounts and keeps nothing about a person; the
  person is a **learner**, and their state is `LeitnerState` in their own browser.
- `card` → `LetterCard`, `WordCard`, `LeitnerCard`: a card is always a card of something.
- `text` → say whose text: `CopticText`, `ArabicGloss`, `PrayerLine`; Coptic and Arabic must never be confused.
- `term` → `GlossaryTerm` or the entity itself.
