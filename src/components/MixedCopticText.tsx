import Link from "next/link";
import type { ReactNode } from "react";
import { CopticPaint } from "@/components/CopticPaint";
import {
  getLetterByAthanasiusKey,
  getLetterByGlyph,
} from "@/lib/letters";

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
  variant = "chip",
}: {
  ch: string;
  currentLetterId?: string;
  variant?: "chip" | "inline";
}) {
  const letter = getLetterByGlyph(ch);
  const paint = (
    <CopticPaint
      unicode={ch}
      mapped={mappedForGlyph(ch)}
      className={
        variant === "inline"
          ? "text-[1.2em] leading-none"
          : "text-[1.65rem] leading-none"
      }
    />
  );
  if (variant === "inline") {
    return (
      <span dir="ltr" className="inline-block align-middle">
        {paint}
      </span>
    );
  }
  const className =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-[14px] bg-surface-2 no-underline";

  if (letter && letter.id !== currentLetterId) {
    return (
      <Link
        href={`/letter/${letter.id}`}
        aria-label={letter.name.ar}
        className={`${className} px-2 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
      >
        {paint}
      </Link>
    );
  }

  return <span className={`${className} px-2`}>{paint}</span>;
}

function glyphForKey(key: string): string | null {
  const letter = getLetterByAthanasiusKey(key);
  return letter?.unicode.lower ?? null;
}

function KeyChip({
  token,
  currentLetterId,
}: {
  token: string;
  currentLetterId?: string;
}) {
  if (token === "OU") {
    const o = glyphForKey("O");
    const u = glyphForKey("U");
    if (o && u) {
      return (
        <span dir="ltr" className="inline-flex items-center gap-0.5">
          <CopticChip ch={o} currentLetterId={currentLetterId} />
          <CopticChip ch={u} currentLetterId={currentLetterId} />
        </span>
      );
    }
  }
  const glyph = glyphForKey(token);
  if (glyph) {
    return <CopticChip ch={glyph} currentLetterId={currentLetterId} />;
  }
  return (
    <span dir="ltr" className="font-mono text-sm">
      {token}
    </span>
  );
}

type Piece =
  | { kind: "text"; value: string }
  | { kind: "coptic"; value: string }
  | { kind: "latin"; value: string }
  | { kind: "keys"; tokens: string[] };

const KEY_TOKEN = "OU|[A-Z]|[\\[\\]{}]";

function parenToPiece(inner: string): Piece {
  const tokens = inner
    .split(/\s*أو\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (
    tokens.length > 0 &&
    tokens.every(
      (token) => token === "OU" || glyphForKey(token) != null,
    )
  ) {
    return { kind: "keys", tokens };
  }
  return { kind: "latin", value: `(${inner})` };
}

function pieces(text: string): Piece[] {
  const token = new RegExp(
    `[\\u2C80-\\u2CFF\\u03E2-\\u03EF][\\u0300-\\u036F]*|\\(([^)]+)\\)|${KEY_TOKEN}`,
    "gu",
  );
  const out: Piece[] = [];
  let last = 0;
  for (const match of text.matchAll(token)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > last) {
      out.push({ kind: "text", value: text.slice(last, index) });
    }
    if (value.startsWith("(")) {
      const inner = match[1] ?? value.slice(1, -1);
      if (/[\u2C80-\u2CFF\u03E2-\u03EF]/u.test(inner)) {
        out.push({ kind: "text", value: "(" });
        out.push(...pieces(inner));
        out.push({ kind: "text", value: ")" });
      } else {
        out.push(parenToPiece(inner));
      }
    } else if (/[\u2C80-\u2CFF\u03E2-\u03EF]/u.test(value)) {
      out.push({ kind: "coptic", value });
    } else {
      out.push({ kind: "keys", tokens: [value] });
    }
    last = index + value.length;
  }
  if (last < text.length) {
    out.push({ kind: "text", value: text.slice(last) });
  }
  return out;
}

function renderPieces(
  list: Piece[],
  currentLetterId?: string,
  variant: "chip" | "inline" = "chip",
) {
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < list.length) {
    const piece = list[i];
    if (piece.kind === "coptic") {
      const chips: Extract<Piece, { kind: "coptic" }>[] = [];
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
          className={
            variant === "inline"
              ? "mx-0.5 inline-flex flex-wrap items-center gap-0.5 align-middle"
              : "mx-1 inline-flex flex-wrap items-center gap-1 align-middle"
          }
        >
          {chips.map((chip, chipIndex) => (
            <CopticChip
              key={`${chip.value}-${chipIndex}`}
              ch={chip.value}
              currentLetterId={currentLetterId}
              variant={variant}
            />
          ))}
        </span>,
      );
      continue;
    }
    if (piece.kind === "keys") {
      nodes.push(
        <span
          key={`keys-${i}`}
          dir="ltr"
          className="mx-1 inline-flex flex-wrap items-center gap-1 align-middle"
        >
          {piece.tokens.map((token, tokenIndex) => (
            <span key={`${token}-${tokenIndex}`} className="inline-flex items-center gap-1">
              {tokenIndex > 0 ? (
                <span className="text-text-dim">أو</span>
              ) : null}
              <KeyChip token={token} currentLetterId={currentLetterId} />
            </span>
          ))}
        </span>,
      );
      i += 1;
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
  variant = "chip",
}: {
  text: string;
  currentLetterId?: string;
  variant?: "chip" | "inline";
}) {
  return <>{renderPieces(pieces(text), currentLetterId, variant)}</>;
}

/** Explorer key row (A - E - I - …) painted as Unicode Coptic. */
export function FollowKeyRow({
  follow,
  currentLetterId,
}: {
  follow: string;
  currentLetterId?: string;
}) {
  const tokens = follow.split(/\s*-\s*/).filter(Boolean);
  return (
    <div dir="ltr" className="mt-3 flex flex-wrap items-center gap-2">
      {tokens.map((token, index) => (
        <span key={`${token}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span className="text-text-dim" aria-hidden="true">
              -
            </span>
          ) : null}
          <KeyChip token={token} currentLetterId={currentLetterId} />
        </span>
      ))}
    </div>
  );
}
