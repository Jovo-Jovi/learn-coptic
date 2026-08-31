import localFont from "next/font/local";
import { Cairo, Noto_Sans_Coptic } from "next/font/google";

/** Arabic UI. Variable; next/font self-hosts at build — no <link> to Google. */
export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

/**
 * Coptic glyphs — GNU FreeSerif, subsetted. GPL-3.0-or-later WITH
 * Font-exception-2.0. Unicode Coptic + overline combining marks.
 */
export const freeSerif = localFont({
  src: "./fonts/FreeSerif.ttf",
  display: "swap",
  variable: "--font-free-serif",
  fallback: ["Noto Sans Coptic", "serif"],
});

/** Fallback if FreeSerif misses a codepoint. SIL OFL 1.1. */
export const notoCoptic = Noto_Sans_Coptic({
  weight: "400",
  subsets: ["coptic"],
  display: "swap",
  variable: "--font-noto-coptic",
});

/**
 * Optional manuscript face. Mapped Latin cmap — never a Unicode stack.
 * Paint only via `athanasiusKey` (see CopticPaint). See ATHANASIUS.txt.
 */
export const athanasius = localFont({
  src: "./fonts/Athanasuis-Plain.ttf",
  display: "swap",
  variable: "--font-athanasius",
  fallback: ["serif"],
});
