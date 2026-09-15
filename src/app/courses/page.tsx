import type { Metadata } from "next";
import Image from "@/components/Image";
import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";
import { courses } from "@/lib/content";

export const metadata: Metadata = {
  title: "課程一覽｜GEO・AI 網站建立・AI Marketing｜未來方針教育",
  description:
    "未來方針教育課程一覽：GEO 證書課程、AI 網站建立及 AI Marketing 實戰課程，面向中小企、Marketing 從業員及創業者。",
};

export default function CoursesPage() {
  return (
    <>
      <PageBanner title="課程一覽" crumbs={[{ href: "/", label: "首頁" }]} />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mx-auto max-w-3xl text-center text-base leading-8 text-ink/90">
            我們把複雜技術拆成簡單、實用、可即時應用的課程。無需 Coding
            背景，重點是理解、判斷與帶到工作上使用。
          </p>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="tech-card overflow-hidden rounded-2xl"
              >
                <div className="relative h-52">
                  <Image
                    src={course.cover}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple">
                    {course.level} ｜ {course.duration}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-navy">
                    {course.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {course.summary}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-navy">
                    {course.fee}
                  </p>
                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      課程詳情
                    </Link>
                    <Link
                      href={`/register?course=${course.id}`}
                      className="inline-flex items-center rounded-lg border border-[#d9deea] px-4 py-2 text-sm font-semibold text-navy"
                    >
                      報名
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
