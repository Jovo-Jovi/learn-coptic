import Link from "next/link";
import type { GroupId, Letter } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { GROUP_DIGIT_AR, easternDigits } from "@/lib/letters";
import { cn } from "@/lib/utils";

export function GroupCard({
  group,
  title,
  letters,
}: {
  group: GroupId;
  title: string | null;
  letters: Letter[];
}) {
  return (
    <div data-group={group} className="group/card relative overflow-hidden rounded-[24px]">
      <div className="glow-blob" aria-hidden="true" />
      <Link
        href={`/group/${group}`}
        className={cn(
          "card-face relative z-10 flex flex-col gap-3 overflow-hidden p-5 no-underline lg:p-7",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        )}
      >
        <span className="group-wash" aria-hidden="true" />
        <span className="relative z-10 flex flex-col gap-3">
          <span className="chip-fill inline-flex min-h-6 w-fit items-center justify-center rounded-full px-2.5 text-sm font-semibold leading-none">
            {GROUP_DIGIT_AR[group]}
          </span>
          {title ? <span className="text-base font-semibold text-text">{title}</span> : null}
          <span className="text-sm text-text-dim">{easternDigits(letters.length)} حروف</span>
          <span dir="ltr" className="flex flex-wrap gap-x-2 gap-y-1">
            {letters.map((letter) => (
              <CopticPaint
                key={letter.id}
                unicode={letter.unicode.lower}
                mapped={letter.athanasiusKey?.lower}
                className="glyph-fill inline-block text-2xl leading-none"
              />
            ))}
          </span>
        </span>
      </Link>
    </div>
  );
}
