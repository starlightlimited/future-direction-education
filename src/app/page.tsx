import type { Metadata } from "next";
import { ThemeHome } from "@/components/theme/ThemeHome";

export const metadata: Metadata = {
  title: "未來方針教育｜香港 AI 教育・GEO・AI Marketing 課程",
  description:
    "未來方針教育專注 AI 與數碼技能教育。學懂 AI，不只是跟上科技，而是跟上市場。",
};

export default function HomePage() {
  return <ThemeHome />;
}
