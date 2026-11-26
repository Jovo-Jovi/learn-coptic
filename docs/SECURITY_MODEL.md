# Security model — learn-coptic

`docs/security.md` is the project's own security and licensing record and stays authoritative for licences. This
file states the security model DEV_OS reviews against. Most of the risk here is licensing and wrong content, not
attack (`docs/security.md`).

## 1. Principals

| Principal | What it can do |
|---|---|
| A visitor (learner) | read every page; keep progress, theme and Coptic face in their own browser (`docs/BOUNDARY_MODEL.md`) |
| The developer | merge to `main`, which deploys production through Vercel's Git integration (OD-04) |
| DEV_OS's agents | build and review on task branches; never reach `main` or production (OD-02) |

There is no account, no sign-in, no role, no database and no server-side state, so there is nothing to authorise.

## 2. Keys and secrets

The product needs **no secret**. `.env*` is gitignored and none exists. The survey found no environment variable and no
secret file. If a later feature needs one (object storage for a long prayer recording, OD-25), it is a signed OD that
names the key, keeps it server-side or in Vercel's settings, and adds it to `docs/setup-items.json`; a key never
reaches the browser or a commit.

## 3. Headers (set in `next.config.ts` for every route; risk 3 and the developer's gate to change, OD-07)

- `Content-Security-Policy`: `default-src 'self'`; `script-src 'self' 'unsafe-inline'` (plus `'unsafe-eval'` in
  development only, for React refresh); `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: blob:`;
  `font-src 'self'`; `connect-src 'self'`; `media-src 'self' blob:`; `worker-src 'self'`; `manifest-src 'self'`;
  `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'none'`. `'unsafe-inline'` stays
  because Next inlines the theme boot script and the App Router flight payloads; hashes alone would need a nonce
  middleware (`docs/security.md`).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=(), clipboard-write=(self)`.
- `Strict-Transport-Security` is not set by the app; Vercel serves its own on its domain. The launch task (T12)
  reads the live headers against `docs/method/READINESS.md` and records what it finds.

Everything is served from the site itself: no outside script, font, image, audio or analytics host. A change that
needs one changes the CSP and is a signed OD.

## 4. What can go wrong, and the rule that holds it

| Risk | Rule |
|---|---|
| A merged change reaches learners at once (no branch protection, OD-04) | every change goes through a unit's pull request; DEV_OS's checks and the reviewer run before it; the developer's merge is the gate |
| A wrong glyph or gloss teaches the wrong thing | never invent content (`docs/STACK.md` §6); content changes stop at the developer's gate (OD-07); the validator runs in every build |
| A bulk edit of `words.json` (11,858 rows) goes wrong | edits by a reviewed script that refuses to write on a mismatch, never by hand; the validator and the developer's gate |
| Saved progress is silently dropped | `learn-coptic:leitner` v1 is migrated, never discarded (`docs/STACK.md` §7) |
| A broken service worker reaches installed phones | `public/sw.js` changes bump the cache name and stop at the developer's gate (OD-07) |
| A dependency brings a vulnerability | `guard:deps`: every new package named in the fence, `pnpm audit` with no high or critical advisory (PR-85). The adoption-tree ids in `docs/security.md` are the PR-85 acceptance, not a claim the components are patched. |
| A licence is missing | every font, recording, image and dictionary source records its licence when it is added (`docs/security.md`) |
| Preview deploys are public | nothing unreleased goes in `public/` (`docs/security.md`) |

## 5. Rate limits, step-up, recovery

None apply: no endpoint accepts input, and there is no account to recover.
