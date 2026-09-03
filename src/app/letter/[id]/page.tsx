import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeveloperMeta } from "@/components/DeveloperMeta";
import { ExampleWords } from "@/components/ExampleWords";
import { LetterBackNav } from "@/components/LetterBackNav";
import { LetterHero } from "@/components/LetterHero";
import { LetterNeighbors } from "@/components/LetterNeighbors";
import { RulesAccordion } from "@/components/RulesAccordion";
import { PronounceSpellList } from "@/components/PronounceSpellList";
import { MixedCopticText } from "@/components/MixedCopticText";
import {
  GROUP_DIGIT_AR,
  getLetterById,
  getLetters,
  neighborsByOrder,
} from "@/lib/letters";
import { exampleWordsForLetter } from "@/lib/words";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLetters().map((letter) => ({ id: letter.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/letter/[id]">): Promise<Metadata> {
  const { id } = await params;
  const letter = getLetterById(id);
  if (!letter) return { title: "حرف" };
  return { title: letter.name.arDisplay ?? letter.name.ar };
}

export default async function LetterPage({ params }: PageProps<"/letter/[id]">) {
  const { id } = await params;
  const letter = getLetterById(id);
  if (!letter) notFound();

  const name = letter.name.arDisplay ?? letter.name.ar;
  const { prev, next } = neighborsByOrder(letter.id);
  const examples = exampleWordsForLetter(letter.id, 6);

  return (
    <article className="w-full min-w-0 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <LetterBackNav
          groupHref={`/alphabet/${letter.group}`}
          groupLabel={`المجموعة ${GROUP_DIGIT_AR[letter.group]}`}
        />
        <LetterHero letter={letter} />

        <h1 className="relative z-10 text-center text-2xl text-text">{name}</h1>
        <p className="relative z-10 mt-2 text-center text-base text-text-dim">
          {letter.sound.arabicHint.join("، ")}
        </p>
        {letter.sound.note ? (
          <p className="relative z-10 mx-auto mt-4 max-w-prose text-center text-sm leading-relaxed text-text-dim">
            <MixedCopticText
              text={letter.sound.note.ar}
              currentLetterId={letter.id}
            />
          </p>
        ) : null}

        <p className="relative z-10 mt-8 text-center" data-group={letter.group}>
          <Link
            href={`/group/${letter.group}`}
            className={cn(
              "chip-fill inline-flex min-h-11 items-center rounded-full px-4 text-sm no-underline",
              "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            )}
          >
            المجموعة {GROUP_DIGIT_AR[letter.group]}
          </Link>
        </p>

        <RulesAccordion letter={letter} />

        <PronounceSpellList letterId={letter.id} />

        <LetterNeighbors prev={prev} next={next} />
      </div>

      <ExampleWords
        letterId={letter.id}
        shown={examples.shown}
        total={examples.total}
      />

      <div className="mx-auto w-full max-w-2xl">
        <DeveloperMeta letter={letter} />
        {examples.total > 0 ? (
          <LetterNeighbors
            prev={prev}
            next={next}
            ariaLabel="الحرف السابق والتالي — نهاية الصفحة"
          />
        ) : null}
      </div>
    </article>
  );
}
