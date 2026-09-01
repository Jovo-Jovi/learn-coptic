<div align="center">

<a href="https://learn-coptic.vercel.app">
  <img src="docs/readme-hero.png" alt="الحروف اللي بتطفو في الصفحة الرئيسية: ⲁ ϣ ⲛ ⲅ ϯ ⲑ" width="1200" />
</a>

# تعلّم القبطي البحيري

**الحروف اللي بتسمعها في القداس — مكتوبة يونيكود، بالعربي، على موبايلك.**

<a href="https://learn-coptic.vercel.app"><img src="https://img.shields.io/badge/افتح_الموقع-learn--coptic.vercel.app-667eea?style=for-the-badge" alt="افتح الموقع" /></a>
<img src="https://img.shields.io/badge/Bohairic-البحيري-43e97b?style=for-the-badge" alt="Bohairic" />
<img src="https://img.shields.io/badge/٣٢_حرف-f093fb?style=for-the-badge" alt="32 letters" />
<img src="https://img.shields.io/badge/صوت-f6d365?style=for-the-badge" alt="Letter audio" />
<img src="https://img.shields.io/badge/٤_صلوات-4facfe?style=for-the-badge" alt="4 prayers" />
<img src="https://img.shields.io/badge/كويز-fda085?style=for-the-badge" alt="Quiz" />
<img src="https://img.shields.io/badge/Unicode-Coptic-667eea?style=for-the-badge" alt="Unicode Coptic" />
<img src="https://img.shields.io/badge/free-no_account-43e97b?style=for-the-badge" alt="Free, no account" />

مجاناً · من غير حساب · من غير تحميل · تقدّمك على الموبايل

</div>

---

Most Coptic apps teach **Sahidic**, or they teach in English. This one is
**Bohairic** — the dialect of the Coptic Orthodox Church today — and it
starts in Arabic, the way a Sunday-school teacher talks.

تنسخ الحرف وتحطه في واتساب، في درس، في أي حتة. اللي بتشوفه Ⲁ، مش
حرف لاتيني لابس فونت.

## إيه اللي تقدر تعمله

| | |
|---|---|
| **[الحروف](https://learn-coptic.vercel.app/alphabet)** | ٣٢ حرف في سبع مجموعات بالألوان. اسمع اسم الحرف. قواعد النطق على الصفحة — بيتا ڤ/ب، غما غ/ج/ن، وحالات خاصة لسيما وتاف من غير ما يتغيّر تصنيفهم |
| **[الكلمات](https://learn-coptic.vercel.app/vocabulary)** | ١٤٧ كلمة منهج (قاموس، أسماء، تمارين قراءة). التمرين عمره ما يتلبس بدلة قاموس. فوقهم قاموس أندرياس المقاري (~٨٥٠٠ معنى عربي) |
| **[بحث](https://learn-coptic.vercel.app/search)** | دور بالعربي أو بالقبطي. المعنى ظاهر مع الحرف |
| **[التدريب والكويز](https://learn-coptic.vercel.app/practice)** | تمرين قراءة، وكويز حرف↔صوت وكلمة↔معنى. الصناديق على الموبايل، من غير حساب |
| **[الصلوات](https://learn-coptic.vercel.app/prayers)** | خين إفران، الربانية، الشكر، المزمور الخمسون. دوس على الكلمة القبطي يتعلّم المعنى في السطر العربي |
| **يونيكود** | تنسخه. خط السيريف افتراضي؛ سانس وأثناسيوس اختياريين من فوق |
| **الموبايل** | ظلام افتراضي، وضع نهاري، ويتثبت كتطبيق (PWA) على أندرويد |

Phone-first. Dark by default. يشتغل في المتصفح اللي عندك.

## لمين

شماس بيتعلّم الحروف. مدرّس باعت لينك في جروب الكنيسة. حد كبر وهو
بيسمع بحيري وعايز يقرأ.

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
| `src/data/json/letters.json` | 32 letters, groups, pronunciation rules, letter audio |
| `src/data/json/words.json` | lexicon / drill / name (teaching set + Andreas harvest) |
| `src/data/json/prayers.json` | four prayers, line tokens for tap-highlight |
| `src/data/json/curriculum.json` | levels → lessons |
| `src/data/json/pronunciation.json` | church-modern vs old Bohairic notes |
| `src/data/json/grammar-rules.json` | owner grammar notes (lesson UI comes later) |

## Next

Prayer audio synced to the lines. Pictures for the teaching-set nouns, not
the whole dictionary. Grammar lessons on screen.

## Stack

Next.js App Router · TypeScript · Tailwind · Zod · Fuse.js · Vercel.
Fonts are self-hosted: GNU FreeSerif, Noto Sans Coptic, Cairo, optional
Athanasius Plain.

## Licence

Code MIT. Lesson text [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Dictionary extras: Andreas of St Macarius via [remnqymi](https://github.com/pishoyg/coptic), CC BY-SA 4.0.
FreeSerif is GPL-3.0-or-later with Font-exception-2.0 — embedding it does not
put the app under the GPL. Details: [`docs/security.md`](docs/security.md).
