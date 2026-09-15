import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { notices, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "條款及細則｜未來方針教育",
  description: "課程報名條款、退款及改期安排占位頁，待中心正式政策補上。",
};

export default function TermsPage() {
  return (
    <>
      <PageBanner title="條款及細則" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-ink/90">
          <p>
            本頁為占位內容。取消、退款、改期及惡劣天氣安排，請按 {site.nameZh}{" "}
            正式政策補上。
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {notices.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p>香港實體課程主要以廣東話授課。證書姓名以報名資料為準。</p>
        </div>
      </section>
    </>
  );
}
