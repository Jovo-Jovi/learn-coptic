import type { Metadata } from "next";
import Link from "next/link";
import { WordGrid } from "@/components/WordGrid";
import { GROUP_DIGIT_AR, GROUP_IDS } from "@/lib/letters";
import { publishedDrills, toWordCardModel } from "@/lib/words";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "التدريب",
};

export default function PracticePage() {
  const drills = publishedDrills().map(toWordCardModel);

  return (
    <article className="w-full min-w-0 py-8">
      <h1 className="text-2xl font-semibold text-text">التدريب</h1>
      <p className="mt-4 text-base text-text">
        اقرأ الكلمات دي بصوت عالي. مش قاموس — تمرين نطق.
      </p>

      {drills.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-lg text-text">تمرين قراءة</h2>
          <WordGrid words={drills} />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="mb-2 text-lg text-text">تمرين المعنى</h2>
        <p className="mb-6 text-sm text-text-dim">
          كلمة قبطي، وبعدين المعنى بالعربي. اختار مجموعة.
        </p>
        <ul className="flex flex-wrap gap-2">
          {GROUP_IDS.map((group) => (
            <li key={group} data-group={group}>
              <Link
                href={`/practice/group/${group}`}
                className={cn(
                  "chip-fill inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm no-underline",
                  "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                )}
              >
                <span className="sr-only">المجموعة </span>
                {GROUP_DIGIT_AR[group]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-text-dim">
        الكويز اللي بيفتكرك لسه جاي. دلوقتي المعنى من غير حفظ على الجهاز.
      </p>
    </article>
  );
}
