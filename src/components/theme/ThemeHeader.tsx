"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeMarkup } from "@/components/theme/ThemeMarkup";
import { headerHtml } from "@/theme/headerHtml";
import { basePath } from "@/lib/paths";

function normalizePath(path: string) {
  const clean = path.split("#")[0].split("?")[0];
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

function hrefPath(href: string) {
  let value = href.trim();
  if (basePath && (value === basePath || value.startsWith(`${basePath}/`))) {
    value = value.slice(basePath.length) || "/";
  }
  return value;
}

function isMenuActive(pathname: string, href: string, hash: string) {
  const [rawPath, rawHash] = hrefPath(href).split("#");
  const itemPath = normalizePath(rawPath || "/");
  if (rawHash) {
    return itemPath === pathname && hash === rawHash;
  }
  if (itemPath === "/") return pathname === "/";
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function applyHeaderActive(pathname: string) {
  const path = normalizePath(pathname);
  const hash = window.location.hash.replace(/^#/, "");
  document
    .querySelectorAll<HTMLElement>(
      "#themephi-header .menu > .menu-item, .sidenav .menu > .menu-item, #mobile_menu .menu-item",
    )
    .forEach((item) => {
      const href = item.querySelector("a")?.getAttribute("href") || "";
      const active = isMenuActive(path, href, hash);
      item.classList.toggle("current-menu-item", active);
      item.classList.toggle("current_page_item", active);
      item.classList.toggle("active", active);
    });
}

export function ThemeHeader() {
  const pathname = usePathname();

  useEffect(() => {
    applyHeaderActive(pathname);
    const sync = () => applyHeaderActive(pathname);
    window.addEventListener("hashchange", sync);
    window.addEventListener("theme:ready", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("theme:ready", sync);
    };
  }, [pathname]);

  return <ThemeMarkup html={headerHtml} />;
}
