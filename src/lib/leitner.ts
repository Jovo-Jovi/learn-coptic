import { LEITNER_KEY } from "@/lib/theme";

export const LEITNER_BOXES = [1, 2, 3, 4, 5] as const;
export type LeitnerBox = (typeof LEITNER_BOXES)[number];

export type LeitnerCard = { box: LeitnerBox; due: number };

export type LeitnerState = {
  v: 1;
  cards: Record<string, LeitnerCard>;
};

const DAY = 86_400_000;
/** Index is the box the card *moves into* after a correct answer. */
const INTERVAL_MS: Record<LeitnerBox, number> = {
  1: 0,
  2: DAY,
  3: 3 * DAY,
  4: 7 * DAY,
  5: 14 * DAY,
};

export function emptyLeitner(): LeitnerState {
  return { v: 1, cards: {} };
}

export function loadLeitner(): LeitnerState {
  if (typeof window === "undefined") return emptyLeitner();
  try {
    const raw = window.localStorage.getItem(LEITNER_KEY);
    if (!raw) return emptyLeitner();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyLeitner();
    const rec = parsed as { v?: unknown; cards?: unknown };
    if (rec.v !== 1 || !rec.cards || typeof rec.cards !== "object") {
      return emptyLeitner();
    }
    const cards: Record<string, LeitnerCard> = {};
    for (const [id, value] of Object.entries(rec.cards)) {
      if (!value || typeof value !== "object") continue;
      const row = value as { box?: unknown; due?: unknown };
      if (row.box !== 1 && row.box !== 2 && row.box !== 3 && row.box !== 4 && row.box !== 5) {
        continue;
      }
      if (typeof row.due !== "number") continue;
      cards[id] = { box: row.box, due: row.due };
    }
    return { v: 1, cards };
  } catch {
    return emptyLeitner();
  }
}

export function saveLeitner(state: LeitnerState): void {
  window.localStorage.setItem(LEITNER_KEY, JSON.stringify(state));
}

export function ensureCards(state: LeitnerState, ids: string[], now = Date.now()): LeitnerState {
  const cards = { ...state.cards };
  let changed = false;
  for (const id of ids) {
    if (cards[id]) continue;
    cards[id] = { box: 1, due: now };
    changed = true;
  }
  return changed ? { v: 1, cards } : state;
}

export function gradeCard(
  state: LeitnerState,
  id: string,
  correct: boolean,
  now = Date.now(),
): LeitnerState {
  const current = state.cards[id] ?? { box: 1 as const, due: now };
  const box: LeitnerBox = correct
    ? (Math.min(5, current.box + 1) as LeitnerBox)
    : 1;
  return {
    v: 1,
    cards: {
      ...state.cards,
      [id]: { box, due: now + INTERVAL_MS[box] },
    },
  };
}

export function dueCardIds(state: LeitnerState, ids: string[], now = Date.now()): string[] {
  return ids.filter((id) => (state.cards[id]?.due ?? 0) <= now);
}

export function pickCardId(state: LeitnerState, ids: string[], now = Date.now()): string | null {
  const due = dueCardIds(state, ids, now);
  if (due.length === 0) return null;
  let lowest: LeitnerBox = 5;
  for (const id of due) {
    const box = state.cards[id]?.box ?? 1;
    if (box < lowest) lowest = box;
  }
  const lowestIds = due.filter((id) => (state.cards[id]?.box ?? 1) === lowest);
  const pick = lowestIds[Math.floor(Math.random() * lowestIds.length)];
  return pick ?? null;
}

export function resetLeitner(): LeitnerState {
  const next = emptyLeitner();
  if (typeof window !== "undefined") saveLeitner(next);
  return next;
}

export function boxCounts(state: LeitnerState, ids: string[]): Record<LeitnerBox, number> {
  const counts: Record<LeitnerBox, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const id of ids) {
    const box = state.cards[id]?.box ?? 1;
    counts[box] += 1;
  }
  return counts;
}
