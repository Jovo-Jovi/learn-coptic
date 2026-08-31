"use client";

import { LayoutGroup, MotionConfig } from "motion/react";
import { SPRING } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <LayoutGroup>{children}</LayoutGroup>
    </MotionConfig>
  );
}
