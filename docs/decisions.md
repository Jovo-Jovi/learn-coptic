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

