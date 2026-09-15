import Image from "@/components/Image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Course } from "@/lib/content";
import { PageBanner } from "@/components/PageBanner";

export function CourseDetail({ course }: { course: Course }) {
  const items = course.contents ?? course.learnings;

  return (
    <>
      <PageBanner
        title={course.title}
        crumbs={[
          { href: "/", label: "首頁" },
          { href: "/courses", label: "課程一覽" },
        ]}
      />
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-purple">
              {course.level} ｜ {course.duration} ｜ {course.audience}
            </p>
            {course.english ? (
              <p className="mt-2 text-sm text-muted">{course.english}</p>
            ) : null}
            <h2 className="mt-4 font-display text-3xl font-semibold text-navy">
              {course.positioning}
            </h2>
            <p className="mt-5 text-base leading-8 text-ink/90">{course.summary}</p>

            <h3 className="mt-10 text-xl font-semibold text-navy">你會學到</h3>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3 text-ink/90">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-purple" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {course.flow ? (
              <>
                <h3 className="mt-10 text-xl font-semibold text-navy">2 小時課程流程</h3>
                <ol className="mt-4 grid gap-4 sm:grid-cols-2">
                  {course.flow.map((step) => (
                    <li key={step.step} className="tech-card rounded-2xl p-5">
                      <p className="text-sm font-semibold text-mint">{step.step}</p>
                      <h4 className="mt-1 font-semibold text-navy">{step.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-muted">{step.body}</p>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}

            <h3 className="mt-10 text-xl font-semibold text-navy">你會帶走</h3>
            <ul className="mt-4 space-y-3">
              {course.takeaways.map((item) => (
                <li key={item} className="flex gap-3 text-ink/90">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-purple" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-xl font-semibold text-navy">適合對象</h3>
            <p className="mt-3 leading-8 text-muted">{course.suitable}</p>
            {course.requirements ? (
              <>
                <h3 className="mt-8 text-xl font-semibold text-navy">入學要求</h3>
                <p className="mt-3 leading-8 text-muted">{course.requirements}</p>
              </>
            ) : null}
            <p className="mt-8 leading-8 text-ink/90">{course.outcome}</p>
          </div>

          <aside className="tech-card h-fit rounded-2xl p-6 lg:sticky lg:top-28">
            <div className="relative mb-5 h-44 overflow-hidden rounded-xl">
              <Image src={course.cover} alt="" fill sizes="360px" className="object-cover" />
            </div>
            <dl className="space-y-3 text-sm">
              {course.date ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">日期</dt>
                  <dd className="font-medium text-navy">{course.date}</dd>
                </div>
              ) : null}
              {course.time ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">時間</dt>
                  <dd className="font-medium text-navy">{course.time}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-muted">形式</dt>
                <dd className="font-medium text-navy">{course.format}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">費用</dt>
                <dd className="font-medium text-navy">{course.fee}</dd>
              </div>
            </dl>
            <Link
              href={`/register?course=${course.id}`}
              className="btn-primary mt-6 w-full"
            >
              立即報名
            </Link>
            <p className="mt-3 text-center text-xs text-muted">
              GEO 實際上課地址將於報名後通知
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
