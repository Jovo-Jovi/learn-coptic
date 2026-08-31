# Security and licensing

No backend, no accounts, no user data. Most risk here is licensing, not attack.

## Licensing (the real risk)

- **Fonts in use** (self-hosted via `next/font`; listed on `/about`):
  - **GNU FreeSerif** — GPL-3.0-or-later WITH Font-exception-2.0.
    Coptic glyphs (serif). Redistributable today. The file in
    `src/app/fonts/FreeSerif.ttf` is a *subset* of GNU FreeFont 20120503
    (cmap probe: U+2C80, U+2C81, U+03E2, U+03EF, U+0304, U+0305).
    A subset is a modification. Font-exception-2.0 covers embedding
    *unaltered* portions; we extend that exception to this subset in
    `src/app/fonts/NOTICE`. `COPYING` and `README` stay beside the TTF.
    The app licence stays MIT (ADR-013). This is the only manuscript-style
    Coptic face we can legally deploy right now.
  - **Noto Sans Coptic** — SIL Open Font License 1.1. Fallback if FreeSerif
    misses a codepoint.
  - **Cairo** — SIL Open Font License 1.1. Arabic UI.

- **Legacy mapped fonts — not shipped.** Latin keystrokes, not Unicode.
  They cannot render U+2C80. A permission *request* is not a grant, and a
  grant is not a cmap. Requests were emailed on 2026-08-29. Until a reply
  *and* a Unicode cmap, they stay out of the repo:
  - CS Avva Shenouda, Pope Shenouda III, CS Pishoi, CS New Athanasius,
    Athanasius — Coptic Font Standard project, copticchurch.net
  - Antinoou — Michael Everson / Evertype
    (same request, not a grant; do not write "written permission" until
    a reply exists)

- **Artwork.** Every image needs a `license` value at the moment it is added.
  Backfilling this later is not realistically possible.
- **Recordings.** Written consent from each reciter before publishing, covering
  redistribution under the content licence. Keep the consent, not just the file.
- **Prayer texts.** Note the source edition in `prayers.json`.

## Secrets

None needed for MVP. If that changes: `.env.local` only, never committed, and
Vercel env vars for anything server-side. Preview deploys are publicly
reachable — nothing unreleased goes in `public/`.

## Privacy

`localStorage` only, one namespaced key, no personal data, no login.
Analytics must be cookieless and IP-anonymised, or absent. No third-party
script that can read page content.

## Dependencies

Lockfile committed. No new dependency without a stated reason. `npm audit` and
a manual look at anything with fewer than ~100k weekly downloads before adding.
Prefer zero-dependency over convenient.

## Headers

Set CSP, `X-Content-Type-Options`, `Referrer-Policy` in `next.config`. Static
site, so CSP can be strict — no `unsafe-inline` once Tailwind is compiled.
