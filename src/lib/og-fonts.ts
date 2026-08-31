import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontsDir = join(process.cwd(), "src/app/fonts");

export async function loadOgFonts() {
  const [cairo, freeSerif] = await Promise.all([
    readFile(join(fontsDir, "Cairo-SemiBold.ttf")),
    readFile(join(fontsDir, "FreeSerif.ttf")),
  ]);
  return { cairo, freeSerif };
}
