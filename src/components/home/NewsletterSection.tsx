import Image from "@/components/Image";
import Link from "next/link";

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-[#071631] px-4 py-20 text-white lg:px-8 lg:py-24">
      <Image
        src="/assets/news-element1.png"
        alt=""
        width={120}
        height={120}
        className="float-a pointer-events-none absolute left-6 top-8 w-16 opacity-80"
      />
      <Image
        src="/assets/news-elements2.png"
        alt=""
        width={120}
        height={120}
        className="float-b pointer-events-none absolute bottom-6 right-8 w-20 opacity-80"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">
          AI 已經改變工作方式，你準備好未？
        </h2>
        <p className="mt-4 text-white/75">
          個人報名、企業包班或院校合作，都可以與未來方針教育聯絡。想第一時間收到新課程通知，歡迎留下聯絡方式。
        </p>
        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="input flex flex-1 items-center border-transparent bg-white text-left text-muted"
          >
            輸入你的電郵，前往報名
          </Link>
          <Link href="/register" className="btn-primary shrink-0">
            立即報名
          </Link>
        </div>
      </div>
    </section>
  );
}
