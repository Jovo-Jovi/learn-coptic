import { notFound } from "next/navigation";

const CHIPS = [
  { n: 1, box: "bg-group-1 text-group-1-fg", ratio: "4.90" },
  { n: 2, box: "bg-group-2 text-group-2-fg", ratio: "8.77" },
  { n: 3, box: "bg-group-3 text-group-3-fg", ratio: "7.40" },
  { n: 4, box: "bg-group-4 text-group-4-fg", ratio: "11.25" },
  { n: 5, box: "bg-group-5 text-group-5-fg", ratio: "12.31" },
  { n: 6, box: "bg-group-6 text-group-6-fg", ratio: "9.00" },
  { n: 7, box: "bg-group-7 text-group-7-fg", ratio: "13.63" },
] as const;

const SCALE = [
  { size: "xs", className: "text-xs", sample: "تسمية إنجليزية" },
  { size: "sm", className: "text-sm", sample: "سطر ثانوي" },
  { size: "base", className: "text-base", sample: "نص عربي للجسم" },
  { size: "lg", className: "text-lg", sample: "عنوان صغير" },
  { size: "xl", className: "text-xl", sample: "عنوان" },
  { size: "2xl", className: "text-2xl", sample: "عنوان كبير" },
  { size: "3xl", className: "text-3xl", sample: "عنوان أوضح" },
] as const;

export const metadata = {
  title: "S3 tokens (throwaway)",
  robots: { index: false, follow: false },
};

export default function S3Tokens() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div dir="rtl" lang="ar" className="mx-auto w-full max-w-[375px] bg-background p-4 text-foreground">
      <p className="mb-4 text-sm text-muted">صفحة مؤقتة للخطوط والألوان — احذفها في S4.</p>

      <section className="mb-8">
        <h1 className="mb-2 text-xl">المقياس</h1>
        <ul className="grid gap-2">
          {SCALE.map((row) => (
            <li key={row.size} className={row.className}>
              <span dir="ltr" className="ml-2 font-mono text-xs text-muted">
                {row.size}
              </span>
              {row.sample}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          <span dir="ltr" className="font-coptic text-glyph">
            Ⲁⲁ
          </span>
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl">ألوان المجموعات</h2>
        <ul className="grid gap-2">
          {CHIPS.map((chip) => (
            <li key={chip.n} className={`rounded-lg px-3 py-2 ${chip.box}`}>
              المجموعة {chip.n}
              <span dir="ltr" className="mr-2 font-mono text-xs">
                {chip.ratio}:1
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
