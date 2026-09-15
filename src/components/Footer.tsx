import Link from "next/link";
import Image from "@/components/Image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/content";

const links = [
  { href: "/courses", label: "課程一覽" },
  { href: "/about", label: "關於我們" },
  { href: "/training", label: "企業培訓" },
  { href: "/register", label: "立即報名" },
  { href: "/contact", label: "聯絡我們" },
  { href: "/about", label: "常見問題" },
];

const courseLinks = [
  { href: "/courses/geo", label: "GEO 證書課程" },
  { href: "/courses/ai-website", label: "AI 網站建立" },
  { href: "/courses/ai-marketing", label: "AI Marketing" },
  { href: "/about#partners", label: "院校合作" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071631] text-white">
      <Image
        src="/assets/footer-shape.png"
        alt=""
        width={1920}
        height={213}
        className="pointer-events-none absolute left-0 top-0 z-10 h-[90px] w-full object-cover object-bottom sm:h-[120px] lg:h-[150px]"
      />
      <div className="tech-grid opacity-25" />
      <div className="relative z-20 mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-28 lg:grid-cols-4 lg:px-8 lg:pt-36">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/70">
            {site.slogan}
            <br />
            我們把複雜的 AI 技術轉化成簡單、實用、可即時應用的學習內容。
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">快速連結</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {links.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">課程</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {courseLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">聯絡</h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple/80">
                <Phone size={14} />
              </span>
              {site.phone}
            </li>
            <li className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple/80">
                <Mail size={14} />
              </span>
              {site.email}
            </li>
            <li className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple/80">
                <MapPin size={14} />
              </span>
              {site.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-20 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © 2026 {site.nameZh}　教育局編號 {site.license}
          </p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              私隱政策
            </Link>
            <Link href="/terms" className="hover:text-white">
              條款及細則
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
