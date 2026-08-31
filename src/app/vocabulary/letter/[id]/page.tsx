import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VocabularyView } from "@/components/VocabularyView";
import { getLetterById, getLetters } from "@/lib/letters";
import { toWordCardModel, wordsTeaching } from "@/lib/words";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLetters().map((letter) => ({ id: letter.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/vocabulary/letter/[id]">): Promise<Metadata> {
  const { id } = await params;
  const letter = getLetterById(id);
  if (!letter) return { title: "كلمات" };
  const name = letter.name.arDisplay ?? letter.name.ar;
  return { title: `كلمات حرف ${name}` };
}

export default async function VocabularyLetterPage({
  params,
}: PageProps<"/vocabulary/letter/[id]">) {
  const { id } = await params;
  const letter = getLetterById(id);
  if (!letter) notFound();

  const words = wordsTeaching(letter.id).map(toWordCardModel);
  const name = letter.name.arDisplay ?? letter.name.ar;
  return <VocabularyView words={words} current="letter" letterName={name} />;
}
