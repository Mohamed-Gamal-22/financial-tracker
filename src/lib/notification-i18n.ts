/** Common English category names → Arabic (fallback for embedded names). */
const CATEGORY_NAME_AR: Record<string, string> = {
  food: "طعام",
  groceries: "بقالة",
  grocery: "بقالة",
  transport: "مواصلات",
  transportation: "مواصلات",
  travel: "سفر",
  shopping: "تسوق",
  entertainment: "ترفيه",
  fun: "ترفيه",
  health: "صحة",
  medical: "طبي",
  bills: "فواتير",
  utilities: "مرافق",
  education: "تعليم",
  rent: "إيجار",
  housing: "سكن",
  home: "منزل",
  other: "أخرى",
  others: "أخرى",
  salary: "راتب",
  income: "دخل",
  savings: "ادخار",
  saving: "ادخار",
  coffee: "قهوة",
  restaurants: "مطاعم",
  restaurant: "مطاعم",
  clothes: "ملابس",
  clothing: "ملابس",
  subscriptions: "اشتراكات",
  subscription: "اشتراكات",
};

function hasArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function translateCategoryName(name: string) {
  const trimmed = name.trim().replace(/[."'”]+$/g, "");
  if (!trimmed) return trimmed;
  if (hasArabic(trimmed)) return trimmed;
  return CATEGORY_NAME_AR[trimmed.toLowerCase()] ?? trimmed;
}

/**
 * Display fallback: if the API still returns English budget alerts,
 * convert common patterns to Arabic for the UI.
 */
export function localizeNotificationText(raw: string): string {
  const text = raw.trim();
  if (!text) return text;
  if (hasArabic(text)) return text;

  const patterns: Array<{
    re: RegExp;
    to: (match: RegExpMatchArray) => string;
  }> = [
    {
      re: /spent\s+([\d,.]+)\s+(?:out\s+of|of)\s+([\d,.]+)/i,
      to: (m) => `أنفقت ${m[1]} من ${m[2]}`,
    },
    {
      re: /(?:monthly\s+)?expense\s+budget.*?(\d{1,3})\s*%/i,
      to: (m) => `وصلتَ إلى ${m[1]}% من ميزانية المصروف الشهري`,
    },
    {
      re: /(?:warning|alert)[:\s-]+.*?(\d{1,3})\s*%.*?budget.*?(?:for|in|on)\s+(.+?)(?:[.!]|$)/i,
      to: (m) =>
        `تنبيه: وصلتَ إلى ${m[1]}% من ميزانية «${translateCategoryName(m[2])}»`,
    },
    {
      re: /you have (?:reached|exceeded|used|spent).*?(\d{1,3})\s*%.*?(?:of\s+(?:your\s+)?)?budget.*?(?:for|in|on)\s+(.+?)(?:[.!]|$)/i,
      to: (m) =>
        `وصلتَ إلى ${m[1]}% من ميزانية «${translateCategoryName(m[2])}»`,
    },
    {
      re: /(?:your\s+)?spending\s+(?:in|on|for)\s+(.+?)\s+has\s+(?:reached|exceeded)\s+(\d{1,3})\s*%/i,
      to: (m) =>
        `إنفاقك على «${translateCategoryName(m[1])}» وصل إلى ${m[2]}% من الميزانية`,
    },
    {
      re: /budget\s+for\s+(.+?)\s+(?:has\s+)?(?:reached|exceeded|is\s+at)\s+(\d{1,3})\s*%/i,
      to: (m) =>
        `ميزانية «${translateCategoryName(m[1])}» وصلت إلى ${m[2]}%`,
    },
    {
      re: /(?:your\s+)?(.+?)\s+budget\s+(?:has\s+)?(?:reached|exceeded|is\s+at)\s+(\d{1,3})\s*%/i,
      to: (m) =>
        `ميزانية «${translateCategoryName(m[1])}» وصلت إلى ${m[2]}%`,
    },
    {
      re: /(.+?)\s+(?:is\s+at|at)\s+(\d{1,3})\s*%\s+(?:of\s+)?(?:your\s+)?budget/i,
      to: (m) =>
        `تصنيف «${translateCategoryName(m[1])}» عند ${m[2]}% من الميزانية`,
    },
  ];

  for (const { re, to } of patterns) {
    const match = text.match(re);
    if (match) return to(match);
  }

  const percent = text.match(/(\d{1,3})\s*%/)?.[1];
  const category =
    text.match(
      /\b(?:for|in|on|category)\s+["']?([A-Za-z][\w\s-]{0,40}?)["']?(?=[.!]|$)/i,
    )?.[1] ?? text.match(/["“]([A-Za-z][\w\s-]{1,40})["”]/)?.[1];

  if (/budget|spent|exceed|reach|alert|warning|threshold|expense|limit/i.test(text)) {
    if (category && percent) {
      return `تنبيه ميزانية: «${translateCategoryName(category)}» عند ${percent}% من السقف`;
    }
    if (percent) {
      return `تنبيه ميزانية: وصلتَ إلى حوالي ${percent}% من السقف`;
    }
    return "تنبيه: اقتربتَ من سقف ميزانية أحد التصنيفات";
  }

  // Any remaining English copy → Arabic fallback (all current alerts are budget-related).
  if (/[A-Za-z]{3,}/.test(text)) {
    if (percent) {
      return `تنبيه ميزانية: وصلتَ إلى حوالي ${percent}% من السقف`;
    }
    return "تنبيه بخصوص ميزانيتك";
  }

  return text;
}
