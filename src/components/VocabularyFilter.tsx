"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { GroupId } from "@/data/schema";
import { GROUP_DIGIT_AR, GROUP_IDS } from "@/lib/letters";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CHIP =
  "relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm no-underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none";

export function VocabularyFilter({
  current,
}: {
  current: GroupId | "all" | "letter";
}) {
  return (
    <nav aria-label="تصفية الكلمات" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/vocabulary"
            aria-current={current === "all" ? "page" : undefined}
            className={cn(
              CHIP,
              "bg-surface-2 text-text",
              current === "all" && "text-bg",
            )}
          >
            {current === "all" ? (
              <motion.span
                layoutId="vocab-filter-active"
                className="absolute inset-0 rounded-full bg-text"
                transition={SPRING}
              />
            ) : null}
            <span className="relative z-10">الكل</span>
          </Link>
        </li>
        {GROUP_IDS.map((id) => {
          const active = current === id;
          return (
            <li key={id} data-group={id}>
              <Link
                href={`/vocabulary/group/${id}`}
                aria-current={active ? "page" : undefined}
                className={cn(CHIP, "bg-surface-2 text-text", active && "chip-fill")}
              >
                {active ? (
                  <motion.span
                    layoutId="vocab-filter-active"
                    className="chip-fill absolute inset-0 rounded-full"
                    transition={SPRING}
                  />
                ) : null}
                <span className="relative z-10">
                  <span className="sr-only">المجموعة </span>
                  {GROUP_DIGIT_AR[id]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
