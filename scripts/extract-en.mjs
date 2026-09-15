import { readFile } from "node:fs/promises";

const files = [
  "src/theme/homeHtml.ts",
  "src/theme/headerHtml.ts",
  "src/theme/footerHtml.ts",
];

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const html = JSON.parse(raw.replace(/^export const \w+ = /, "").replace(/;\s*$/, ""));
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");
  console.log(`\n==== ${file} ====`);
  const words = text.match(/[A-Za-z][A-Za-z0-9&'’.,:+/\- ]{2,}/g) || [];
  const uniq = [...new Set(words.map((s) => s.trim()).filter((s) => s.length > 2 && /[A-Za-z]{3}/.test(s)))];
  for (const s of uniq) console.log(s);
}
