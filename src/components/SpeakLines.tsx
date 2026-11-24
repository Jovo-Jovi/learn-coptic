import { CopticPaint } from "@/components/CopticPaint";
import { copticToAthanasiusKey } from "@/lib/letters";
import type { LearnerSpeak } from "@/lib/pronounce";
import { cn } from "@/lib/utils";

export function SpeakLines({
  speak,
  showText = true,
  align = "start",
}: {
  speak: LearnerSpeak;
  showText?: boolean;
  align?: "start" | "center";
}) {
  if (!speak.text && speak.notes.length === 0) return null;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-1",
        align === "center" && "items-center text-center",
      )}
    >
      {showText && speak.text ? (
        <p className="text-sm text-text-dim">النطق: {speak.text}</p>
      ) : null}
      {speak.notes.length > 0 ? (
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {speak.notes.map((note, index) => (
            <li
              key={`${note.coptic}-${note.noteAr}-${index}`}
              className="flex items-baseline gap-1 text-sm text-text-dim"
            >
              <span dir="ltr" className="[unicode-bidi:isolate]">
                <CopticPaint
                  unicode={note.coptic}
                  mapped={copticToAthanasiusKey(note.coptic)}
                />
              </span>
              <span>{note.noteAr}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
