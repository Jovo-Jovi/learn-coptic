import Link from "next/link";
import { WordGrid } from "@/components/WordGrid";
import { easternDigits } from "@/lib/letters";
import { toWordCardModel, type WordCardModel } from "@/lib/words";
import type { Word } from "@/data/schema";

export function ExampleWords({
  letterId,
  shown,
  total,
}: {
  letterId: string;
  shown: Word[];
  total: number;
}) {
  if (total === 0) return null;

  const models: WordCardModel[] = shown.map(toWordCardModel);
  const remaining = total - shown.length;

  return (
    <section className="mt-8 min-w-0">
      <h2 className="mb-4 text-lg text-text">كلمات</h2>
      <WordGrid words={models} />
      {remaining > 0 ? (
        <p className="mt-4 text-center">
          <Link
            href={`/vocabulary/letter/${letterId}`}
            className="inline-flex min-h-11 items-center text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            باقي الكلمات — {easternDigits(remaining)} كمان
          </Link>
        </p>
      ) : (
        <p className="mt-4 text-center">
          <Link
            href={`/vocabulary/letter/${letterId}`}
            className="inline-flex min-h-11 items-center text-sm text-text-dim underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            كل الكلمات اللي بتعلّم الحرف ده
          </Link>
        </p>
      )}
    </section>
  );
}
