import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlphabetView } from "@/components/AlphabetView";
import { GROUP_IDS, lettersInGroup, parseGroupId } from "@/lib/letters";

export const dynamicParams = false;

export function generateStaticParams() {
  return GROUP_IDS.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/group/[id]">): Promise<Metadata> {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) return { title: "مجموعة" };
  return { title: `المجموعة ${group}` };
}

export default async function GroupPage({ params }: PageProps<"/group/[id]">) {
  const { id } = await params;
  const group = parseGroupId(id);
  if (!group) notFound();

  return <AlphabetView letters={lettersInGroup(group)} current={group} />;
}
