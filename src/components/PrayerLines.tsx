import type { Prayer } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";
import { copticToAthanasiusKey } from "@/lib/letters";

const ROLE_AR: Record<Prayer["lines"][number]["role"], string | null> = {
  priest: "الكاهن",
  deacon: "الشماس",
  congregation: "الشعب",
  narration: null,
  none: null,
};

export function PrayerLines({ prayer }: { prayer: Prayer }) {
  return (
    <ol className="mt-8 flex list-none flex-col gap-6 p-0">
      {prayer.lines.map((line) => {
        const role = ROLE_AR[line.role];
        return (
          <li key={line.id} className="card-face px-4 py-5">
            {role ? (
              <p className="mb-3 text-xs font-semibold text-text-dim">{role}</p>
            ) : null}
            <CopticPaint
              unicode={line.coptic}
              mapped={copticToAthanasiusKey(line.coptic)}
              className="word-coptic text-[1.65rem] leading-snug"
            />
            {line.translit.ar ? (
              <p className="mt-3 text-sm text-text-dim">{line.translit.ar}</p>
            ) : null}
            <p className="mt-3 text-base text-text">{line.translation.ar}</p>
            {line.translation.en ? (
              <p className="mt-1 text-sm text-text-dim" dir="ltr">
                {line.translation.en}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
