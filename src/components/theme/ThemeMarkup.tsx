"use client";

import { useEffect, useRef } from "react";
import { basePath } from "@/lib/paths";

export function prefixThemeHtml(html: string) {
  if (!basePath) return html;
  return html
    .replaceAll('src="/theme/', `src="${basePath}/theme/`)
    .replaceAll('href="/theme/', `href="${basePath}/theme/`)
    .replaceAll('srcset="/theme/', `srcset="${basePath}/theme/`)
    .replaceAll(", /theme/", `, ${basePath}/theme/`)
    .replace(/(href=")\/(?!\/)/g, `$1${basePath}/`);
}

function activateScripts(root: HTMLElement) {
  if (root.dataset.scriptsRan === "1") return;
  root.dataset.scriptsRan = "1";
  root.querySelectorAll("script").forEach((old) => {
    const code = old.textContent?.trim();
    if (!code) {
      old.remove();
      return;
    }
    const script = document.createElement("script");
    script.textContent = `(function(){\n${code}\n})();`;
    old.replaceWith(script);
  });
}

export function ThemeMarkup({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const run = () => activateScripts(root);
    const w = window as Window & { jQuery?: unknown };
    if (w.jQuery) run();
    window.addEventListener("theme:ready", run);
    return () => window.removeEventListener("theme:ready", run);
  }, [html]);

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: prefixThemeHtml(html) }}
    />
  );
}
