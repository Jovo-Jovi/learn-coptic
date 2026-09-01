import Link from "next/link";
import { VocabularyFilter } from "@/components/VocabularyFilter";
import { letterLessonTitle } from "@/lib/curriculum";
import { GROUP_DIGIT_AR, GROUP_IDS, easternDigits } from "@/lib/letters";
import type { GroupId } from "@/data/schema";
import { cn } from "@/lib/utils";

export function VocabularyHome({
  total,
  byGroup,
  drills,
}: {
  total: number;
  byGroup: Record<GroupId, number>;
  drills: number;
}) {
  return (
    <div className="w-full min-w-0 py-8">
      <h1 className="mb-2 text-2xl text-text">الكلمات</h1>
      <p className="mb-4 text-sm text-text-dim">
        {easternDigits(total)} كلمة — اختار مجموعة عشان الصفحة تفضل خفيفة على
        الموبايل.
      </p>
      <p className="mb-8">
        <Link
          href="/search"
          className={cn(
            "flex min-h-11 w-full items-center rounded-full border border-hairline bg-surface-2 px-4 text-base text-text-dim no-underline",
            "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
          )}
        >
          دور بالعربي — طلع القبطي
        </Link>
      </p>
      <VocabularyFilter current="all" />
      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {GROUP_IDS.map((group) => {
          const title = letterLessonTitle(group);
          return (
            <li key={group} data-group={group}>
              <Link
                href={`/vocabulary/group/${group}`}
                className={cn(
                  "card-face relative flex min-h-11 flex-col gap-2 overflow-hidden p-5 no-underline",
                  "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                )}
              >
                <span className="group-wash" aria-hidden="true" />
                <span className="relative z-10 chip-fill inline-flex min-h-6 w-fit items-center rounded-full px-2.5 text-sm font-semibold leading-none">
                  {GROUP_DIGIT_AR[group]}
                </span>
                {title ? (
                  <span className="relative z-10 text-base font-semibold text-text">
                    {title}
                  </span>
                ) : null}
                <span className="relative z-10 text-sm text-text-dim">
                  {easternDigits(byGroup[group])} كلمة
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {drills > 0 ? (
        <p className="mt-8">
          <Link
            href="/practice"
            className="inline-flex min-h-11 items-center text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            تمارين القراءة — {easternDigits(drills)}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
