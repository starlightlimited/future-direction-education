import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "私隱政策｜未來方針教育",
  description: "未來方針教育網站私隱政策占位頁，待法務確認後更新。",
};

export default function PrivacyPage() {
  return (
    <>
      <PageBanner title="私隱政策" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-ink/90">
          <p>
            本頁為網站上線前占位內容，正式私隱政策待中心法務確認後更新。
          </p>
          <p>
            {site.nameZh}（教育局編號 {site.license}
            ）收集報名及查詢資料，僅用於課程安排、回覆查詢及必要通訊。我們不會把個人資料出售予無關第三方。
          </p>
          <p>
            目前網站表單為前端提交示範，尚未連接正式伺服器或付款系統。如需查閱、更正或刪除你的資料，請透過聯絡頁留下訊息。
          </p>
        </div>
      </section>
    </>
  );
}
