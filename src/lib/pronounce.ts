/**
 * Stored-rule Coptic → Arabic sounds. Production and lab share this file.
 * Never invent a sound: if no stored rule matches, leave that segment blank.
 * Greek-only rules fire on the six loan endings (as os is an on in), a
 * stored `spellList` stem, or `ctx.isGreekLoan`.
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
  /** Force Greek letter rules. Unset: the six loan endings. */
  isGreekLoan?: boolean;
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

/** Owner 2026-09-03: as os is an on in. Do not add ⲏⲥ / ⲏⲛ. */
export const GREEK_LOAN_ENDINGS = ["ⲁⲥ", "ⲟⲥ", "ⲓⲥ", "ⲁⲛ", "ⲟⲛ", "ⲓⲛ"] as const;

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

/** "الحروف السابقة" on a Greek else-rule is the paired follow list, not (X). */
function elseFollowKeys(
  letter: Letter,
  rule: Letter["rules"][number],
): string[] {
  if (rule.follow) return tokensFromFollow(rule.follow);
  const self = new Set(
    [letter.athanasiusKey.upper, letter.athanasiusKey.lower].filter(Boolean),
  );
  const fromCond = followKeys(rule).filter((key) => !self.has(key));
  if (fromCond.length > 0) return fromCond;
  const paired = letter.rules.find((other) => {
    if (other.id === rule.id) return false;
    const ar = cond(other);
    return isGreekOnly(ar) && !isElseRule(ar) && followKeys(other).length > 0;
  });
  return paired ? followKeys(paired) : [];
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

/** Six endings, and the word is longer than the ending (so ⲁⲛ negation stays Coptic). */
function lettersOnlyOf(surface: string): string {
  return units(foldCopticLower(surface))
    .map((unit) => unit.base)
    .join("");
}

function endsWithGreekLoan(lettersOnly: string): boolean {
  return GREEK_LOAN_ENDINGS.some(
    (end) => lettersOnly.length > end.length && lettersOnly.endsWith(end),
  );
}

type SpellForm = {
  letters: string;
  origin: "greek" | "coptic";
  match: "span" | "exact";
};

function spellForms(): SpellForm[] {
  return getPronunciation()
    .spellList.map((row) => ({
      letters: lettersOnlyOf(row.coptic),
      origin: row.origin,
      match: row.match ?? (row.origin === "greek" ? "span" : "exact"),
    }))
    .filter((row) => row.letters.length > 0);
}

function coverAt(
  lettersOnly: string,
  index: number,
  forms: SpellForm[],
): SpellForm | null {
  let best: SpellForm | null = null;
  for (const form of forms) {
    if (form.match === "exact") {
      if (lettersOnly === form.letters) {
        if (!best || form.letters.length >= best.letters.length) best = form;
      }
      continue;
    }
    let from = 0;
    while (from <= lettersOnly.length - form.letters.length) {
      const at = lettersOnly.indexOf(form.letters, from);
      if (at < 0) break;
      if (index >= at && index < at + form.letters.length) {
        if (!best || form.letters.length > best.letters.length) best = form;
      }
      from = at + 1;
    }
  }
  return best;
}

function greekAt(lettersOnly: string, index: number, forms: SpellForm[]): boolean {
  const hit = coverAt(lettersOnly, index, forms);
  if (hit) return hit.origin === "greek";
  return endsWithGreekLoan(lettersOnly);
}

export function looksGreekLoan(surface: string): boolean {
  const lettersOnly = lettersOnlyOf(surface);
  const forms = spellForms();
  if (lettersOnly.length === 0) return false;
  return [...lettersOnly].some((_, index) => greekAt(lettersOnly, index, forms));
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

function isCopticDefault(ar: string): boolean {
  return ar.includes("الكلمات القبطية");
}

function ruleAllowed(rule: Letter["rules"][number], greek: boolean): boolean {
  const ar = cond(rule);
  if (isGreekOnly(ar)) return greek;
  if (isSpecialCase(ar)) return false;
  if (greek && isCopticDefault(ar)) return false;
  return true;
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
  greek: boolean,
): { ar: string; noteAr: string | null; ruleId: string } | null {
  const nextBases = stream.slice(index + 1).map((u) => u.base);
  const prevBase = stream[index - 1]?.base;
  const atEnd = index === stream.length - 1;
  const nextIsConsonant = nextBases[0] != null && !VOWELS.has(nextBases[0]);
  const prevIsConsonant = prevBase != null && !VOWELS.has(prevBase);
  const betweenConsonants = prevIsConsonant && (nextIsConsonant || atEnd);
  const unit = stream[index]!;

  const usable = letter.rules.filter((rule) => ruleAllowed(rule, greek));

  for (const rule of usable) {
    const ar = cond(rule);
    if (!isElseRule(ar)) continue;
    const keys = elseFollowKeys(letter, rule);
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
  const lettersOnly = stream.map((unit) => unit.base).join("");
  const forms = spellForms();
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
    const greek = ctx.isGreekLoan ?? greekAt(lettersOnly, i, forms);
    const picked = pickRule(letter, i, stream, ctx, greek);
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
