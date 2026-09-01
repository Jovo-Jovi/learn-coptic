import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { athanasius, cairo, freeSerif, notoCoptic } from "./fonts";
import { BottomNav } from "@/components/BottomNav";
import { MotionProvider } from "@/components/MotionProvider";
import { FontSelect } from "@/components/FontSelect";
import { PwaRegister } from "@/components/PwaRegister";
import { ThemeToggle } from "@/components/ThemeToggle";
import { themeBootScript } from "@/lib/theme";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const description =
  "تعلّم الحروف القبطية البحيرية بالعربي — مجانًا، بدون حساب، يشتغل على الموبايل.";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  applicationName: "تعلّم القبطي",
  title: {
    default: "تعلّم القبطي البحيري",
    template: "%s — تعلّم القبطي البحيري",
  },
  description,
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: "تعلّم القبطي",
    title: "تعلّم القبطي البحيري",
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "تعلّم القبطي البحيري",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تعلّم القبطي البحيري",
    description,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: "تعلّم القبطي",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      data-coptic-font="serif"
      className={cn(
        "h-full antialiased",
        cairo.variable,
        freeSerif.variable,
        notoCoptic.variable,
        athanasius.variable,
        "font-sans",
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip bg-bg font-sans text-text">
        <MotionProvider>
          <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-[calc(2.75rem+env(safe-area-inset-bottom,0px))]">
            <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-[calc(env(safe-area-inset-top,0px)+2.75rem)] pb-5 sm:px-6 lg:px-8 lg:pt-[calc(env(safe-area-inset-top,0px)+2rem)] lg:pb-8">
              <p className="min-w-0 truncate text-lg font-semibold">
                <Link href="/" className="text-text">
                  تعلّم القبطي
                </Link>
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href="/prayers"
                  className="inline-flex min-h-11 items-center px-2 text-sm text-text no-underline hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
                >
                  صلوات
                </Link>
                <Link
                  href="/search"
                  className="inline-flex min-h-11 items-center px-2 text-sm text-text no-underline hover:underline focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
                >
                  بحث
                </Link>
                <FontSelect />
                <ThemeToggle />
              </div>
            </header>
            <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
          <BottomNav />
          <PwaRegister />
        </MotionProvider>
      </body>
    </html>
  );
}
