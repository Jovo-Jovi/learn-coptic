import type { Metadata } from "next";
import { VocabularyView } from "@/components/VocabularyView";
import { publishedWords, toWordCardModel } from "@/lib/words";

export const metadata: Metadata = {
  title: "الكلمات",
};

export default function VocabularyPage() {
  const words = publishedWords().map(toWordCardModel);
  return <VocabularyView words={words} current="all" />;
}
