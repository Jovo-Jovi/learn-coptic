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
export type GroupId = z.infer<typeof GroupId>;

export const Letter = z.object({
  id: slug,
  order: z.number().int().min(1).max(32),

  /** What the site renders and what the learner can copy. */
  unicode: z.object({ upper: copticText, lower: copticText }),
  /** Explorer keymap for optional manuscript paint (Athanasius Plain).
   *  Default paint is Unicode. Never invent a key. */
  athanasiusKey: z.object({ upper: z.string(), lower: z.string() }).nullable(),
  /** Extra keystrokes that produce the same glyph in some sources
   *  (e.g. hori: explorer `|`, vocabulary `\`). Not used for paint. */
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

  /** The teaching core: conditional pronunciation rules.
   *  Copy matches the live explorer: result first (ينطق (ڤ)), then
   *  condition, then optional `follow` key row (A - E - I - …). */
  rules: z.array(z.object({
    id: slug,
    condition: Localized,   // "إذا جاء بعده حرف متحرك"
    result: Localized,      // "ينطق (ڤ)"
    /** Athanasuis key row from the explorer, shown LTR as taught. */
    follow: z.string().min(1).optional(),
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
  /** Coptic with U+0300–U+036F stripped. Validator checks against normalizeCoptic. */
  normalized: copticText,
  /** Dictionary headword when known. Null rather than a guessed stem. */
  lemma: copticText.nullable(),
  /** Explorer keymap for optional manuscript paint. Null → Unicode fallback. */
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
    /** Span copied from this line's translation.ar — not a new dictionary gloss.
     *  Validator requires it to occur exactly once in the line. */
    arHighlight: z.string().min(1).optional(),
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
export type Lesson = z.infer<typeof Lesson>;

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
/* Owner grammar notes — 10/10 stored; parse when a human says so       */
/* ------------------------------------------------------------------ */

export const GrammarExample = z.object({
  coptic: copticText,
  translation: Localized,
  analysis: z.string().min(1).optional(),
});
export type GrammarExample = z.infer<typeof GrammarExample>;

export const GrammarTable = z.object({
  id: slug,
  caption: Localized.optional(),
  headers: z.array(z.string().min(1)).min(1),
  rows: z.array(z.array(z.string().min(1)).min(1)),
});
export type GrammarTable = z.infer<typeof GrammarTable>;

export const GrammarSection = z.object({
  id: slug,
  title: Localized,
  rule: Localized,
  structure: z.string().min(1).optional(),
  when: Localized.optional(),
  examples: z.array(GrammarExample).default([]),
  notes: z.array(z.string().min(1)).default([]),
  tables: z.array(GrammarTable).default([]),
});
export type GrammarSection = z.infer<typeof GrammarSection>;

export const GrammarPoint = z.object({
  id: slug,
  order: z.number().int().min(1).max(10),
  title: Localized,
  summary: Localized,
  sections: z.array(GrammarSection).min(1),
});
export type GrammarPoint = z.infer<typeof GrammarPoint>;

export const GrammarAffix = z.object({
  id: slug,
  kind: z.enum([
    "article-definite",
    "article-indefinite",
    "possessive-adjective",
    "possessive-pronoun",
    "independent-pronoun",
    "subject-pronoun",
    "object-pronoun",
    "copula",
    "relative",
    "preposition",
    "genitive",
    "tense",
    "negation",
    "imperative",
    "interrogative",
    "mood",
    "conjunction",
    "object-marker",
    "other",
  ]),
  form: copticText,
  formBeforePronoun: copticText.optional(),
  gloss: Localized,
  attach: z.enum(["prefix", "suffix", "clitic", "free"]).default("prefix"),
  /** True on unambiguous rows after a human said parse (S17). Short colliding forms stay false. */
  parseReady: z.boolean().default(false),
});
export type GrammarAffix = z.infer<typeof GrammarAffix>;

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
export const GrammarFile = z.object({
  ...fileMeta,
  dialect: z.literal("bohairic"),
  provenance: z.string().min(1),
  pointsExpected: z.literal(10),
  points: z.array(GrammarPoint),
  affixes: z.array(GrammarAffix).default([]),
});
export type GrammarFile = z.infer<typeof GrammarFile>;

/* ------------------------------------------------------------------ */
/* Pronunciation reference — church modern vs old Bohairic             */
/* ------------------------------------------------------------------ */

export const PronunciationExample = z.object({
  coptic: copticText,
  translit: Localized.optional(),
  translation: Localized.optional(),
  wordId: slug.optional(),
});
export type PronunciationExample = z.infer<typeof PronunciationExample>;

export const SpellListRow = z.object({
  id: slug,
  coptic: copticText,
  origin: z.enum(["greek", "coptic"]),
  /** greek defaults to span; coptic defaults to exact (so ⲭⲱ ≠ ⲭⲱⲣⲁ). */
  match: z.enum(["span", "exact"]).optional(),
  wordId: slug.optional(),
});
export type SpellListRow = z.infer<typeof SpellListRow>;

export const PronunciationFile = z.object({
  ...fileMeta,
  dialect: z.literal("bohairic"),
  provenance: z.string().min(1),
  systems: z.array(
    z.object({
      id: slug,
      title: Localized,
      body: Localized,
    }),
  ).min(1),
  diphthongs: z.array(
    z.object({
      id: slug,
      cluster: copticText,
      result: Localized,
      examples: z.array(PronunciationExample).default([]),
    }),
  ).default([]),
  pitfalls: z.array(
    z.object({
      id: slug,
      wrong: Localized,
      right: Localized,
    }),
  ).default([]),
  marks: z.array(
    z.object({
      id: slug,
      title: Localized,
      body: Localized,
      examples: z.array(PronunciationExample).default([]),
    }),
  ).default([]),
  drills: z.array(PronunciationExample).default([]),
  /** Verified stems the six Greek endings miss. Do not bulk-tag harvest. */
  spellList: z.array(SpellListRow).default([]),
});
export type PronunciationFile = z.infer<typeof PronunciationFile>;
