# Decisions

One-way doors only. Format: what, why, what it costs.

## ADR-001 — Unicode is the default rendering, not the mapped font
The old site painted Latin keystrokes as Coptic through a custom TTF. That
blocks copy-paste, breaks search and screen readers. `athanasiusKey` is kept
on every letter so a "manuscript mode" remains possible later. **Cost:**
Noto (sans) looked too plain; GNU FreeSerif is now the Coptic face (ADR-012).

## ADR-002 — No backend for the MVP
Static export on Vercel. Progress in `localStorage`. **Cost:** no cross-device
sync, no server-side progress. Revisit only if learners ask for it.

## ADR-003 — One home group per letter
The markdown put Beta in groups 3 and 5 and Chi in 3 and 7. Navigation needs a
single home; `alsoTaughtIn[]` carries the extra appearances. The live explorer
is the tiebreaker. **Cost:** the markdown must be corrected, not merged.

## ADR-004 — Data lives in JSON, validated by Zod at build time
HTML stops being the database. `prebuild` runs the validator, so invalid data
cannot deploy. **Cost:** editing content means editing JSON, not a CMS.

## ADR-005 — Curriculum is levels → lessons from day one
Grammar arrives as Level 2+ with an MDX body and needs no schema change.
**Cost:** slightly more structure than the alphabet alone requires.

## ADR-006 — `main` is the default branch
Set at scaffold time; `master` removed from the remote.

## ADR-007 — Live explorer keymap, not coptic-groups.md
The 11 keys where `coptic-groups.md` disagrees with the live explorer
(Sou, Eta, Theta, Eksi, Khi, Epsi, Shai, Khai, Hori, Cheema, Ti) are a
coherent alternative Athanasuis layout, not typos. The same keystrokes
are assigned to different letters. `letters.json` freezes the explorer
map (vocabulary corroborates it). Hori is the one split: words are typed
with `\`, the explorer card shows `|` — primary key is `\`, alias `|`.
**Cost:** anyone typing from the markdown table will hit the wrong glyphs.
Do not "reconcile" the two maps.

Do not add a generic Coptic font converter as a dependency. This keymap is
font-specific: hori `\`, cheema `S`, shai `}`, eksi `{` do not match any
standard legacy map (CS, New Athanasius, Avva Shenouda, …). A generic
converter would silently mangle those four. The extractor's 32/32 map is
authoritative. For later cross-checking of prayer texts typed in a *standard*
legacy font, [StMarkus/coptic-font-unicode-converter](https://github.com/StMarkus/coptic-font-unicode-converter)
is a reference only — not a dependency, and not for this site's keystrokes.

## ADR-008 — Reading drills may have `meaning: null`
The group-1 ⲟ+ⲛ+ⲧ/ⲕ set (تونك، تون، زونت، كونت، نوت، كوتك) is pronunciation
sitting in the HTML `arabic` field, not unfinished lexicon. Those rows are
`kind: "drill"`, Arabic in `translit.ar`, `meaning: null`, `published: true`.
Lexicon and name rows still require a meaning. **Cost:** every UI that shows
a word must not assume `meaning.ar` exists.

## ADR-009 — shadcn/ui extras from S5b init
S5b allowed `motion` and Radix via shadcn. `npx shadcn init` also installed
five packages that were not named in the prompt:

- `class-variance-authority`, `clsx`, `tailwind-merge` — `cn()` for merging
  Radix class names. Required by the shadcn component contract.
- `lucide-react` — accordion chevrons. An icon font or inline SVG would
  duplicate the same job; keep lucide while we use shadcn Accordion.
- `tw-animate-css` — shadcn’s Tailwind v4 animation import. Height of our
  rules accordion is a spring in `motion`, not these keyframes, but removing
  the package breaks `@import "tw-animate-css"` in `globals.css`.

Do not add more of this family (shine kits, particle libs, extra icon packs)
without a new reason. **Cost:** three small utilities plus an icon set and an
animation CSS package sit in `package.json` even when unused directly.

## ADR-010 — Dark-first, group colors are gradient pairs
The seven group values were gradient *starts*. Using them as flat borders
threw away the `to` stop. Tokens are now `--group-N-from` / `--group-N-to`
with `--group-N` as an alias of `from`. Dark (`#0A0A0F`) is the primary skin.
Light does not invert the pair; it only darkens `to` so gradient text still
clears 4.5:1. Group 1 dark `to` was lightened `#764ba2` → `#8f6bb3` (3.10 →
4.63 vs `--bg`). **Cost:** light-mode glyphs are a deeper shade than the
marketing pastels.

## ADR-011 — Cards show the reading form only
Coptic is unicase: upper and lower are the same shape at different sizes. A
card that shows both teaches the Latin habit of two letters. `LetterCard`
renders `unicode.lower` only. `/letter/[id]` keeps both, stacked, labelled
كبير / صغير. **Cost:** a shared `layoutId` transition can only morph the
lowercase glyph; the uppercase appears on the letter page.

Group lesson titles on `/` and `/alphabet/[n]` are read from
`curriculum.json` via `CurriculumFile.parse` (Level 1, `kind: "letters"`,
`order` 1–7). They are not hardcoded.

## ADR-012 — FreeSerif for Coptic, not mapped CS fonts
Noto Sans Coptic is legal and Unicode but too plain. CS / Athanasius /
Antinoou are manuscript-like but either mapped (no U+2C80) or need written
permission from copticchurch.net / Evertype — requested 2026-08-29, not a
grant, and a grant still does nothing until a cmap covers U+2C80.

GNU FreeSerif (GPL-3.0-or-later WITH Font-exception-2.0) is Unicode, serif,
handles combining overline, and is redistributable today. It is the Coptic
`font-family`. Noto stays as fallback. The site licence remains MIT; the
font exception keeps embedding from infecting the app.

**Cost:** a 45 KB subset in git; GPL docs on `/about`; Coptic combining
numerals U+2CEF–U+2CF1 are missing in this release (Noto may cover them).

## ADR-013 — FreeSerif subset is GPL; Font-exception-2.0 is extended
GNU FreeFont's Font-exception-2.0 covers embedding *unaltered portions* of
the font in a document — that is what keeps a page that uses the face from
becoming GPL. The file we ship is a subset, which is a modification. The
README lets a modifier extend the exception to their version; we do that in
`src/app/fonts/NOTICE`. The subset itself stays GPL-3.0-or-later. `COPYING`
and `README` remain next to the TTF.

A permission email (copticchurch.net, Evertype) is a request, not a grant,
and a grant is not a cmap. Do not record Antinoou or the CS faces as
licensed until a reply exists.

**Cost:** any later subset or font swap must keep those three files and the
exception grant. Dropping them to "save space" would drop the licence.

## ADR-014 — Coptic face is user-selectable
The header offers سيريف (GNU FreeSerif, default), سانس (Noto Sans Coptic),
and أثناسيوس (Athanasius Plain, ADR-015). Choice lives in `localStorage`
(`learn-coptic:coptic-font`) and is applied before paint.

**Cost:** Noto is plainer; a learner can pick it anyway. The chrome is one
control wider on a phone.

## ADR-015 — Optional mapped Athanasius manuscript mode
The only mapped TTF on disk is Athanasius Plain (`Athanasuis-Plain.ttf`).
It has no Coptic Unicode cmap. The owner authorized shipping that local
copy on 2026-08-31 and granted project rules to allow optional mapped
picker faces.

Default paint stays Unicode (FreeSerif / Noto). Manuscript mode sets
`data-coptic-font="athanasius"` and `CopticPaint` shows stored
`athanasiusKey` through the mapped face. Unicode remains in the DOM for
copy and screen readers. Missing keys fall back to Unicode. Reverse-mapped
prayer strings use the same keystrokes as `words.json`: jinkim is backtick
before the letter, never combining grave after. ASCII `:` in a source line
is punctuation; that cmap slot is capital ti.

Other CS / Antinoou / Coptic1 files are still absent and stay out. A
second mapped face that needs a different keymap needs a new ADR. A
Unicode cmap is still required to use any file as a *Unicode* face.
copticchurch.net has not granted a licence; `/about` must not say it has.

**Cost:** selecting the visible glyph in manuscript mode can copy Latin.
The letter-page copy button still writes Unicode. Redistribution of
Athanasius Plain is an owner decision, not a third-party grant.

## ADR-016 — Church letter-name clips from Coptic Literacy
S10 needs 32 letter recordings. No CC pack exists. The owner said Coptic
Literacy's letter-name videos are church material we may reuse (2026-09-01).
We download those MP4s, strip video, and ship 64 kbps mono MP3 in
`public/audio/letters/{id}.mp3` (a few seconds each — git + Vercel CDN).
`reciter` is `Coptic Literacy`. Dialect is `bohairic-modern`.

Do **not** hotlink copticliteracy.org (CSP is `media-src 'self'`; their
host is not ours). Do **not** put the raw ~2.6 MB videos in git.

Word clips are out of S10 (owner waiver 2026-09-01). Long prayers (S13)
over ~2 minutes go to object storage (Cloudflare R2 is fine), not git.

**Cost:** a written grant from Coptic Literacy is still not on file; this
is an owner church-reuse decision, same class as ADR-015. Credit them on
`/about`. St-Takla was not copied (no per-file URLs; one source only).

## ADR-017 — Pronunciation rules copy from the live explorer
Letter `rules[]` are Greco-Bohairic. Arabic layout and most conditions
come from `interactive_coptic_explorer_ascii.html`. Sound letters and
the “what follows” rows were cross-checked against church pages:

- St-Takla written pronunciation
- SUSCopts CPT100 / deacon Coptic lessons
- copticchurch.net alphabet table (too short; Veeta row there is wrong)
- OrSoZoX Sunday-school hymn for throat letters and epsilon

`follow` keys are this project’s explorer map (`]` = shai, `{` = eksi,
`X` = khi). The HTML’s gamma `]` and theta `{` were CS-font leftovers;
church حلقية are غما كبا إكسي كي → `G - K - { - X`. Epsilon after A/E
is ڤ (church), not the HTML’s ف.

**Cost:** this is church-school Greco-Bohairic, not Old Bohairic.
copticchurch.net’s one-line table is not used where it contradicts the
lessons.

## ADR-018 — Andreas harvest for Arabic glosses
Learner-length lemmas (2–8 Coptic letters) from Andreas of St Macarius,
via remnqymi `andreas.json` (**CC BY-SA 4.0**), were appended to
`words.json`. Coptic and `meaning.ar` are copied. `translit.ar` stays
empty — the source has no church pronunciation line, and guessing from
spelling is forbidden. UI hides an empty translit.

`group` is the highest letter-group in the word (the lesson that can
read it). `teaches` is only letters in that home group so letter pages
stay a lesson, not the whole dictionary.

`/vocabulary` is a group index; cards load 48 at a time. `/practice`
shows the HTML reading drills plus a tap-to-reveal meaning deck (80
shortest words per group). That is not S11 (no Leitner, no sound quiz).

**Cost:** ~8.5k extra rows, many without pronunciation. Share-alike
already matches the site content licence. Do not harvest Dawoud, Reader,
or St-Takla without a grant.

## ADR-019 — Word art is the teaching set, not the dictionary
8,635 illustrated lemmas will never happen. Art is the **147** curriculum
words (`translit.ar` or `kind: drill`), and only **concrete nouns**.
`group != null` is not a filter: Andreas harvest filled `group` on every
row (ADR-018). Tag `partOfSpeech` on the 121 lexicon teaching rows before
drawing. Drills, particles, and abstract verbs stay unillustrated.

Generated images are allowed when `license` is `ai-generated` and
`provenance: { model, prompt, date }` is filled. One prompt template and
one palette; themed batches so a letter page is never half-illustrated.
**Cost:** most of the site has no pictures. That is the design.

## ADR-020 — Prayer tokens never guess; S16 before S13b
Tap-a-word resolves a surface form in this order only: exact `coptic` →
`lemma` → strip one leading article from
`ⲡⲓ ϯ ⲛⲓ ⲡ̀ ⲧ̀ ⲛ̀ ⲙ̀ ⲟⲩ ϩⲁⲛ` (after `normalized`) → null.
Two hits at any step are null. Null shows the Coptic with no Arabic.
Tap highlights the Coptic token and a sourced span in the same line’s
Arabic. No tooltip, no bottom sheet.

Do **S16** (lemma / `normalized` / harvest report) before filling prayer
`tokens` from the dictionary. The same rule limits S11 word→meaning to
the teaching set until S16. ϯ and ⲟⲩ are also verb/stems — stripping is
best-effort, not a parser; when unsure, leave `wordId` null. Do not add
ⲉⲧ / ⲉⲑ to the strip list without a new decision.

Stored `lemma` is the row’s own `coptic` when that string is already a
headword (Andreas / teaching stems). It is **null** when a bound article
from `{ⲡⲓ, ⲛⲓ, ϩⲁⲛ, ϯ, ⲡ̀, ⲧ̀, ⲛ̀, ⲙ̀}` is glued on **and** at least two
letters remain (so ⲛⲓⲙ and ϯϯ stay lemmas). We do not invent the stem.
ⲟⲩ- rows keep `lemma = coptic` (ⲟⲩⲟϩ is a real lemma) and are listed in
the hygiene report for a human. `normalized` is combining marks
U+0300–U+036F stripped; not NFKC (ϣ stays U+03E3).

S13b stores `wordId` only on a **unique teaching-set** hit. Harvest-only
rows are skipped (unverified Arabic). Strip of ⲟⲩ/ϯ needs ≥3 letters
left (so ⲟⲩⲟⲛ is not “ⲟⲛ / أيضاً”). ⲛ̀ϫⲉ is not article + ϫⲉ.
**Cost:** many liturgical words stay unglossed. Blank is better than wrong.

A sourced substring of the line’s `translation.ar` may be stored as
`token.arHighlight` (must occur exactly once in that line). Runtime may
also mark a unique standalone (or short-suffix) piece of a teaching-set
gloss after peeling, for highlight only: relative ⲉⲧ/ⲉⲑ, one S13b article,
or a bound possessive (ⲡⲉⲕ ⲧⲉⲕ ⲡⲉⲛ …). That is a **stub**. Many liturgical
forms will not highlight. The owner will supply full prefix/suffix grammar
rules to **store as data** and use later. Do not invent extra peels, do not
use harvest Arabic, and do not treat a blank highlight as a bug.


