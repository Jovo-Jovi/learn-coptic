import type { Metadata } from "next";
import { AlphabetView } from "@/components/AlphabetView";
import { lettersInOrder } from "@/lib/letters";

export const metadata: Metadata = {
  title: "الحروف",
};

export default function AlphabetPage() {
  return <AlphabetView letters={lettersInOrder()} current="all" />;
}
