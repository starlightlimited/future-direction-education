import Link from "next/link";
import { HudCorners, TechField } from "@/components/TechField";

export function PageBanner({
  title,
  crumbs,
}: {
  title: string;
  crumbs: { href: string; label: string }[];
}) {
  return (
    <section className="page-banner relative overflow-hidden bg-navy py-16 text-center text-white md:py-20">
      <TechField />
      <HudCorners className="opacity-70" />
      <div className="relative z-10 px-4">
        <p className="section-kicker page-banner__kicker mb-4 justify-center">未來方針</p>
        <h1 className="page-banner__title">{title}</h1>
        <nav className="page-banner__crumbs mt-4 text-sm">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 ? <span className="mx-2">›</span> : null}
              <Link href={c.href}>
                {c.label}
              </Link>
            </span>
          ))}
          <span className="mx-2">›</span>
          <span className="page-banner__current">{title}</span>
        </nav>
      </div>
    </section>
  );
}
