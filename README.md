<div align="center">

# تعلّم القبطي البحيري

**Learn the Coptic of the Church — in Arabic, on your phone.**

<img src="docs/readme-hero.png" alt="الحروف اللي بتطفو في الصفحة الرئيسية: ⲁ ϣ ⲛ ⲅ ϯ ⲑ" width="1200" />

مجاناً. من غير حساب. من غير تحميل.

الحروف اللي بتسمعها في القداس، مكتوبة يونيكود —
تنسخها وتحطها في واتساب، في درس، في أي حتة.

</div>

---

Most Coptic apps teach **Sahidic**, or they teach in English. This one is
**Bohairic** — the dialect of the Coptic Orthodox Church today — and it
starts in Arabic, the way a Sunday-school teacher talks.

No login. No backend. Your progress stays on the phone.

## What’s live

- **٣٢ حرف** in seven colour-coded groups, from the letters that look like
  English to the ones that don’t
- **قواعد النطق** on the letters that need them — قبل Ⲉ Ⲓ Ⲏ, not a wall of
  grammar
- **١٤٧ كلمة**: real vocabulary, names, and reading drills (a drill is never
  dressed up as a dictionary entry)
- **Unicode Coptic** you can copy. What you see is Ⲁ, not a Latin `A` in a
  costume font
- A **manuscript face** (Athanasius) if you want the old look — default is
  still Unicode

Phone-first. Dark by default. Works in the browser you already have.

## Who it’s for

A deacon learning the letters. A teacher sending a link in the parish group.
Someone who grew up hearing Bohairic and wants to read it.

English is a supporting line, not a second site.

## Run it locally

```bash
npm install
npm run validate
npm run dev
```

`npm run validate` runs on every build. Invalid data cannot ship.

## How the content works

HTML is never the database. Everything learners see comes from JSON, checked
by Zod before the site builds:

| File | What it holds |
|---|---|
| `src/data/json/letters.json` | 32 letters, groups, pronunciation rules |
| `src/data/json/words.json` | lexicon / drill / name |
| `src/data/json/prayers.json` | prayers with line timings (recording comes later) |
| `src/data/json/curriculum.json` | levels → lessons |

## Next

Audio for every letter. A small quiz that remembers you. Then prayers with
the line highlighted as it’s sung.

## Stack

Next.js App Router · TypeScript · Tailwind · Zod · Vercel.
Fonts are self-hosted: GNU FreeSerif, Noto Sans Coptic, Cairo, optional
Athanasius Plain.

## Licence

Code MIT. Lesson text [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
FreeSerif is GPL-3.0-or-later with Font-exception-2.0 — embedding it does not
put the app under the GPL. Details: [`docs/security.md`](docs/security.md).
