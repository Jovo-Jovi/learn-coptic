import { Cairo, Noto_Sans_Coptic } from "next/font/google";

/** Arabic UI. Variable; next/font self-hosts at build — no <link> to Google. */
export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

/** Coptic glyphs. Weight 400 only in the Google family. */
export const notoCoptic = Noto_Sans_Coptic({
  weight: "400",
  subsets: ["coptic"],
  display: "swap",
  variable: "--font-noto-coptic",
});
