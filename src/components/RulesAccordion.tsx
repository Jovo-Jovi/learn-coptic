import { MixedCopticText } from "@/components/MixedCopticText";
import { easternDigits } from "@/lib/letters";
import type { Letter } from "@/data/schema";

type Rule = Letter["rules"][number];

export function RulesAccordion({
  rules,
  letterId,
}: {
  rules: Rule[];
  letterId: string;
}) {
  if (rules.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg text-text">قواعد النطق</h2>
      <ol className="flex flex-col gap-3">
        {rules.map((rule, index) => (
          <li
            key={rule.id}
            className="rounded-[20px] border border-hairline bg-surface px-4 py-4"
          >
            <p className="flex flex-wrap items-center gap-x-2 gap-y-2 text-base font-medium text-text">
              <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-surface-2 text-sm text-text-dim">
                {easternDigits(index + 1)}
              </span>
              <span className="min-w-0 leading-loose">
                <MixedCopticText
                  text={rule.condition.ar}
                  currentLetterId={letterId}
                />
              </span>
            </p>
            <p className="mt-3 text-base leading-relaxed text-text">
              <MixedCopticText
                text={rule.result.ar}
                currentLetterId={letterId}
              />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
