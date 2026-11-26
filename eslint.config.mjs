import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // DEV_OS's method files: checked by the engine, never changed by a product task.
    "scripts/devos/**",
    "scripts/guards/**",
    "devos/**",
    ".devos/**",
    ".cursor/**",
  ]),
  // These four files are the adoption baseline; the rule stays an error in every other file.
  {
    files: [
      "src/components/FontSelect.tsx",
      "src/components/MeaningPractice.tsx",
      "src/components/QuizSession.tsx",
      "src/components/ThemeToggle.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
