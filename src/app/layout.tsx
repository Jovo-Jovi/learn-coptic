import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { cairo, notoCoptic } from "./fonts";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "تعلّم القبطي البحيري",
  description:
    "تعلّم الحروف القبطية البحيرية بالعربي — مجانًا، بدون حساب، يشتغل على الموبايل.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${notoCoptic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="font-sans flex min-h-full flex-col overflow-x-clip bg-background text-foreground">
        <div className="flex min-w-0 flex-1 flex-col pb-[calc(2.75rem+env(safe-area-inset-bottom,0px))]">
          <header className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="text-lg font-semibold">
              <Link href="/" className="text-foreground">
                تعلّم القبطي
              </Link>
            </p>
            <ThemeToggle />
          </header>
          <main className="min-w-0 flex-1 px-4">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
