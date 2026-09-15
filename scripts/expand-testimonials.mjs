import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const studentTestimonials = [
  {
    name: "陳小姐",
    role: "中小企老闆",
    quote:
      "上完 GEO 課程先明白，而家客戶用 AI 搵供應商，網站唔只係做 SEO。Checklist 返到公司即刻用得着。",
    avatar: "/assets/testimonials/avatar-1.jpg",
  },
  {
    name: "林先生",
    role: "Marketing 從業員",
    quote:
      "以前每日追新工具，上完堂先有一套流程。Research、內容同投放，而家識得點同 AI 分工。",
    avatar: "/assets/testimonials/avatar-2.jpg",
  },
  {
    name: "黃小姐",
    role: "Agency 負責人",
    quote:
      "團隊唔使人人識 coding，但要識判斷。課程用真實客戶場景講，同事返工即刻帶得走方法。",
    avatar: "/assets/testimonials/avatar-3.jpg",
  },
  {
    name: "張先生",
    role: "創業者",
    quote:
      "想自己起網站又怕技術門檻。AI 網站課程教嘅唔係一味靠工具，而係品牌、結構同內容一齊諗。",
    avatar: "/assets/testimonials/avatar-4.jpg",
  },
  {
    name: "李小姐",
    role: "數碼行銷",
    quote:
      "最有用係知道邊啲應該交俾 AI、邊啲必須自己決定。唔再盲目跟風，做嘢清晰好多。",
    avatar: "/assets/testimonials/avatar-5.jpg",
  },
  {
    name: "周先生",
    role: "傳統企業 Marketing",
    quote:
      "公司轉型好需要識用 AI 嘅人。實體課可以即場問，聽得明、做得到，比自己睇教學片實在。",
    avatar: "/assets/testimonials/avatar-6.jpg",
  },
];

function slideHtml(item) {
  const stars = Array.from(
    { length: 5 },
    () => `            <i class="material-symbols-outlined">star_rate</i>`,
  ).join("\n");
  return `<div class="swiper-slide tp-slide-item">
    <div  class="single--item testimonial__items tp-el-content">
        <div class="star__grp tp-el-star">
${stars}
                    </div>
        <div class="review-body">
            <div class="desc tp-el-desc">
                ${item.quote}            </div>  
        </div>
        <div class="content--box">
            <div class="banner-image">
                    <img decoding="async" class="banner-img" src="${item.avatar}" alt="${item.name}">
            </div>
            <div class="description">
                                    <h2 class="slider-title tp-el-title">${item.name}</h2>
                                                    <p class="slider-subtitle tp-el-subtitle">${item.role}</p>
                            </div>            
        </div>
    </div>
</div>`;
}

function cutDivAt(html, start) {
  if (start < 0 || !html.startsWith("<div", start)) return null;
  let i = html.indexOf(">", start) + 1;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) return { start, end: nextClose + 6 };
      i = nextClose + 6;
    }
  }
  return null;
}

export function expandTestimonialSlides(html) {
  const slides = studentTestimonials.map(slideHtml).join("\n");
  const seen = new Set();
  let from = 0;
  while (true) {
    const item = html.indexOf("testimonial__items", from);
    if (item < 0) break;
    const wrapperOpen = html.lastIndexOf('<div class="swiper-wrapper">', item);
    if (wrapperOpen < 0 || seen.has(wrapperOpen)) {
      from = item + 1;
      continue;
    }
    seen.add(wrapperOpen);
    const range = cutDivAt(html, wrapperOpen);
    if (!range) {
      from = item + 1;
      continue;
    }
    const rebuilt = `<div class="swiper-wrapper">\n${slides}\n                    </div>`;
    html = html.slice(0, range.start) + rebuilt + html.slice(range.end);
    from = range.start + rebuilt.length;
  }
  return html;
}

function patchHtmlModule(file, exportName) {
  const src = readFileSync(file, "utf8");
  const m = src.match(
    new RegExp(`^export const ${exportName} = (".*");\\r?\\n?$`, "s"),
  );
  if (!m) throw new Error(`parse failed: ${file}`);
  const html = expandTestimonialSlides(JSON.parse(m[1]));
  const count = (html.match(/testimonial__items/g) || []).length;
  if (count < studentTestimonials.length) {
    throw new Error(`${exportName} only has ${count} testimonials`);
  }
  writeFileSync(file, `export const ${exportName} = ${JSON.stringify(html)};\n`);
  console.log("patched", exportName, { testimonials: count });
}

const self = fileURLToPath(import.meta.url);
if (basename(process.argv[1] || "") === "expand-testimonials.mjs") {
  const ROOT = join(dirname(self), "..");
  mkdirSync(join(ROOT, "public", "assets", "testimonials"), { recursive: true });
  patchHtmlModule(join(ROOT, "src", "theme", "homeHtml.ts"), "homeHtml");
  patchHtmlModule(join(ROOT, "src", "theme", "introHtml.ts"), "introHtml");
}
