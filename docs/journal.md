# Journal

Append only. Newest at the top. One entry per step. Keep entries short — this
is a record of what happened, not an explanation of why.

Format:

```
## YYYY-MM-DD · S# · <title>
Model: <who wrote it> | Commit: <sha> | Result: pass / fail / partial
- what changed
- what was decided
- what is still open
```

---

## 2026-08-31 · S0 · Repo setup
Model: — | Commit: `8df36c5` | Result: pass

- `create-next-app` (TS, Tailwind, App Router, `src/`, `@/*`, ESLint, npm) in a
  clean folder. Next 16, Turbopack is the default so there was nothing to decline.
- Scaffold mapped into `.cursor/rules/`, `src/data/schema/`, `src/data/json/`,
  `scripts/`, plus the three root markdown files. Downloaded `package.json` and
  `tsconfig.json` deliberately not used.
- Deps: `zod`, `fuse.js`, `tsx`, `node-html-parser`. Scripts: `prebuild`,
  `validate`, `seed:letters`, `extract`.
- Only the two working HTML files copied to `legacy/`. No TTF, no summary
  markdown. `legacy/` and `.extract/` gitignored.
- Default branch `main`; `master` removed from the remote.
- Stock `AGENTS.md` and `CLAUDE.md` from the template are in the commit.
- Validator green: 32 letters, 8 words, 1 prayer, 2 levels.

Open: the 11 unconfirmed `athanasiusKey` values, and no Coptic reader has
checked the glyphs yet.
