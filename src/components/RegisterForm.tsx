"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { courses, notices, type CourseId } from "@/lib/content";

export function RegisterForm({ initialCourse = "geo" }: { initialCourse?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [courseId, setCourseId] = useState<string>(
    courses.some((c) => c.id === initialCourse) ? initialCourse : "geo",
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("course");
    if (fromQuery && courses.some((c) => c.id === fromQuery)) {
      setCourseId(fromQuery);
    }
    const emailQuery = params.get("email");
    if (emailQuery) setEmail(emailQuery);
  }, []);

  const selected = useMemo(
    () => courses.find((c) => c.id === courseId) ?? courses[0],
    [courseId],
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nameZh = String(data.get("nameZh") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const agree = data.get("agree");
    if (!nameZh || !phone || !email || !agree) {
      setError("請填寫必填欄位，並同意課程條款及私隱政策。");
      return;
    }
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-navy">報名資料已提交</h3>
        <p className="mt-3 leading-7 text-muted">
          已收到你報讀「{selected.title}」的申請。這是前端示範流程，付款連結與上課確認將於正式流程接通後發出。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="tech-card rounded-2xl p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="label">中文姓名 *</span>
          <input name="nameZh" className="input" required />
        </label>
        <label className="block">
          <span className="label">英文姓名（證書使用，如適用）</span>
          <input name="nameEn" className="input" />
        </label>
        <label className="block">
          <span className="label">聯絡電話 / WhatsApp *</span>
          <input name="phone" className="input" required />
        </label>
        <label className="block">
          <span className="label">電郵地址 *</span>
          <input
            name="email"
            type="email"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="label">公司／機構名稱</span>
          <input name="company" className="input" />
        </label>
        <label className="block">
          <span className="label">職位</span>
          <input name="role" className="input" />
        </label>
        <label className="block md:col-span-2">
          <span className="label">選擇課程 *</span>
          <select
            name="course"
            className="input"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="label">你目前最想解決的問題（選填）</span>
          <textarea name="goal" rows={3} className="input" />
        </label>
        {courseId === "geo" ? (
          <label className="block md:col-span-2">
            <span className="label">公司／客戶網站網址（選填）</span>
            <input name="website" className="input" placeholder="https://" />
          </label>
        ) : null}
        <label className="flex items-start gap-3 md:col-span-2">
          <input type="checkbox" name="agree" className="mt-1 h-4 w-4 accent-purple" required />
          <span className="text-sm leading-7 text-muted">
            我同意課程條款及私隱政策。付款方式將按實際流程另行通知（目前為報名資料提交）。
          </span>
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="btn-primary mt-6">
        提交報名
      </button>
      <ul className="mt-6 space-y-2 text-sm leading-7 text-muted">
        {notices.map((n) => (
          <li key={n}>• {n}</li>
        ))}
      </ul>
    </form>
  );
}
