import Link from "next/link";
import type { ReactNode } from "react";
import { CopticPaint } from "@/components/CopticPaint";
import { getLetterByGlyph } from "@/lib/letters";

function mappedForGlyph(ch: string): string | null {
  const letter = getLetterByGlyph(ch);
  if (!letter?.athanasiusKey) return null;
  return ch === letter.unicode.upper
    ? letter.athanasiusKey.upper
    : letter.athanasiusKey.lower;
}

function CopticChip({
  ch,
  currentLetterId,
}: {
  ch: string;
  currentLetterId?: string;
}) {
  const letter = getLetterByGlyph(ch);
  const paint = (
    <CopticPaint
      unicode={ch}
      mapped={mappedForGlyph(ch)}
      className="text-[1.65rem] leading-none"
    />
  );
  const className =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[14px] bg-surface-2 px-2 no-underline";

  if (letter && letter.id !== currentLetterId) {
    return (
      <Link
        href={`/letter/${letter.id}`}
        aria-label={letter.name.ar}
        className={`${className} focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
      >
        {paint}
      </Link>
    );
  }

  return <span className={className}>{paint}</span>;
}

type Piece =
  | { kind: "text"; value: string }
  | { kind: "coptic"; value: string }
  | { kind: "latin"; value: string };

function pieces(text: string): Piece[] {
  const token = /[\u2C80-\u2CFF\u03E2-\u03EF]|\([^)]+\)/gu;
  const out: Piece[] = [];
  let last = 0;
  for (const match of text.matchAll(token)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > last) {
      out.push({ kind: "text", value: text.slice(last, index) });
    }
    out.push(
      value.startsWith("(")
        ? { kind: "latin", value }
        : { kind: "coptic", value },
    );
    last = index + value.length;
  }
  if (last < text.length) {
    out.push({ kind: "text", value: text.slice(last) });
  }
  return out;
}

function renderPieces(list: Piece[], currentLetterId?: string) {
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < list.length) {
    const piece = list[i];
    if (piece.kind === "coptic") {
      const chips: Piece[] = [];
      while (i < list.length) {
        const next = list[i];
        if (next.kind === "coptic") {
          chips.push(next);
          i += 1;
          continue;
        }
        if (next.kind === "text" && next.value.trim() === "") {
          i += 1;
          continue;
        }
        break;
      }
      nodes.push(
        <span
          key={`run-${nodes.length}`}
          dir="ltr"
          className="mx-1 inline-flex flex-wrap items-center gap-1 align-middle"
        >
          {chips.map((chip, chipIndex) => (
            <CopticChip
              key={`${chip.value}-${chipIndex}`}
              ch={chip.value}
              currentLetterId={currentLetterId}
            />
          ))}
        </span>,
      );
      continue;
    }
    if (piece.kind === "latin") {
      nodes.push(
        <span key={`latin-${i}`} dir="ltr" className="inline-block">
          {piece.value}
        </span>,
      );
      i += 1;
      continue;
    }
    nodes.push(<span key={`text-${i}`}>{piece.value}</span>);
    i += 1;
  }
  return nodes;
}

/** Isolate Coptic (and Latin in parentheses) inside Arabic rule copy. */
export function MixedCopticText({
  text,
  currentLetterId,
}: {
  text: string;
  currentLetterId?: string;
}) {
  return <>{renderPieces(pieces(text), currentLetterId)}</>;
}
