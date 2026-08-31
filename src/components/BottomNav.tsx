"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/alphabet",
    label: "الحروف",
    active: (p: string) =>
      p === "/alphabet" || p.startsWith("/group/") || p.startsWith("/letter/"),
  },
  {
    href: "/vocabulary",
    label: "الكلمات",
    active: (p: string) => p.startsWith("/vocabulary"),
  },
  {
    href: "/practice",
    label: "التدريب",
    active: (p: string) => p.startsWith("/practice") || p.startsWith("/quiz"),
  },
  {
    href: "/about",
    label: "عن الموقع",
    active: (p: string) => p.startsWith("/about"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/15 bg-background pb-[env(safe-area-inset-bottom,0px)]"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {ITEMS.map((item) => {
          const isActive = item.active(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center justify-center px-1 text-sm no-underline ${
                  isActive ? "font-semibold text-foreground" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
