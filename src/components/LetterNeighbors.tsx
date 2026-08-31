import Link from "next/link";
import { CopticPaint } from "@/components/CopticPaint";
import type { Letter } from "@/data/schema";
import { cn } from "@/lib/utils";

export function LetterNeighbors({
  prev,
  next,
  ariaLabel = "الحرف السابق والتالي",
}: {
  prev: Letter | null;
  next: Letter | null;
  ariaLabel?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="mt-8 flex justify-between gap-3"
    >
      {prev ? (
        <Link
          href={`/letter/${prev.id}`}
          className={cn(
            "flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-[20px] border border-hairline bg-surface px-3 py-3 no-underline",
            "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
        >
          <CopticPaint
            unicode={prev.unicode.lower}
            mapped={prev.athanasiusKey?.lower}
            className="text-2xl leading-none"
          />
          <span className="min-w-0">
            <span className="block text-xs text-text-dim">السابق</span>
            <span className="block truncate text-sm text-text">{prev.name.ar}</span>
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/letter/${next.id}`}
          className={cn(
            "flex min-h-11 min-w-0 flex-1 items-center justify-end gap-3 rounded-[20px] border border-hairline bg-surface px-3 py-3 text-end no-underline",
            "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
        >
          <span className="min-w-0">
            <span className="block text-xs text-text-dim">التالي</span>
            <span className="block truncate text-sm text-text">{next.name.ar}</span>
          </span>
          <CopticPaint
            unicode={next.unicode.lower}
            mapped={next.athanasiusKey?.lower}
            className="text-2xl leading-none"
          />
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
