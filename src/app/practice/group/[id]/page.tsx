import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MeaningPractice } from "@/components/MeaningPractice";
import { letterLessonTitle } from "@/lib/curriculum";
import { GROUP_DIGIT_AR, GROUP_IDS, parseGroupId } from "@/lib/letters";
import { lexiconForPractice, toWordCardModel } from "@/lib/words";

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUP_IDS.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/practice/group/[id]">): Promise<Metadata> {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) return { title: "التدريب" };
  return { title: `تدريب المجموعة ${GROUP_DIGIT_AR[group]}` };
}

export default async function PracticeGroupPage({
  params,
}: PageProps<"/practice/group/[id]">) {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) notFound();

  const words = lexiconForPractice(group).map(toWordCardModel);
  const title = letterLessonTitle(group);

  return (
    <article className="w-full min-w-0 py-8">
      <p className="mb-6">
        <Link
          href="/practice"
          className="inline-flex min-h-11 items-center text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          التدريب
        </Link>
      </p>
      <h1 className="text-2xl font-semibold text-text">
        تدريب المجموعة {GROUP_DIGIT_AR[group]}
      </h1>
      {title ? <p className="mt-2 text-sm text-text-dim">{title}</p> : null}
      <div className="mt-8">
        <MeaningPractice words={words} />
      </div>
    </article>
  );
}
