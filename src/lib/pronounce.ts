/**
 * Stored-rule Coptic → Arabic sounds. Production and lab share this file.
 * Never invent a sound: if no stored rule matches, leave that segment blank.
 * Greek-only rules stay unused — the engine cannot know the etymology.
 */
import type { Letter } from "@/data/schema";
import { copticLetterCount, normalizeCoptic } from "@/lib/coptic-text";
import {
  foldCopticLower,
  getLetterByAthanasiusKey,
  getLetterByGlyph,
  getLetters,
} from "@/lib/letters";
import { getPronunciation } from "@/lib/pronunciation";

export type PronounceSeg = {
  coptic: string;
  ar: string;
  /** Extra stored commentary (كسرة طويلة). Not part of النطق. */
  noteAr?: string | null;
  ruleId: string | null;
  source: string;
};

export type PronounceCtx = {
  /** Stored `kind: name` or a unique gloss that marks a proper name. */
  isProperName?: boolean;
};

export type SpeakNote = {
  coptic: string;
  noteAr: string;
};

export type LearnerSpeak = {
  text: string | null;
  notes: SpeakNote[];
};

/** Routine extras that would label every ⲁ / ⲟ / ⲱ. Keep them in the lab only. */
const QUIET_NOTES = new Set(["فتحة صريحة", "طويلة", "قصيرة"]);

const VOWELS = new Set(["ⲁ", "ⲉ", "ⲏ", "ⲓ", "ⲟ", "ⲩ", "ⲱ"]);
const JINKIM = "\u0300";
const LATIN_KEY = /^(OU|[A-Z{\]])$/;

function glyphForKey(key: string): string | null {
  return getLetterByAthanasiusKey(key)?.unicode.lower ?? null;
}

function tokensFromFollow(follow: string | undefined): string[] {
  if (!follow) return [];
  return follow
    .split(/\s*-\s*/)
    .map((token) => token.trim())
    .filter((token) => LATIN_KEY.test(token));
}

function tokensFromParens(ar: string): string[] {
  const out: string[] = [];
  for (const block of ar.matchAll(/\(([^)]+)\)/g)) {
    const inner = block[1]!.replace(/أو/g, " ");
    for (const piece of inner.split(/[\s,،]+/)) {
      const token = piece.trim();
      if (LATIN_KEY.test(token)) out.push(token);
    }
  }
  return out;
}

function followKeys(rule: Letter["rules"][number]): string[] {
  const fromFollow = tokensFromFollow(rule.follow);
  if (fromFollow.length > 0) return fromFollow;
  return tokensFromParens(rule.condition.ar);
}

function nextMatches(keys: string[], nextBases: string[]): boolean {
  for (const token of keys) {
    if (token === "OU") {
      if (nextBases[0] === "ⲟ" && nextBases[1] === "ⲩ") return true;
      continue;
    }
    const glyph = glyphForKey(token);
    if (glyph && nextBases[0] === glyph) return true;
  }
  return false;
}

function prevMatches(keys: string[], prevBase: string | undefined): boolean {
  if (!prevBase) return false;
  for (const token of keys) {
    if (token === "OU") continue;
    const glyph = glyphForKey(token);
    if (glyph && prevBase === glyph) return true;
  }
  return false;
}

function parseSpoken(ar: string): { sound: string; note: string | null } {
  const parens = [...ar.matchAll(/\(([^)]+)\)/g)];
  const inner = parens.at(-1)?.[1]?.trim();
  if (inner) {
    const leftover = ar
      .replace(/\s*\([^)]+\)\s*/g, " ")
      .replace(/^ينطق\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    return { sound: inner, note: leftover.length > 0 ? leftover : null };
  }
  const parts = ar.split("/");
  if (parts.length >= 2) {
    const sound = parts[0]!.trim();
    const note = parts.slice(2).join("/").trim();
    return { sound, note: note.length > 0 ? note : null };
  }
  const compact = ar.replace(/^ينطق\s*/, "").trim();
  return { sound: compact.length > 0 ? compact : ar, note: null };
}

function fromRule(
  rule: Letter["rules"][number],
): { ar: string; noteAr: string | null; ruleId: string } | null {
  const spoken = parseSpoken(rule.result.ar);
  if (!spoken.sound) return null;
  return { ar: spoken.sound, noteAr: spoken.note, ruleId: rule.id };
}

type Unit = { base: string; jinkim: boolean };

function units(folded: string): Unit[] {
  const out: Unit[] = [];
  for (const ch of folded) {
    if (ch === JINKIM) {
      const prev = out[out.length - 1];
      if (prev) prev.jinkim = true;
      continue;
    }
    if (getLetterByGlyph(ch)) out.push({ base: foldCopticLower(ch), jinkim: false });
  }
  return out;
}

function cond(rule: Letter["rules"][number]): string {
  return rule.condition.ar;
}

function isGreekOnly(ar: string): boolean {
  return ar.includes("يونان");
}

function isSpecialCase(ar: string): boolean {
  return ar.includes("حالة خاصة");
}

function isElseRule(ar: string): boolean {
  return /لم يتبع|خلاف ذلك|ليس متبوعا/.test(ar);
}

function isPrecede(ar: string): boolean {
  return /قبله|سبقه/.test(ar);
}

function isDefault(ar: string): boolean {
  return /دائماً|عموماً|جميع الكلمات القبطية/.test(ar);
}

function isNameRule(ar: string): boolean {
  return ar.includes("الأعلام") || ar.includes("البلاد");
}

function isRestWordsRule(ar: string): boolean {
  return ar.includes("بقية الكلمات") || ar.includes("فيما عدا ذلك");
}

/** Isolated letter names use أ (أو، إي). Inside a word the أ drops. */
function inWordSound(ar: string, atStart: boolean): string {
  const core = ar.replace(/\s*(طويلة|قصيرة)\s*/g, "").trim();
  if (atStart) return core;
  if (core === "أوو") return "وو";
  if (core === "أو") return "و";
  if (core === "إي") return "ي";
  return core;
}

function jinkimMap(): Map<string, string> {
  const out = new Map<string, string>();
  const mark = getPronunciation().marks.find((row) => row.id === "jinkim");
  if (!mark) return out;
  for (const example of mark.examples) {
    const folded = foldCopticLower(example.coptic);
    const ar = example.translit?.ar.replace(/-$/, "") ?? "";
    if (folded && ar) out.set(folded, ar);
  }
  return out;
}

function pickRule(
  letter: Letter,
  index: number,
  stream: Unit[],
  ctx: PronounceCtx,
): { ar: string; noteAr: string | null; ruleId: string } | null {
  const nextBases = stream.slice(index + 1).map((u) => u.base);
  const prevBase = stream[index - 1]?.base;
  const atEnd = index === stream.length - 1;
  const nextIsConsonant = nextBases[0] != null && !VOWELS.has(nextBases[0]);
  const prevIsConsonant = prevBase != null && !VOWELS.has(prevBase);
  const betweenConsonants = prevIsConsonant && (nextIsConsonant || atEnd);
  const unit = stream[index]!;

  const usable = letter.rules.filter(
    (rule) => !isGreekOnly(cond(rule)) && !isSpecialCase(cond(rule)),
  );

  for (const rule of usable) {
    const ar = cond(rule);
    if (!isElseRule(ar)) continue;
    const keys = followKeys(rule);
    if (keys.length === 0) continue;
    if (nextMatches(keys, nextBases)) continue;
    const hit = fromRule(rule);
    if (hit) return hit;
  }

  for (const rule of usable) {
    const ar = cond(rule);
    if (isElseRule(ar) || !isPrecede(ar)) continue;
    const keys = followKeys(rule);
    if (keys.length === 0) continue;
    if (!prevMatches(keys, prevBase)) continue;
    const hit = fromRule(rule);
    if (hit) return hit;
  }

  const followHits = usable.filter((rule) => {
    const ar = cond(rule);
    if (isElseRule(ar) || isPrecede(ar)) return false;
    const keys = followKeys(rule);
    return keys.length > 0 && nextMatches(keys, nextBases);
  });
  if (followHits.length === 1) {
    const hit = fromRule(followHits[0]!);
    if (hit) return hit;
  }

  for (const rule of usable) {
    const ar = cond(rule);
    if (ar.includes("بين حرفين") && betweenConsonants) {
      const hit = fromRule(rule);
      if (hit) return hit;
    }
    if ((ar.includes("جنكم") || ar.includes("جينكم")) && unit.jinkim) {
      const hit = fromRule(rule);
      if (hit) return hit;
    }
  }

  for (const rule of usable) {
    const ar = cond(rule);
    if (rule.follow && !ar.includes("حرف ساكن") && !ar.includes("آخر الكلمة")) {
      continue;
    }
    if (ar.includes("آخر الكلمة") && atEnd) {
      const hit = fromRule(rule);
      if (hit) return hit;
    }
    if (ar.includes("حرف ساكن") && nextIsConsonant) {
      const hit = fromRule(rule);
      if (hit) return hit;
    }
  }

  if (ctx.isProperName) {
    const named = usable.find((rule) => isNameRule(cond(rule)));
    if (named) {
      const hit = fromRule(named);
      if (hit) return hit;
    }
  }
  const restWords = usable.find((rule) => isRestWordsRule(cond(rule)));
  if (restWords && !ctx.isProperName) {
    const hit = fromRule(restWords);
    if (hit) return hit;
  }

  const always = usable.find((rule) => isDefault(cond(rule)));
  if (always) {
    const hit = fromRule(always);
    if (hit) return hit;
  }

  const hint = letter.sound.arabicHint[0];
  if (hint) return { ar: hint, noteAr: null, ruleId: `${letter.id}-arabicHint` };
  return null;
}

export function pronounceCoptic(
  surface: string,
  letters: Letter[] = getLetters(),
  ctx: PronounceCtx = {},
): {
  segs: PronounceSeg[];
  text: string | null;
  gaps: string[];
} {
  const folded = foldCopticLower(surface);
  const stream = units(folded);
  const diphthongs = getPronunciation()
    .diphthongs.slice()
    .sort((a, b) => [...b.cluster].length - [...a.cluster].length);
  const jinkim = jinkimMap();
  const segs: PronounceSeg[] = [];
  const gaps: string[] = [];
  let i = 0;
  while (i < stream.length) {
    const fromHere = stream.slice(i).map((u) => u.base).join("");
    const cluster = diphthongs.find((d) => fromHere.startsWith(foldCopticLower(d.cluster)));
    if (cluster) {
      const clusterLen = units(foldCopticLower(cluster.cluster)).length;
      const slice = stream.slice(i, i + clusterLen);
      const spoken = parseSpoken(cluster.result.ar);
      segs.push({
        coptic: slice.map((u) => (u.jinkim ? `${u.base}${JINKIM}` : u.base)).join(""),
        ar: inWordSound(spoken.sound, i === 0),
        noteAr: spoken.note,
        ruleId: cluster.id,
        source: "pronunciation.diphthongs",
      });
      i += clusterLen;
      continue;
    }
    const unit = stream[i]!;
    const letter = letters.find((row) => row.unicode.lower === unit.base);
    if (!letter) {
      gaps.push(`لا قاعدة لحرف ${unit.base}`);
      i += 1;
      continue;
    }
    const picked = pickRule(letter, i, stream, ctx);
    if (!picked) {
      gaps.push(`لا نطق مخزّن لـ ${unit.base}`);
      i += 1;
      continue;
    }
    const jinkimForm = `${unit.base}${JINKIM}`;
    let spoken = inWordSound(picked.ar, i === 0);
    let source: PronounceSeg["source"] = "letter.rules";
    if (unit.jinkim) {
      source = "pronunciation.marks/jinkim + letter.rules";
      const stored = jinkim.get(jinkimForm);
      if (stored) spoken = stored.replace(/-$/, "");
      else if (!VOWELS.has(unit.base)) spoken = `إ${picked.ar}`;
    }
    segs.push({
      coptic: unit.jinkim ? jinkimForm : unit.base,
      ar: spoken,
      noteAr: picked.noteAr,
      ruleId: unit.jinkim ? `jinkim+${picked.ruleId}` : picked.ruleId,
      source,
    });
    i += 1;
  }
  const text = segs.length > 0 ? segs.map((s) => s.ar).join(" ") : null;
  tagSameLetterConflicts(segs);
  return { segs, text, gaps };
}

function letterKey(coptic: string): string | null {
  const folded = normalizeCoptic(coptic);
  if (copticLetterCount(folded) !== 1) return null;
  return folded;
}

/** Same stored letter, two sounds in one word (ϫ → ج then چ). */
function tagSameLetterConflicts(segs: PronounceSeg[]): void {
  const sounds = new Map<string, Set<string>>();
  for (const seg of segs) {
    const key = letterKey(seg.coptic);
    if (!key) continue;
    const set = sounds.get(key) ?? new Set<string>();
    set.add(seg.ar);
    sounds.set(key, set);
  }
  for (const seg of segs) {
    const key = letterKey(seg.coptic);
    if (!key) continue;
    const set = sounds.get(key);
    if (!set || set.size < 2) continue;
    if (!seg.noteAr) seg.noteAr = seg.ar;
  }
}

/**
 * Learner النطق: unique stored teaching translit wins; otherwise the engine.
 * Notes only when a stored extra actually changes the reading.
 */
export function learnerSpeak(
  surface: string,
  opts: {
    storedTranslit?: string | null;
    isProperName?: boolean;
  } = {},
): LearnerSpeak {
  const spoken = pronounceCoptic(surface, undefined, {
    isProperName: opts.isProperName,
  });
  const stored = opts.storedTranslit?.trim();
  const text = stored && stored.length > 0 ? stored : spoken.text;
  const notes: SpeakNote[] = [];
  for (const seg of spoken.segs) {
    const note = seg.noteAr?.trim();
    if (!note || QUIET_NOTES.has(note)) continue;
    notes.push({ coptic: seg.coptic, noteAr: note });
  }
  return { text, notes };
}
