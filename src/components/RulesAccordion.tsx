import { FollowKeyRow, MixedCopticText } from "@/components/MixedCopticText";
import type { Letter } from "@/data/schema";

function rulesHeading(letter: Letter): string {
  if (letter.id === "vida") return "بيتا (ڤيتا)";
  if (letter.id === "gamma") return "غما";
  return letter.name.ar;
}

export function RulesAccordion({ letter }: { letter: Letter }) {
  const rules = letter.rules;
  if (rules.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-center text-lg font-semibold text-text">
        {rulesHeading(letter)}
        {" - "}
        قواعد النطق
      </h2>
      <ol className="flex flex-col gap-3">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className="rounded-[20px] border border-hairline bg-surface px-4 py-4"
          >
            <p className="text-base font-semibold leading-loose text-text">
              <MixedCopticText
                text={`${rule.result.ar}:`}
                currentLetterId={letter.id}
              />
            </p>
            <p className="mt-2 text-base leading-relaxed text-text">
              <MixedCopticText
                text={rule.condition.ar}
                currentLetterId={letter.id}
              />
            </p>
            {rule.follow ? (
              <FollowKeyRow
                follow={rule.follow}
                currentLetterId={letter.id}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
