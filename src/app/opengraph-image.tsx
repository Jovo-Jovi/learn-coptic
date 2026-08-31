import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";
export const alt = "تعلّم القبطي البحيري";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { cairo, freeSerif } = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "#0A0A0F",
          color: "#F5F5F7",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -90,
            right: -70,
            width: 380,
            height: 380,
            borderRadius: 190,
            background: "rgba(102, 126, 234, 0.32)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -100,
            left: -50,
            width: 340,
            height: 340,
            borderRadius: 170,
            background: "rgba(67, 233, 123, 0.2)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 32,
            fontSize: 96,
            fontFamily: "FreeSerif",
            color: "#C5C8F5",
          }}
        >
          <span>Ⲁ</span>
          <span>ϣ</span>
          <span>Ⲛ</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 60,
            fontFamily: "Cairo",
          }}
        >
          تعلّم القبطي البحيري
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 32,
            fontFamily: "Cairo",
            color: "#9A9AA8",
          }}
        >
          مجاناً، بالعربي، من موبايلك
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cairo", data: cairo, weight: 600, style: "normal" },
        { name: "FreeSerif", data: freeSerif, weight: 400, style: "normal" },
      ],
    },
  );
}
