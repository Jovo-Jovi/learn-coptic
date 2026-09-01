import type { GroupId, Word } from "@/data/schema";

/** Strip tashkeel and fold common Arabic letter variants for lookup. */
export function normalizeArabic(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

export function glossTokens(arabic: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of arabic.split(/[،,;\/]+/)) {
    const token = normalizeArabic(part);
    if (!token || seen.has(token)) continue;
    seen.add(token);
    out.push(token);
  }
  return out;
}

/** Payload on `/search` — no derived Fuse fields. */
export type SlimSearchRecord = {
  type: "word" | "letter" | "prayer";
  id: string;
  coptic: string;
  mapped: string | null;
  ar: string;
  label: string;
  translitAr: string;
  wordKind: Word["kind"] | null;
  group: GroupId | null;
  href: string;
};

export type SearchRecord = SlimSearchRecord & {
  arNorm: string;
  tokens: string[];
  translitNorm: string;
};

export function hydrateRecord(row: SlimSearchRecord): SearchRecord {
  const extra =
    row.type === "letter"
      ? row.ar
      : [row.ar, row.translitAr].filter(Boolean).join(" ");
  return {
    ...row,
    arNorm: normalizeArabic(extra),
    tokens: glossTokens(row.ar),
    translitNorm: normalizeArabic(row.translitAr),
  };
}

export const FUSE_KEYS = [
  { name: "arNorm", weight: 2.5 },
  { name: "tokens", weight: 3 },
  { name: "coptic", weight: 2 },
  { name: "translitNorm", weight: 1 },
] as const;

export const FUSE_OPTIONS = {
  keys: [...FUSE_KEYS],
  threshold: 0.32,
  ignoreLocation: true,
  ignoreDiacritics: true,
  minMatchCharLength: 1,
  includeScore: true,
  shouldSort: true,
};

export const SEARCH_LIMIT = 40;

function hasCoptic(query: string): boolean {
  return /[\u2C80-\u2CFF\u03E2-\u03EF]/u.test(query);
}

export function rankSearch(
  query: string,
  records: SearchRecord[],
  fuseSearch: (q: string) => { item: SearchRecord; score?: number }[],
): SearchRecord[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const seen = new Set<string>();
  const out: SearchRecord[] = [];
  const push = (record: SearchRecord) => {
    const key = `${record.type}:${record.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(record);
  };

  if (hasCoptic(trimmed)) {
    for (const record of records) {
      if (record.coptic === trimmed || record.coptic.includes(trimmed)) push(record);
      if (out.length >= SEARCH_LIMIT) return out;
    }
  }

  const norm = normalizeArabic(trimmed);
  if (norm.length >= 1) {
    for (const record of records) {
      if (record.tokens.includes(norm) || record.arNorm === norm) push(record);
      if (out.length >= SEARCH_LIMIT) return out;
    }
    if (norm.length >= 2) {
      for (const record of records) {
        if (record.tokens.some((token) => token.startsWith(norm))) {
          push(record);
        } else if (
          norm.length >= 3 &&
          (record.arNorm.includes(norm) || record.translitNorm.includes(norm))
        ) {
          push(record);
        }
        if (out.length >= SEARCH_LIMIT) return out;
      }
    }
  }

  const q = hasCoptic(trimmed) ? trimmed : norm || trimmed;
  if (hasCoptic(trimmed) || norm.length >= 2) {
    for (const hit of fuseSearch(q)) {
      push(hit.item);
      if (out.length >= SEARCH_LIMIT) return out;
    }
  }
  return out;
}
