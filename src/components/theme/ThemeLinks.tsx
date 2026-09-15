import { themeCss } from "@/theme/assets";
import { withBasePath } from "@/lib/paths";

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

export function ThemeLinks() {
  return (
    <>
      <link rel="stylesheet" href={FONT_HREF} />
      {themeCss.map((href) => (
        <link key={href} rel="stylesheet" href={withBasePath(href)} />
      ))}
    </>
  );
}
