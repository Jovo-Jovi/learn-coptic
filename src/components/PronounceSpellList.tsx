import { CopticPaint } from "@/components/CopticPaint";
import { MixedCopticText } from "@/components/MixedCopticText";
import { copticToAthanasiusKey, getLetterById } from "@/lib/letters";
import { getPronunciation } from "@/lib/pronunciation";
import { getWordById } from "@/lib/words";

export function PronounceSpellList({ letterId }: { letterId: string }) {
  const letter = getLetterById(letterId);
  if (!letter) return null;
  const glyph = letter.unicode.lower;
  const rows = getPronunciation().spellList.filter((row) =>
    row.coptic.includes(glyph),
  );
  if (rows.length === 0) return null;

  const coptic = rows.filter((row) => row.origin === "coptic");
  const greek = rows.filter((row) => row.origin === "greek");

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-center text-lg font-semibold text-text">
        قائمة خاصة
      </h2>
      <p className="mx-auto mb-4 max-w-prose text-center text-sm leading-relaxed text-text-dim">
        <MixedCopticText
          text="الست نهايات مش كافية لوحدها. الكلمات دي مخزّنة: قبطي كي كاف، يوناني شين أو خاء."
          currentLetterId={letterId}
        />
      </p>
      <SpellGroup title="قبطي" rows={coptic} />
      <SpellGroup title="يوناني" rows={greek} />
    </section>
  );
}

function SpellGroup({
  title,
  rows,
}: {
  title: string;
  rows: ReturnType<typeof getPronunciation>["spellList"];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-3">
      <h3 className="mb-2 text-center text-sm font-semibold text-text-dim">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const word = row.wordId ? getWordById(row.wordId) : undefined;
          const gloss = word?.meaning?.ar.split("،")[0]?.split("-")[0]?.trim();
          return (
            <li
              key={row.id}
              className="rounded-[20px] border border-hairline bg-surface px-4 py-3"
            >
              <p className="text-base text-text">
                <span dir="ltr" className="[unicode-bidi:isolate]">
                  <CopticPaint
                    unicode={row.coptic}
                    mapped={copticToAthanasiusKey(row.coptic)}
                    className="text-lg text-text"
                  />
                </span>
                {gloss ? (
                  <span className="text-text-dim"> — {gloss}</span>
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
