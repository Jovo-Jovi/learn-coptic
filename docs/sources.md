# External sources — words and prayers

Search index for later harvest. **Do not copy a site into `src/data/json/`
from this file.** Unicode Coptic only. Bohairic first. Never invent a gloss.
A request is not a grant (same rule as ADR-013 / St-Takla).

This site today: **10324** published words (147 teaching set + Andreas
harvest including 9–17 letter leftovers), **4** prayers. Letter audio is S10 (done). Word audio is S10b
optional, teaching set only. Prayer *text* is S13a; synced audio is S13c.

---

## Largest first

| Rank | What | Size (order of magnitude) | Dialect | Dumpable? | Licence / grant |
|---|---|---|---|---|---|
| 1 | [Coptic SCRIPTORIUM](https://copticscriptorium.org/) corpora | **~2.38M** words total (v6.3.0, Jul 2026); **~750k Bohairic** (v6.0, Bible + lives) | S + B | Yes, GitHub | Mostly **CC-BY** / CC-BY-SA; check per-corpus |
| 2 | [Coptic Dictionary Online](https://coptic-dictionary.org/) (KELLIA / BBAW + DDGLC) | **~11k lemmas, ~20k forms** (Comprehensive Coptic Lexicon v1); later v1.2 | All, filter **B** | Yes, TEI XML | **CC BY-SA 4.0** |
| 3 | [Coptic Reader](https://www.copticreader.org/) | Full church library: Agpeya, 3 liturgies, psalmody, katameros, Pascha, rites | Bohairic liturgy | **No** (app/web) | Church product; not a dump |
| 4 | [Tasbeha hymn library](https://tasbeha.org/hymn_library/) | **2122** hymns (Coptic / Arabic / English) | Church Bohairic | Scrape only | Church site; need grant |
| 5 | معوض داود عبد النور، قاموس قبطي عربي | **~1057–1098** pages, B + S + Greek loans | B + S | Scans / PDF | Book; not a data grant |
| 6 | Crum, *A Coptic Dictionary* (1939) | Standard academic lexicon | S primary, B marked | Viewer / DJVU | 1939 text; interfaces vary |
| 7 | أندرياس المقاري، قاموس قبطي عربي (بحيري) | **~297** pages, church + Greek loans in prayers | Bohairic | Book / PDF shops | Monastery publication |
| 8 | [St-Takla](https://st-takla.org/) Agpeya + kholagy | Seven hours + 3 liturgies (mostly Arabic / romanized Coptic) | Church | HTML | Listen/read online; **not** a grant |

For **this** site, the useful order is: church prayers (Reader / Tasbeha / St-Takla, with a grant) → Arabic glosses (Dawoud / Andreas, human-checked) → CDO dialect **B** for extra lemmas → SCRIPTORIUM Bohairic Bible for frequency and example lines.

---

## Words / lexicons

### Coptic Dictionary Online — search and dump

- UI: https://coptic-dictionary.org/ — set Dialect **B** (Bohairic)
- Data: https://github.com/KELLIA/dictionary
- Raw TEI: [Comprehensive Coptic Lexicon](https://doi.org/10.17169/refubium-2333) (v1: 11272 entries, 20141 forms); v1.2 https://doi.org/10.17169/refubium-27566
- Paper: https://aclanthology.org/W18-4502.pdf
- Glosses: English, French, German — **not Arabic**. Do not machine-translate into `meaning.ar`.

### Crum 1939

- Interactive: https://coptot.manuscriptroom.com/crum-coptic-dictionary
- DJVU: https://www.metalogos.org/files/crum.html
- Search UI wrapping Crum + KELLIA + Andreas: https://remnqymi.com/crum/

### Arabic church dictionaries (best gloss source for this product)

| Work | URL | Notes |
|---|---|---|
| معوض داود عبد النور، *قاموس اللغة القبطية* (بحيري + صعيدي) | Coptic Treasures (2nd ed., 1057 pp, 197MB PDF): https://coptic-treasures.com/book/coptic-dictionary-moawad-abd-al-nour/ · remnqymi page scan (not JSON): https://remnqymi.com/dawoud/?page=1 · IA community scans, **no `licenseurl`**: [20221116_20221116_1358](https://archive.org/details/20221116_20221116_1358), [coptic-dictionary_-M.-Abdalnour_1998](https://archive.org/details/coptic-dictionary_-M.-Abdalnour_1998), [AAlexandrina-408096](https://archive.org/details/AAlexandrina-408096). Skip z-lib id `by-z-lib.org-compressed-compressed`. | Largest Coptic–Arabic **book**. Author died 2000; 2013 reprint (Cultural Centre) still sold. IA OCR is Tesseract Arabic/Persian — Coptic glyphs are garbage. Being on Archive is not a data grant. Do not paste pages or OCR into `words.json`. Background: https://copticliterature.wordpress.com/2016/12/10/bohairicsahidic-coptic-arabic-dictionary-by-muawad-dauod-abdal-nour/ |
| الراهب أندرياس المقاري، *قاموس قبطي عربي* (بحيري + يوناني كنسي) | Book: https://shop.stmacariusmonastery.org/?product=%D9%82%D8%A7%D9%85%D9%88%D8%B3-%D9%82%D8%A8%D8%B7%D9%8A-%D8%B9%D8%B1%D8%A8%D9%8A · dump: [andreas.json](https://github.com/pishoyg/coptic/blob/master/dictionary/stmacariusmonastery_org/data/output/andreas.json) (~6.6 MB, remnqymi **CC BY-SA 4.0**) | Only dumpable Coptic–Arabic lexicon. In `words.json`: 8488 rows of 2–8 letters, then 1689 leftovers of 9–17 letters (2026-09-01). Re-run leftovers: `node scripts/harvest-andreas.mjs --leftovers`. |
| Adeeb B. Makar, *Abbreviated Coptic–English Dictionary* (2001) | St Antonius / St Mina; overview https://www.orthodoxbookstore.org/products/coptic-english-dictionary | Greco-Bohairic pronunciation; English only |
| مصباح النقلون / Naqlun CopDic (دير الملاك غبريال، جبل النقلون؛ الراهب أرساني النقلوني، إشراف الأنبا أبرآم) | [Play](https://play.google.com/store/apps/details?id=com.naqlun.coptdict) · [App Store](https://apps.apple.com/us/app/naqlun-coptic-dictionary/id1525120781) · [Facebook](https://www.facebook.com/NaqlunCopticDictionary) · naqluncopdic@gmail.com | Church **app**, not a dump. 50,000+ definitions, Bohairic + Fayyumic, Coptic↔Arabic; cites Crum / Černý / Labib. Search is **online**. APK ~20 MB is the client. **No JSON/API.** Do not scrape. Grant: that Gmail. |

There is **no larger legal Coptic–Arabic JSON/XML dump** than Andreas. Dawoud is scans/PDF (searchable at remnqymi `/dawoud`), not structured data. CDO/KELLIA is English/French/German. [Coptic Compass](https://www.copticcompass.com/en/developers) has a public dictionary API, but glosses are Coptic / English / Dutch / Greek — **not Arabic**. [UBC-NLP/copticmt](https://github.com/UBC-NLP/copticmt) is parallel *sentences* for MT, not a lemma dictionary. Machine-translating those into `meaning.ar` is forbidden. Remaining unmarked prayer tokens are mostly **inflected forms** (ⲙⲁⲣⲉ-, ⲁϥ-, …), not missing lemmas. Inventory: `docs/gaps.md`.

### Learnability portals (indexes, not new lemmas)

- https://remnqymi.com/ — Crum + KELLIA + Andreas in one search; Anki pack; Bohairic–English Bible ebook. Code: https://github.com/pishoyg/coptic — lexicon data **CC BY-SA 4.0**, code GPL-3.0
- Marcion (Milan Konvicka) — older desktop dictionary; cited by remnqymi
- Pierre Chérix lexica (Sahidic / Greek-Coptic): https://www.coptica.ch/instrumenta — Sahidic, not church Bohairic

### Our data

- `src/data/json/words.json` — 10324 published (teaching 147 + Andreas harvest).
  HTML set plus Andreas (St Macarius) via remnqymi, CC BY-SA 4.0.
  S16: every row has `normalized` (combining marks stripped) and `lemma`
  (headword or null). Hygiene report: `src/data/generated/hygiene-report.json`.
  CDO/KELLIA store lemmas not inflected forms ([W18-4502](https://aclanthology.org/W18-4502.pdf));
  Bohairic jinkim is combining grave U+0300 (Unicode N2636). Do not NFKC-fold ϣ.

---

## Prayers / liturgy (church Bohairic)

### Largest living library — Coptic Reader

- https://www.copticreader.org/
- Agpeya, Holy Psalmody, liturgies of Basil / Gregory / Cyril, katameros, Synaxarion, Antiphonary, Pascha, baptism, crowning, funerals, unction, consecrations, Lakkan
- Coptic + Arabic + English in one view
- **Do not scrape.** Ask the Coptic Orthodox Diocese of the Southern United States / Coptic Reader maintainers before any ingest.

### Hymn and lyric dumps

- https://tasbeha.org/hymn_library/ — **2122** items, Coptic Unicode on many pages, Arabic + English. Search by Coptic word works. Grant needed to ship.

### St-Takla (Arabic-first church HTML)

- Agpeya index: https://st-takla.org/Agpeya_.html · English hours https://st-takla.org/Agpeya.html
- Kholagy index: https://st-takla.org/Lyrics-Spiritual-Songs/Words-of-Coptic-Alhan-Tasbeha-Kodas/Arabic-Coptic-Liturgy-Lyrics/Arab-Copts-Mass-Book-000-index.html
- Basil index: https://st-takla.org/Lyrics-Spiritual-Songs/Words-of-Coptic-Alhan-Tasbeha-Kodas/Arabic-Coptic-Liturgy-Lyrics/Arab-Copts-Mass-Book-002-index-El-Kodas-El-Basily.html
- Coptic is often **romanized** (Athanasius-style keys), not Unicode. Convert only with **this** project’s explorer map (ADR-007), never a generic converter.

### Other Agpeya apps / APIs (smaller or mixed)

- https://copticforall.com/hymn-library/lords-prayer/ — Lord's Prayer Unicode + Arabic
- https://copticforall.com/hymn-library/thanks-giving/ — Thanksgiving Unicode + Arabic
- https://agpeya.org/prime/ — Agpeya Arabic (and English) for hours, including Psalm 50
- https://coptic.io/agpeya — hours; Coptic is mostly psalms, not full prayer prose
- https://github.com/abanobmikaeel/coptic.io
- https://github.com/abanoubha/agpeya — Android hours
- Play Store “Coptic Agpeya” — Bohairic + English, Unicode or CS font

### Our data

- `src/data/json/prayers.json` — four prayers: sample `khen-efran`; liturgical
  **الصلاة الربانية** and **صلاة الشكر** from Coptic for All (Unicode + Arabic
  on the named pages, not a library dump); **المزمور الخمسون** Coptic from
  SCRIPTORIUM Bohairic Psalter `urn:cts:copticLit:ot.pss.bohairic_ed:50`
  (CC BY 4.0, TEI phrases joined), Arabic/English gloss from
  [agpeya.org Prime](https://agpeya.org/prime/). No recordings. S13c is
  one prayer end-to-end with `startSec` / `endSec`. S13b tap-a-word stores
  tokens on every line; `wordId` is teaching-set only (harvest Arabic stays
  off prayer pages). Grammar notes 10/10 are in `grammar-rules.json`;
  parse when a human says. Blank highlight is expected until then.
  Pronunciation: owner 2026-09-01 notes merged into letter `rules[]` /
  `sound.note` and `pronunciation.json` (church modern vs old Bohairic).
  Explorer Greco-Bohairic copy stays the rule rows (ADR-017).

---

## Running text (mine words and lines later)

Not prayer books, but the **biggest Bohairic Unicode** to search for lemmas we already teach.

| Corpus | URL | Notes |
|---|---|---|
| SCRIPTORIUM browse | https://data.copticscriptorium.org/ | ANNIS search |
| Bohairic NT | https://data.copticscriptorium.org/texts/bohairicnt/ | urn:cts:copticLit:nt.bohairic |
| Bohairic OT | https://data.copticscriptorium.org/texts/bohairicot/ | Genesis… |
| GitHub dump | https://github.com/CopticScriptorium/corpora | TEI, PAULA, CoNLL-U, `*.tt` |
| UD Bohairic treebank | https://universaldependencies.org/treebanks/cop_bohairic/index.html | Mark, 1 Cor, Habakkuk, lives |
| CoptOT (Sahidic OT) | https://coptot.manuscriptroom.com/ | Göttingen; not Bohairic liturgy |
| PAThs atlas | https://atlas.paths-erc.eu/ | Manuscripts / works / places, not a learner lexicon |
| St Shenouda Society | cited by remnqymi for Bible app text | Ask before reuse |

SCRIPTORIUM v6.3.0 (2026-07-23): https://blog.copticscriptorium.org/2026/07/23/summer-2026-release/

---

## How to search next time

1. **Lemma + dialect B:** `https://coptic-dictionary.org/` then confirm the form is church Bohairic, not only Sahidic.
2. **Arabic gloss:** Dawoud or Andreas; leave `meaning` null if unsure.
3. **Does the church actually say this?** Tasbeha hymn search or Coptic Reader, not CDO frequency alone.
4. **Example line:** SCRIPTORIUM Bohairic Bible (CC) before scraping St-Takla.
5. **Prayer for S13:** start from a short Agpeya piece we already have (`ϧⲉⲛ ⲫ̀ⲣⲁⲛ`) or one Tasbeha/Reader page the owner names — not the whole kholagy.

---

## Out of scope unless granted

- Hotlinking Coptic Literacy / St-Takla / Reader media (`media-src 'self'`)
- Pasting Crum, Dawoud, or Makar pages into JSON
- Using Internet Archive OCR (`_djvu.txt`) of Dawoud as if it were Unicode Coptic
- Scraping Naqlun CopDic, Coptic Reader, Tasbeha, or St-Takla into `words.json`
- Generic “Coptic font converter” on St-Takla romanization (ADR-007)
- Sahidic-only learner apps as if they were Bohairic church Coptic
