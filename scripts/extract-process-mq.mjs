import fs from "fs";

const css = fs.readFileSync("public/theme/wp-content/uploads/elementor/css/post-1425.css", "utf8");
const ids = ["6714d57", "bb88334", "8e34d19", "d9dda8e", "23fc18a"];

function splitMedia(cssText) {
  const parts = [];
  let i = 0;
  while (i < cssText.length) {
    const mq = cssText.indexOf("@media", i);
    if (mq === -1) {
      parts.push({ media: "all", body: cssText.slice(i) });
      break;
    }
    if (mq > i) parts.push({ media: "all", body: cssText.slice(i, mq) });
    const brace = cssText.indexOf("{", mq);
    const cond = cssText.slice(mq, brace).trim();
    let depth = 1;
    let j = brace + 1;
    while (j < cssText.length && depth) {
      if (cssText[j] === "{") depth++;
      else if (cssText[j] === "}") depth--;
      j++;
    }
    parts.push({ media: cond, body: cssText.slice(brace + 1, j - 1) });
    i = j;
  }
  return parts;
}

const parts = splitMedia(css);
for (const id of ids) {
  console.log("\n########", id, "########");
  for (const part of parts) {
    const re = new RegExp(`[^}]*${id}[^}{]*\\{[^}]*\\}`, "g");
    const matches = part.body.match(re);
    if (matches) {
      console.log(part.media);
      console.log(matches.join("\n"));
    }
  }
}
