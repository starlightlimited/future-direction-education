import { ThemeMarkup } from "@/components/theme/ThemeMarkup";
import { homeHtml } from "@/theme/homeHtml";

export function ThemeHome() {
  return (
    <div className="theme-home">
      <ThemeMarkup html={homeHtml} />
    </div>
  );
}
