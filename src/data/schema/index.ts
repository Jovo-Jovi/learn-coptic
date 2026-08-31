import { z } from "zod";

/**
 * Single source of truth for every piece of content in the app.
 * Data files are JSON; this schema validates them at build time.
 * If a data file breaks a rule here, the build fails and nothing ships.
 */

export const SCHEMA_VERSION = 1;

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

/** Every human-readable string is localized from day one.
 *  `ar` is required (Arabic-first product). Everything else is optional. */
export const Localized = z.object({
  ar: z.string().min(1),
  en: z.string().optional(),
  fr: z.string().optional(),
});
export type Localized = z.infer<typeof Localized>;

const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase-kebab-ascii");

/** Only Coptic Unicode is allowed in Coptic text fields.
 *  Blocks U+2C80–2CFF (Coptic) and U+03E2–03EF (Demotic-derived letters,
 *  which live in the Greek block), plus combining marks, spaces, punctuation. */
const copticText = z.string().regex(
  /^[\u2C80-\u2CFF\u03E2-\u03EF\u0300-\u036F\s.,:;·\u0374\u00B7?!()\-]+$/u,
  "must contain only Coptic Unicode — no Latin ASCII-font keystrokes",
);

export const AudioClip = z.object({
  src: z.string(),                       // /audio/... or CDN url
  durationSec: z.number().positive().optional(),
  /** Who recorded it. Matters once you have many contributors. */
  reciter: z.string().optional(),
  dialect: z.enum(["bohairic-old", "bohairic-modern"]).default("bohairic-modern"),
});

/** Art for a word's meaning. License is required because you will be
 *  commissioning, drawing, or generating these — record it once, at entry. */
export const Artwork = z.object({
  src: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: Localized,
  style: z.enum(["illustration", "photo", "icon", "manuscript"]),
  license: z.enum([
    "own-work", "commissioned", "cc0", "cc-by-4.0", "cc-by-sa-4.0", "public-domain",
  ]),
  credit: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
});

/* ------------------------------------------------------------------ */
/* Letters                                                             */
/* ------------------------------------------------------------------ */

export const GroupId = z.union([
  z.literal(1), z.literal(2), z.literal(3), z.literal(4),
  z.literal(5), z.literal(6), z.literal(7),
]);

export const Letter = z.object({
  id: slug,
  order: z.number().int().min(1).max(32),

  /** What the site renders and what the learner can copy. */
  unicode: z.object({ upper: copticText, lower: copticText }),
  /** Legacy Athanasius/Antonious keystroke. Kept only so the optional
   *  "manuscript mode" can still work. Never rendered as the default. */
  athanasiusKey: z.object({ upper: z.string(), lower: z.string() }).nullable(),
  /** Extra keystrokes that produce the same glyph in some sources
   *  (e.g. hori: explorer `|`, vocabulary `\`). Never rendered. */
  athanasiusAliases: z.array(z.string().min(1)).default([]),

  name: z.object({
    coptic: copticText,
    ar: z.string().min(1),
    /** Longer teaching form (khi: كي، خي، شي). Search/sort use `ar`. */
    arDisplay: z.string().min(1).optional(),
    latin: z.string().min(1),
  }),

  /** Exactly one home group — this drives navigation. */
  group: GroupId,
  /** Extra appearances, e.g. a letter revisited in a pronunciation lesson. */
  alsoTaughtIn: z.array(GroupId).default([]),

  sound: z.object({
    ipa: z.array(z.string()).min(1),
    arabicHint: z.array(z.string()).min(1),   // e.g. ["ش"]
    note: Localized.optional(),
  }),

  /** The teaching core: conditional pronunciation rules. */
  rules: z.array(z.object({
    id: slug,
    condition: Localized,   // "قبل حرف متحرك"
    result: Localized,      // "تُنطق (v)"
    examples: z.array(z.string()).default([]),  // word ids
  })).default([]),

  numericValue: z.number().int().positive().nullable(),
  audio: AudioClip.nullable(),
  exampleWords: z.array(slug).default([]),
});
export type Letter = z.infer<typeof Letter>;

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

export const Word = z.object({
  id: slug,
  coptic: copticText,
  athanasiusKey: z.string().nullable(),
  translit: z.object({ ar: z.string(), en: z.string().optional() }),
  /** Null on reading drills with no dictionary gloss. Pronunciation stays in translit.ar. */
  meaning: Localized.nullable(),

  /** The fix for "reads like a broken dictionary":
   *  real Coptic vocabulary vs. reading-practice strings like `zaki`. */
  kind: z.enum(["lexicon", "drill", "name"]),

  /** Which letter this word was chosen to demonstrate. */
  teaches: z.array(slug).default([]),
  group: GroupId.nullable(),
  partOfSpeech: z.enum([
    "noun", "verb", "pronoun", "adjective", "preposition", "particle", "phrase", "other",
  ]).optional(),

  art: Artwork.nullable().default(null),
  audio: AudioClip.nullable().default(null),

  /** Set false while an Arabic gloss is unfinished — hidden from the UI,
   *  visible in the contributor view. Nothing half-done ships. */
  published: z.boolean().default(true),
});
export type Word = z.infer<typeof Word>;

/* ------------------------------------------------------------------ */
/* Prayers / running text with audio                                   */
/* ------------------------------------------------------------------ */

/** One line of a prayer. Timings point into the single full recording,
 *  so you record once and never cut the file. */
export const PrayerLine = z.object({
  id: slug,
  role: z.enum(["priest", "deacon", "congregation", "narration", "none"]).default("none"),
  coptic: copticText,
  translit: z.object({ ar: z.string(), en: z.string().optional() }),
  translation: Localized,

  /** Seconds into `audio.full`. Enables karaoke-style line highlighting. */
  startSec: z.number().nonnegative().optional(),
  endSec: z.number().nonnegative().optional(),

  /** Optional per-word breakdown. Add later, line by line — the app
   *  renders a plain line when this is absent. */
  tokens: z.array(z.object({
    coptic: copticText,
    wordId: slug.nullable().default(null),
    gloss: z.string().optional(),
    startSec: z.number().nonnegative().optional(),
  })).default([]),
});

export const Prayer = z.object({
  id: slug,
  title: Localized,
  titleCoptic: copticText,
  /** Where it is used, so learners find it by occasion, not by lesson number. */
  occasion: z.array(z.enum([
    "daily", "agpeya", "liturgy", "vespers", "matins", "feast", "fasting", "hymn",
  ])).default([]),
  level: z.number().int().min(1).max(6),
  audio: z.object({
    full: AudioClip,
    slow: AudioClip.optional(),   // a slower teaching take
  }).nullable(),
  lines: z.array(PrayerLine).min(1),
  /** Vocabulary drawn from this prayer, for the lesson page. */
  keyWords: z.array(slug).default([]),
  source: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
});
export type Prayer = z.infer<typeof Prayer>;

/* ------------------------------------------------------------------ */
/* Curriculum — this is what makes grammar levels a drop-in later      */
/* ------------------------------------------------------------------ */

export const Lesson = z.object({
  id: slug,
  order: z.number().int().min(1),
  title: Localized,
  summary: Localized,
  /** What kind of page to render. Adding "grammar" costs one component. */
  kind: z.enum(["letters", "vocabulary", "grammar", "prayer", "practice", "reading"]),
  /** Prose lives in MDX so a grammar lesson can hold tables and inline
   *  <LetterChip/> / <WordCard/> components without a schema change. */
  body: z.string().nullable().default(null),   // content/lessons/<file>.mdx
  refs: z.object({
    letters: z.array(slug).default([]),
    words: z.array(slug).default([]),
    prayers: z.array(slug).default([]),
  }).default({ letters: [], words: [], prayers: [] }),
  requires: z.array(slug).default([]),         // lesson ids
  estMinutes: z.number().int().positive().default(10),
  status: z.enum(["published", "draft"]).default("draft"),
});

export const Level = z.object({
  id: slug,
  order: z.number().int().min(1),
  title: Localized,
  goal: Localized,
  /** Level 1 uses the seven colors. Later levels get their own ramp. */
  colorToken: z.string(),
  lessons: z.array(Lesson).min(1),
});
export type Level = z.infer<typeof Level>;

/* ------------------------------------------------------------------ */
/* File-level schemas                                                  */
/* ------------------------------------------------------------------ */

const fileMeta = { schemaVersion: z.literal(SCHEMA_VERSION), updated: z.string() };

export const LettersFile = z.object({ ...fileMeta, letters: z.array(Letter).length(32) });
export const WordsFile = z.object({
  ...fileMeta,
  /** How rows entered this file. Required so a 147-count stays auditable. */
  provenance: z.string().min(1),
  words: z.array(Word).min(1),
});
export const PrayersFile = z.object({ ...fileMeta, prayers: z.array(Prayer) });
export const CurriculumFile = z.object({ ...fileMeta, levels: z.array(Level).min(1) });
