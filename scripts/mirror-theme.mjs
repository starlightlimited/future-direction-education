import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { dirname, extname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { expandTestimonialSlides } from "./expand-testimonials.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HTML_SRC = join(ROOT, "online.html");
const OUT_PUBLIC = join(ROOT, "public", "theme");
const OUT_SRC = join(ROOT, "src", "theme");
const ORIGIN = "https://wordpress-1000719-5945832.cloudwaysapps.com";
const DEMO = "https://softivuslab.com/wp/intellicon";

const SKIP_HOST_PARTS = [
  "googleapis.com",
  "gstatic.com",
  "google-analytics",
  "monsterinsights",
];

const queue = new Set();
const saved = new Map();

function shouldSkip(url) {
  return SKIP_HOST_PARTS.some((p) => url.includes(p));
}

function isAssetUrl(urlStr) {
  return /\/wp-content\/|\/wp-includes\/|softivuslab\.com|\/wp\/intellicon\/wp-content\//.test(
    urlStr,
  );
}

function toLocalPath(urlStr) {
  const u = new URL(urlStr);
  if (u.hostname.includes("softivuslab.com")) {
    return `/theme/demo${u.pathname.replace(/^\/wp\/intellicon/, "")}`;
  }
  if (u.hostname.includes("cloudwaysapps.com") || u.hostname.includes("wordpress-")) {
    return `/theme${u.pathname}`;
  }
  const safe = `${u.hostname}${u.pathname}`.replace(/[^a-zA-Z0-9._/-]/g, "_");
  return `/theme/ext/${safe}`;
}

function toDisk(localPath) {
  return join(OUT_PUBLIC, localPath.replace(/^\/theme\/?/, ""));
}

function enqueue(urlStr, base) {
  if (!urlStr) return;
  let abs;
  try {
    abs = new URL(urlStr, base).href;
  } catch {
    return;
  }
  if (abs.startsWith("data:") || abs.startsWith("blob:")) return;
  if (shouldSkip(abs)) return;
  if (!/^https?:/i.test(abs)) return;
  const clean = abs.split("#")[0];
  if (!saved.has(clean)) queue.add(clean);
}

function rewriteHtml(html, base) {
  return html.replace(
    /(href|src|srcset|data-src|action)=["']([^"']+)["']/gi,
    (full, attr, value) => {
      if (attr.toLowerCase() === "srcset") {
        const next = value
          .split(",")
          .map((part) => {
            const bits = part.trim().split(/\s+/);
            if (!bits[0]) return part;
            try {
              const abs = new URL(bits[0], base).href;
              if (isAssetUrl(abs) && !shouldSkip(abs)) {
                enqueue(abs, base);
                bits[0] = toLocalPath(abs);
              }
            } catch {
              /* keep */
            }
            return bits.join(" ");
          })
          .join(", ");
        return `${attr}="${next}"`;
      }
      if (
        value.startsWith("#") ||
        value.startsWith("mailto:") ||
        value.startsWith("tel:") ||
        value.startsWith("javascript:")
      ) {
        return full;
      }
      try {
        const abs = new URL(value, base).href;
        if (shouldSkip(abs) || !isAssetUrl(abs)) return full;
        enqueue(abs, base);
        return `${attr}="${toLocalPath(abs)}"`;
      } catch {
        return full;
      }
    },
  );
}

function rewriteCss(css, fileUrl) {
  return css.replace(/url\((['"]?)([^'")]+)\1\)/g, (full, _q, raw) => {
    const value = raw.trim();
    if (!value || value.startsWith("data:") || value.startsWith("#")) return full;
    enqueue(value, fileUrl);
    try {
      const abs = new URL(value, fileUrl).href;
      if (shouldSkip(abs)) return full;
      return `url("${toLocalPath(abs)}")`;
    } catch {
      return full;
    }
  });
}

async function download(urlStr) {
  if (saved.has(urlStr)) return saved.get(urlStr);
  const local = toLocalPath(urlStr);
  const disk = toDisk(local);
  saved.set(urlStr, local);
  try {
    await access(disk);
    return local;
  } catch {
    /* download */
  }
  await mkdir(dirname(disk), { recursive: true });
  const res = await fetch(urlStr, {
    headers: { "User-Agent": "Mozilla/5.0 theme-mirror" },
  });
  if (!res.ok) {
    console.warn("skip", res.status, urlStr);
    return local;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extname(new URL(urlStr).pathname).toLowerCase();
  if (ext === ".css" || (res.headers.get("content-type") || "").includes("text/css")) {
    const text = rewriteCss(buf.toString("utf8"), urlStr);
    await writeFile(disk, text);
  } else {
    await writeFile(disk, buf);
  }
  process.stdout.write(`saved ${local}\n`);
  return local;
}

const CSS_URLS = [
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-7253.css?ver=1789358855`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/widget-icon-list.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInUp.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/widget-counter.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/widget-image.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-9.css?ver=1789358857`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-1402.css?ver=1789358878`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-2396.css?ver=1789358879`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-2498.css?ver=1789358879`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-1425.css?ver=1789364310`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-6537.css?ver=1789364310`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-4261.css?ver=1789364311`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-4323.css?ver=1789364311`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-6657.css?ver=1789358858`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-5294.css?ver=1789358858`,
  `${ORIGIN}/wp-content/uploads/elementor/css/post-1312.css?ver=1789358858`,
  `${ORIGIN}/wp-content/plugins/tp-elements/themephi-header-footer-elementor/assets/css/header-footer-elementor.css?ver=1.0.0`,
  `${ORIGIN}/wp-content/plugins/tp-elements/assets/css/aos.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/tp-elements/assets/css/elements.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/tp-elements/widgets/iconbox/tp-iconbox-css/iconbox.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/tp-elements/widgets/pricing-table/pricing-table-css/pricing-table.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/tp-elements/widgets/cta/cta-css/cta.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/bootstrap.min.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/tp-icons.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/magnific-popup.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css?ver=8.4.5`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/owl.carousel.min.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/owl.theme.default.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/theme-assets/css/animate.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/theme-assets/css/icon-font.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/theme-assets/css/main.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/scss/theme.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/css/responsive.css?ver=7.1`,
  `${ORIGIN}/wp-content/themes/intellicon/style.css?ver=7.1`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/font-awesome/css/all.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/font-awesome/css/v4-shims.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css?ver=3.32.5`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/css/widget-heading.min.css?ver=3.32.5`,
];

const JS_URLS = [
  `${ORIGIN}/wp-includes/js/jquery/jquery.min.js?ver=3.7.1`,
  `${ORIGIN}/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/owl.carousel.min.js?ver=8.2.3`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/wow.min.js?ver=1.1.2`,
  `${ORIGIN}/wp-content/plugins/tp-elements/assets/js/aos.js?ver=201513434`,
  `${ORIGIN}/wp-includes/js/imagesloaded.min.js?ver=5.0.0`,
  `${ORIGIN}/wp-content/plugins/tp-elements/assets/js/custom.js?ver=201513434`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/modernizr-2.8.3.min.js?ver=2.8.3`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/bootstrap.min.js?ver=5.2.0`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js?ver=8.4.5`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/waypoints.min.js?ver=2.0.3`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/waypoints-sticky.min.js?ver=1.6.2`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/jquery.counterup.min.js?ver=1.0`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/jquery.magnific-popup.min.js?ver=1.1.0`,
  `${ORIGIN}/wp-content/plugins/elementor/assets/lib/jquery-numerator/jquery-numerator.min.js?ver=0.2.1`,
  `${ORIGIN}/wp-content/themes/intellicon/assets/js/main.js?ver=1.0.1`,
];

function replaceUlById(html, id, inner) {
  const start = html.indexOf(`<ul id="${id}"`);
  if (start < 0) return html;
  let i = html.indexOf(">", start) + 1;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf("<ul", i);
    const nextClose = html.indexOf("</ul>", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 3;
    } else {
      depth -= 1;
      if (depth === 0) {
        return `${html.slice(0, start)}<ul id="${id}" class="menu">${inner}</ul>${html.slice(nextClose + 5)}`;
      }
      i = nextClose + 5;
    }
  }
  return html;
}

function replaceOnce(html, from, to) {
  const i = html.indexOf(from);
  if (i < 0) return html;
  return html.slice(0, i) + to + html.slice(i + from.length);
}

function replaceEach(html, from, tos) {
  for (const to of tos) html = replaceOnce(html, from, to);
  return html;
}

function cutBlockContaining(html, needle) {
  const idx = html.indexOf(needle);
  if (idx < 0) return null;
  const start = html.lastIndexOf("<div", idx);
  if (start < 0) return null;
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
      if (depth === 0) {
        return { start, end: nextClose + 6 };
      }
      i = nextClose + 6;
    }
  }
  return null;
}

function removeBlockContaining(html, needle) {
  const range = cutBlockContaining(html, needle);
  if (!range) return html;
  return html.slice(0, range.start) + html.slice(range.end);
}

function replaceBlockContaining(html, needle, replacement) {
  const range = cutBlockContaining(html, needle);
  if (!range) return html;
  return html.slice(0, range.start) + replacement + html.slice(range.end);
}

function localize(html) {
  html = replaceUlById(
    html,
    "menu-main-menu",
    `
<li class="menu-item"><a href="/">首頁</a></li>
<li class="menu-item"><a href="/intro/">介紹</a></li>
<li class="menu-item"><a href="/courses/">課程一覽</a></li>
<li class="menu-item"><a href="/training/">企業培訓</a></li>
<li class="menu-item"><a href="/about/">關於我們</a></li>
<li class="menu-item"><a href="/contact/">聯絡我們</a></li>
`,
  );

  html = replaceUlById(
    html,
    "menu-quick-links",
    `
<li class="menu-item"><a href="/courses/">課程一覽</a></li>
<li class="menu-item"><a href="/about/">關於我們</a></li>
<li class="menu-item"><a href="/training/">企業培訓</a></li>
<li class="menu-item"><a href="/register/">立即報名</a></li>
<li class="menu-item"><a href="/contact/">聯絡我們</a></li>
<li class="menu-item"><a href="/about/">常見問題</a></li>
`,
  );

  html = replaceUlById(
    html,
    "menu-services",
    `
<li class="menu-item"><a href="/courses/geo/">GEO 證書課程</a></li>
<li class="menu-item"><a href="/courses/ai-website/">AI 網站建立</a></li>
<li class="menu-item"><a href="/courses/ai-marketing/">AI Marketing</a></li>
<li class="menu-item"><a href="/about/#partners">院校合作</a></li>
`,
  );

  const pairs = [
    ["Sign In", "立即報名"],
    ["/wp/intellicon/wp-login.php", "/register/"],
    ["Search for:", "搜尋課程："],
    ["Searching...", "搜尋課程"],
    ['value="Search"', 'value="搜尋"'],
    ["Unleash the", "學懂"],
    ["potential of <span class=\"theme\">AI</span> and machine learning", "<span class=\"theme\">AI</span>，不只是跟上科技，而是跟上市場。"],
    [
      "Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions...",
      "我們把複雜的 AI 技術轉化成人人都聽得明、做得到、帶得走的實戰能力。面向中小企、Marketing 從業員、Agency 及創業者。",
    ],
    ["Get Started", "立即報名"],
    ["/wp/intellicon/contact/", "/register/"],
    ["Watch Intro Video", "了解課程"],
    ["https://www.youtube.com/watch?v=PHNJ2_4oefE", "/courses/"],
    ["https://www.youtube.com/watch?v=wXNv-x5zVgE", "/courses/"],
    ["The world's leading AI and machine learning company", "面向成人、企業及 Marketing 的未來技能教育平台"],
    [
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
      "未來方針教育過往以傳統教育／補習服務為基礎，現階段重新定位為 AI 教育機構。我們希望讓你真正學懂 AI，而不是只聽懂幾個新名詞。",
    ],
    ["Key Services Features", "為甚麼現在要學 AI？"],
    [
      "AI is the broader concept of machines being able to carry out tasks in a way that would normally require human intelligence.",
      "客戶開始用 AI 搜尋，Marketing 走向協作，網站門檻降低——企業需要識用的人。",
    ],
    ["See All Case Studies", "查看所有課程"],
    ["/wp/intellicon/case-studies-04/", "/courses/"],
    ["Unique capabilities in action", "我們教甚麼？"],
    ["Save your time and money by choosing our qualified services", "把 AI 由「聽過」變成「識用」"],
    [
      "AI (Artificial Intelligence) and ML (Machine Learning) are closely related fieldss that are focused on the development of computer systems that can perform tasks that would normally require human intelligence, such as understanding natural language, recognizing images, making decisions, and solving problems.",
      "人工智能（AI）與機器學習（ML）密切相關，專注開發可執行原本需要人類智能之任務的電腦系統，例如理解自然語言、辨識圖像、作出決策及解決問題。",
    ],
    [
      "AI (Artificial Intelligence) and ML (Machine Learning) are closely related fields that are focused on the development of computer systems...",
      "三門核心課程：GEO 生成式引擎優化、AI 網站建立、AI Marketing 實戰。",
    ],
    ["Completed Projects", "完成項目"],
    ["Customer Satisfaction", "客戶滿意"],
    ["Expert Employees", "專業團隊"],
    ["Basic and Premium plans at different levels", "三門核心課程，按程度選擇"],
    [
      "AI is the broader concept of machines being able to perform tasks that would normally require human intelligence, such as visual perception, speech recognition, and language translation.",
      "由入門理解到真實工作場景應用，學員帶走可重複使用的方法，而不是一堆用完即棄的工具名稱。",
    ],
    [
      "ML, on the other hand, is a specific subfield of AI that is focused on the development of algorithms and statistical models that allow systems to automatically improve their performance with experience",
      "GEO 證書課程現正接受報名；AI 網站建立及 AI Marketing 課程日期即將公布。",
    ],
    [
      "These algorithms and models can be used for a variety of tasks such as prediction, classification, and clustering.",
      "無需 IT 背景，適合中小企老闆、Marketing 從業員、Agency 及創業者。",
    ],
    ["Enabling Medical Staff To Prescribe The Right Antibiotics", "GEO 生成式引擎優化證書課程"],
    ["Classifying  listing photos using AI &amp; ML", "AI 網站建立實戰課程"],
    ["Prescribe correct antibiotics including AI and ML", "AI Marketing 實戰課程"],
    ["/wp/intellicon/tp-portfolio-category/technology/", "/courses/geo/"],
    ["/wp/intellicon/tp-portfolio-category/machine/", "/courses/ai-website/"],
    ["/wp/intellicon/tp-portfolio-category/robot/", "/courses/ai-marketing/"],
    ["Data Generated", "先理解，再談技術"],
    ["Data Stored", "真實場景學習"],
    ["Data Processing", "帶走可重用方法"],
    ["Actionable Insights", "判斷力持續"],
    [
      "Our company has seen significant improvement in efficiency and accuracy since implementing AI and ML technology in our processes...",
      "課程以真實工作場景出發，聽得明、做得到、帶得走。離開課室時，清楚知道下一步可以怎樣做。",
    ],
    ["Davon Lane", "中小企老闆"],
    ["Louce Voiton", "Marketing 從業員"],
    ["Quick Links", "快速連結"],
    ["Services", "課程"],
    ["Contact", "聯絡"],
    ["Read More", "了解更多"],
    ["Personal Use", "香港實體課程"],
    ["For Multi Use", "企業／團隊"],
    ["Full access library", "香港實體授課"],
    ["One user", "完成可獲證書"],
    ["1 analytic report", "真實工作場景"],
    ["5 free optimization", "可帶走方法"],
    ["Support 24/7", "現正接受報名"],
    ["Talent Advisory Team", "人才顧問團隊"],
    ["100% Security System", "100% 安全系統"],
    ["24 Hours Supports", "24 小時支援"],
    ["(406) 555-0120", "即將公布"],
    ["example@gmail.com", "即將公布"],
    ["Westheimer Rd. Santa Ana, Illinois", "荃灣海濱花園平台C(9-11座)停車場L2 120A號舖"],
    [
      'Copyright ©2024 <a class="intellicon" href="#">Intellicon</a>. Designed By <a class="theme" href="https://themeforest.net/user/pixelaxis">Pixelaxis</a>',
      "© 2026 未來方針教育",
    ],
    ["Facebook-f", "臉書"],
    ["Twitter", "X"],
    ["Linkedin-in", "LinkedIn"],
    ['alt="image"', 'alt="示意"'],
    ['alt="project-img"', 'alt="課程圖片"'],
    ['alt="logo"', 'alt="未來方針教育"'],
    ['title="bell-elements" alt="bell-elements"', 'title="" alt=""'],
    ["/wp/intellicon/about/", "/about/"],
  ];

  for (const [from, to] of pairs) {
    html = html.split(from).join(to);
  }

  html = html.replace(
    '<a href="/courses/" class="play__btn video-btn">',
    '<a href="/courses/" class="play__btn">',
  );

  html = html.split("未來方針教育中心").join("未來方針教育");

  html = replaceOnce(html, " Image Processing", " Marketing 走向協作");
  html = replaceEach(html, " Robotic Automation", [
    " 客戶用 AI 搜尋",
    " 網站門檻降低",
    " 企業需要識用的人",
    " 無需 Coding 背景",
    " 完成課程可獲證書",
  ]);
  html = replaceEach(
    html,
    "  Machine learning (ML), a fundamental concept of AI research since...",
    [
      " 客戶開始用 AI 搜尋產品、服務及供應商，品牌需要被系統理解及引用。",
      " 工作由單純製作內容，走向 AI 協作與策略判斷。",
      " 建立網站更容易，但品牌、結構及推廣能力變得更重要。",
      " 需要的不只是工具，而是懂得把 AI 放入真實工作流程的人。",
      " 無需 IT 或 Coding 背景，以入門及實際應用為主。",
      " 完成課程可獲證書，企業及院校可另約包班。",
    ],
  );
  html = html.replaceAll("<span>Technology</span>", "<span>GEO</span>");
  html = html.replaceAll("<span>Machine</span>", "<span>網站</span>");
  html = html.replaceAll("<span>Robot</span>", "<span>行銷</span>");
  html = replaceEach(
    html,
    "Education AI Studies refers to the field of study that combines education and artificial intelligence (AI)",
    [
      "了解 AI Search 如何認識、理解及引用品牌，並使用 GEO Checklist 檢查網站。",
      "由零開始理解如何運用 AI 規劃及建立網站，同時保留品牌、內容及搜尋基礎。",
      "學習如何把 AI 放入內容、搜尋、網站及 Marketing 工作流程。",
      "了解 AI Search 如何認識、理解及引用品牌，並使用 GEO Checklist 檢查網站。",
      "由零開始理解如何運用 AI 規劃及建立網站，同時保留品牌、內容及搜尋基礎。",
    ],
  );
  html = html.replaceAll('href="#">GEO 生成式引擎優化證書課程', 'href="/courses/geo/">GEO 生成式引擎優化證書課程');
  html = html.replaceAll('href="#">AI 網站建立實戰課程', 'href="/courses/ai-website/">AI 網站建立實戰課程');
  html = html.replaceAll('href="#">AI Marketing 實戰課程', 'href="/courses/ai-marketing/">AI Marketing 實戰課程');
  html = html.replaceAll('href="#"><span>了解更多</span>', 'href="/courses/"><span>了解更多</span>');
  html = replaceEach(
    html,
    '<a href="/courses/" class="play__btn video-btn popup-videos tp-el-video-play-btn">',
    [
      '<a href="/courses/geo/" class="play__btn tp-el-video-play-btn">',
      '<a href="/courses/ai-website/" class="play__btn tp-el-video-play-btn">',
      '<a href="/courses/ai-marketing/" class="play__btn tp-el-video-play-btn">',
      '<a href="/courses/geo/" class="play__btn tp-el-video-play-btn">',
      '<a href="/courses/ai-website/" class="play__btn tp-el-video-play-btn">',
    ],
  );
  html = replaceEach(html, '<a class="slider-btn capa__more tp-el-btn" href="/courses/"><span>了解更多</span>', [
    '<a class="slider-btn capa__more tp-el-btn" href="/courses/geo/"><span>了解更多</span>',
    '<a class="slider-btn capa__more tp-el-btn" href="/courses/ai-website/"><span>了解更多</span>',
    '<a class="slider-btn capa__more tp-el-btn" href="/courses/ai-marketing/"><span>了解更多</span>',
    '<a class="slider-btn capa__more tp-el-btn" href="/courses/geo/"><span>了解更多</span>',
    '<a class="slider-btn capa__more tp-el-btn" href="/courses/ai-website/"><span>了解更多</span>',
  ]);
  html = html.replace(
    /<a class="cmn--btn border__btn" href="#">\s*<span>立即報名<\/span>/g,
    '<a class="cmn--btn border__btn" href="/register/"><span>立即報名</span>',
  );
  html = html.replace(
    /<span class="dollar">&#036;<\/span>\s*25\.00/,
    "即將公布",
  );
  html = html.replace(
    /<span class="dollar">&#036;<\/span>\s*00\.00/,
    "HK$100",
  );
  html = html.replace(
    /<span class="dollar">&#036;<\/span>\s*5\.00/,
    "即將公布",
  );
  html = html.replaceAll(">Premium</h4>", ">AI Marketing</h4>");
  html = html.replaceAll(">Basic</h4>", ">GEO 入門</h4>");
  html = html.replaceAll(">Standard</h4>", ">AI 網站</h4>");
  html = replaceEach(
    html,
    "Step-by-step user manual for effective and efficient use",
    ["上課帶走可重複使用的方法", "學員怎麼說"],
  );
  html = replaceEach(
    html,
    "  The integration of AI and ML is leading to the creation of intelligent systems that can automate tasks, improve decision-making",
    [
      " 不以艱深術語作為門檻，先講清楚原理。",
      " 每堂課以真實商業及 Marketing 情境作例子。",
      " 學員帶走 Framework、Checklist 或可重複使用的方法。",
      " 不是盲目依賴 AI，而是知道甚麼應交給 AI、甚麼必須由人決定。",
    ],
  );

  html = html.replace(
    'class="readon themephi_button elementor-animation-" href="/about/"',
    'class="readon themephi_button elementor-animation-" href="/register/"',
  );

  html = html.replaceAll(`${ORIGIN}`, "");
  html = html.replaceAll("https://wordpress-1000719-5945832.cloudwaysapps.com", "");
  html = html.replaceAll(`class='elementor-clickable' href=""`, `class='elementor-clickable' href="/"`);
  html = html.replaceAll(`action=""`, `action="/courses/"`);
  html = html.replace(/href="\/home\/?"/g, 'href="/"');
  html = html.replace(/href="\/about\/?"/g, 'href="/about/"');
  html = html.replace(/href="\/contact\/?"/g, 'href="/contact/"');
  html = html.replace(/href="\/pricing\/?"/g, 'href="/courses/"');
  html = html.replace(/href="\/service\/?"/g, 'href="/courses/"');
  html = html.replace(/href="\/blog\/?"/g, 'href="/about/"');

  html = html.replace(
    /Artificial Intelligence \(AI\) and Machine Learning \(ML\) are closely related technologies that enable computers to learn from data and make predictions/,
    "AI 教育 × 商業應用 × 未來技能。我們把複雜的 AI 技術轉化成簡單、實用、可即時應用的學習內容。",
  );

  html = html.replace(
    /Subscribe to newsletters and <br> get news\./,
    "立即報名，<br>開始學 AI。",
  );
  html = html.replace(
    /Sign up for updates and stay informed about the latest developments and be a part of our community and get the latest news and insights/,
    "GEO 證書課程現正接受報名。無需 Coding 背景，適合中小企、Marketing 從業員、Agency 及創業者。",
  );
  html = replaceBlockContaining(
    html,
    "elementor-element-1a65ade",
    `<div class="elementor-element elementor-element-1a65ade elementor-widget__width-initial tp-subscribe-form elementor-widget elementor-widget-metform" data-id="1a65ade" data-element_type="widget" data-widget_type="metform.default">
					<div class="elementor-widget-container">
		<a class="newsletter-register-btn cmn--btn readon themephi_button" href="/register/"><span>立即報名</span></a>
					</div>
				</div>`,
  );

  return html;
}

function localizeIntro(html) {
  const pairs = [
    ["Revolutionize your", "認識我們的"],
    [
      'business with <span class="theme">AI</span>',
      '<span class="theme">AI</span> 課程',
    ],
    ['<span class="theme2">machines</span>', '<span class="theme2">介紹</span>'],
    [
      "We offer professional AI &amp; ML solutions for humans",
      "把複雜技術拆成簡單、實用、可即時應用的課程",
    ],
    [
      "Artificial intelligence (AI) is perceiving, synthesizing, and inferring information—demonstrated by , as opposed to intelligence displayed by n and . Example tasks in which this is done include speech recognition, computer vision, translation between (natural) languages, as well as other mappings of inputs. The of defines artificial intelligence as:",
      "無需 Coding 背景，重點是理解、判斷與帶到工作上使用。面向中小企、Marketing 從業員、Agency 及創業者。",
    ],
    ["Customer satisfaction", "學員滿意"],
    [">Marketing<", ">實戰導向<"],
    ["ICT AI Performance", "AI Marketing 實戰"],
    [">Performance<", ">可帶走方法<"],
    [
      "Check out our wide range of services including AI",
      "三門核心課程，按程度選擇",
    ],
    [
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
      "由入門理解到真實工作場景應用，學員帶走可重複使用的方法，而不是一堆用完即棄的工具名稱。",
    ],
    ["Advanced Technology", "香港實體授課"],
    ["Competitive Pricing", "完成可獲證書"],
    ["See All Services", "查看課程詳情"],
    ["/wp/intellicon/service/", "/courses/geo/"],
    [
      'We have successfully completed <span class="basecon">3k+</span> projects annually and counting',
      '香港實體授課，完成課程可獲 <span class="basecon">證書</span>',
    ],
    ["Awards Won", "企業包班"],
    ["Have any question about us?", "想了解課程？"],
    ["Don't hesitate to contact us.", "歡迎查詢或立即報名。"],
    ["Contact Us", "聯絡我們"],
    [
      "Real-world examples of our unique capabilities",
      "我們教甚麼？三門核心課程介紹",
    ],
    ["AI Antibiotics", "GEO 證書課程"],
    ["Classified Listing AI Photos", "AI 網站建立"],
    ["Industry Labor Machine", "AI Marketing"],
    ["Army Defence AI &amp; ML", "AI 網站實戰"],
    [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industrLorem Ipsum is simply dummy text of the printing and typesetting industrLorem Ipsum is simply dummy text of the printing and typesetting industry",
      "了解 AI Search 如何認識、理解及引用品牌，並使用 GEO Checklist 檢查網站。",
    ],
    ["Pricing Information", "課程收費與報名"],
    ["Full acess library", "香港實體授課"],
    ["One user", "完成可獲證書"],
    ["25 Analytic Reports", "真實工作場景"],
    ["5 Analytic Reports", "真實工作場景"],
    ["1 Analytic Reports", "真實工作場景"],
    ["Five users", "可帶走方法"],
    ["Five user", "可帶走方法"],
    ["Ten user", "企業／團隊"],
    ["25 Free optimization", "現正接受報名"],
    ["15 Free optimization", "現正接受報名"],
    ["5 Free optimization", "現正接受報名"],
    ["Hotline supports 24/7", "歡迎查詢"],
    [">Free</h4>", ">GEO 入門</h4>"],
    [">Pro</h4>", ">AI 網站</h4>"],
    [
      "Detailed Guide on How the System Works and Operates",
      "上課帶走可重複使用的方法",
    ],
    [
      "The integration of AI and ML is leading to the creation of intelligent systems",
      "不以艱深術語作為門檻，先講清楚原理。",
    ],
    ["User experience reports on support and services", "學員怎麼說"],
    ["Luice Voitton", "Marketing 從業員"],
    ["Jhon Smith", "Agency 負責人"],
    ["Web Designer", "數碼行銷"],
    ["Jhon Lane", "創業者"],
    ["WP Developer", "中小企老闆"],
    ["Simplifying Your Information Search with FAQs", "常見問題"],
    [
      "Artificial intelligence, or AI, is the simulation of human intelligence in machines that are programmed to think and learn...",
      "以下是學員報名前最常問的問題。如需進一步資料，歡迎聯絡我們。",
    ],
    ["What is the difference between AI and ML?", "GEO 同 SEO 有甚麼分別？"],
    [
      "What are some common applications of AI and ML?",
      "完全不懂 AI，可以參加嗎？",
    ],
    ["How can I get started with AI and ML?", "課程適合甚麼人？"],
    ["What skills do I need to work in AI and ML?", "完成課程有證書嗎？"],
    [
      "What are the benefits of using AI and ML in business?",
      "可以公司包班嗎？",
    ],
    ["Are there any limitations to AI and ML?", "如何報名？"],
    ["Join Our Community", "立即報名，開始學 AI"],
    [
      "We are trusted by over 5000+ clients. Join them by using our services",
      "GEO 證書課程現正接受報名。無需 Coding 背景",
    ],
    ["and grow your business.", "適合中小企、Marketing 從業員及創業者。"],
    ["(Save 30%)", "現正接受報名"],
    ["Join Us", "立即報名"],
    ["Privacy", "安全可靠"],
    [">Monthly<", ">短期<"],
    [">Yearly <", ">全年 <"],
    ["/15 Days", "/短期"],
    ["/365 Days", "/一年"],
  ];

  for (const [from, to] of pairs) {
    html = html.split(from).join(to);
  }

  html = replaceEach(html, " Robotic Automation", [
    " GEO 證書課程",
    " AI 網站建立",
    " AI Marketing",
  ]);
  html = replaceEach(
    html,
    " Machine learning (ML), a fundamental concept of AI research...",
    [
      " 了解 AI Search 如何認識、理解及引用品牌。",
      " 由零開始理解如何運用 AI 規劃及建立網站。",
      " 學習如何把 AI 放入 Marketing 工作流程。",
    ],
  );
  html = replaceEach(
    html,
    "Learn the basics: Acquire a basic understanding of AI and ML concepts and technologies by reading books, taking online courses, or attending workshops.",
    [
      "不是。課程會解釋 SEO 與 GEO 的關係，但重點放在 AI Search、品牌資訊如何被理解，以及如何初步檢查網站。",
      "可以。課程以入門及實際應用為主，會先講清楚原理，再進入工具或框架。基本上不需要 Coding 背景。",
      "現階段主要面向中小企老闆、Marketing 從業員、Agency、創業者及希望提升職場技能的在職人士。",
      "指定證書課程完成後可獲課程完成證書；實際證書名稱及發放條件以各課程頁面公布為準。",
      "可以。可按企業需要調整案例、內容深度及工作場景，適合 Marketing、Sales 或跨部門 AI 入門培訓。",
      "按網站「立即報名」連結，填寫資料並按指示完成報名程序即可。",
    ],
  );
  html = replaceEach(
    html,
    "不以艱深術語作為門檻，先講清楚原理。",
    [
      "不以艱深術語作為門檻，先講清楚原理。",
      "每堂課以真實商業及 Marketing 情境作例子。",
      "學員帶走 Framework、Checklist 或可重複使用的方法。",
      "不是盲目依賴 AI，而是知道甚麼應交給 AI、甚麼必須由人決定。",
    ],
  );

  html = html.replaceAll(
    'href="/register/" > <span>聯絡我們</span>',
    'href="/contact/"><span>聯絡我們</span>',
  );
  html = html.replace(
    /<a href="\/courses\/" class="play__btn video-btn">/,
    '<a href="/courses/geo/" class="play__btn">',
  );
  html = html.replaceAll(">Education AI Studies</", ">GEO 生成式引擎優化</");
  html = html.replaceAll("$ 00.00", "HK$100");
  html = html.replaceAll("$00.00", "HK$100");
  html = html.replaceAll("$ 60.00", "即將公布");
  html = html.replaceAll("$ 90.00", "即將公布");
  html = html.replaceAll("$199", "即將公布");
  html = html.replaceAll("$399", "即將公布");

  html = html.replace(
    /<a class="themephi_button " href="\/wp\/intellicon\/contact\/"\s*>/,
    '<a class="themephi_button" href="/contact/">',
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/ai-antibiotics/",
    "/courses/geo/",
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/classifying-al-photos/",
    "/courses/ai-website/",
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/industry-labor-machine/",
    "/courses/ai-marketing/",
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/education-all-studies/",
    "/courses/geo/",
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/army-defense-al/",
    "/courses/ai-website/",
  );
  html = html.replaceAll(
    "/wp/intellicon/tp-portfolio/ict-al-performance/",
    "/courses/ai-marketing/",
  );
  html = html.replaceAll("/wp/intellicon/case-studies-02/", "/courses/");
  html = replaceEach(html, "https://www.youtube.com/watch?v=oV74Najm6Nc&#038;t=412s", [
    "/courses/geo/",
    "/courses/ai-website/",
    "/courses/ai-marketing/",
    "/courses/geo/",
    "/courses/ai-website/",
    "/courses/ai-marketing/",
  ]);

  return html;
}

function localizeTraining(html) {
  const pairs = [
    [
      'Maker of AI and</span><span class="d3"><span class="rounded">machine</span> learning products',
      '企業／團隊</span><span class="d3"><span class="rounded">AI</span> 包班培訓',
    ],
    [
      "Empower your creativity with artificial intelligence",
      "按企業需要，把 AI 放入真實工作流程",
    ],
    ["Computer Vision", "香港實體"],
    ["Content Services", "可包班"],
    ["Digital Publishing", "可獲證書"],
    ["Data Enhancement", "真實場景"],
    ["Benefits Service Features", "企業培訓可以帶走甚麼"],
    [
      "AI is the broader concept of machines being able to carry out tasks in a way that would normally require human intelligence",
      "可按企業需要調整案例、內容深度及工作場景，適合 Marketing、Sales 或跨部門培訓",
    ],
    ["Discover More", "了解更多"],
    ["How It’s Work", "培訓如何進行"],
    ["How It's Work", "培訓如何進行"],
    ["Solutions", "判斷力持續"],
    ["Differentiating through case studies", "可按團隊需要調整的課程方向"],
    ["Education All Studies", "GEO 生成式引擎優化"],
    ["Classifying Al Photos", "AI 網站建立"],
    ["Army Defence Ml", "AI Marketing"],
    ["Ict Al Performance", "AI Marketing 實戰"],
    [
      "Lorem Ipsum is simply dummy text of the printing and&hellip;",
      "了解 AI Search 如何認識、理解及引用品牌。",
    ],
    [
      "User-Centered Support Ratings &amp; Evaluations",
      "企業客戶怎麼說",
    ],
    [
      "Machine learning is a subset of AI that involves the development of algorithms and statistical models that enable a system to improve its performance on a task over time through experience. ML algorithms learn from data, allowing them to make predictions, classify objects, and control systems with increasing accuracy.",
      "企業及團隊可按真實工作場景包班，帶走可重複使用的方法，而不是一堆用完即棄的工具名稱。",
    ],
    [
      "The integration of AI and ML is leading to the creation of intelligent systems that can automate tasks, improve decision-making, and drive innovation across industries.",
      "課程以真實工作場景出發，聽得明、做得到、帶得走。離開課室時，清楚知道下一步可以怎樣做。",
    ],
    [
      "Our company has seen significant improvement in efficiency and accuracy since implementing AI and ML technology...",
      "課程以真實工作場景出發，聽得明、做得到、帶得走。",
    ],
    ["Esther Howard", "中小企老闆"],
    ["About Us", "關於我們"],
    ["Machine Expert", "零售業"],
    ["Devon Lane", "Marketing 主管"],
    ["AI Expert", "數碼行銷"],
    ["Robert Fox", "Agency 負責人"],
    ["Web Expert", "服務業"],
    [
      "The Quick Reference Guide for All Your Questions",
      "企業培訓常見問題",
    ],
    ["Our pricing features", "包班方案"],
    [">Monthly<", ">短期<"],
    [">Yearly<", ">全年<"],
    ["(Save 30%)", "現正接受報名"],
    ["Full Access Libra", "香港實體授課"],
    ["Only One User", "完成可獲證書"],
    ["Ten Analytics Reports", "真實工作場景"],
    ["Three Analytics Reports", "真實工作場景"],
    ["One Analytics Reports", "真實工作場景"],
    ["Ten Users Only", "企業／團隊"],
    ["Five Users Only", "可帶走方法"],
    ["25 Free Optimization", "現正接受報名"],
    ["15 Free Optimization", "現正接受報名"],
    ["5 Free Optimization", "現正接受報名"],
    ["24/7 Supports", "歡迎查詢"],
    [">Free</h4>", ">GEO 入門</h4>"],
    [">Premium</h4>", ">AI 網站</h4>"],
    [">Business</h4>", ">AI Marketing</h4>"],
    ["AI Antibiotics", "GEO 證書課程"],
    ["Industry Labor Machine", "AI 網站實戰"],
  ];

  for (const [from, to] of pairs) {
    html = html.split(from).join(to);
  }

  html = replaceEach(html, ">Robotic Automation</h4>", [
    ">GEO 應用</h4>",
    ">GEO 證書課程</h4>",
  ]);
  html = replaceEach(html, ">Machine Learning</h4>", [
    ">AI 網站</h4>",
    ">AI 網站建立</h4>",
  ]);
  html = replaceEach(html, ">Virtual Reality</h4>", [
    ">AI Marketing</h4>",
    ">AI Marketing 實戰</h4>",
  ]);
  html = replaceEach(
    html,
    "Machine learning (ML), a fundamental concept of AI research...",
    [
      "了解 AI Search 如何認識、理解及引用品牌。",
      "由零開始理解如何運用 AI 規劃及建立網站。",
      "學習如何把 AI 放入 Marketing 工作流程。",
      "了解 AI Search 如何認識、理解及引用品牌。",
      "由零開始理解如何運用 AI 規劃及建立網站。",
      "學習如何把 AI 放入 Marketing 工作流程。",
    ],
  );
  html = replaceEach(
    html,
    "Artificial intelligence, or AI, is the simulation of human intelligence in machines that are programmed to think and learn. The field of AI research began in the 1950s and has since evolved to encompass a wide range of technologies and applications.",
    [
      "可按企業需要調整案例、內容深度及工作場景。適合 Marketing、Sales、Management 或跨部門 AI 入門培訓。",
      "以下是企業包班前最常問的問題。歡迎聯絡我們安排時間與內容。",
    ],
  );
  html = replaceEach(
    html,
    "The integration of AI and ML is leading to the creation of...",
    [
      "不以艱深術語作為門檻，先講清楚原理。",
      "每堂課以真實商業及 Marketing 情境作例子。",
      "學員帶走 Framework、Checklist 或可重複使用的方法。",
      "不是盲目依賴 AI，而是知道甚麼應交給 AI、甚麼必須由人決定。",
    ],
  );
  html = replaceEach(
    html,
    "Learn the basics: Acquire a basic understanding of AI and ML concepts and technologies by reading books, taking online courses, or attending workshops.",
    [
      "可以。可按企業需要調整案例、內容深度及工作場景，適合 Marketing、Sales、Management 或跨部門 AI 入門培訓。",
      "可以。課程以入門及實際應用為主，會先講清楚原理。基本上不需要 Coding 背景。",
      "可按團隊規模安排時數、地點及案例，上課地點將於確認後通知。",
      "指定證書課程完成後可獲課程完成證書；實際證書名稱及發放條件以各課程公布為準。",
    ],
  );
  html = html.replace(
    /What is the difference between AI and ML\?/,
    "可以公司包班嗎？",
  );
  html = html.replace(
    /What are some common applications of AI and ML\?/,
    "完全不懂 AI 的同事可以參加嗎？",
  );
  html = html.replace(
    /How can I get started with AI and ML\?/,
    "包班可以在公司上課嗎？",
  );
  html = html.replace(
    /What skills do I need to work in AI and ML\?/,
    "完成培訓有證書嗎？",
  );
  html = html.replace(
    /<a href="\/courses\/" class="play__btn video-btn">/,
    '<a href="/contact/" class="play__btn">',
  );
  html = html.replaceAll("$ 00.00", "即將公布");
  html = html.replaceAll("$00.00", "即將公布");
  html = html.replaceAll("$ 30.00", "即將公布");
  html = html.replaceAll("$ 60.00", "即將公布");
  html = html.replaceAll("$ 90.00", "即將公布");
  html = html.replaceAll("$ 199", "即將公布");
  html = html.replaceAll("$199", "即將公布");
  html = html.replaceAll("$ 299", "即將公布");
  html = html.replaceAll("$299", "即將公布");
  html = html.replaceAll("$ 399", "即將公布");
  html = html.replaceAll("$399", "即將公布");

  return html;
}

function extract(html, startRe, endMarker) {
  const start = html.search(startRe);
  const end = html.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`extract failed ${startRe}`);
  return html.slice(start, end + endMarker.length);
}

function stripHeaderSearch(html) {
  html = html.replace(
    /<div class="sticky_form tps-search-popup">[\s\S]*?<\/i>\s*<\/div>\s*/,
    "",
  );
  html = html.replace(
    /<div class="elementor-element elementor-element-eda865d[\s\S]*?<\/form>\s*<\/div>\s*<\/div>\s*/,
    "",
  );
  return html;
}

function toModule(name, html) {
  return `export const ${name} = ${JSON.stringify(html)};\n`;
}

const html0 = await readFile(HTML_SRC, "utf8");
let html = rewriteHtml(html0, `${ORIGIN}/home/`);
const intro0 = await readFile(join(ROOT, "home-2.html"), "utf8");
let intro = rewriteHtml(intro0, `${ORIGIN}/home-2/`);
const training0 = await readFile(join(ROOT, "home-4.html"), "utf8");
let training = rewriteHtml(training0, `${ORIGIN}/home-4/`);

for (const url of [...CSS_URLS, ...JS_URLS]) enqueue(url, ORIGIN);

while (queue.size) {
  const batch = [...queue];
  queue.clear();
  for (const url of batch) {
    await download(url);
  }
}

html = expandTestimonialSlides(localize(html));
intro = expandTestimonialSlides(localize(localizeIntro(intro)));
training = localize(localizeTraining(training));

const headerHtml = stripHeaderSearch(
  extract(
    html,
    /<div class="sticky_form tps-search-popup">/,
    "</header>",
  ),
);
const homeHtml = extract(
  html,
  /<div class="main-contain offcontents">/,
  "<!-- .main-container -->",
);
const footerHtml = extract(html, /<footer itemtype=/, "</footer>");
const introHtml = extract(
  intro,
  /<div class="main-contain offcontents">/,
  "<!-- .main-container -->",
);
const trainingHtml = extract(
  training,
  /<div class="main-contain offcontents">/,
  "<!-- .main-container -->",
);

await mkdir(OUT_SRC, { recursive: true });
await writeFile(join(OUT_SRC, "headerHtml.ts"), toModule("headerHtml", headerHtml));
await writeFile(join(OUT_SRC, "homeHtml.ts"), toModule("homeHtml", homeHtml));
await writeFile(join(OUT_SRC, "footerHtml.ts"), toModule("footerHtml", footerHtml));
await writeFile(join(OUT_SRC, "introHtml.ts"), toModule("introHtml", introHtml));
await writeFile(join(OUT_SRC, "trainingHtml.ts"), toModule("trainingHtml", trainingHtml));

const cssLocals = CSS_URLS.map((u) => toLocalPath(u));
const jsLocals = JS_URLS.map((u) => toLocalPath(u));
await writeFile(
  join(OUT_SRC, "assets.ts"),
  `export const themeCss = ${JSON.stringify(cssLocals, null, 2)};\nexport const themeJs = ${JSON.stringify(jsLocals, null, 2)};\n`,
);

console.log("done", { files: saved.size, css: cssLocals.length, js: jsLocals.length });
