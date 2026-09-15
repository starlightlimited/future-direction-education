import type { Metadata } from "next";
import { ThemeTraining } from "@/components/theme/ThemeTraining";

export const metadata: Metadata = {
  title: "企業培訓｜包班・團隊 AI 課程｜未來方針教育",
  description:
    "未來方針教育提供企業／團隊 AI 包班培訓，可按需要調整案例、內容深度及工作場景。適合 Marketing、Sales、Management 或跨部門入門培訓。",
};

export default function TrainingPage() {
  return <ThemeTraining />;
}
