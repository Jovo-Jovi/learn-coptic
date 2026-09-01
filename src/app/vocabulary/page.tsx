import type { Metadata } from "next";
import { VocabularyHome } from "@/components/VocabularyHome";
import {
  countByKind,
  countPublishedByGroup,
  publishedWords,
} from "@/lib/words";

export const metadata: Metadata = {
  title: "الكلمات",
};

export default function VocabularyPage() {
  const words = publishedWords();
  const kinds = countByKind(words);
  return (
    <VocabularyHome
      total={words.length}
      byGroup={countPublishedByGroup()}
      drills={kinds.drill}
    />
  );
}
