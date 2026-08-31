# Security and licensing

No backend, no accounts, no user data. Most risk here is licensing, not attack.

## Licensing (the real risk)

- **Fonts.** Noto Sans Coptic and Cairo are SIL OFL 1.1 — safe to self-host and
  redistribute. `Athanasuis-Plain.ttf` has **no confirmed licence**; related
  Athanasius fonts appear as OFL in some places and personal-use-only in others.
  It stays out of the repo until a licence is confirmed in writing.
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
