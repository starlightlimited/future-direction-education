import type { Metadata } from "next";
import { PageBanner } from "@/components/PageBanner";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "課程報名｜未來方針教育",
  description: "報名 GEO 證書課程、AI 網站建立或 AI Marketing 實戰課程。",
};

export default function RegisterPage() {
  return (
    <>
      <PageBanner title="課程報名" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-center leading-8 text-ink/90">
            請填寫以下資料完成報名。成功提交後，中心將按課程安排發出確認及付款／上課資訊。
          </p>
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
