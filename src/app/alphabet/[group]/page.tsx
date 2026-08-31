import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlphabetView } from "@/components/AlphabetView";
import { GROUP_IDS, lettersInGroup, parseGroupId } from "@/lib/letters";

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUP_IDS.map((id) => ({ group: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/alphabet/[group]">): Promise<Metadata> {
  const { group: raw } = await params;
  const group = parseGroupId(raw);
  if (!group) return { title: "مجموعة" };
  return { title: `المجموعة ${group}` };
}

export default async function AlphabetGroupPage({
  params,
}: PageProps<"/alphabet/[group]">) {
  const { group: raw } = await params;
  const group = parseGroupId(raw);
  if (!group) notFound();

  return <AlphabetView letters={lettersInGroup(group)} current={group} />;
}
