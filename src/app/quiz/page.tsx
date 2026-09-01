import type { Metadata } from "next";
import Link from "next/link";
import { QuizSession } from "@/components/QuizSession";
import { lettersInOrder } from "@/lib/letters";
import { teachingWords } from "@/lib/words";

export const metadata: Metadata = {
  title: "الكويز",
};

export default function QuizPage() {
  const letters = lettersInOrder().map((letter) => ({
    id: letter.id,
    glyph: letter.unicode.lower,
    mapped: letter.athanasiusKey?.lower ?? null,
    nameAr: letter.name.ar,
    hintAr: letter.sound.arabicHint.join("، "),
    audioSrc: letter.audio?.src ?? null,
    group: letter.group,
  }));
  const words = teachingWords().flatMap((word) => {
    const meaningAr = word.meaning?.ar;
    if (!meaningAr) return [];
    return [
      {
        id: word.id,
        coptic: word.coptic,
        mapped: word.athanasiusKey,
        meaningAr,
        group: word.group,
      },
    ];
  });

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
      <h1 className="text-2xl font-semibold text-text">الكويز</h1>
      <p className="mt-4 text-base text-text-dim">
        اختار الإجابة. كل حصة ١٥ سؤال، وبعدين تقف. الغلط بيرجّع الكرت
        للصندوق الأول.
      </p>
      <div className="mt-8">
        <QuizSession letters={letters} words={words} />
      </div>
    </article>
  );
}
