import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const { freeSerif } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          color: "#8f9cf0",
          fontSize: 118,
          fontFamily: "FreeSerif",
        }}
      >
        Ⲁ
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "FreeSerif",
          data: freeSerif,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
