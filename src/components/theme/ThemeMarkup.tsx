"use client";

import { useEffect, useMemo, useRef } from "react";
import { basePath } from "@/lib/paths";

export function prefixThemeHtml(html: string) {
  if (!basePath) return html;
  return html
    .replaceAll('src="/theme/', `src="${basePath}/theme/`)
    .replaceAll('src="/brand/', `src="${basePath}/brand/`)
    .replaceAll('href="/theme/', `href="${basePath}/theme/`)
    .replaceAll('srcset="/theme/', `srcset="${basePath}/theme/`)
    .replaceAll(", /theme/", `, ${basePath}/theme/`)
    .replace(/(href=")\/(?!\/)/g, `$1${basePath}/`);
}

/** Pull inline scripts out so SSR/static HTML cannot run them before jQuery loads. */
export function extractInlineScripts(html: string): {
  html: string;
  scripts: string[];
} {
  const scripts: string[] = [];
  const cleaned = html.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    (_match, code: string) => {
      const trimmed = String(code).trim();
      if (trimmed) scripts.push(trimmed);
      return "";
    },
  );
  return { html: cleaned, scripts };
}

function runInlineScripts(codes: string[]) {
  for (const code of codes) {
    try {
      const script = document.createElement("script");
      script.textContent = `(function(){\n${code}\n})();`;
      document.body.appendChild(script);
      script.remove();
    } catch (error) {
      console.warn(error);
    }
  }
}

export function ThemeMarkup({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ranRef = useRef(false);
  const { html: markup, scripts } = useMemo(() => {
    const prefixed = prefixThemeHtml(html);
    return extractInlineScripts(prefixed);
  }, [html]);

  useEffect(() => {
    ranRef.current = false;
    const root = ref.current;
    if (!root || !scripts.length) return;

    const run = () => {
      const w = window as Window & { jQuery?: unknown };
      if (!w.jQuery || ranRef.current) return;
      ranRef.current = true;
      runInlineScripts(scripts);
    };

    run();
    window.addEventListener("theme:ready", run);
    return () => window.removeEventListener("theme:ready", run);
  }, [scripts]);

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
