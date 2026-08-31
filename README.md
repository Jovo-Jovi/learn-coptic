# learn-coptic

تعلّم الحروف القبطية البحيرية بالعربي — free, no account, works on a phone.

Bohairic (church) pronunciation. Arabic-first. Unicode Coptic, so every word on
the site can be copied and pasted into real text.

---

## How the data works

`src/data/json/` is the only source of truth. HTML is never the database.

| File | Holds |
|---|---|
| `letters.json` | 32 letters, Unicode + legacy key, groups, pronunciation rules |
| `words.json` | vocabulary, split into `lexicon` / `drill` / `name` |
| `prayers.json` | running texts, line-level audio timings, optional per-word tokens |
| `curriculum.json` | levels → lessons; grammar lessons point at MDX prose |

`src/data/schema/index.ts` validates all of it. `npm run validate` runs on every
build via `prebuild`, so bad data cannot deploy.

```bash
npm run seed:letters   # one time only — writes letters.json
npm run extract -- ./legacy/interactive_coptic_explorer_ascii.html
npm run validate
npm run dev
```

## Stack

Next.js (App Router) · TypeScript · Tailwind · Zod · Fuse.js · Vercel.
No backend. Progress lives in `localStorage`. PWA so it installs on a phone.

Fonts: **Noto Sans Coptic** (SIL OFL 1.1) for Coptic, **Cairo** for Arabic, both
self-hosted through `next/font`. The Athanasuis TTF is not in this repo and must
not be added until its licence is confirmed in writing.

---

## Roadmap

**Phase 1 — alphabet (ship this first)**
Freeze the 32-letter map · routes `/`, `/alphabet`, `/group/[1-7]`, `/letter/[id]`,
`/vocabulary`, `/about` · bottom nav · expanding panels, not 3D flips · deploy.

**Phase 2 — audio**
32 letter clips + one example word each. Highest-value addition; every competitor
already has it. 64 kbps mono MP3, in `public/audio/`.

**Phase 3 — practice**
Leitner-box quiz (5 boxes) in `localStorage`. Client-side search over ~150 words.

**Phase 4 — prayers with sound**
One full recording per prayer, plus `startSec`/`endSec` per line so the app
highlights the line being sung. Add `tokens[]` per line later for tap-a-word
glosses. Recordings over ~2 minutes go to object storage, not the git repo.

**Phase 5 — illustrated vocabulary**
`art` on each word: 800×800 WebP, `alt` text in Arabic, and a required `license`
field. Fill in a themed batch at a time (body, family, church, nature) so the
site never looks half-illustrated.

**Phase 6 — grammar levels**
Level 2+ lessons are `kind: "grammar"` with an MDX body, so a lesson can hold
tables and inline `<LetterChip/>` / `<WordCard/>` components. No schema change
is needed to add them — that is the whole point of the curriculum file.

## Licence

Code MIT. Lesson text and recordings CC BY-SA 4.0.
