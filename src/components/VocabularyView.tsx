import { FilterableWordGrid } from "@/components/FilterableWordGrid";
import { VocabularyFilter } from "@/components/VocabularyFilter";
import type { GroupId } from "@/data/schema";
import { GROUP_DIGIT_AR, easternDigits } from "@/lib/letters";
import type { WordCardModel } from "@/lib/words";

export function VocabularyView({
  words,
  current,
  letterName,
}: {
  words: WordCardModel[];
  current: GroupId | "all" | "letter";
  letterName?: string;
}) {
  const title =
    current === "all"
      ? "الكلمات"
      : current === "letter"
        ? letterName
          ? `كلمات حرف ${letterName}`
          : "كلمات الحرف"
        : `المجموعة ${GROUP_DIGIT_AR[current]}`;

  const countLine =
    words.length === 0
      ? "مفيش كلمات هنا"
      : `${easternDigits(words.length)} كلمة`;

  return (
    <div className="w-full min-w-0 py-8">
      <h1 className="mb-2 text-2xl text-text">{title}</h1>
      <p className="mb-8 text-sm text-text-dim">{countLine}</p>
      <VocabularyFilter current={current} />
      {words.length > 0 ? (
        <FilterableWordGrid words={words} />
      ) : (
        <p className="text-base text-text-dim">مفيش كلمات في التصفية دي.</p>
      )}
    </div>
  );
}
