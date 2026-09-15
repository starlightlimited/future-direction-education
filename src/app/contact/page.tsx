import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageBanner } from "@/components/PageBanner";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "聯絡未來方針教育｜課程及企業培訓查詢",
  description:
    "查詢個人課程、企業培訓、學校／大專合作，或為團隊設計更貼合工作場景的 AI 課程。",
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="聯絡我們" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-navy">
              想學 AI，或者想把 AI 帶入你的團隊？
            </h2>
            <p className="mt-4 leading-8 text-ink/90">
              無論你想了解個人課程、企業培訓、學校／大專合作，都可以與未來方針教育聯絡。
            </p>
            <ul className="tech-card mt-8 space-y-4 rounded-2xl p-6 text-sm text-muted">
              <li className="flex gap-3">
                <Phone size={18} className="text-purple" />
                電話／WhatsApp：{site.phone}
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-purple" />
                電郵：{site.email}
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="text-purple" />
                地址：{site.address}
              </li>
              <li>辦公／查詢時間：{site.hours}</li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
