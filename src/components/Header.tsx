"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const topNav = [
  { href: "/", label: "首頁" },
  { href: "/intro", label: "介紹" },
  { href: "/courses", label: "課程一覽" },
  { href: "/training", label: "企業培訓" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header key={pathname} className="sticky top-0 z-50 bg-[#071631] text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4 lg:py-5">
          <Logo light />
          <nav className="hidden items-center gap-7 text-[15px] lg:flex">
            {topNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive(pathname, item.href)
                    ? "font-semibold text-mint"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/register" className="btn-primary !px-5 !py-2.5 text-sm">
              立即報名
            </Link>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 transition hover:border-mint/40 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "關閉選單" : "開啟選單"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={`mobile-nav-backdrop lg:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id="mobile-nav"
        aria-hidden={!open}
        className={`mobile-nav-panel lg:hidden ${open ? "is-open" : ""}`}
      >
        <div className="mobile-nav-inner">
          {[...topNav.filter((item) => item.href !== "/register")].map((item, i) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`mobile-nav-item ${isActive(pathname, item.href) ? "text-mint" : "text-white/90"}`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/register"
            className="mobile-nav-item btn-primary mt-2 w-full"
            style={{ transitionDelay: open ? `${80 + 8 * 45}ms` : "0ms" }}
            onClick={() => setOpen(false)}
          >
            立即報名
          </Link>
        </div>
      </nav>
    </header>
  );
}
