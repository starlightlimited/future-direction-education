export const site = {
  nameZh: "未來方針教育",
  legalName: "未來方針教育中心",
  nameEn: "Future Direction Education",
  slogan: "AI 教育 × 商業應用 × 未來技能",
  tagline: "學懂 AI，不只是跟上科技，而是跟上市場。",
  license: "596434",
  address: "荃灣海濱花園平台C(9-11座)停車場L2 120A號舖",
  phone: "即將公布",
  whatsapp: "即將公布",
  email: "即將公布",
  hours: "即將公布",
  description:
    "未來方針教育專注 AI 與數碼技能教育，將複雜技術拆成簡單、實用、可即時應用的課程，面向中小企、Marketing 從業員及創業者。",
};

export const nav = [
  { href: "/intro", label: "介紹" },
  { href: "/courses", label: "課程一覽" },
  { href: "/training", label: "企業培訓" },
  { href: "/about", label: "關於我們" },
  { href: "/contact", label: "聯絡我們" },
];

export const whyNow = [
  {
    title: "客戶用 AI 搜尋",
    body: "客戶開始用 AI 搜尋產品、服務及供應商，品牌需要被系統理解及引用。",
    icon: "/assets/icon-ai.png",
  },
  {
    title: "Marketing 走向協作",
    body: "工作由單純製作內容，走向 AI 協作與策略判斷。",
    icon: "/assets/machine-1.png",
  },
  {
    title: "網站門檻降低",
    body: "建立網站更容易，但品牌、結構及推廣能力變得更重要。",
    icon: "/assets/cloud.png",
  },
  {
    title: "企業需要識用的人",
    body: "需要的不只是工具，而是懂得把 AI 放入真實工作流程的人。",
    icon: "/assets/man.png",
  },
];

export const principles = [
  {
    key: "簡單",
    title: "先理解，再談技術",
    body: "不以艱深術語作為門檻，先講清楚原理。",
  },
  {
    key: "Practical",
    title: "真實場景學習",
    body: "每堂課以真實商業及 Marketing 情境作例子。",
  },
  {
    key: "Applicable",
    title: "帶走可重用方法",
    body: "學員帶走 Framework、Checklist 或可重複使用的方法。",
  },
  {
    key: "面向未來",
    title: "工具會變，判斷力持續",
    body: "不是盲目依賴 AI，而是知道甚麼應交給 AI、甚麼必須由人決定。",
  },
];

export const audiences = [
  "中小企老闆",
  "Marketing Manager / Executive",
  "Digital Marketing / Agency",
  "創業者",
  "希望掌握 AI 工作技能的在職人士",
  "正進行數碼轉型的團隊",
];

export const stats = [
  { value: "3", label: "門核心課程" },
  { value: "實體", label: "香港授課" },
  { value: "證書", label: "完成可獲證書" },
  { value: "包班", label: "企業可內訓" },
];

export const credentials = [
  `商業登記 ${site.license}`,
  "100% 香港實體教學",
  "完成課程可獲證書",
];

export const differentiators = [
  "貼近香港市場語境同真實商業案例",
  "真人導師實體授課，即場可以提問",
  "每堂課帶走可重複使用嘅 Framework／Checklist",
  "企業／院校可另約包班培訓",
];

export type CourseId = "geo" | "ai-website" | "ai-marketing";

export type Course = {
  id: CourseId;
  slug: string;
  title: string;
  english?: string;
  level: string;
  duration: string;
  audience: string;
  summary: string;
  cover: string;
  fee: string;
  date?: string;
  time?: string;
  format: string;
  seoTitle: string;
  seoDescription: string;
  positioning: string;
  goals: string[];
  learnings: string[];
  takeaways: string[];
  suitable: string;
  requirements?: string;
  flow?: { step: string; title: string; body: string }[];
  contents?: string[];
  outcome: string;
};

export const courses: Course[] = [
  {
    id: "geo",
    slug: "geo",
    title: "GEO 生成式引擎優化證書課程",
    english: "讓品牌被 AI 搜尋理解及引用",
    level: "入門",
    duration: "2 小時",
    audience: "中小企／Marketing／Agency",
    summary:
      "了解 AI Search 如何認識、理解及引用品牌，並使用 GEO Checklist 檢查網站。",
    cover: "/assets/capbi1.jpg",
    fee: "HK$100 / 位",
    date: "2026年9月17日（星期四）",
    time: "晚上 7:30 – 9:30",
    format: "香港實體課程",
    seoTitle: "GEO 證書課程｜生成式引擎優化入門｜未來方針教育",
    seoDescription:
      "2 小時理解 GEO 與 AI Search，即場使用 Website Checklist 檢查網站。2026年9月17日香港實體課程，HK$100。",
    positioning:
      "當客戶開始問 ChatGPT、Google AI 等工具「邊間公司好？」——你的品牌有沒有機會出現在答案？這堂課會讓你用 2 小時理解 GEO，並學會初步檢查自己的網站。",
    goals: [
      "理解 SEO 與 GEO 的基本分別，以及 AI Search 的搜尋邏輯。",
      "學習 AI 如何從網站判斷「你是誰、你做甚麼、適合誰、為甚麼值得相信」。",
      "即場使用 GEO Website Checklist，初步檢查自己或客戶網站。",
    ],
    learnings: [
      "GEO 與傳統 SEO 的基本分別，以及 AI Search 的搜尋邏輯。",
      "AI 如何從網站判斷 WHO / WHAT / WHY YOU。",
      "如何把傳統 Keyword 思維轉成真實客戶會向 AI 提出的問題。",
      "香港市場常見的在地搜尋語境、地區、價錢、比較及推薦問題。",
      "如何使用 GEO Website Checklist。",
      "如何理解 AI Citation、Brand Mention、Answer Coverage 及 Recommendation Scenario。",
    ],
    takeaways: [
      "一套聽得明的 GEO 基礎邏輯。",
      "一份可重複使用的 GEO Website Checklist。",
      "一個判斷框架：找不到你 → 看不懂你 → 沒理由推薦你。",
    ],
    suitable:
      "中小企老闆｜Marketing Manager / Executive｜Digital Marketing / Agency｜傳統企業 Marketing 團隊｜希望理解 AI Search 的創業者",
    requirements:
      "無需 IT 背景｜無需 Coding 經驗｜無需 SEO 專業知識。建議準備自己公司或客戶網站網址，以便課堂實戰。",
    flow: [
      {
        step: "01",
        title: "GEO 基礎",
        body: "搜尋由「找連結」走向「直接問答案」；SEO vs GEO。",
      },
      {
        step: "02",
        title: "AI 如何認識品牌",
        body: "WHO / WHAT / WHY YOU；網站內容與品牌訊號。",
      },
      {
        step: "03",
        title: "GEO 搜尋意圖",
        body: "地區＋服務、問題＋場景、疑問句、規格、價錢等。",
      },
      {
        step: "04",
        title: "香港 Localization",
        body: "廣東話語境、本地地名、真實使用場景及常見疑問。",
      },
      {
        step: "05",
        title: "網站健康檢查",
        body: "即場使用 Checklist 檢查網站。",
      },
      {
        step: "06",
        title: "成效與下一步",
        body: "理解 GEO 基本指標及持續測試方向。",
      },
    ],
    outcome: "完成課程可獲課程完成證書。上課地點將於報名成功後通知。",
  },
  {
    id: "ai-website",
    slug: "ai-website",
    title: "AI 網站建立實戰課程",
    level: "入門｜實戰",
    duration: "即將公布",
    audience: "創業者／Marketing／中小企",
    summary:
      "由零開始理解如何運用 AI 規劃及建立網站，同時保留品牌、內容及搜尋基礎。",
    cover: "/assets/capabi2.jpg",
    fee: "即將公布",
    format: "香港實體課程",
    seoTitle: "AI 網站建立課程｜由零規劃商業網站｜未來方針教育",
    seoDescription:
      "讓沒有技術背景的學員理解網站由零到上線的思考流程，並利用 AI 協助規劃、內容及初步製作。",
    positioning: "由「叫 AI 整個網站」到真正建立一個可以用的商業網站。",
    goals: [
      "理解一個網站由零到上線的完整思考流程。",
      "學習如何利用 AI 協助完成規劃、內容及初步製作。",
      "知道哪些技術及商業環節不能只靠 AI 自動決定。",
    ],
    learnings: [
      "網站不是由首頁開始：先定義目標、受眾及轉化行動。",
      "如何利用 AI 建立 Sitemap、Page Structure 及內容初稿。",
      "如何寫出首頁、服務頁、About Us、FAQ、Contact 等基本網站內容。",
      "如何判斷 AI 生成內容是否空泛、重複或不符合品牌。",
      "基本 SEO / GEO 友善內容概念。",
      "AI Website Builder 的角色、限制及常見錯誤。",
      "上線前基本 Checklist：手機版、CTA、表單、連結、內容、品牌一致性及可讀性。",
    ],
    takeaways: [
      "一份自己的網站 Blueprint。",
      "包括網站目標、Sitemap、核心頁面內容框架及上線前 Checklist。",
    ],
    suitable:
      "創業者｜中小企老闆｜Marketing 人員｜Freelancer｜希望用 AI 建立個人品牌網站的人士",
    outcome: "可作為自行製作或交予網站開發團隊的基礎。日期、時數及費用即將公布。",
  },
  {
    id: "ai-marketing",
    slug: "ai-marketing",
    title: "AI Marketing 實戰課程",
    level: "入門至應用",
    duration: "即將公布",
    audience: "Marketing／Agency／企業團隊",
    summary:
      "學習如何把 AI 放入內容、搜尋、網站及 Marketing 工作流程，提升效率與判斷力。",
    cover: "/assets/capabi3.jpg",
    fee: "即將公布",
    format: "香港實體課程",
    seoTitle: "AI Marketing 課程｜AI 行銷實戰與工作流程｜未來方針教育",
    seoDescription:
      "把 AI 放入 Marketing Workflow，建立由 Research、定位、內容、製作、搜尋到分析的協作流程。",
    positioning: "不是學更多工具，而是建立一套更有效率的 Marketing 工作方式。",
    goals: [
      "理解 AI 在不同 Marketing 環節的角色。",
      "建立由 Research、定位、內容、製作、搜尋到分析的基本協作流程。",
      "清楚哪些工作可以交給 AI、哪些需要人工判斷。",
    ],
    contents: [
      "AI Marketing 的正確分工：AI 做甚麼？人應該決定甚麼？",
      "利用 AI 做市場 Research、受眾整理及競爭者分析。",
      "由品牌定位到 Content Pillar，再生成內容方向。",
      "AI 寫稿：如何避免內容太「AI」、太空泛、沒有品牌語氣。",
      "AI 圖像／影片在 Marketing 的應用及品質判斷。",
      "AI Search / GEO：未來品牌曝光不只來自傳統搜尋。",
      "AI Website：網站如何成為 Marketing 系統的一部分。",
      "建立小型 AI Marketing Workflow。",
      "如何檢查 AI 產出：事實、品牌、語氣、版權及商業風險。",
    ],
    learnings: [
      "把 AI 放入 Marketing Workflow，而不是單純收藏更多 Prompt。",
      "按實際內容選用合適 AI 工具示範，不限於 ChatGPT。",
    ],
    takeaways: [
      "一套適合自己工作／品牌的 AI Marketing Workflow。",
      "清楚知道哪些工作可以交給 AI、哪些需要人工判斷。",
    ],
    suitable:
      "Marketing Manager / Executive｜中小企老闆｜Agency 團隊｜品牌負責人｜創業者｜希望提升工作效率的在職人士",
    outcome: "學員可將不同 AI 工具串連到日常 Marketing。日期、時數及費用即將公布。",
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export const faqs = [
  {
    q: "我完全不懂 AI，可以參加嗎？",
    a: "可以。課程以入門及實際應用為主，會先講清楚原理，再進入工具或框架。除非個別課程另有註明，基本上不需要 Coding 背景。",
  },
  {
    q: "課程適合學生還是上班族？",
    a: "現階段 AI 商業應用課程主要面向中小企老闆、Marketing 從業員、Agency、創業者及希望提升職場技能的在職人士。",
  },
  {
    q: "GEO 課程是否等於 SEO 課程？",
    a: "不是。課程會解釋 SEO 與 GEO 的關係，但重點放在 AI Search、品牌資訊如何被理解，以及如何初步檢查網站是否具備 GEO 基礎。",
  },
  {
    q: "上完 GEO 課程是否可以自己完成所有 GEO 技術工作？",
    a: "2 小時課程的目標是讓你理解原理、識得判斷及完成基礎檢查，而不是在短時間內訓練成技術工程師。較深入的網站、結構化資料、技術 SEO / GEO 或持續內容優化仍可能需要專業團隊處理。",
  },
  {
    q: "AI 網站課程會教 Coding 嗎？",
    a: "課程核心不是傳統程式開發，而是讓你理解如何利用 AI 規劃、製作及檢查網站，同時掌握一個商業網站真正需要的內容與結構。",
  },
  {
    q: "AI Marketing 是否只教 ChatGPT？",
    a: "不是。我們更重視工作流程及判斷方法。工具會隨市場改變，課程會按實際內容選用合適 AI 工具示範。",
  },
  {
    q: "完成課程有證書嗎？",
    a: "指定證書課程完成後可獲課程完成證書；實際證書名稱及發放條件以各課程頁面公布為準。",
  },
  {
    q: "可以公司包班／企業培訓嗎？",
    a: "可以。可按企業需要調整案例、內容深度及工作場景，適合 Marketing、Sales、Management 或跨部門 AI 入門培訓。",
  },
  {
    q: "可以與學校／大專院校合作嗎？",
    a: "可以。中心歡迎與學校、大專院校、教育機構及專業團體合作舉辦講座、工作坊或聯合課程。",
  },
  {
    q: "課程用甚麼語言？",
    a: "網站列出的香港實體課程主要以廣東話授課；個別課程如有其他語言安排，會在課程頁註明。",
  },
  {
    q: "需要帶電腦嗎？",
    a: "視乎課程。實戰課程建議攜帶手提電腦；GEO 課程亦建議準備自己公司或客戶網站網址，方便即場檢查。",
  },
  {
    q: "如何報名？",
    a: "按網站「立即報名」連結，填寫資料並按指示完成報名程序即可。",
  },
];

export const partners = [
  {
    name: "NEOX / NEOXGEO",
    url: "https://www.neoxgeo.com/en/solutions",
    body: "NEOXGEO 是立足香港的 GEO 及 AI Search 技術團隊，服務方向涵蓋 AI knowledge structuring、entity & semantic alignment、public signal orchestration，以及網站 AI readiness。可為課程提供 GEO、AI Search、網站可見度及數碼 Marketing 的實務案例。",
  },
  {
    name: "FromDB Limited",
    url: "https://fromdb.com/",
    body: "FromDB Limited 是香港 IT 服務及科技解決方案公司，公開服務包括網站、企業數碼解決方案、AI 應用及營運流程改善。可為 AI 網站、企業科技應用及數碼轉型相關內容提供技術實務視角。",
  },
];

export const notices = [
  "名額以成功完成指定報名程序為準。",
  "課程資料、地點及上課安排將按報名時提供的聯絡方式通知。",
  "如需更改參加者資料，請於課程開始前聯絡中心。",
  "證書姓名以報名資料為準；請確保英文／中文姓名正確。",
  "取消、退款、改期及惡劣天氣安排，請按中心正式政策補上（待公布）。",
];
