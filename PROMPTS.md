# Prompts to paste into Cursor

Two rules for using these:

- **One step per session.** Start a new chat for each step. A long chat drifts.
- **Never paste two steps at once.** The agent will merge them and you lose the
  ability to tell which change broke what.

---

## The wrapper — put this at the top of every step prompt

```
Read .cursor/rules/00-project.mdc and IMPLEMENTATION_PLAN.md first.

We are doing exactly one step: <S#>. Do not start any other step.

Rules for this session:
- Do not modify anything in src/data/json/ unless this step says to.
- If npm run validate fails, stop and show me the failure. Do not fix data.
- If something is ambiguous, ask me one question instead of guessing.
- When done, run: npm run validate && npm run build
- Tick the step's checkboxes in IMPLEMENTATION_PLAN.md
- Update docs/journal.md and docs/session-context.md (and any other stale doc)
- Then output: a list of files changed, the command output, and anything
  you did differently from the step description.
```

---

## S0 — setup
```
Create the Next.js app in this empty folder: App Router, TypeScript, Tailwind,
src/ directory, import alias @/*. Then copy in the scaffold files I've placed
in ./scaffold (schema, data json, scripts, rules). Install zod, tsx, fuse.js,
node-html-parser. Wire prebuild -> validate. git init and commit.
Confirm: npm run validate prints 32 letters, npm run build succeeds.
```

## S1 — freeze the letter map (GATE)
```
Run: npm run extract -- ./legacy/interactive_coptic_explorer_ascii.html ./legacy/coptic_vocabulary.html

Then read .extract/conflicts.md and .extract/raw-arrays.json and give me a table:
letter | key in the live HTML | key in coptic-groups.md | key currently in letters.json | your recommendation

Do NOT write to letters.json. I will decide each conflict myself and tell you
what to write. The live explorer is the tiebreaker, but I want to see all three.
```

## S2 — vocabulary migration (GATE)
```
Convert every word from the vocabulary HTML into words.json using the frozen
athanasiusKey -> Unicode map in letters.json.

For each word set: kind (lexicon | drill | name), teaches[], group, meaning.ar.
Words whose Arabic gloss looks incomplete or garbled: set published=false and
list them separately — do not guess a meaning.

Report the real count. Do not match the number the old site advertised.
```

## S3 — tokens and fonts
```
Set up next/font self-hosting Noto Sans Coptic (Coptic) and Cairo (Arabic).
Define --group-1..--group-7 for light and dark in globals.css, exposed as
Tailwind tokens. Set a type scale.

Then check every group color against its text color at 4.5:1 and give me a
table of the results with any value you had to adjust.
```

## S4 — app shell
```
Build the root layout: dir="rtl" lang="ar", Arabic metadata, theme toggle with
no flash on load, and a fixed bottom nav with four items
(الحروف / الكلمات / التدريب / عن الموقع) including iOS safe-area padding.
Nothing else — no pages yet.
```

## S5 — alphabet and groups
```
Build /alphabet and /group/[id]. Statically generate groups 1-7 only; any other
id must 404. Letters read from letters.json through the Zod-parsed loader, never
imported raw. Color each letter by its group token. Coptic glyphs wrapped in an
LTR isolate.
```

## S6 — letter page
```
Build /letter/[id]: large upper+lower glyph, Arabic name, sound hints, numeric
value, and the pronunciation rules as an expanding panel (real button,
aria-expanded, reduced-motion respected). Example words link to /vocabulary.
Prev/next navigation follows `order`, not group.
```

## S7 — vocabulary page
```
Build /vocabulary: tap to reveal meaning, filter by group and by letter.
lexicon and drill words must be visually distinct — a drill word is reading
practice, not a dictionary entry, and must not look like one.
Hide published:false words.
```

## S8 — landing and about
```
Build / and /about. Landing: one Arabic sentence saying what this teaches and
who it's for, then a single primary action into group 1. No feature grid.
/about lists the font licences (Noto Sans Coptic OFL, Cairo OFL), the content
licence, and how to contribute a recording.
```

## S9 — deploy (GATE)
```
Add a PWA manifest and icons, verify offline shell, then walk me through
pushing to GitHub and connecting Vercel. After deploy, run Lighthouse mobile
and paste the four scores.
```

---

## Later phases

Ask me for the S10–S15 prompts when you reach them. They depend on decisions
you haven't made yet (where audio is hosted, who records, what the art style
is), and a prompt written now would be guesswork.

---

## Review handoff — paste this back to me in our chat after each step

```
STEP: S#

VALIDATOR / BUILD OUTPUT:
<paste the tail of npm run validate && npm run build>

FILES CHANGED:
<paste git diff --stat>

DIFF:
<paste git diff — src/ and scripts/ only>

DEVIATIONS:
<anything the agent did differently, or "none">

SCREENSHOT:
<attach one screenshot at 375px width>
```

Send the diff even when everything passes. A green build is not the same as a
correct one, and the failures worth catching on this project — a wrong glyph, a
letter quietly moved between groups, a gloss invented to fill a blank — all
compile perfectly.
