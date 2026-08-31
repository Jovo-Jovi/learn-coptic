"use client";

import { motion } from "motion/react";
import type { Letter } from "@/data/schema";
import { LetterCard } from "@/components/LetterCard";
import { SPRING } from "@/lib/motion";

export function LetterGrid({ letters }: { letters: Letter[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {letters.map((letter, index) => (
        <motion.li
          key={letter.id}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: index * 0.03 }}
        >
          <LetterCard letter={letter} />
        </motion.li>
      ))}
    </ul>
  );
}
