# Boundary model — learn-coptic

<!-- devos:boundary {"profile":"A","zones":[{"name":"learner-progress","src":["src/lib/leitner.ts"],"urls":[],"personal_data":false},{"name":"preferences","src":["src/lib/theme.ts","src/components/ThemeToggle.tsx","src/components/FontSelect.tsx"],"urls":["/","/index","/_not-found","/about","/alphabet","/group","/letter","/vocabulary","/search","/practice","/quiz","/prayers"],"personal_data":false},{"name":"search","src":["src/components/WordSearch.tsx"],"urls":["/search"],"personal_data":false}]} -->

## 1. Profile and gate

**Profile A** (handbook §0, OD-01): a public site that collects no personal data. **The Boundary gate is
non-waivable** (handbook §10.2): no table, column, bucket, form, route handler or log accepts or keeps a visitor's
personal data. No OD can waive it. The brief's "Personal data" section decides it: **none found in the product** —
no accounts, no sign-in, no email, no payment, no location, no analytics (`docs/security.md` says the same).

The product has no server: no database, no route handler (`route.ts`), no server action, no cookie. The only data it
keeps is the visitor's own choices and progress, in **their own browser**, under `localStorage` keys that start with
`learn-coptic:`. Nothing of it is ever sent anywhere.

## 2. The zones the code already has (PR-19)

The line above declares them for `guard:boundary`. Each holds no personal data (`personal_data: false`): what it
keeps describes a learner's practice on one device, not a person, and it never leaves that device.

| Zone | Where it lives | What it holds | Why it is a zone |
|---|---|---|---|
| `learner-progress` | `src/lib/leitner.ts` (read and written by `src/components/QuizSession.tsx` through it) | `localStorage` `learn-coptic:leitner`: for each quiz card, its Leitner box (1–5) and when it is next due, format version 1 (`v: 1`); the reset button clears it | browser storage |
| `preferences` | `src/lib/theme.ts` (the keys and the boot script that applies them before paint), `src/components/ThemeToggle.tsx`, `src/components/FontSelect.tsx` | `localStorage` `learn-coptic:theme` (`dark` or `light`) and `learn-coptic:coptic-font` (`serif`, `sans` or `athanasius`) | browser storage, and the font picker's `<select>`, which is in the header of **every** page, so its pages are every route of the site |
| `search` | `src/components/WordSearch.tsx` on `/search` | nothing: the search box's `<input>` filters the build-time index in the page; the query is never stored or sent | a form control |

The keys are named by `THEME_KEY`, `COPTIC_FONT_KEY` and `LEITNER_KEY` in `src/lib/theme.ts` and `src/lib/leitner.ts`;
every key starts with the prefix that file defines.

## 3. What stays forbidden, inside and outside the zones

- Analytics, beacons, trackers and third-party scripts: never, in any zone (PR-19). `docs/security.md` allows only
  cookieless, IP-anonymised analytics *or none*; today there is none, and adding any is a signed OD plus a change to
  the CSP (`docs/SECURITY_MODEL.md`).
- A form that sends anything, a cookie, a `route.ts` handler, a server action: none exists, and adding one is a
  signed OD that changes this file.
- A new `localStorage` key outside the three zones: a signed OD adds its zone here first.
- Personal data of any kind (a name, an email, a phone number, a location): never. A zone with personal data would
  bring the Personal-Data Protection gate, `docs/PROTECTION_MODEL.md` and a private repository (PR-19); the
  repository is public.

## 4. The repository itself

The repository is public. `docs/journal.md` holds a public contact address of a third-party dictionary app, and
`docs/session-context.md` a local folder path with a computer user name; neither is product data, and no DEV_OS
document copies them. No task adds an email, a local path or a user name to any file.
