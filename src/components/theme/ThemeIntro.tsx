import { ThemeMarkup } from "@/components/theme/ThemeMarkup";
import { introHtml } from "@/theme/introHtml";

export function ThemeIntro() {
  return (
    <div className="theme-home theme-intro">
      <ThemeMarkup html={introHtml} />
    </div>
  );
}
