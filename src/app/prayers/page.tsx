import type { Metadata } from "next";
import Link from "next/link";
import { CopticPaint } from "@/components/CopticPaint";
import { copticToAthanasiusKey } from "@/lib/letters";
import { OCCASION_AR, getPrayers } from "@/lib/prayers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الصلوات",
};

export default function PrayersPage() {
  const prayers = getPrayers();

  return (
    <article className="w-full min-w-0 py-8">
      <h1 className="text-2xl font-semibold text-text">الصلوات</h1>
      <p className="mt-4 text-base text-text">
        قبطي بحيري، والمعنى بالعربي تحت كل سطر. من غير تسجيل دلوقتي.
      </p>
      <ul className="mt-8 flex flex-col gap-3">
        {prayers.map((prayer) => (
          <li key={prayer.id}>
            <Link
              href={`/prayers/${prayer.id}`}
              className={cn(
                "card-face flex flex-col gap-2 px-4 py-5 no-underline",
                "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
              )}
            >
              <span className="text-lg font-semibold text-text">
                {prayer.title.ar}
              </span>
              <CopticPaint
                unicode={prayer.titleCoptic}
                mapped={copticToAthanasiusKey(prayer.titleCoptic)}
                className="word-coptic text-2xl leading-none"
              />
              <span className="text-sm text-text-dim">
                {prayer.occasion.map((item) => OCCASION_AR[item]).join(" · ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
