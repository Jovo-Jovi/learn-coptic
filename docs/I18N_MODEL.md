# I18N model — learn-coptic

## 1. Languages

- **Arabic is the interface language**, in the Egyptian register a Sunday-school teacher uses (`docs/content-style.md`).
  The page is `<html lang="ar" dir="rtl">` (`src/app/layout.tsx`).
- **Coptic (Bohairic) is the content being learned**, never the interface.
- **English** is at most one small supporting line, never a parallel column or a second site.

There is **one locale**, so there is no locale segment in the URL and no message catalogue: the Arabic strings live in
the components and in the JSON content. `devos/project.json` removes the default `en` catalogue from `guard:i18n`.
(`devos/answers.json` lists `en` as the language; that is the setup's default, and the confirmed brief wins: the
product is Arabic-first.)

## 2. Direction and isolation

- The chrome is right-to-left. Use logical CSS properties (`inline-start`, `inline-end`), never `left`/`right`, for
  layout that must mirror.
- **Every Coptic or Latin string inside Arabic text is in an LTR isolate**, so it cannot flip the line:
  `<span dir="ltr" className="inline-block">…</span>` (`.cursor/rules/20-ui.mdc`).
- Coptic glyphs are the largest thing on any page; Arabic is the reading language.

## 3. Digits, names and routes

- Learner-facing numbers use Eastern Arabic digits (المجموعة ٤, chips ١..٧); routes stay ASCII (`/group/4`).
- Letter names follow the curriculum's forms (`docs/content-style.md`); a name changes once, in `letters.json`, never
  per page.
- Route segments are English, ASCII, lower case; their labels are Arabic.

## 4. What a task checks

The runner captures each screen at 390 and 1280 px; a screen task shows its Arabic in RTL with every Coptic and Latin
string isolated, and no horizontal scroll at 375 px. `guard:i18n` reports a hardcoded `lang` attribute; the one in
`src/app/layout.tsx` is the site's single language and is part of the baseline.
