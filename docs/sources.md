# External sources — words and prayers

Search index for later harvest. **Do not copy a site into `src/data/json/`
from this file.** Unicode Coptic only. Bohairic first. Never invent a gloss.
A request is not a grant (same rule as ADR-013 / St-Takla).

This site today: **8635** published words (147 teaching set + Andreas
harvest), **4** prayers. Letter audio is S10 (done). Word audio is S10b
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
| معوض داود عبد النور، *قاموس اللغة القبطية* (بحيري + صعيدي) | https://coptic-treasures.com/book/coptic-dictionary-moawad-abd-al-nour/ · searchable scan https://remnqymi.com/dawoud/?page=1 | Largest Coptic–Arabic book. Background: https://copticliterature.wordpress.com/2016/12/10/bohairicsahidic-coptic-arabic-dictionary-by-muawad-dauod-abdal-nour/ |
| الراهب أندرياس المقاري، *قاموس قبطي عربي* (بحيري + يوناني كنسي) | https://shop.stmacariusmonastery.org/?product=%D9%82%D8%A7%D9%85%D9%88%D8%B3-%D9%82%D8%A8%D8%B7%D9%8A-%D8%B9%D8%B1%D8%A8%D9%8A · https://www.christianlib.com/16353.html | Aimed at prayers and patristic church words |
| Adeeb B. Makar, *Abbreviated Coptic–English Dictionary* (2001) | St Antonius / St Mina; overview https://www.orthodoxbookstore.org/products/coptic-english-dictionary | Greco-Bohairic pronunciation; English only |

### Learnability portals (indexes, not new lemmas)

- https://remnqymi.com/ — Crum + KELLIA + Andreas in one search; Anki pack; Bohairic–English Bible ebook. Code: https://github.com/pishoyg/coptic — lexicon data **CC BY-SA 4.0**, code GPL-3.0
- Marcion (Milan Konvicka) — older desktop dictionary; cited by remnqymi
- Pierre Chérix lexica (Sahidic / Greek-Coptic): https://www.coptica.ch/instrumenta — Sahidic, not church Bohairic

### Our data

- `src/data/json/words.json` — 8635 published (8420 lexicon / 11 drill / 204 name).
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
  off prayer pages). Many tokens have no Arabic highlight until the owner
  supplies grammar rules to store and use. Blank is expected.

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
- Generic “Coptic font converter” on St-Takla romanization (ADR-007)
- Sahidic-only learner apps as if they were Bohairic church Coptic
