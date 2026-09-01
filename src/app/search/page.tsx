import type { Metadata } from "next";
import { WordSearch } from "@/components/WordSearch";

export const metadata: Metadata = {
  title: "بحث",
};

export default function SearchPage() {
  return (
    <article className="w-full min-w-0 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-text">بحث</h1>
      <WordSearch />
    </article>
  );
}
