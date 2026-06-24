"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { getDocumentHref } from "@/lib/document-pages";

const NAV_ACCENT = "text-[#4e4bdc]";
const NAV_ACCENT_BG = "bg-[#4e4bdc]";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuGroup {
  id: string;
  label: string;
  href: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    id: "popular-documents",
    label: "Popular Documents",
    href: "/documents",
    items: [
      {
        label: "Passport renewal photo",
        href: getDocumentHref("passport-renewal-photo"),
      },
      { label: "US Passport Photo", href: getDocumentHref("us-passport-photo") },
      { label: "600x600 Photo", href: getDocumentHref("600x600-photo") },
      { label: "All documents", href: "/documents" },
    ],
  },
  {
    id: "how-it-works",
    label: "How it Works",
    href: "/how-it-works",
    items: [
      { label: "How to Take a Photo", href: "/how-it-works/how-to-take-a-photo" },
      {
        label: "AI and Expert Verification",
        href: "/how-it-works/ai-and-expert-verification",
      },
      { label: "Guarantee", href: "/how-it-works/guarantee" },
      { label: "Delivery", href: "/how-it-works/delivery" },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    items: [
      { label: "About Us", href: "/about/about-us" },
      { label: "Why Choose Us", href: "/about/why-choose-us" },
      { label: "Customer Reviews", href: "/about/customer-reviews" },
    ],
  },
];

export function Header() {
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimeout() {
    if (!closeTimeoutRef.current) return;
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }

  function openMenu(menuId: string) {
    clearCloseTimeout();
    setOpenMenuId(menuId);
  }

  function closeMenuWithDelay() {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenuId(null);
      closeTimeoutRef.current = null;
    }, 160);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/96 shadow-nav">
      {openMenuId ? (
        <div className="pointer-events-none absolute inset-x-0 top-full hidden h-[calc(100vh-76px)] bg-navy/35 md:block" />
      ) : null}

      <div className="container-main flex h-[76px] items-center justify-between gap-3">
        <Logo className="shrink" />

        <nav className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
          {menuGroups.map((menu) => {
            const isOpen = openMenuId === menu.id;
            const isActive =
              pathname === menu.href || pathname.startsWith(`${menu.href}/`);

            return (
              <div
                key={menu.id}
                className="relative hidden md:block"
                onMouseEnter={() => openMenu(menu.id)}
                onMouseLeave={closeMenuWithDelay}
              >
                <button
                  type="button"
                  className={`relative flex h-[76px] items-center gap-1 px-2 text-base leading-none transition ${
                    isOpen || isActive ? NAV_ACCENT : "text-navy hover:text-grey"
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => {
                    setOpenMenuId((current) =>
                      current === menu.id ? null : menu.id,
                    );
                  }}
                >
                  <span className="text-[15px] font-medium leading-none sm:text-[16px]">
                    {menu.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute -bottom-px left-0 right-0 mx-auto h-[3px] w-[calc(100%-6px)] rounded-full transition ${
                      isOpen || isActive
                        ? `${NAV_ACCENT_BG} opacity-100`
                        : "opacity-0"
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="absolute left-1/2 top-[calc(100%+4px)] z-50 w-[280px] -translate-x-1/2 rounded-xl border border-[#ebebeb] bg-white p-5 shadow-[0_18px_38px_rgba(0,0,0,0.16)]">
                    <ul className="space-y-1.5">
                      {menu.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-md px-3 py-2 text-[15px] font-medium leading-[1.35] text-navy transition hover:bg-section hover:text-[#4e4bdc] sm:text-[16px]"
                            onClick={() => setOpenMenuId(null)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
          <Button asChild size="sm" className="sm:h-[50px] sm:px-6 sm:text-base">
            <Link href="/create">
              <span className="hidden sm:inline">Choose document</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
