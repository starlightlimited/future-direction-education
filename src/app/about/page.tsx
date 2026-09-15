import type { Metadata } from "next";
import Image from "@/components/Image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageBanner } from "@/components/PageBanner";
import { RobotFloat } from "@/components/RobotFloat";
import { TechField } from "@/components/TechField";
import { partners, principles, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "關於未來方針教育｜香港 AI 教育機構",
  description:
    "未來方針教育由傳統教育服務出發，延伸至人工智能、數碼技能及商業應用，把複雜科技變成可應用的能力。",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner title="關於我們" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="relative overflow-hidden px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/assets/brain-element.png"
              alt=""
              width={220}
              height={220}
              className="absolute -left-8 top-10 w-36 float-b"
            />
            <RobotFloat variant="a" className="relative z-10 mx-auto w-[78%]">
              <Image
                src="/assets/about1.png"
                alt=""
                width={420}
                height={517}
                className="h-auto w-full"
              />
            </RobotFloat>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold leading-snug text-navy">
              教育不只是教你今天要用的工具，而是讓你準備好下一次改變。
            </h2>
            <p className="mt-5 text-base leading-8 text-ink/90">
              未來方針教育由傳統教育服務的基礎出發，隨着工作、商業及學習方式進入
              AI 時代，我們把教育方向延伸至人工智能、數碼技能及商業應用。
            </p>
            <p className="mt-4 text-base leading-8 text-ink/90">
              我們相信，AI 教育不應該只屬於工程師。中小企老闆、Marketing
              人員、創業者、學生及一般在職人士，同樣需要理解 AI
              如何影響自己的工作與市場。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-semibold text-navy">我們的使命</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/90">
            把複雜科技，變成人人可以理解及應用的能力。我們希望學員離開課室時，不只是「知道
            AI 很重要」，而是清楚知道下一步可以怎樣做。
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <article key={p.key} className="tech-card rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple">
                  {p.key}
                </p>
                <h3 className="mt-2 font-semibold text-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-navy">
              由傳統教育走向 AI 教育
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/90">
              中心過往以傳統教育／補習服務為基礎；現階段的品牌發展方向，是建立面向
              AI
              時代的實用教育平台。這份轉型不是否定過去，而是延續教育的核心：因應社會需要，教授下一階段真正需要的能力。
            </p>
          </div>
          <div className="tech-card rounded-2xl p-6">
            <h3 className="font-semibold text-navy">牌照／註冊資料</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-1 text-purple" />
                正式註冊名稱：{site.legalName}
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-1 text-purple" />
                教育局學校／中心編號：{site.license}
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="mt-1 text-purple" />
                註冊地址：{site.address}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="partners" className="scroll-mt-24 bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-semibold text-navy">
            合作夥伴｜教育 × 市場推廣 × 科技
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink/90">
            未來方針教育透過跨領域合作，把教育內容與真實市場應用連結。合作夥伴的角色不是取代教學，而是讓課程能夠接觸到最新的
            Marketing、網站、AI Search 及企業科技應用。
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {partners.map((p) => (
              <article key={p.name} className="tech-card rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-navy">{p.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{p.body}</p>
                <a
                  href={p.url}
                  className="mt-4 inline-block text-sm font-semibold text-purple"
                  target="_blank"
                  rel="noreferrer"
                >
                  官方網站 →
                </a>
              </article>
            ))}
          </div>
          <div className="relative mt-10 overflow-hidden rounded-2xl bg-navy p-8 text-white">
            <TechField />
            <h3 className="partner-cta-title relative z-10">成為合作夥伴</h3>
            <p className="relative z-10 mt-3 max-w-3xl text-white/75">
              我們歡迎大專院校、學校、商會、專業團體、企業及科技機構共同策劃 AI
              教育項目。如希望合作舉辦講座、工作坊、企業內訓或聯合證書課程，歡迎與我們聯絡。
            </p>
            <Link href="/contact" className="btn-primary relative z-10 mt-6 inline-flex">
              聯絡我們
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
