import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "التدريب",
};

export default function PracticePage() {
  return (
    <article className="mx-auto w-full max-w-3xl py-8">
      <h1 className="text-2xl font-semibold text-text">التدريب</h1>
      <p className="mt-4 text-base text-text">
        التدريب لسه مش جاهز. هيجي كويز صغير يفتكرك على الموبايل.
      </p>
      <p className="mt-4 text-base text-text-dim">
        دلوقتي ابدأ من الحروف.
      </p>
      <p className="mt-8">
        <Link
          href="/alphabet"
          className="text-sm text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          الحروف
        </Link>
      </p>
    </article>
  );
}
