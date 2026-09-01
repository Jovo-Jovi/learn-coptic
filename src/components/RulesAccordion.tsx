import { FollowKeyRow, MixedCopticText } from "@/components/MixedCopticText";
import { CopticPaint } from "@/components/CopticPaint";
import type { Letter } from "@/data/schema";
import { getWordById } from "@/lib/words";

function rulesHeading(letter: Letter): string {
  if (letter.id === "vida") return "بيتا (ڤيتا)";
  if (letter.id === "gamma") return "غما";
  if (letter.id === "sou") return "سوو";
  return letter.name.ar;
}

export function RulesAccordion({ letter }: { letter: Letter }) {
  const rules = letter.rules;
  if (rules.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-center text-lg font-semibold text-text">
        {rulesHeading(letter)}
        {letter.id === "sou" ? " — رقم" : " - قواعد النطق"}
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
            {rule.examples.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-1">
                {rule.examples.map((wordId) => {
                  const word = getWordById(wordId);
                  if (!word) return null;
                  return (
                    <li key={wordId} className="text-sm text-text-dim">
                      <CopticPaint
                        unicode={word.coptic}
                        mapped={word.athanasiusKey}
                        className="text-base text-text"
                      />
                      {word.meaning?.ar ? (
                        <span> — {word.meaning.ar.split("،")[0].split("-")[0].trim()}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
