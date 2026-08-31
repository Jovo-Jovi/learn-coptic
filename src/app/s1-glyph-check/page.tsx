import { Noto_Sans_Coptic } from "next/font/google";
import { notFound } from "next/navigation";
import { LettersFile } from "@/data/schema";
import raw from "@/data/json/letters.json";

/** THROWAY S1 — delete at S4. Hidden in production builds. */
const notoCoptic = Noto_Sans_Coptic({
  weight: "400",
  subsets: ["coptic"],
  display: "swap",
});

export const metadata = {
  title: "S1 glyph check (throwaway)",
  robots: { index: false, follow: false },
};

function cp(ch: string) {
  return [...ch].map((c) => "U+" + c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")).join(" ");
}

export default function S1GlyphCheck() {
  if (process.env.NODE_ENV === "production") notFound();

  const { letters } = LettersFile.parse(raw);
  return (
    <div dir="rtl" lang="ar" className="mx-auto max-w-lg bg-white p-4 text-zinc-900">
      <p className="mb-4 text-sm text-zinc-600">
        صفحة مؤقتة لمراجعة الحروف — احذفها بعد بوابة S1.
      </p>
      <ol className="grid gap-3">
        {letters.map((l) => (
          <li key={l.id} className="flex items-center gap-4 border-b border-zinc-200 pb-3">
            <span
              dir="ltr"
              className={`inline-block text-5xl leading-none ${notoCoptic.className}`}
            >
              {l.unicode.upper} {l.unicode.lower}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg">{l.name.arDisplay ?? l.name.ar}</span>
              <span dir="ltr" className="block font-mono text-xs text-zinc-500">
                {l.id} · {cp(l.unicode.upper)} / {cp(l.unicode.lower)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
