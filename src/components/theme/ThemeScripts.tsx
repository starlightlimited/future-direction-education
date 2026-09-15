"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { themeJs } from "@/theme/assets";
import { withBasePath } from "@/lib/paths";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const abs = withBasePath(src);
    const existing = document.querySelector(`script[data-theme-src="${abs}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = abs;
    script.async = false;
    script.dataset.themeSrc = abs;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${abs}`));
    document.body.appendChild(script);
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateCounter(el: HTMLElement) {
  if (el.dataset.counted === "1") return;
  el.dataset.counted = "1";
  const to = Number(el.getAttribute("data-to-value") || el.textContent || "0");
  const from = Number(el.getAttribute("data-from-value") || "0");
  const duration = Number(el.getAttribute("data-duration") || "2000");
  if (!Number.isFinite(to) || !Number.isFinite(from)) return;
  if (prefersReducedMotion() || duration <= 0) {
    el.textContent = String(Math.round(to));
    return;
  }
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function observeCounters() {
  const nodes = [
    ...document.querySelectorAll<HTMLElement>(".elementor-counter-number"),
  ];
  if (!nodes.length) return () => {};

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(animateCounter);
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animateCounter(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
  );
  nodes.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

function applyThemeDom() {
  const w = window as Window & {
    WOW?: new () => { init: () => void };
    AOS?: {
      init: (options?: Record<string, unknown>) => void;
      refresh: () => void;
      refreshHard?: () => void;
    };
  };
  if (w.WOW) new w.WOW().init();
  if (w.AOS) {
    w.AOS.init({ duration: 500, easing: "ease-out-quart", once: true });
    w.AOS.refreshHard?.() ?? w.AOS.refresh();
  }
  const primary = document.querySelector("#menu-main-menu");
  const mobile = document.querySelector("#mobile_menu");
  if (primary && mobile && !mobile.innerHTML.trim()) {
    mobile.innerHTML = primary.outerHTML;
  }
  document.querySelectorAll(".e-con.e-parent:not(.e-lazyloaded)").forEach((el) => {
    el.classList.add("e-lazyloaded");
  });
  document.querySelectorAll(".elementor-invisible").forEach((el) => {
    el.classList.remove("elementor-invisible");
  });
}

export function ThemeScripts() {
  const pathname = usePathname();
  const loadPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let stopCounters = () => {};

    if (!loadPromise.current) {
      loadPromise.current = (async () => {
        for (const src of themeJs) {
          try {
            await loadScript(src);
          } catch (error) {
            console.warn(error);
          }
        }
      })();
    }

    loadPromise.current.then(() => {
      if (cancelled) return;
      applyThemeDom();
      stopCounters = observeCounters();
      if (cancelled) {
        stopCounters();
        return;
      }
      window.dispatchEvent(new Event("theme:ready"));
    });

    return () => {
      cancelled = true;
      stopCounters();
    };
  }, [pathname]);

  return null;
}
