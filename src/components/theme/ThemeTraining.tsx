import { ThemeMarkup } from "@/components/theme/ThemeMarkup";
import { trainingHtml } from "@/theme/trainingHtml";

export function ThemeTraining() {
  return (
    <div className="theme-home theme-training">
      <ThemeMarkup html={trainingHtml} />
    </div>
  );
}
