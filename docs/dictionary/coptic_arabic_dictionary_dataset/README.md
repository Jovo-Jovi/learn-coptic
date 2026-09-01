# Coptic–Arabic Dictionary Dataset

This package contains a normalized JSON dictionary extracted from the public Internet Archive item **Coptic Arabic Dictionary / قاموس قبطي عربي**, using the file `coptic dictionary northern dialect unicode complete.xlsx`. The resulting dataset contains **12,333 unique Coptic headwords** and **14,879 unique Arabic senses**.

## JSON structure

The main file, `output/coptic_arabic_dictionary.json`, uses the `coptic-arabic-dictionary/v1.1` schema. Each entry contains a stable local identifier, a Coptic `headword`, a list of transliteration and grammatical `variants`, and a list of `senses`. Each sense contains an Arabic gloss plus any available part of speech, gender, etymology, note, and original spreadsheet row number.

The file also contains top-level `language_pair`, dialect, counts, provenance, and field notes. The source export includes a mixture of dictionary material and English-only etymological glosses. To keep this deliverable Coptic–Arabic rather than Coptic–English, only senses containing Arabic script were retained. Duplicate combinations of Coptic headword, Arabic gloss, and part of speech were merged, while `source_row` preserves traceability.

## Provenance and rights

The Internet Archive page identifies the item as created by Osama Thabet and displays **Public Domain Mark 1.0**. This rights label is recorded in the JSON, but users should independently assess the underlying publication history and accuracy before redistributing or using the data commercially.

This repo harvests **unique** Unicode lemmas into `src/data/json/words.json`
with `node scripts/harvest-thabet.mjs`. Exact Coptic, combining-stripped, and
case-folded duplicates of existing rows are skipped. Re-run with `--dry-run`
to count without writing. Spreadsheet ASCII backtick jinkim is stored as
combining grave. The mapped notepad file and the xlsx under `source/` are
gitignored (originals stay on Archive). Keep `output/coptic_arabic_dictionary.json`
as the harvest input.

For comparison, the KELLIA/Coptic SCRIPTORIUM dictionary repository provides authoritative Coptic lexicon data in TEI XML under **CC BY-SA 4.0**, but it is not itself a complete Arabic-translation dictionary. Its source and license are documented in the research notes and were not merged into this dataset because doing so would create unverified Coptic-to-Arabic mappings.

## Reproducibility

The downloaded source files are included under `source/archive_files/`. The scripts `inspect_sources.py`, `build_dictionary.py`, and `validate_dictionary.py` reproduce the inspection, extraction, and validation workflow. Run:

```bash
python3 inspect_sources.py
python3 build_dictionary.py
python3 validate_dictionary.py
```

## References

[1]: https://archive.org/details/CopticArabicDictionary "Internet Archive: Coptic Arabic Dictionary / قاموس قبطي عربي"
[2]: https://github.com/KELLIA/dictionary "KELLIA dictionary repository"
[3]: https://blog.copticscriptorium.org/topics/release-notes/ "Coptic SCRIPTORIUM release notes"
[4]: https://creativecommons.org/publicdomain/mark/1.0/ "Public Domain Mark 1.0"
[5]: https://creativecommons.org/licenses/by-sa/4.0/ "CC BY-SA 4.0"
