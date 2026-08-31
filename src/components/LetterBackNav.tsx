"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function LetterBackNav({
  groupHref,
  groupLabel,
}: {
  groupHref: string;
  groupLabel: string;
}) {
  const router = useRouter();

  return (
    <nav
      aria-label="رجوع"
      className="relative z-10 mb-6 flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        onClick={() => router.back()}
        className={cn(
          "inline-flex min-h-11 items-center rounded-full border border-hairline bg-surface-2 px-4 text-sm text-text",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none",
        )}
      >
        رجوع
      </button>
      <Link
        href="/alphabet"
        className={cn(
          "inline-flex min-h-11 items-center rounded-full px-4 text-sm text-text-dim no-underline",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        الحروف
      </Link>
      <Link
        href={groupHref}
        className={cn(
          "inline-flex min-h-11 items-center rounded-full px-4 text-sm text-text-dim no-underline",
          "focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        )}
      >
        {groupLabel}
      </Link>
    </nav>
  );
}
