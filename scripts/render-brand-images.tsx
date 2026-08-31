/**
 * Rasterise README hero + PWA icons from Unicode in letters.json + FreeSerif.
 * Run: npx tsx scripts/render-brand-images.tsx
 * Does not invent glyphs. README snap is the landing letters at readable opacity.
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
  { inlineStart: 2, top: 6 },
  { inlineStart: 20, top: 58 },
  { inlineStart: 40, top: 10 },
  { inlineStart: 58, top: 50 },
  { inlineStart: 74, top: 4 },
  { inlineStart: 84, top: 62 },
] as const;

/** `--group-N-from` in globals.css */
const GROUP_FROM: Record<number, string> = {
  1: "#667eea",
  2: "#f093fb",
  3: "#4facfe",
  4: "#43e97b",
  5: "#f6d365",
  6: "#fda085",
  7: "#a8edea",
};

async function png(
  element: ReactElement,
  size: { width: number; height: number },
  fonts: { name: string; data: Buffer; weight: 400; style: "normal" }[],
): Promise<Buffer> {
  const res = new ImageResponse(element, { ...size, fonts });
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const { freeSerif } = await loadOgFonts();
  const fonts = [
    {
      name: "FreeSerif",
      data: freeSerif,
      weight: 400 as const,
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
          width: 520,
          height: 320,
          borderRadius: 260,
          background: "rgba(102, 126, 234, 0.28)",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: -90,
          right: -40,
          width: 480,
          height: 300,
          borderRadius: 240,
          background: "rgba(67, 233, 123, 0.22)",
        }}
      />
      {hero.map((letter, i) => {
        const slot = HERO_SLOTS[i];
        const color = GROUP_FROM[letter.group];
        if (!slot || !color) throw new Error(`no slot/colour for ${letter.id}`);
        return (
          <div
            key={letter.id}
            style={{
              display: "flex",
              position: "absolute",
              right: `${slot.inlineStart}%`,
              top: `${slot.top}%`,
              fontSize: 92,
              lineHeight: 1,
              fontFamily: "FreeSerif",
              color,
              opacity: 0.72,
            }}
          >
            {letter.unicode.lower}
          </div>
        );
      })}
    </div>,
    { width: 1200, height: 420 },
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
