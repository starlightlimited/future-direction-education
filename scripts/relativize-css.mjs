import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THEME = join(ROOT, "public", "theme");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(p)));
    else if (entry.name.endsWith(".css")) files.push(p);
  }
  return files;
}

const files = await walk(THEME);
let changed = 0;
for (const file of files) {
  const cssLocal = `/theme/${file.slice(THEME.length).replaceAll("\\", "/")}`;
  const fromDir = posix.dirname(cssLocal);
  let css = await readFile(file, "utf8");
  const next = css.replace(/url\((['"]?)(\/theme\/[^'")]+)\1\)/g, (_m, _q, asset) => {
    const rel = posix.relative(fromDir, asset).replaceAll("\\", "/");
    return `url("${rel}")`;
  });
  if (next !== css) {
    await writeFile(file, next);
    changed += 1;
  }
}
console.log("relativized css files", changed);
