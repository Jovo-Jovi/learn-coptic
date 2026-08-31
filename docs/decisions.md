# Decisions

One-way doors only. Format: what, why, what it costs.

## ADR-001 — Unicode is the default rendering, not the mapped font
The old site painted Latin keystrokes as Coptic through a custom TTF. That
blocks copy-paste, breaks search and screen readers, and the font licence is
unconfirmed. `athanasiusKey` is kept on every letter so a "manuscript mode"
remains possible later. **Cost:** glyphs look less like manuscript hands.

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
