import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VocabularyView } from "@/components/VocabularyView";
import { GROUP_DIGIT_AR, GROUP_IDS, parseGroupId } from "@/lib/letters";
import { toWordCardModel, wordsInGroup } from "@/lib/words";

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUP_IDS.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/vocabulary/group/[id]">): Promise<Metadata> {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) return { title: "كلمات" };
  return { title: `كلمات المجموعة ${GROUP_DIGIT_AR[group]}` };
}

export default async function VocabularyGroupPage({
  params,
}: PageProps<"/vocabulary/group/[id]">) {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) notFound();

  const words = wordsInGroup(group).map(toWordCardModel);
  return <VocabularyView words={words} current={group} />;
}
