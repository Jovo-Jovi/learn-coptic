/**
 * Rasterise README hero + PWA icons from Unicode in letters.json + FreeSerif.
 * Run: npx tsx scripts/render-brand-images.tsx
 * Does not invent glyphs. Glass tiles mimic landing `.glyph-glass`
 * (satori cannot paint backdrop-filter, so the frost is a gradient).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import lettersFile from "../src/data/json/letters.json";
import { loadOgFonts } from "../src/lib/og-fonts";

const ROOT = join(import.meta.dirname, "..");

const HERO_LETTER_IDS = ["alpha", "shai", "ni", "gamma", "ti", "theta"] as const;

/** Same as `.hero-glyphs > span:nth-child(n)` — RTL `inset-inline-start` / `top`. */
const HERO_SLOTS = [
  { inlineStart: 3, top: 8 },
  { inlineStart: 18, top: 52 },
  { inlineStart: 38, top: 12 },
  { inlineStart: 56, top: 48 },
  { inlineStart: 72, top: 6 },
  { inlineStart: 82, top: 54 },
] as const;

/** `--group-N-from` / `--group-N-to` in globals.css */
const GROUP_FROM: Record<number, string> = {
  1: "#667eea",
  2: "#f093fb",
  3: "#4facfe",
  4: "#43e97b",
  5: "#f6d365",
  6: "#fda085",
  7: "#a8edea",
};
const GROUP_TO: Record<number, string> = {
  1: "#8f6bb3",
  2: "#f5576c",
  3: "#00f2fe",
  4: "#38f9d7",
  5: "#fda085",
  6: "#f5576c",
  7: "#fed6e3",
};

function hexRgba(hex: string, alpha: number): string {
  const n = hex.replace("#", "");
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

async function png(
  element: ReactElement,
  size: { width: number; height: number },
  fonts: { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[],
): Promise<Buffer> {
  const res = new ImageResponse(element, { ...size, fonts });
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const { cairo, freeSerif } = await loadOgFonts();
  const fonts = [
    {
      name: "FreeSerif",
      data: freeSerif,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Cairo",
      data: cairo,
      weight: 600 as const,
      style: "normal" as const,
    },
  ];

  const byId = new Map(
    lettersFile.letters.map((letter) => [letter.id, letter] as const),
  );
  const hero = HERO_LETTER_IDS.map((id) => {
    const letter = byId.get(id);
    if (!letter) throw new Error(`missing letter ${id}`);
    return letter;
  });

  const heroPng = await png(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "#0A0A0F",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: -80,
          left: -60,
          width: 560,
          height: 360,
          borderRadius: 280,
          background: "rgba(102, 126, 234, 0.34)",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -70,
          right: -40,
          width: 520,
          height: 340,
          borderRadius: 260,
          background: "rgba(67, 233, 123, 0.26)",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 80,
          right: 280,
          width: 280,
          height: 220,
          borderRadius: 200,
          background: "rgba(240, 147, 251, 0.18)",
        }}
      />
      {hero.map((letter, i) => {
        const slot = HERO_SLOTS[i];
        const from = GROUP_FROM[letter.group];
        const to = GROUP_TO[letter.group];
        if (!slot || !from || !to) {
          throw new Error(`no slot/colour for ${letter.id}`);
        }
        return (
          <div
            key={letter.id}
            style={{
              display: "flex",
              position: "absolute",
              right: `${slot.inlineStart}%`,
              top: `${slot.top}%`,
              width: 128,
              height: 140,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 28,
              background: `linear-gradient(155deg, rgba(255,255,255,0.22), ${hexRgba(from, 0.2)} 55%, ${hexRgba(to, 0.14)})`,
              border: "1px solid rgba(255,255,255,0.32)",
              boxShadow: `0 14px 32px ${hexRgba(from, 0.32)}`,
              color: from,
              fontSize: 76,
              lineHeight: 1,
              fontFamily: "FreeSerif",
            }}
          >
            {letter.unicode.lower}
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 108,
          paddingBottom: 22,
          alignItems: "flex-end",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(10,10,15,0.88) 70%)",
          color: "#F5F5F7",
          fontFamily: "Cairo",
          fontSize: 34,
        }}
      >
        تعلّم القبطي البحيري
      </div>
    </div>,
    { width: 1200, height: 480 },
    fonts,
  );

  const icon = async (size: number, fontSize: number) =>
    png(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          color: "#8f9cf0",
          fontSize,
          fontFamily: "FreeSerif",
        }}
      >
        Ⲁ
      </div>,
      { width: size, height: size },
      fonts,
    );

  const docsDir = join(ROOT, "docs");
  const iconsDir = join(ROOT, "public", "icons");
  await mkdir(iconsDir, { recursive: true });

  await Promise.all([
    writeFile(join(docsDir, "readme-hero.png"), heroPng),
    writeFile(join(iconsDir, "icon-192.png"), await icon(192, 128)),
    writeFile(join(iconsDir, "icon-512.png"), await icon(512, 340)),
    writeFile(join(iconsDir, "icon-maskable-512.png"), await icon(512, 280)),
  ]);

  console.log("wrote docs/readme-hero.png and public/icons/*.png");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
