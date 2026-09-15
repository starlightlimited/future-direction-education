import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import { ThemeLinks } from "@/components/theme/ThemeLinks";
import { ThemeScripts } from "@/components/theme/ThemeScripts";
import { ThemeHeader } from "@/components/theme/ThemeHeader";
import { ThemeFooter } from "@/components/theme/ThemeFooter";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const noto = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "未來方針教育｜香港 AI 教育・GEO・AI Marketing 課程",
    template: "%s",
  },
  description: site.description,
  metadataBase: new URL("https://www.future-direction.example"),
};

const themeBodyClass =
  "page-template-elementor_header_footer page page-id-9 page-id-1402 page-id-1425 wp-embed-responsive wp-theme-intellicon theme-intellicon ehf-header ehf-footer ehf-template-intellicon ehf-stylesheet-intellicon elementor-default elementor-template-full-width elementor-kit-7253 elementor-page elementor-page-9 elementor-page-1402 elementor-page-1425";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-HK"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${noto.variable} h-full`}
    >
      <body className={`${themeBodyClass} min-h-full`}>
        <ThemeLinks />
        <ThemeScripts />
        <div id="page" className="site lesspadding">
          <ThemeHeader />
          {children}
          <ThemeFooter />
        </div>
      </body>
    </html>
  );
}
