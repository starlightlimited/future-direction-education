import type { Metadata } from "next";
import { ThemeIntro } from "@/components/theme/ThemeIntro";

export const metadata: Metadata = {
  title: "課程介紹｜GEO・AI 網站建立・AI Marketing｜未來方針教育",
  description:
    "未來方針教育課程介紹：GEO 證書課程、AI 網站建立及 AI Marketing 實戰課程，面向中小企、Marketing 從業員及創業者。",
};

export default function IntroPage() {
  return <ThemeIntro />;
}
