import type { Letter } from "@/data/schema";

export function DeveloperMeta({ letter }: { letter: Letter }) {
  const key = letter.athanasiusKey
    ? `${letter.athanasiusKey.upper} / ${letter.athanasiusKey.lower}`
    : "—";
  const numeric =
    letter.numericValue === null ? "—" : String(letter.numericValue);

  return (
    <details className="mt-8 rounded-[20px] border border-hairline bg-surface px-4 py-1">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-text focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:outline-none">
        للمطورين
      </summary>
      <dl className="grid gap-3 pb-4 text-sm">
        <div>
          <dt className="text-text-dim">النطق بالعربية</dt>
          <dd>{letter.sound.arabicHint.join("، ")}</dd>
        </div>
        <div>
          <dt className="text-text-dim">القيمة العددية</dt>
          <dd dir="ltr" className="inline-block">
            {numeric}
          </dd>
        </div>
        <div>
          <dt className="text-text-dim">مفتاح Athanasius</dt>
          <dd dir="ltr" className="inline-block font-sans">
            {key}
          </dd>
        </div>
      </dl>
    </details>
  );
}
