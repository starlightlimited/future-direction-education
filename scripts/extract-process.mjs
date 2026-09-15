import fs from "fs";

const html = fs.readFileSync("src/theme/trainingHtml.ts", "utf8");
const start = html.indexOf("elementor-element-23fc18a");
const chunk = html.slice(start, start + 18000);

fs.writeFileSync("scripts/_process-snippet.html", chunk.replace(/\\n/g, "\n").replace(/\\r/g, "").replace(/\\t/g, "  "));

const css = fs.readFileSync("public/theme/wp-content/uploads/elementor/css/post-1425.css", "utf8");
const ids = [...new Set([...chunk.matchAll(/elementor-element-([a-z0-9]+)/g)].map((m) => m[1]))];
console.log("ids", ids.join(","));

const wpPost = fs.readFileSync("src/app/wordpress-post.css", "utf8");
const wpResp = fs.readFileSync("src/app/wordpress-responsive.css", "utf8");

function extractRules(source, label) {
  for (const id of ids) {
    const re = new RegExp(`[^}]*${id}[^}{]*\\{[^}]*\\}`, "g");
    const matches = source.match(re);
    if (matches) {
      console.log(`\n=== ${label} ${id} ===`);
      console.log(matches.join("\n"));
    }
  }
}

extractRules(css, "post-1425");
extractRules(wpPost, "wordpress-post");
extractRules(wpResp, "wordpress-responsive");
