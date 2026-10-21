import { ThemeMarkup } from "@/components/theme/ThemeMarkup";
import { footerHtml } from "@/theme/footerHtml";
import { site } from "@/lib/content";

function withContactEmail(html: string) {
  return html.replace(
    /<span class="sub-text">即將公布<\/span>(\s*)<a href="mailto:"><span class="text-heading"><\/span><\/a>/,
    `<a href="mailto:${site.email}" class="footer-email-link"><span class="sub-text">Email: ${site.email}</span></a>$1<span class="text-heading"></span>`,
  );
}

export function ThemeFooter() {
  return <ThemeMarkup html={withContactEmail(footerHtml)} />;
}
