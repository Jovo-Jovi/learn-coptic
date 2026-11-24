# Product brief — learn-coptic (تعلّم القبطي البحيري)

The product as it is today, from the brief the developer confirmed at adoption (`.devos/adopt/brief.md`).

## What it is

A free, Arabic-first website for learning to read **Bohairic Coptic**, the dialect the Coptic Orthodox Church uses
today. It teaches the 32 letters with audio, then words, four prayers and quizzes. It works on a phone, with no
account and no download, and installs as an app (PWA) on Android.

Most Coptic apps teach Sahidic, or teach in English. This one is Bohairic and starts in Arabic, the way a
Sunday-school teacher talks. The Coptic is Unicode: a learner can copy a letter into WhatsApp or a lesson.

## For whom

Church learners:

- deacons learning the letters;
- Sunday-school teachers sharing a link in a church group;
- adults who grew up hearing Bohairic and want to read it.

## Stage

**In production** at https://learn-coptic.vercel.app. Real learners use it. Every push to `main` deploys production
through Vercel's GitHub integration (OD-04). The code was written in three days (2026-08-31 to 2026-09-02) by one
person, in 38 commits, with no tests and no CI before the adoption.

## What a learner can do today

- **Letters:** 32 letters in seven colour groups, each with its Arabic name, pronunciation rules, example words and
  its sound.
- **Words:** 147 curriculum words (dictionary words, names and reading drills, never confused), with the Andreas of
  St Macarius and Osama Thabet dictionaries behind them: 11,858 Arabic meanings.
- **Search:** in Arabic or in Coptic, with the meaning shown beside the glyph.
- **Practice and quiz:** reading practice by group, and Leitner-box quizzes (letter↔sound, word↔meaning) whose
  progress stays on the phone.
- **Prayers:** خين إفران، الربانية، الشكر، المزمور الخمسون. Tapping a Coptic word highlights its meaning in the Arabic
  line where a sourced match exists.
- **Reading comfort:** dark by default with a light mode; three Coptic faces (serif, sans, Athanasius manuscript).

## What it never does

It never asks who the learner is: no account, no email, no tracking. It never shows a gloss nobody verified, a
transliteration guessed from spelling or a prayer line typed from memory: a blank is better than a wrong letter.

## What comes next (`docs/PHASES.md`)

Tests around the logic that has none; grammar and pronunciation lessons on screen (S15); pictures for the
teaching-set nouns, a whole theme at a time (S14); one prayer with its audio synced to the lines (S13c); a
production-readiness check of the live pages.

## The main risks

Changes go live with no automatic gate except the data validator, and `main` has no branch protection (OD-04); the
content is sensitive and large (OD-07); learner progress lives only in the browser; installed phones run the service
worker; licensing is the main legal risk (`docs/security.md`). `docs/SECURITY_MODEL.md` §4 gives the rule for each.
