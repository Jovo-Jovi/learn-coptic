import type { GroupId, Letter } from "@/data/schema";
import { GroupFilter } from "@/components/GroupFilter";
import { LetterGrid } from "@/components/LetterGrid";
import { letterLessonTitle } from "@/lib/curriculum";
import { GROUP_DIGIT_AR } from "@/lib/letters";

export function AlphabetView({
  letters,
  current,
}: {
  letters: Letter[];
  current: GroupId | "all";
}) {
  const title =
    current === "all" ? "الحروف" : `المجموعة ${GROUP_DIGIT_AR[current]}`;
  const lessonTitle = current === "all" ? null : letterLessonTitle(current);

  return (
    <div className="w-full py-8">
      <h1 className="mb-2 text-2xl text-text">{title}</h1>
      {current === "all" ? (
        <p className="mb-8 text-sm text-text-dim">اثنان وثلاثون حرفًا</p>
      ) : lessonTitle ? (
        <p className="mb-8 text-sm text-text-dim">{lessonTitle}</p>
      ) : (
        <div className="mb-8" />
      )}
      <GroupFilter current={current} />
      <LetterGrid letters={letters} />
    </div>
  );
}
