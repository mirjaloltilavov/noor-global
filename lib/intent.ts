import {
  MOODS,
  type MoodId,
  type Passage,
  type ThemeId,
} from "./sakinah";

/**
 * Erkin matnni mavzularga bog'laydi.
 *
 * Bu sun'iy intellekt emas — oddiy so'z lug'ati. Foydalanuvchi yozgan
 * gapdagi so'zlar quyidagi o'zaklar bilan solishtiriladi va mos kelgan
 * mavzudagi parchalar taklif qilinadi. Shuning uchun interfeysda ham
 * «tushunib turibman» degan da'vo yo'q: nima topilgani ochiq ko'rsatiladi.
 */

/** Har mavzuning o'zaklari — uz, ru, en aralash. Qo'shimchalar hisobga olinadi. */
const THEME_STEMS: Record<ThemeId, string[]> = {
  comfort: [
    "tinch", "tasal", "taskin", "sokin", "xotirjam", "yolg'iz", "yolgiz",
    "qo'rq", "qorq", "xavotir", "vahim", "tashvish", "bezovta", "notinch",
    "покой", "спокой", "утеш", "тревог", "страх", "боюс", "боюсь", "одинок",
    "волну", "беспоко",
    "calm", "comfort", "peace", "anxious", "anxiety", "afraid", "fear",
    "worry", "worried", "lonely", "restless", "stress",
    // yo'qotish, qayg'u, charchoq
    "qayg'u", "qaygu", "g'am", "ayril", "yo'qot", "yoqot", "vafot", "o'lim",
    "olim ", "yig'la", "yigla", "siqil", "ezil", "charcha", "xafa",
    "горе", "скорб", "потер", "умер", "смерт", "груст", "печал", "устал",
    "grief", "griev", "loss", "lost", "died", "death", "sad", "cry", "tired",
    "miss",
  ],
  patience: [
    "sabr", "chida", "bardosh", "qiyin", "og'ir", "ogir", "sinov", "toqat",
    "терпен", "терпет", "выдерж", "трудно", "тяжел", "испытан",
    "patien", "endur", "persever", "hard", "difficult", "struggl", "trial",
    "ayril", "yo'qot", "yoqot", "потер", "loss", "griev",
  ],
  hope: [
    "umid", "ishon", "yorug'", "yorug", "kelajak", "yengil",
    "надежд", "наде", "свет", "будущ",
    "hope", "hopeful", "light", "future", "despair", "hopeless",
  ],
  mercy: [
    "rahm", "mehr", "shafqat", "muruvv",
    "милост", "милосерд", "жалос", "любов",
    "mercy", "merciful", "compassion", "kind", "love",
  ],
  forgiveness: [
    "mag'fir", "magfir", "kechir", "gunoh", "tavba", "pushaym", "afsus",
    "aybdor", "xato",
    "прощен", "прости", "грех", "покаян", "раская", "вина", "ошиб",
    "forgiv", "sin", "repent", "guilt", "regret", "mistake", "ashamed",
  ],
  gratitude: [
    "shukr", "minnatdor", "rahmat aytish", "ne'mat", "nemat", "quvon",
    "xursand", "baxt",
    "благодар", "спасиб", "благо", "радост", "счаст",
    "gratitud", "grateful", "thank", "blessing", "joy", "happy",
  ],
  trust: [
    "tavakkul", "topshir", "qo'rqma", "qorqma", "himoy", "panoh", "suyan",
    "nazorat",
    "упован", "довер", "защит", "полага", "контрол",
    "trust", "reliance", "rely", "protect", "surrender", "control",
  ],
  guidance: [
    "hidoyat", "yo'l", "yol", "adash", "qaror", "tanlov", "izla", "savol",
    "ma'no", "mano", "shubha",
    "руководств", "путь", "заблуд", "решен", "выбор", "ищу", "смысл",
    "сомнен",
    "guidance", "guide", "lost", "direction", "decision", "choice",
    "meaning", "purpose", "doubt", "confus",
  ],
  provision: [
    "rizq", "ish", "pul", "muhtoj", "kambag'", "kambag", "ta'minot", "taminot",
    "qarz",
    "удел", "работ", "деньг", "нужд", "бедн", "долг", "пропитан",
    "provision", "sustenance", "money", "job", "work", "need", "poor", "debt",
  ],
  remembrance: [
    "zikr", "eslash", "yod", "duo", "namoz", "yaqinlash", "uzoqlash",
    "поминан", "вспомн", "молитв", "дуа", "намаз", "близ", "отдал",
    "remembr", "remember", "dhikr", "prayer", "supplicat", "closer", "distant",
  ],
};

/** Ba'zi so'zlar to'g'ridan-to'g'ri kayfiyatni ko'rsatadi */
const MOOD_STEMS: Record<MoodId, string[]> = {
  anxious: ["xavotir", "vahim", "tashvish", "тревог", "паник", "anxi", "panic"],
  grateful: ["shukr", "minnatdor", "благодар", "grateful", "thank"],
  grieving: [
    "qayg'u", "qaygu", "g'am", "yo'qot", "yoqot", "vafot", "yig'la", "yigla",
    "горе", "скорб", "потер", "умер", "плач",
    "grief", "griev", "loss", "lost someone", "died", "death", "sad", "cry",
  ],
  regretful: [
    "pushaym", "gunoh", "tavba", "afsus", "раская", "грех", "сожал",
    "regret", "sin", "guilt", "repent",
  ],
  guidance: [
    "hidoyat", "adash", "qaror", "yo'l izla", "руководств", "заблуд", "решен",
    "guidance", "lost", "direction", "decision",
  ],
  fear: [
    "qo'rq", "qorq", "hayajon", "dahshat", "страх", "боюс", "ужас",
    "fear", "afraid", "scared", "terrif",
  ],
};

/** Kichik harf, apostrof va tinish belgilarini bir xillashtiradi */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʻʼ`´]/g, "'")
    .replace(/[^0-9a-z\u0400-\u04ff'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** So'z o'zak bilan boshlanadimi (yoki o'zak ko'p so'zli iborami) */
function hits(haystack: string, tokens: string[], stem: string): boolean {
  if (stem.includes(" ")) return haystack.includes(stem);
  return tokens.some(
    (w) => w.startsWith(stem) || (stem.length > 4 && stem.startsWith(w) && w.length >= 4)
  );
}

export interface IntentMatch {
  /** Topilgan mavzular — kuchi bo'yicha */
  themes: ThemeId[];
  /** Eng mos kayfiyat (sayohat shundan tuziladi) */
  mood: MoodId | null;
  /** Taklif qilinadigan parchalar */
  passages: { passage: Passage; mood: MoodId; shared: ThemeId[] }[];
}

const EMPTY: IntentMatch = { themes: [], mood: null, passages: [] };

export function matchIntent(input: string): IntentMatch {
  const text = normalize(input);
  if (text.length < 3) return EMPTY;
  const tokens = text.split(" ").filter((w) => w.length >= 3);
  if (tokens.length === 0) return EMPTY;

  // 1) Mavzular
  const themeScore: { id: ThemeId; score: number }[] = [];
  for (const key of Object.keys(THEME_STEMS) as ThemeId[]) {
    let score = 0;
    for (const stem of THEME_STEMS[key]) if (hits(text, tokens, stem)) score++;
    if (score > 0) themeScore.push({ id: key, score });
  }

  const themes = themeScore
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.id);

  if (themes.length === 0) return EMPTY;

  // 2) Kayfiyat — avval to'g'ridan-to'g'ri so'zlar, bo'lmasa mavzular orqali
  let mood: MoodId | null = null;
  let best = 0;
  for (const key of Object.keys(MOOD_STEMS) as MoodId[]) {
    let score = 0;
    for (const stem of MOOD_STEMS[key]) if (hits(text, tokens, stem)) score++;
    if (score > best) {
      best = score;
      mood = key;
    }
  }

  // 3) Parchalar — mavzular kesishuvi bo'yicha
  const found: IntentMatch["passages"] = [];
  for (const m of MOODS) {
    for (const p of m.passages) {
      const shared = p.themes.filter((x) => themes.includes(x));
      if (shared.length > 0) found.push({ passage: p, mood: m.id, shared });
    }
  }

  // Birinchi mavzuga mos kelgani va ko'proq kesishgani yuqorida
  const weight = (x: (typeof found)[number]) =>
    x.shared.length * 10 +
    x.shared.reduce((s, th) => s + (3 - themes.indexOf(th)), 0);
  found.sort((a, b) => weight(b) - weight(a));

  const passages = found.slice(0, 5);
  if (!mood && passages.length > 0) mood = passages[0].mood;

  return { themes, mood, passages };
}
