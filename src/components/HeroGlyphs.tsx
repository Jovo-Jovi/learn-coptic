import type { Letter } from "@/data/schema";
import { CopticPaint } from "@/components/CopticPaint";

export function HeroGlyphs({ letters }: { letters: Letter[] }) {
  return (
    <div className="hero-glyphs" aria-hidden="true">
      {letters.map((letter) => (
        <span
          key={letter.id}
          data-group={letter.group}
          dir="ltr"
          className="glyph-float"
        >
          <span className="glyph-glass">
            <CopticPaint
              unicode={letter.unicode.lower}
              mapped={letter.athanasiusKey?.lower}
              className="glyph-fill"
            />
          </span>
        </span>
      ))}
    </div>
  );
}
