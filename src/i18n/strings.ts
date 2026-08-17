export type Lang = "en" | "ar";

export type UI = {
  htmlTitle: Record<"home" | "work" | "practice" | "contact", string>;
  metaDescription: string;
  langName: string;
  switchTo: string;
  switchLabel: string;

  nav: { work: string; practice: string; contact: string };
  brandRole: string;

  hero: {
    year: string;
    big: string;
    sub: string;
    signRole: string;
    facts: string[];
    caption: { project: string; stage: string };
  };

  home: {
    practice: string;
    deliveredFor: string;
    availability: string;
    test: string;
    testHeadline: string;
    testBody: string;
    selectedWork: string;
    fullIndex: string;
    dayConsists: string;
  };

  work: {
    eyebrow: string;
    title: string;
    blurb: (projects: number, images: number) => string;
    allProjects: string;
    open: (ref: string) => string;
    studio: string;
    role: string;
    scope: string;
  };

  project: {
    index: string;
    summary: string;
    client: string;
    location: string;
    studio: string;
    period: string;
    scope: string;
    role: string;
    materials: string;
    onSite: string;
    designAgainst: string;
    frames: (n: number, ref: string) => string;
    next: string;
  };

  compare: { design: string; built: string; drag: string; hint: string };

  lightbox: { prev: string; next: string; close: string; open: (i: number, n: number, caption?: string) => string };

  practice: {
    eyebrow: string;
    headline: string[];
    experience: (n: number) => string;
    education: string;
    certificates: string;
    softwareHand: string;
    languages: string;
    awayFromSite: string;
    interludeLabel: string;
    interludeCaption: string;
    portraitAlt: string;
    ridingAlt: string;
    outOf: (n: number) => string;
  };

  contact: {
    eyebrow: string;
    headline: string[];
    blurb: string;
    email: string;
    phone: string;
    whatsapp: string;
    linkedin: string;
    based: string;
    languages: string;
    startEmail: string;
    howItRuns: string;
    stages: { label: string; body: string }[];
  };

  footer: {
    cta: string[];
    direct: string;
    index: string;
    workCount: (n: number) => string;
    practice: string;
    contact: string;
    since: (year: number) => string;
    imageCount: (n: number) => string;
  };
};

export const en: UI = {
  htmlTitle: {
    home: "Ahmed Yahia Rashid — Architect, finishing & site supervision",
    work: "Work — Ahmed Yahia Rashid",
    practice: "Practice — Ahmed Yahia Rashid",
    contact: "Contact — Ahmed Yahia Rashid",
  },
  metaDescription:
    "Ahmed Yahia Rashid, architect. Eight years of residential and public project finishing — site supervision, technical office and handover. Open to work abroad.",
  langName: "English",
  switchTo: "ع",
  switchLabel: "التبديل إلى العربية",

  nav: { work: "Work", practice: "Practice", contact: "Contact" },
  brandRole: "Architect · Finishing",

  hero: {
    year: "2026",
    big: "Portfolio",
    sub: "Finishing · Execution · Site supervision",
    signRole: "Architect — open to work abroad",
    facts: ["Est. 2018", "Eight years on site", "Nine projects"],
    caption: { project: "Reception & Master Suite", stage: "Design" },
  },

  home: {
    practice: "Practice",
    deliveredFor: "Delivered for",
    availability: "Availability",
    test: "The test",
    testHeadline: "Design against\nas built",
    testBody:
      "A render is a promise. The only question that matters on site is whether the room matches it — the same joint, the same reveal, the same shadow line. Drag the handle.",
    selectedWork: "Selected work",
    fullIndex: "Full index",
    dayConsists: "What the day consists of",
  },

  work: {
    eyebrow: "Index",
    title: "Work",
    blurb: (projects, images) =>
      `${projects} projects, ${images} photographs, drawings and renders. Residential finishing for private clients and international developers, plus the hand-drawing work that came first. Open a line to read the specification.`,
    allProjects: "All projects",
    open: (ref) => `Open ${ref}`,
    studio: "Studio",
    role: "Role",
    scope: "Scope",
  },

  project: {
    index: "Index",
    summary: "Summary",
    client: "Client",
    location: "Location",
    studio: "Studio",
    period: "Period",
    scope: "Scope",
    role: "Role",
    materials: "Materials",
    onSite: "On site",
    designAgainst: "Design against as built",
    frames: (n, ref) => `${n} frames — ${ref}`,
    next: "Next",
  },

  compare: {
    design: "Design",
    built: "As built",
    drag: "Drag",
    hint: "Drag or use arrow keys to wipe between them.",
  },

  lightbox: {
    prev: "Prev",
    next: "Next",
    close: "Close",
    open: (i, n, caption) => `Open image ${i} of ${n}${caption ? `: ${caption}` : ""}`,
  },

  practice: {
    eyebrow: "Practice",
    headline: ["Eight years", "on site"],
    experience: (n) => `Experience — ${n} posts since 2015`,
    education: "Education",
    certificates: "Accredited certificates",
    softwareHand: "Software & hand",
    languages: "Languages",
    awayFromSite: "Away from site",
    interludeLabel: "Roof level",
    interludeCaption: "Lake View Residence — pool built on site from sizing through mosaic",
    portraitAlt: "Ahmed Yahia Rashid at the drawing board",
    ridingAlt: "Ahmed Yahia Rashid riding",
    outOf: (n) => `${n} out of 5`,
  },

  contact: {
    eyebrow: "Contact",
    headline: ["Tell me what", "needs finishing"],
    blurb:
      "Residential finishing packages, fit-out supervision and technical office work. Available for projects abroad and ready to relocate — send the unit, the drawings and the date you need it handed over.",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    based: "Based",
    languages: "Languages",
    startEmail: "Start an email",
    howItRuns: "How the work runs",
    stages: [
      {
        label: "Before anything is ordered",
        body: "Drawings reviewed against the unit as it stands, quantities taken off, and a materials schedule you can actually price.",
      },
      {
        label: "While the trades are in",
        body: "Daily supervision, sequencing between subcontractors, and technical review whenever the drawing and the building disagree.",
      },
      {
        label: "At handover",
        body: "Detail-level inspection, snag list raised and closed, and the unit handed over finished — including to clients following from abroad.",
      },
    ],
  },

  footer: {
    cta: ["Have a unit", "to finish?"],
    direct: "Direct",
    index: "Index",
    workCount: (n) => `Work — ${n} projects`,
    practice: "Practice",
    contact: "Contact",
    since: (year) => `Ahmed Yahia Rashid · Architect · Est. ${year}`,
    imageCount: (n) => `${n} photographs, drawings and renders`,
  },
};

const n = (value: number) => value.toLocaleString("ar-EG");

export const ar: UI = {
  htmlTitle: {
    home: "أحمد يحيى راشد — معماري، تشطيبات وإشراف على الموقع",
    work: "الأعمال — أحمد يحيى راشد",
    practice: "الخبرة — أحمد يحيى راشد",
    contact: "تواصل — أحمد يحيى راشد",
  },
  metaDescription:
    "أحمد يحيى راشد، معماري. ثماني سنوات في تشطيب المشروعات السكنية والعامة — إشراف على الموقع ومكتب فني وتسليم. متاح للعمل بالخارج.",
  langName: "العربية",
  switchTo: "EN",
  switchLabel: "Switch to English",

  nav: { work: "الأعمال", practice: "الخبرة", contact: "تواصل" },
  brandRole: "معماري · تشطيبات",

  hero: {
    year: "٢٠٢٦",
    big: "ملف الأعمال",
    sub: "تشطيبات · تنفيذ · إشراف على الموقع",
    signRole: "معماري — متاح للعمل بالخارج",
    facts: ["منذ ٢٠١٨", "ثماني سنوات في المواقع", "تسعة مشروعات"],
    caption: { project: "الاستقبال والجناح الرئيسي", stage: "تصميم" },
  },

  home: {
    practice: "الخبرة",
    deliveredFor: "نُفِّذت لصالح",
    availability: "الإتاحة",
    test: "الاختبار",
    testHeadline: "التصميم مقابل\nما نُفِّذ",
    testBody:
      "الإظهار وعد. والسؤال الوحيد المهم في الموقع هو هل جاءت الغرفة مطابقة له — الفاصل نفسه، والغائر نفسه، وخط الظل نفسه. اسحب المقبض.",
    selectedWork: "أعمال مختارة",
    fullIndex: "الفهرس الكامل",
    dayConsists: "مما يتكوّن يوم العمل",
  },

  work: {
    eyebrow: "الفهرس",
    title: "الأعمال",
    blurb: (projects, images) =>
      `${n(projects)} مشروعات، و${n(images)} صورة ورسمة وإظهاراً. تشطيبات سكنية لعملاء خاصين ومطورين عالميين، إضافة إلى أعمال الرسم اليدوي التي جاءت أولاً. افتح أي سطر لقراءة المواصفة.`,
    allProjects: "كل المشروعات",
    open: (ref) => `افتح ${ref}`,
    studio: "الجهة",
    role: "الدور",
    scope: "النطاق",
  },

  project: {
    index: "الفهرس",
    summary: "نبذة",
    client: "العميل",
    location: "الموقع",
    studio: "الجهة",
    period: "الفترة",
    scope: "النطاق",
    role: "الدور",
    materials: "الخامات",
    onSite: "في الموقع",
    designAgainst: "التصميم مقابل ما نُفِّذ",
    frames: (count, ref) => `${n(count)} لقطة — ${ref}`,
    next: "التالي",
  },

  compare: {
    design: "تصميم",
    built: "بعد التنفيذ",
    drag: "اسحب",
    hint: "اسحب أو استخدم مفاتيح الأسهم للتنقل بينهما.",
  },

  lightbox: {
    prev: "السابق",
    next: "التالي",
    close: "إغلاق",
    open: (i, total, caption) => `افتح الصورة ${n(i)} من ${n(total)}${caption ? `: ${caption}` : ""}`,
  },

  practice: {
    eyebrow: "الخبرة",
    headline: ["ثماني سنوات", "في المواقع"],
    experience: (count) => `الخبرة العملية — ${n(count)} مواقع منذ ٢٠١٥`,
    education: "التعليم",
    certificates: "شهادات معتمدة",
    softwareHand: "البرامج واليد",
    languages: "اللغات",
    awayFromSite: "خارج الموقع",
    interludeLabel: "مستوى السطح",
    interludeCaption: "ليك فيو ريزيدنس — حمام سباحة نُفِّذ في الموقع من الضبط حتى الفسيفساء",
    portraitAlt: "أحمد يحيى راشد أمام لوحة الرسم",
    ridingAlt: "أحمد يحيى راشد أثناء الفروسية",
    outOf: (level) => `${n(level)} من ٥`,
  },

  contact: {
    eyebrow: "تواصل",
    headline: ["أخبرني بما", "يحتاج تشطيباً"],
    blurb:
      "حزم تشطيب سكني، وإشراف على أعمال التنفيذ، وأعمال مكتب فني. متاح لمشروعات خارج مصر ومستعد للانتقال — أرسل الوحدة والرسومات وتاريخ التسليم المطلوب.",
    email: "البريد",
    phone: "الهاتف",
    whatsapp: "واتساب",
    linkedin: "لينكدإن",
    based: "المقر",
    languages: "اللغات",
    startEmail: "ابدأ رسالة",
    howItRuns: "كيف يسير العمل",
    stages: [
      {
        label: "قبل توريد أي شيء",
        body: "مراجعة الرسومات مقابل الوحدة على وضعها الحالي، وحصر الكميات، وجدول خامات قابل للتسعير فعلاً.",
      },
      {
        label: "أثناء وجود البنود في الموقع",
        body: "إشراف يومي، وترتيب التتابع بين مقاولي الباطن، ومراجعة فنية كلما اختلف الرسم عن المبنى.",
      },
      {
        label: "عند التسليم",
        body: "معاينة على مستوى التفصيلة، وقائمة ملاحظات تُرفع وتُغلق، ووحدة تُسلَّم جاهزة — بما في ذلك لعملاء يتابعون من الخارج.",
      },
    ],
  },

  footer: {
    cta: ["عندك وحدة", "تحتاج تشطيباً؟"],
    direct: "مباشر",
    index: "الفهرس",
    workCount: (count) => `الأعمال — ${n(count)} مشروعات`,
    practice: "الخبرة",
    contact: "تواصل",
    since: (year) => `أحمد يحيى راشد · معماري · منذ ${n(year)}`,
    imageCount: (count) => `${n(count)} صورة ورسمة وإظهاراً`,
  },
};

export const dictionaries: Record<Lang, UI> = { en, ar };
