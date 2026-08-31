import { cache } from "react";
import { CurriculumFile, type GroupId, type Lesson } from "@/data/schema";
import raw from "@/data/json/curriculum.json";

export const getCurriculum = cache(() => CurriculumFile.parse(raw));

/** Level 1 `kind: "letters"` lesson whose `order` is the home group 1–7. */
export function letterLessonForGroup(group: GroupId): Lesson | null {
  const level1 = getCurriculum().levels.find((level) => level.order === 1);
  if (!level1) return null;
  return (
    level1.lessons.find(
      (lesson) => lesson.kind === "letters" && lesson.order === group,
    ) ?? null
  );
}

export function letterLessonTitle(group: GroupId): string | null {
  return letterLessonForGroup(group)?.title.ar ?? null;
}
