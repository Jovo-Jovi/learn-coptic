"use client";

import { useEffect, useMemo, useState } from "react";
import { CopticPaint } from "@/components/CopticPaint";
import { AudioButton } from "@/components/AudioButton";
import {
  boxCounts,
  dueCardIds,
  ensureCards,
  gradeCard,
  loadLeitner,
  pickCardId,
  resetLeitner,
  saveLeitner,
  type LeitnerBox,
  type LeitnerState,
} from "@/lib/leitner";
import { easternDigits } from "@/lib/letters";
import { cn } from "@/lib/utils";

export type QuizLetter = {
  id: string;
  glyph: string;
  mapped: string | null;
  nameAr: string;
  hintAr: string;
  audioSrc: string | null;
  group: 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

export type QuizWord = {
  id: string;
  coptic: string;
  mapped: string | null;
  meaningAr: string;
  group: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
};

function shuffle<T>(items: T[]): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function optionSet(correct: string, pool: string[]): string[] {
  const unique = [...new Set(pool.filter((item) => item !== correct))];
  const picked = shuffle(unique).slice(0, 3);
  return shuffle([correct, ...picked]);
}

function cardIds(letters: QuizLetter[], words: QuizWord[]): string[] {
  return [
    ...letters.map((letter) => `gs:${letter.id}`),
    ...letters.map((letter) => `sg:${letter.id}`),
    ...words.map((word) => `wm:${word.id}`),
  ];
}

const SESSION_SIZE = 15;

function sessionGoalFor(state: LeitnerState, ids: string[]): number {
  return Math.min(SESSION_SIZE, dueCardIds(state, ids).length);
}

export function QuizSession({
  letters,
  words,
}: {
  letters: QuizLetter[];
  words: QuizWord[];
}) {
  const ids = useMemo(() => cardIds(letters, words), [letters, words]);
  const lettersById = useMemo(
    () => Object.fromEntries(letters.map((letter) => [letter.id, letter])),
    [letters],
  );
  const wordsById = useMemo(
    () => Object.fromEntries(words.map((word) => [word.id, word])),
    [words],
  );

  const [state, setState] = useState<LeitnerState | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [goal, setGoal] = useState(0);
  const [answered, setAnswered] = useState(0);

  function persist(next: LeitnerState, nextId: string | null) {
    saveLeitner(next);
    setState(next);
    setCardId(nextId);
    setPicked(null);
  }

  function startRound(next: LeitnerState) {
    const roundGoal = sessionGoalFor(next, ids);
    setGoal(roundGoal);
    setAnswered(0);
    persist(next, roundGoal > 0 ? pickCardId(next, ids) : null);
  }

  useEffect(() => {
    const loaded = ensureCards(loadLeitner(), ids);
    saveLeitner(loaded);
    setState(loaded);
    const roundGoal = sessionGoalFor(loaded, ids);
    setGoal(roundGoal);
    setAnswered(0);
    setCardId(roundGoal > 0 ? pickCardId(loaded, ids) : null);
    setPicked(null);
  }, [ids]);

  useEffect(() => {
    if (!cardId || !state) return;
    if (cardId.startsWith("gs:")) {
      const letter = lettersById[cardId.slice(3)];
      if (!letter) return;
      setChoices(optionSet(letter.nameAr, letters.map((item) => item.nameAr)));
    } else if (cardId.startsWith("sg:")) {
      const letter = lettersById[cardId.slice(3)];
      if (!letter) return;
      setChoices(optionSet(letter.glyph, letters.map((item) => item.glyph)));
    } else if (cardId.startsWith("wm:")) {
      const word = wordsById[cardId.slice(3)];
      if (!word) return;
      setChoices(optionSet(word.meaningAr, words.map((item) => item.meaningAr)));
    }
    setPicked(null);
  }, [cardId, letters, lettersById, state, words, wordsById]);

  if (!state) {
    return <p className="text-base text-text-dim">بنجهّز الكويز…</p>;
  }

  const counts = boxCounts(state, ids);
  const kind =
    cardId?.startsWith("gs:") ? "glyph-sound"
    : cardId?.startsWith("sg:") ? "sound-glyph"
    : cardId?.startsWith("wm:") ? "word-meaning"
    : null;

  function onReset() {
    if (!window.confirm("صفّر كل التقدم؟")) return;
    startRound(ensureCards(resetLeitner(), ids));
  }

  function answer(choice: string) {
    if (picked || !cardId) return;
    setPicked(choice);
  }

  function nextCard() {
    if (!cardId || picked == null || !state) return;
    const correct = picked === correctAnswer(cardId);
    const graded = gradeCard(state, cardId, correct);
    const nextAnswered = answered + 1;
    setAnswered(nextAnswered);
    const nextId = pickCardId(graded, ids);
    const finished = nextAnswered >= goal || nextId == null;
    persist(graded, finished ? null : nextId);
  }

  function anotherRound() {
    if (!state) return;
    startRound(state);
  }

  function correctAnswer(id: string): string | null {
    if (id.startsWith("gs:")) return lettersById[id.slice(3)]?.nameAr ?? null;
    if (id.startsWith("sg:")) return lettersById[id.slice(3)]?.glyph ?? null;
    if (id.startsWith("wm:")) return wordsById[id.slice(3)]?.meaningAr ?? null;
    return null;
  }

  const prompt = cardId ? renderPrompt(cardId, lettersById, wordsById) : null;
  const right = cardId ? correctAnswer(cardId) : null;
  const isCorrect = picked != null && picked === right;
  const dueLeft = dueCardIds(state, ids).length;
  const roundDone = !cardId && answered > 0;
  const nothingDue = !cardId && answered === 0 && dueLeft === 0;
  const shown = cardId ? Math.min(goal, answered + 1) : answered;
  const pct = goal > 0 ? Math.round((shown / goal) * 100) : 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-text">
            {goal > 0
              ? `${easternDigits(shown)} من ${easternDigits(goal)}`
              : "مفيش كروت دلوقتي"}
          </p>
          <p className="text-xs text-text-dim">حصة {easternDigits(SESSION_SIZE)}</p>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal || 1}
          aria-valuenow={shown}
          aria-label="تقدم الحصة"
        >
          <div
            className="h-full rounded-full bg-text transition-[width] duration-300"
            style={{ width: `${goal > 0 ? Math.min(100, pct) : 0}%` }}
          />
        </div>
        {dueLeft > 0 && roundDone ? (
          <p className="mt-2 text-xs text-text-dim">
            لسه {easternDigits(dueLeft)} كرت مستحق. تقدر تاخد حصة كمان.
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-text-dim">صناديق الحفظ</p>
        <ul className="grid grid-cols-5 gap-1.5" aria-label="صناديق لايتنر">
          {([1, 2, 3, 4, 5] as LeitnerBox[]).map((box) => {
            const n = counts[box];
            return (
              <li
                key={box}
                className={cn(
                  "flex flex-col items-center rounded-2xl px-1 py-2 text-center",
                  n > 0 ? "bg-surface-2 text-text" : "bg-surface text-text-dim",
                )}
              >
                <span className="text-xs text-text-dim">{easternDigits(box)}</span>
                <span className="text-sm font-semibold">{easternDigits(n)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {prompt && cardId && right && kind ? (
        <>
          <p className="text-center text-sm font-semibold text-text-dim">
            {kind === "glyph-sound"
              ? "الحرف — اختار الاسم"
              : kind === "sound-glyph"
                ? "الصوت — اختار الحرف"
                : "الكلمة — اختار المعنى"}
          </p>
          {prompt}
          <ul className="flex flex-col gap-2">
            {choices.map((choice) => {
              const isRight = choice === right;
              const isPicked = choice === picked;
              const optionLetter = letters.find((letter) => letter.glyph === choice);
              return (
                <li key={choice}>
                  <button
                    type="button"
                    disabled={picked != null}
                    onClick={() => answer(choice)}
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center rounded-2xl border px-4 py-3 text-base",
                      "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                      picked == null
                        ? "border-hairline bg-surface text-text"
                        : isRight
                          ? "border-text bg-surface-2 text-text ring-2 ring-text"
                          : isPicked
                            ? "border-destructive/40 bg-destructive/15 text-destructive line-through"
                            : "border-transparent bg-surface-2 text-text-dim",
                    )}
                  >
                    {kind === "sound-glyph" ? (
                      <span data-group={optionLetter?.group}>
                        <CopticPaint
                          unicode={choice}
                          mapped={optionLetter?.mapped}
                          className="word-coptic text-3xl leading-none text-current"
                        />
                      </span>
                    ) : (
                      <span className="text-center leading-snug whitespace-normal">
                        {choice}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {picked != null ? (
            <div className="flex flex-col gap-3">
              <p
                className={cn(
                  "text-center text-sm font-semibold",
                  isCorrect ? "text-text" : "text-destructive",
                )}
              >
                {isCorrect ? "صح" : "غلط"}
              </p>
              <button
                type="button"
                onClick={nextCard}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-text px-4 text-sm font-semibold text-bg focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
              >
                اللي بعده
              </button>
            </div>
          ) : null}
        </>
      ) : roundDone ? (
        <div className="card-face flex flex-col items-center gap-4 px-4 py-8 text-center">
          <p className="text-lg font-semibold text-text">خلصت الحصة</p>
          <p className="text-sm text-text-dim">
            {easternDigits(answered)} سؤال. الكروت الصح هترجع بعد يوم أو أكتر.
          </p>
          {dueLeft > 0 ? (
            <button
              type="button"
              onClick={anotherRound}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-text px-4 text-sm font-semibold text-bg focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
            >
              حصة كمان ({easternDigits(Math.min(SESSION_SIZE, dueLeft))})
            </button>
          ) : (
            <p className="text-sm text-text-dim">مفيش كروت مستحقة دلوقتي. تعالى بكرا.</p>
          )}
        </div>
      ) : nothingDue ? (
        <p className="text-base text-text-dim">مفيش كروت مستحقة دلوقتي. تعالى بكرا.</p>
      ) : (
        <p className="text-base text-text-dim">مفيش كروت دلوقتي.</p>
      )}

      <p className="border-t border-hairline pt-5">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-destructive/15 px-4 text-sm font-semibold text-destructive focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          صفّر التقدم
        </button>
      </p>
    </div>
  );
}

function renderPrompt(
  cardId: string,
  lettersById: Record<string, QuizLetter>,
  wordsById: Record<string, QuizWord>,
) {
  if (cardId.startsWith("gs:")) {
    const letter = lettersById[cardId.slice(3)];
    if (!letter) return null;
    return (
      <div
        data-group={letter.group}
        className="card-face relative flex flex-col items-center gap-3 overflow-hidden px-4 py-10"
      >
        <div className="group-wash" aria-hidden="true" />
        <CopticPaint
          unicode={letter.glyph}
          mapped={letter.mapped}
          className="relative z-10 glyph-fill text-glyph inline-block leading-none"
        />
      </div>
    );
  }
  if (cardId.startsWith("sg:")) {
    const letter = lettersById[cardId.slice(3)];
    if (!letter) return null;
    return (
      <div
        data-group={letter.group}
        className="card-face relative flex flex-col items-center gap-4 overflow-hidden px-4 py-10"
      >
        <div className="group-wash" aria-hidden="true" />
        <p className="relative z-10 text-2xl font-semibold text-text">{letter.hintAr}</p>
        {letter.audioSrc ? (
          <div className="relative z-10">
            <AudioButton src={letter.audioSrc} ariaLabel="اسمع نطق الحرف" />
          </div>
        ) : null}
      </div>
    );
  }
  if (cardId.startsWith("wm:")) {
    const word = wordsById[cardId.slice(3)];
    if (!word) return null;
    return (
      <div
        data-group={word.group ?? undefined}
        className="card-face relative flex flex-col items-center gap-3 overflow-hidden px-4 py-10"
      >
        <div className="group-wash" aria-hidden="true" />
        <CopticPaint
          unicode={word.coptic}
          mapped={word.mapped}
          className="word-coptic relative z-10 text-[2.5rem] leading-none text-text glyph-fill sm:text-glyph-word-md"
        />
      </div>
    );
  }
  return null;
}
