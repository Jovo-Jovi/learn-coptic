import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Smartphone, Volume2 } from "lucide-react";
import { GroupCard } from "@/components/GroupCard";
import { HeroGlyphs } from "@/components/HeroGlyphs";
import { letterLessonTitle } from "@/lib/curriculum";
import { GROUP_IDS, getLetterById, lettersInGroup } from "@/lib/letters";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: "تعلّم الحروف القبطية البحيرية",
  },
  description: "مجاناً، بالعربي، من موبايلك. من غير حساب.",
};

const HERO_LETTER_IDS = ["alpha", "shai", "ni", "gamma", "ti", "theta"] as const;

const WHAT_YOU_GET = [
  { icon: Volume2, text: "٣٢ حرف بالنطق الصحيح" },
  { icon: BookOpen, text: "كلمات وصلوات" },
  { icon: Smartphone, text: "يشتغل على الموبايل من غير تحميل" },
] as const;

export default function Home() {
  const heroLetters = HERO_LETTER_IDS.map((id) => getLetterById(id)).filter(
    (letter): letter is NonNullable<typeof letter> => letter != null,
  );

  return (
    <div className="relative w-full pb-12">
      <div className="landing-radials" aria-hidden="true" />

      <section className="relative overflow-x-clip pt-4 pb-8">
        <HeroGlyphs letters={heroLetters} />
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold text-text">
            تعلّم الحروف القبطية البحيرية
          </h1>
          <p className="mt-4 text-base text-text-dim">
            مجاناً، بالعربي، من موبايلك. من غير حساب.
          </p>
          <p className="mt-8">
            <Link
              href="/group/1"
              data-group="1"
              className={cn(
                "chip-fill inline-flex min-h-11 w-full items-center justify-center rounded-full px-6 text-base font-semibold no-underline sm:w-auto",
                "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
              )}
            >
              ابدأ من المجموعة الأولى
            </Link>
          </p>
          <p className="mt-4">
            <Link
              href="/alphabet"
              className="text-sm text-text-dim underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
            >
              تصفّح كل الحروف
            </Link>
          </p>
        </div>
        <div className="relative h-36" aria-hidden="true" />
      </section>

      <section className="relative z-10">
        <h2 className="mb-6 text-xl font-semibold text-text">المجموعات السبع</h2>
        <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {GROUP_IDS.map((group) => (
            <li key={group}>
              <GroupCard
                group={group}
                title={letterLessonTitle(group)}
                letters={lettersInGroup(group)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="relative z-10 mt-16">
        <ul className="flex flex-col gap-5">
          {WHAT_YOU_GET.map((item) => (
            <li key={item.text} className="flex items-start gap-3">
              <item.icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-text-dim" />
              <span className="text-base text-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="relative z-10 mt-16 border-t border-hairline pt-8 text-sm text-text-dim">
        <p>
          <Link
            href="/about"
            className="text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            عن الموقع
          </Link>
        </p>
        <p className="mt-3">
          النص{" "}
          <bdi dir="ltr">CC BY-SA 4.0</bdi>
          {" · "}
          الكود <bdi dir="ltr">MIT</bdi>
        </p>
        <p className="mt-3">
          <a
            href="https://github.com/Jovo-Jovi/learn-coptic"
            dir="ltr"
            className="inline-block text-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
