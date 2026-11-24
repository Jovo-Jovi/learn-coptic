# Session context — learn-coptic

DEV_OS's state file (handbook §5.5). The project's own `docs/session-context.md` is kept and updated beside it (OD-06).

**Phase:** P01 — Checks and tests. **Stage:** production (https://learn-coptic.vercel.app).

## Done

| Step | What | Verdict |
|---|---|---|
| Adoption | DEV_OS's documents and fence T01 written; the code at `9f6ae1b` recorded as the baseline (`docs/SCOPE.md` §Baseline) | the developer's merge of the adoption pull request |

## Open carry-forwards

None.

## Next action

Before T01's unit is merged, the developer sets the Vercel Install Command to `npm ci` and the Build Command to
`npm run build` (OD-05 §3). The cycle builds **T01** from `docs/fences/T01.md`: a pnpm lockfile beside npm's, the
`typecheck` and `test` scripts, one architecture test and DEV_OS's folders out of lint, so that
`node scripts/devos/run-checks.mjs --strict` exits 0 on the code as it is. Until T01 lands, `ci` on `main` is red; that
changes nothing in production.
