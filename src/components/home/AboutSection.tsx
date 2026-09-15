import Image from "@/components/Image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { credentials, site } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { RobotFloat } from "@/components/RobotFloat";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <Image
            src="/assets/brain-element.png"
            alt=""
            width={282}
            height={282}
            className="float-b absolute left-0 top-0 w-24 lg:-left-6 lg:top-2 lg:w-32"
          />
          <RobotFloat variant="c" className="relative z-10 mx-auto w-[78%]">
            <Image
              src="/assets/about1.png"
              alt="未來方針教學機器人"
              width={420}
              height={517}
              className="h-auto w-full drop-shadow-[0_18px_40px_rgba(17,28,68,0.12)]"
            />
          </RobotFloat>
          <Image
            src="/assets/light-elements.png"
            alt=""
            width={21}
            height={21}
            className="float-d absolute bottom-10 left-4 w-5"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="section-kicker">關於中心</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-snug text-navy md:text-[40px]">
            面向成人、企業及 Marketing 的未來技能教育平台
          </h2>
          <p className="mt-5 text-base leading-8 text-ink/90">
            未來方針教育過往以傳統教育／補習服務為基礎，現階段重新定位為
            AI 教育機構。我們希望讓你真正學懂 AI，而不是只聽懂幾個新名詞。
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {credentials.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-navy">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-mint" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-7 text-muted">
            {site.nameZh}｜教育局編號 {site.license}
          </p>
          <Link href="/about" className="btn-primary mt-8 inline-flex">
            了解更多
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
