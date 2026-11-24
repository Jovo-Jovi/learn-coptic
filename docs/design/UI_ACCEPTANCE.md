# UI acceptance — learn-coptic

The pass/fail criteria of every screen task (`docs/method/DESIGN_METHOD.md` §1, §4). A UI fence's `- Criteria:` line
names the rows that apply. *Checked by*: `automated` (a check or a guard decides) or `reviewer` (the reviewer decides
from the captures at 390 and 1280).

| UA-nn | Criterion | Checked by |
|---|---|---|
| UA-01 | Every state on the fence's `- Screens:` line has an error-free capture at 1280 and 390, with no layout shift, no console error and no failed request | automated |
| UA-02 | axe finds no WCAG 2.0, 2.1 or 2.2 A or AA violation on any capture | automated |
| UA-03 | No horizontal scroll at 390 (and at 375 when the builder checks it), in the dark and the light theme | reviewer |
| UA-04 | The page is Arabic, right to left; every Coptic or Latin string inside Arabic text sits in an LTR isolate and reads correctly | reviewer |
| UA-05 | The Coptic glyph is the largest thing on the screen; Arabic is the reading language; English, if any, is one small line | reviewer |
| UA-06 | Colours come only from the tokens of `docs/DESIGN_SYSTEM.md` §2.1; each group keeps its colour; text contrast is at least 4.5:1 in both themes | reviewer |
| UA-07 | Type uses the scale of §2.2 only; Coptic is in the Coptic stack, Arabic in Cairo | reviewer |
| UA-08 | Every control is a real `<button>` or link with an Arabic label and a visible focus; panels carry `aria-expanded`; nothing works on hover alone | reviewer |
| UA-09 | Motion follows §6: opacity and transform only, and the reduced-motion capture shows the same content without animation | reviewer |
| UA-10 | Absent content shows its designed state, never a placeholder: an empty translit is hidden, a token with no match has no highlight, a theme without its art keeps today's card | reviewer |
| UA-11 | A drill never looks like a dictionary word; a `name` carries اسم علم; unpublished words never show | reviewer |
| UA-12 | Manuscript mode still paints only stored `athanasiusKey`s, with the Unicode in the DOM; the copy button copies Unicode | reviewer |
| UA-13 | The screen matches the Direction of `docs/DESIGN_SYSTEM.md` §1: the same surfaces, cards, chips and glow as the rest of the site | reviewer |
| UA-14 | Copy follows `docs/content-style.md`: Egyptian Arabic, short sentences, Eastern digits, no congratulation copy, nothing invented | reviewer |
