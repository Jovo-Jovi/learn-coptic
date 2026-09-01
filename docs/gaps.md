# Gaps — dictionary merge and unmarked prayers

Recorded 2026-09-01. Refresh the tables with
`npx tsx scripts/report-gaps.mts` (does not touch `src/data/json/`).

A gap here is a Coptic form the site cannot honestly gloss today. Leave it
blank in the UI until a human sources Arabic or approves a parse peel.

---

## GitHub dictionaries — merge or not

Dumpable Coptic–Arabic lexicons in `words.json`: remnqymi Andreas
(**CC BY-SA 4.0**) and unique Osama Thabet northern-dialect lemmas
(Internet Archive **Public Domain Mark 1.0**). Do not merge KELLIA English
into `meaning.ar`.

| Repo / file | Arabic? | Licence | Merge? |
|---|---|---|---|
| [pishoyg/coptic](https://github.com/pishoyg/coptic) `dictionary/stmacariusmonastery_org/data/output/andreas.json` | Yes | **CC BY-SA 4.0** | **In** `words.json` (2–8 then 9–17 letters). Remaining skips: affix hyphen, no Arabic, regex, letter names, unmapped glyphs. |
| [IA CopticArabicDictionary](https://archive.org/details/CopticArabicDictionary) Osama Thabet xlsx | Yes | **PDM 1.0** (uploader mark) | **In** unique lemmas only (`node scripts/harvest-thabet.mjs`). Exact / normalized / case-folded duplicates skipped. Notepad Greek-mapped file and bundled Andreas PDFs not ingested. |
| [KELLIA/dictionary](https://github.com/KELLIA/dictionary) (CDO / Comprehensive Coptic Lexicon TEI) | No (EN / FR / DE) | CC BY-SA 4.0 | **No** into `meaning.ar`. Do not machine-translate. Optional later: store English as `meaning.en` only if a human asks. |
| [louiseyousre2020/coptic-words](https://github.com/louiseyousre2020/coptic-words) | No | Derived from KELLIA | **No** — Bohairic wordlist, not Arabic glosses. |
| [KyroHub/CopticCompass](https://github.com/KyroHub/CopticCompass) | No (EN / NL / Greek) | Code MIT; **content rights reserved** | **No** Arabic merge. |
| [UBC-NLP/copticmt](https://github.com/UBC-NLP/copticmt) CoPARA | Parallel sentences, not lemmas | Research corpus | **No** as a dictionary. Do not split sentences into invented headwords. |
| [CopticScriptorium/corpora](https://github.com/CopticScriptorium/corpora) | Running text | Mostly CC-BY / CC-BY-SA | **No** as a dictionary. Useful later for example lines, not glosses. |
| [iDevMartin/copticlingo](https://github.com/iDevMartin/copticlingo) `copticsite.json` (mentioned in their notes) | Coptic–Arabic claimed | **Unlicensed** README; likely a scrape of a church site | **No** without a named grant. Treat like Tasbeha / Reader. |

Not on GitHub as structured data: Dawoud (scans / 197MB PDF), Claudius Labib (scans), Naqlun CopDic (app). See `docs/sources.md`.

**Why another lemma dump still would not close most of the prayer table:**
those forms are mostly conjugated / optative / fused (ⲙⲁⲣⲉ-, ⲁϥ-, ⲉⲕⲉ̀-),
not missing headwords. Long leftovers filled a few exact liturgical lemmas
(e.g. ϣⲟⲩϣⲱⲟⲩϣⲓ) only.

---

## Snapshot

| Measure | Count |
|---|---|
| Prayer tokens | 484 |
| Tokens with a stored / parse caption | 355 |
| Tokens with **no** caption (occurrences) | 129 |
| Unique unmarked Coptic forms | 117 |
| Published words | 11858 |
| Teaching set | 147 |
| Published rows with `meaning.ar` null | 6 (all 6 drills; other: none) |
| Grammar affixes `parseReady` | 13 |
| Grammar affixes still blocked | 89 |

---

## Later actions

1. **Andreas leftovers (9–17)** — done 2026-09-01. Same CC BY-SA dump.
2. **Thabet unique lemmas** — done 2026-09-02. Duplicates skipped.
3. **Do not** merge KELLIA / Compass / coptic-words / copticlingo / copticmt
   into `meaning.ar`.
4. **Prayer tokens below** — human `gloss` / `arHighlight` on the line,
   or more `parseReady` affixes after S17 GATE **PASS** (optative ⲙⲁⲣⲉ-,
   past ⲁ- + subject, ⲛ̀ϫⲉ, object ⲙ̀ⲙⲟ-, ⲉϫⲉⲛ / ⲉϫⲱ-). Never invent Arabic.
5. **Grant track** — Dawoud, Naqlun, or copticsite.json only if the owner
   names the source in writing.

---

## Unmarked prayer forms

Unique Coptic surfaces with no dictionary hit and no parse caption.
Count is how often the form appears across the four prayers.

| n | prayers | coptic |
|---|---|---|
| 3 | lords-prayer, thanksgiving | ⲛ̀ϫⲉ |
| 2 | psalm-50 | ⲉⲕⲉ̀ⲣⲁϧⲧ |
| 2 | lords-prayer, thanksgiving | ⲉ̀ⲡⲓⲣⲁⲥⲙⲟⲥ |
| 2 | thanksgiving | ⲉ̀ⲧⲁⲓⲟⲩⲛⲟⲩ |
| 2 | psalm-50 | ⲉϥⲧⲉⲛⲛⲏⲟⲩⲧ |
| 2 | thanksgiving | ⲉ̀ϫⲉⲛ |
| 2 | thanksgiving | ⲉ̀ϫⲱⲛ |
| 2 | lords-prayer, thanksgiving | ⲙ̀ⲡⲉⲣⲉⲛⲧⲉⲛ |
| 2 | lords-prayer, thanksgiving | ⲛⲁϩⲙⲉⲛ |
| 2 | psalm-50, thanksgiving | ⲛⲏⲉⲧϩⲏⲡ |
| 2 | psalm-50 | ⲡϭⲟⲓⲥ |
| 1 | psalm-50 | ⲁ̀ |
| 1 | psalm-50 | ⲁⲓⲁⲓϥ |
| 1 | thanksgiving | ⲁⲕⲉⲛⲧⲉⲛ |
| 1 | thanksgiving | ⲁⲕⲉⲣⲥⲕⲉⲡⲁⲍⲓⲛ |
| 1 | psalm-50 | ⲁⲕⲧⲁⲙⲟⲓ |
| 1 | thanksgiving | ⲁⲕϣⲟⲡⲧⲉⲛ |
| 1 | thanksgiving | ⲁⲕϯⲧⲟⲧⲉⲛ |
| 1 | thanksgiving | ⲁⲗⲓⲧⲟⲩ |
| 1 | psalm-50 | ⲁⲣⲓⲡⲉⲑⲛⲁⲛⲉϥ |
| 1 | lords-prayer | Ⲁⲣⲓⲧⲉⲛ |
| 1 | psalm-50 | ⲁ̀ⲣⲓⲧϥ |
| 1 | thanksgiving | ⲁϥⲉⲛⲧⲉⲛ |
| 1 | thanksgiving | ⲁϥⲉⲣⲥⲕⲉⲡⲁⲍⲓⲛ |
| 1 | thanksgiving | ⲁϥϣⲟⲡⲧⲉⲛ |
| 1 | thanksgiving | ⲁϥϯⲧⲟⲧⲉⲛ |
| 1 | thanksgiving | ⲉ̀ⲃⲟⲗϩⲓⲧⲟⲧϥ |
| 1 | thanksgiving | ⲉⲑⲛⲁⲛⲉⲩ |
| 1 | thanksgiving | ⲉⲑⲣⲉⲛϫⲱⲕ |
| 1 | psalm-50 | ⲉⲓⲉ̀ⲟⲩⲃⲁϣ |
| 1 | psalm-50 | ⲉⲓⲉ̀ⲧⲟⲩⲃⲟ |
| 1 | psalm-50 | ⲉⲓⲉ̀ⲧ̀ⲥⲁⲃⲉ |
| 1 | psalm-50 | ⲉⲕⲉⲑ̀ⲣⲓⲥⲱⲧⲉⲙ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲛⲟⲩϫϧ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲟⲩⲱⲛ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲥⲟⲗϫⲟⲩ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲥⲟⲛⲧϥ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲥⲱⲗϫ |
| 1 | psalm-50 | ⲉⲕⲉ̀ⲧⲟⲩⲃⲟⲓ |
| 1 | psalm-50 | ⲉⲕⲉ̀ϯⲙⲁϯ |
| 1 | psalm-50 | ⲉⲕⲛⲁϭⲓϩⲁⲡ |
| 1 | psalm-50 | ⲉ̀ⲟⲩⲑⲉⲗⲏⲗ |
| 1 | psalm-50 | ⲉ̀ⲡ̀ⲱϣⲓ |
| 1 | psalm-50 | ⲉ̀ⲣⲉⲣⲱⲓ |
| 1 | psalm-50 | ⲉ̀ⲥⲓⲱⲛ |
| 1 | thanksgiving | ⲉⲧⲁⲕϯ |
| 1 | psalm-50 | ⲉⲩⲉ̀ⲑⲉⲗⲏⲗ |
| 1 | psalm-50 | ⲉⲩⲉ̀ⲓ̀ⲛⲓ |
| 1 | psalm-50 | ⲉⲩⲉ̀ⲕⲟⲧⲟⲩ |
| 1 | thanksgiving | ⲉⲩϩⲱⲟⲩ |
| 1 | psalm-50 | ⲉϥⲉ̀ⲑⲉⲃⲓⲏⲟⲩⲧ |
| 1 | psalm-50 | ⲉϥⲉ̀ⲑⲉⲗⲏⲗ |
| 1 | psalm-50 | ⲉϥⲟⲩⲁⲃ |
| 1 | psalm-50 | ⲉϥⲥⲟⲩⲧⲱⲛ |
| 1 | thanksgiving | ⲉ̀ϩⲱⲙⲓ |
| 1 | psalm-50 | ⲉ̀ϫⲉⲛⲡⲉⲕⲙⲁⲛ̀ⲉⲣϣⲱⲟⲩϣⲓ |
| 1 | psalm-50 | ⲉ̀ϫⲉⲛϩⲁⲛϣⲟⲩϣⲱⲟⲩϣⲓ |
| 1 | psalm-50 | ⲉ̀ϫⲱⲓ |
| 1 | psalm-50 | ⲉ̀ϫⲱⲟⲩ |
| 1 | psalm-50 | ⲕⲁⲧⲁⲡⲉⲕⲛⲓϣϯ |
| 1 | thanksgiving | Ⲙⲁⲣⲉⲛϣⲉⲡϩ̀ⲙⲟⲧ |
| 1 | thanksgiving | ⲙⲁⲣⲉⲛϯϩⲟ |
| 1 | lords-prayer | ⲙⲁⲣⲉⲥⲓ̀ |
| 1 | lords-prayer | ⲙⲁⲣⲉϥⲧⲟⲩⲃⲟ |
| 1 | lords-prayer | ⲙⲁⲣⲉϥϣⲱⲡⲓ |
| 1 | psalm-50 | ⲙⲁⲣⲟⲩⲕⲟⲧⲟⲩ |
| 1 | psalm-50 | ⲙⲁⲧⲁⲥⲑⲟ |
| 1 | psalm-50 | ⲙⲁⲧⲁϫⲣⲟⲓ |
| 1 | thanksgiving | ⲙⲏⲓⲥ |
| 1 | lords-prayer | ⲙⲏⲓϥ |
| 1 | psalm-50 | ⲙ̀ⲙⲁⲩⲁⲧⲕ |
| 1 | psalm-50 | ⲙ̀ⲙⲟⲥ |
| 1 | thanksgiving | ⲙ̀ⲡⲁⲓⲕⲉⲉϩⲟⲟⲩ |
| 1 | psalm-50 | ⲙ̀ⲡⲁⲙ̀ⲑⲟ |
| 1 | psalm-50 | ⲙⲡⲉⲣⲃⲉⲣⲃⲱⲣⲧ |
| 1 | psalm-50 | ⲙ̀ⲡⲉⲣⲟⲗϥ |
| 1 | psalm-50 | ⲛⲁⲁ̀ⲛⲟⲙⲓⲁ̀ |
| 1 | psalm-50 | ⲛⲁⲓⲛⲁϯ |
| 1 | psalm-50 | ⲛⲁϩⲙⲉⲧ |
| 1 | psalm-50 | ⲛⲉⲙⲕⲁⲧⲁⲡ̀ⲁ̀ϣⲁⲓ |
| 1 | psalm-50 | ⲛⲉⲙⲛⲏⲉⲧⲉ |
| 1 | thanksgiving | ⲛⲏⲉⲑⲟⲩⲱⲛϩ |
| 1 | thanksgiving | ⲛⲏⲉⲧⲉⲣⲛⲟϥⲣⲓ |
| 1 | lords-prayer | ⲛⲏⲉⲧⲉⲣⲟⲛ |
| 1 | psalm-50 | ⲛ̀ⲛⲁⲛⲟⲃⲓ |
| 1 | psalm-50 | ⲛ̀ⲛⲁⲥ̀ⲫⲟⲧⲟⲩ |
| 1 | lords-prayer | ⲛ̀ⲛⲏⲉⲧⲉ |
| 1 | psalm-50 | ⲛ̀ⲥⲉⲟⲩⲱⲛϩ |
| 1 | psalm-50 | ⲛ̀ⲧⲁⲁ̀ⲙⲟⲛⲓⲁ̀ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲓⲉⲣⲟⲩⲥⲁⲗⲏⲙ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲛⲉⲕⲙⲉⲧϣⲉⲛϩⲏⲧ |
| 1 | lords-prayer | ⲛ̀ⲧⲉⲛⲭⲱ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲡⲉⲕⲟⲩϫⲁⲓ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲧⲁⲥⲱⲧⲏⲣⲓⲁ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲧⲉⲕⲥⲟⲫⲓⲁ |
| 1 | psalm-50 | ⲛ̀ⲧⲉⲫⲛⲟⲩϯ |
| 1 | thanksgiving | ⲛ̀ⲧⲉϥⲁⲣⲉϩ |
| 1 | psalm-50 | ⲛ̀ϫⲉⲛⲓⲕⲁⲥ |
| 1 | psalm-50 | ⲛ̀ϫⲉⲡⲁⲗⲁⲥ |
| 1 | thanksgiving | ⲡⲁⲓⲉϩⲟⲟⲩ |
| 1 | psalm-50 | ⲡⲁⲛⲟⲃⲓ |
| 1 | lords-prayer | ⲡⲉⲧⲉϩⲛⲁⲕ |
| 1 | psalm-50 | ⲧⲁⲙⲁⲩ |
| 1 | thanksgiving | ⲧⲉⲛⲧⲱⲃϩ |
| 1 | thanksgiving | ⲧⲉⲛϣⲉⲡϩ̀ⲙⲟⲧ |
| 1 | thanksgiving | ⲧⲉⲛϯϩⲟ |
| 1 | psalm-50 | ϧⲉⲛⲛⲉⲕⲥⲁϫⲓ |
| 1 | psalm-50 | ϧⲉⲛⲛⲏⲉⲧⲥⲁϧⲟⲩⲛ |
| 1 | psalm-50 | ϩⲁⲡⲁⲛⲟⲃⲓ |
| 1 | psalm-50 | ϩⲁⲡⲉⲕϩⲟ |
| 1 | psalm-50 | ϩⲁⲣⲟⲓ |
| 1 | psalm-50 | ϩⲁⲣⲟⲕ |
| 1 | thanksgiving | ϩⲁⲣⲟⲛ |
| 1 | psalm-50 | ϩⲁⲧⲁⲁ̀ⲛⲟⲙⲓⲁ |
| 1 | psalm-50 | ϩⲓⲛⲉⲕⲙⲱⲓⲧ |
| 1 | psalm-50 | ϫⲉⲉ̀ⲛⲉ |
| 1 | psalm-50 | ϫⲉⲧⲁⲁ̀ⲛⲟⲙⲓⲁ̀ |

---

## Affixes not parseReady yet

Short colliding forms stay false on purpose (S17 test). Do not bulk-flip.

| id | form | kind |
|---|---|---|
| `copula-pe` | ⲡⲉ | copula |
| `copula-te` | ⲧⲉ | copula |
| `copula-ne` | ⲛⲉ | copula |
| `art-fi` | ⲫ | article-definite |
| `art-p` | ⲡ | article-definite |
| `art-ti` | ϯ | article-definite |
| `art-thi` | ⲑ | article-definite |
| `art-t` | ⲧ | article-definite |
| `art-nen` | ⲛⲉⲛ | article-definite |
| `art-ou` | ⲟⲩ | article-indefinite |
| `art-han` | ϩⲁⲛ | article-indefinite |
| `gen-n` | ⲛ̀ | genitive |
| `gen-m` | ⲙ̀ | genitive |
| `gen-nte` | ⲛ̀ⲧⲉ | genitive |
| `tense-a` | ⲁ | tense |
| `poss-pa` | ⲡⲁ | possessive-adjective |
| `poss-ta` | ⲧⲁ | possessive-adjective |
| `poss-na` | ⲛⲁ | possessive-adjective |
| `poss-nek` | ⲛⲉⲕ | possessive-adjective |
| `poss-pe-fsg` | ⲡⲉ | possessive-adjective |
| `poss-te-fsg` | ⲧⲉ | possessive-adjective |
| `poss-ne-fsg` | ⲛⲉ | possessive-adjective |
| `poss-pef` | ⲡⲉϥ | possessive-adjective |
| `poss-tef` | ⲧⲉϥ | possessive-adjective |
| `poss-nef` | ⲛⲉϥ | possessive-adjective |
| `poss-pes` | ⲡⲉⲥ | possessive-adjective |
| `poss-tes` | ⲧⲉⲥ | possessive-adjective |
| `poss-nes` | ⲛⲉⲥ | possessive-adjective |
| `poss-ten` | ⲧⲉⲛ | possessive-adjective |
| `poss-nen` | ⲛⲉⲛ | possessive-adjective |
| `poss-peten` | ⲡⲉⲧⲉⲛ | possessive-adjective |
| `poss-teten` | ⲧⲉⲧⲉⲛ | possessive-adjective |
| `poss-neten` | ⲛⲉⲧⲉⲛ | possessive-adjective |
| `poss-pou` | ⲡⲟⲩ | possessive-adjective |
| `poss-tou` | ⲧⲟⲩ | possessive-adjective |
| `poss-nou` | ⲛⲟⲩ | possessive-adjective |
| `prep-e` | ⲉ | preposition |
| `prep-n` | ⲛ̀ | preposition |
| `subj-ti` | ϯ | subject-pronoun |
| `subj-k` | ⲕ | subject-pronoun |
| `subj-te` | ⲧⲉ | subject-pronoun |
| `subj-f` | ϥ | subject-pronoun |
| `subj-s` | ⲥ | subject-pronoun |
| `subj-ten` | ⲧⲉⲛ | subject-pronoun |
| `subj-teten` | ⲧⲉⲧⲉⲛ | subject-pronoun |
| `subj-se` | ⲥⲉ | subject-pronoun |
| `obj-et` | ⲉⲧ | object-pronoun |
| `obj-ef` | ⲉϥ | object-pronoun |
| `tense-na` | ⲛⲁ | tense |
| `tense-nare` | ⲛⲁⲣⲉ | tense |
| `tense-nai` | ⲛⲁⲓ | tense |
| `neg-n` | ⲛ̀ | negation |
| `neg-an` | ⲁⲛ | negation |
| `neg-mpe` | ⲙ̀ⲡⲉ | negation |
| `neg-mpi` | ⲙ̀ⲡⲓ | negation |
| `neg-nne` | ⲛ̀ⲛⲉ | negation |
| `neg-mmon` | ⲙ̀ⲙⲟⲛ | negation |
| `neg-mmont` | ⲙ̀ⲙⲟⲛⲧ | negation |
| `neg-at` | ⲁⲧ | negation |
| `imp-a` | ⲁ̀ | imperative |
| `imp-ma` | ⲙⲁ | imperative |
| `imp-ari` | ⲁⲣⲓ | imperative |
| `imp-mper` | ⲙ̀ⲡⲉⲣ | imperative |
| `mood-e` | ⲉ | mood |
| `mood-shan` | ϣⲁⲛ | mood |
| `mood-esop` | ⲉϣⲱⲡ | mood |
| `q-e` | ⲏ | interrogative |
| `q-me` | ⲙⲏ | interrogative |
| `q-nim` | ⲛⲓⲙ | interrogative |
| `q-ou` | ⲟⲩ | interrogative |
| `q-thon` | ⲑⲱⲛ | interrogative |
| `q-nthnau` | ⲛ̀ⲑⲛⲁⲩ | interrogative |
| `q-tnau` | ⲧⲛⲁⲩ | interrogative |
| `q-ethbe` | ⲉⲑⲃⲉ | interrogative |
| `q-pos` | ⲡⲱⲥ | interrogative |
| `q-ouer` | ⲟⲩⲏⲣ | interrogative |
| `rel-eta` | ⲉⲧⲁ | relative |
| `objmark-n` | ⲛ̀ | object-marker |
| `objmark-m` | ⲙ̀ | object-marker |
| `objmark-e` | ⲉ | object-marker |
| `conj-hina` | ϩⲓⲛⲁ | conjunction |
| `conj-shante` | ϣⲁⲛⲧⲉ | conjunction |
| `conj-nte` | ⲛ̀ⲧⲉ | conjunction |
| `tense-jin` | ϫⲓⲛ | tense |
| `mood-enare` | ⲉⲛⲁⲣⲉ | mood |
| `mood-ethre` | ⲉⲑ̀ⲣⲉ | mood |
| `ind-nthok` | ⲛ̀ⲑⲟⲕ | independent-pronoun |
| `ind-nthof` | ⲛ̀ⲑⲟϥ | independent-pronoun |
| `ind-nthoten` | ⲛ̀ⲑⲱⲧⲉⲛ | independent-pronoun |
