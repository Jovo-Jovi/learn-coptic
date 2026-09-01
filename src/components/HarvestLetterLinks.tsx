import Link from "next/link";
import type { GroupId } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { lettersInGroup, easternDigits } from "@/lib/letters";
import { wordsTeaching } from "@/lib/words";
import { cn } from "@/lib/utils";

export function HarvestLetterLinks({ group }: { group: GroupId }) {
  const rows = lettersInGroup(group).map((letter) => ({
    letter,
    count: wordsTeaching(letter.id).filter((word) => !word.translit.ar).length,
  }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (total === 0) return null;

  return (
    <section className="mt-2 pb-8">
      <h2 className="mb-2 text-lg text-text">باقي القاموس</h2>
      <p className="mb-6 text-sm text-text-dim">
        {easternDigits(total)} كلمة من قاموس أندرياس — من غير نطق عربي لسه.
        افتح الحرف.
      </p>
      <ul className="flex flex-wrap gap-2">
        {rows.map(({ letter, count }) => (
          <li key={letter.id} data-group={letter.group}>
            <Link
              href={`/vocabulary/letter/${letter.id}`}
              className={cn(
                "chip-fill inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm no-underline",
                "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
              )}
            >
              <CopticPaint
                unicode={letter.unicode.lower}
                mapped={letter.athanasiusKey?.lower ?? null}
                className="inline-block"
              />
              <span>{easternDigits(count)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
