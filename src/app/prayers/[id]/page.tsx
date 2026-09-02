import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopticPaint } from "@/components/CopticPaint";
import { PrayerLines } from "@/components/PrayerLines";
import { copticToAthanasiusKey } from "@/lib/letters";
import { OCCASION_AR, getPrayerById, getPrayers } from "@/lib/prayers";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPrayers().map((prayer) => ({ id: prayer.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/prayers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const prayer = getPrayerById(id);
  if (!prayer) return { title: "صلاة" };
  return { title: prayer.title.ar };
}

export default async function PrayerPage({
  params,
}: PageProps<"/prayers/[id]">) {
  const { id } = await params;
  const prayer = getPrayerById(id);
  if (!prayer) notFound();

  return (
    <article className="mx-auto w-full max-w-2xl py-8">
      <p className="mb-6">
        <Link
          href="/prayers"
          className="inline-flex min-h-11 items-center text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          الصلوات
        </Link>
      </p>
      <h1 className="text-2xl font-semibold text-text">{prayer.title.ar}</h1>
      <p className="mt-4">
        <CopticPaint
          unicode={prayer.titleCoptic}
          mapped={copticToAthanasiusKey(prayer.titleCoptic)}
          className="word-coptic text-3xl leading-none"
        />
      </p>
      <p className="mt-4 text-sm text-text-dim">
        {prayer.occasion.map((item) => OCCASION_AR[item]).join(" · ")}
      </p>
      <p className="mt-4 text-sm text-text-dim">
        اضغط على الكلمة القبطي. اللي تقابلها في العربي تتعلم في نفس السطر.
        تحتها المعنى والنطق من القواعد المخزّنة.
      </p>
      <PrayerLines prayer={prayer} />
      {prayer.source ? (
        <p className="mt-10 text-sm text-text-dim">
          المصدر: {prayer.source.name}
          {prayer.source.url ? (
            <>
              {" · "}
              <a
                href={prayer.source.url}
                dir="ltr"
                className={cn(
                  "inline-block text-text underline-offset-4 hover:underline",
                  "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
                )}
              >
                {prayer.source.url}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </article>
  );
}
