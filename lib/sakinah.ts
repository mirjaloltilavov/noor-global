import type { Locale } from "./i18n";

export type L10n = Record<Locale, string>;

/* ————————————————————————————————————————————————————————————
   Suralar (faqat Sakinah tanlovida ishlatilganlari)
———————————————————————————————————————————————————————————— */

export const SURAHS: Record<
  number,
  { slug: string; arabic: string; verses: number }
> = {
  1: { slug: "Al-Fatihah", arabic: "الفاتحة", verses: 7 },
  2: { slug: "Al-Baqarah", arabic: "البقرة", verses: 286 },
  3: { slug: "Ali 'Imran", arabic: "آل عمران", verses: 200 },
  9: { slug: "At-Tawbah", arabic: "التوبة", verses: 129 },
  12: { slug: "Yusuf", arabic: "يوسف", verses: 111 },
  13: { slug: "Ar-Ra'd", arabic: "الرعد", verses: 43 },
  14: { slug: "Ibrahim", arabic: "إبراهيم", verses: 52 },
  18: { slug: "Al-Kahf", arabic: "الكهف", verses: 110 },
  39: { slug: "Az-Zumar", arabic: "الزمر", verses: 75 },
  65: { slug: "At-Talaq", arabic: "الطلاق", verses: 12 },
  66: { slug: "At-Tahrim", arabic: "التحريم", verses: 12 },
  93: { slug: "Ad-Duha", arabic: "الضحى", verses: 11 },
  94: { slug: "Ash-Sharh", arabic: "الشرح", verses: 8 },
};

export interface Passage {
  surah: number;
  from: number;
  to: number;
  minutes: number;
  /** Nega aynan shu parcha — olimlar izohiga asoslangan qisqa eslatma */
  note: L10n;
}

export function passageRef(p: Passage): string {
  const name = SURAHS[p.surah].slug;
  return p.from === p.to
    ? `${name} ${p.surah}:${p.from}`
    : `${name} ${p.surah}:${p.from}–${p.to}`;
}

export function passageKey(p: Passage): string {
  return `${p.surah}:${p.from}-${p.to}`;
}

/* ————————————————————————————————————————————————————————————
   Kayfiyatlar — Figmadagi 6 ta karta
———————————————————————————————————————————————————————————— */

export type MoodId =
  | "anxious"
  | "grateful"
  | "grieving"
  | "regretful"
  | "guidance"
  | "fear";

export interface Mood {
  id: MoodId;
  label: L10n;
  arabic: string;
  /** Reminder ekranining sarlavhasi */
  title: L10n;
  passages: Passage[];
}

export const MOODS: Mood[] = [
  {
    id: "anxious",
    label: { uz: "Xavotirdaman", ru: "Тревожно", en: "Anxious" },
    arabic: "قَلَق",
    title: {
      uz: "Notinch qalb uchun tanlangan uch parcha",
      ru: "Три отрывка для встревоженного сердца",
      en: "Three passages, chosen for a heavy heart",
    },
    passages: [
      {
        surah: 13,
        from: 28,
        to: 28,
        minutes: 2,
        note: {
          uz: "Bevosita notinch qalbga qaratilgan — klassik tafsirlar buni xavotirning davosi deb o'qigan.",
          ru: "Обращено прямо к беспокойному сердцу — классические тафсиры читают это как лекарство от тревоги.",
          en: "Speaks directly to a restless heart — the classical commentaries read it as the cure for anxiety.",
        },
      },
      {
        surah: 94,
        from: 1,
        to: 8,
        minutes: 3,
        note: {
          uz: "Payg'ambarga ﷺ qiyinchilik onida tasalli sifatida nozil bo'lgan.",
          ru: "Ниспослано как утешение Пророку ﷺ в момент трудности.",
          en: "Revealed as consolation to the Prophet ﷺ in a moment of difficulty.",
        },
      },
      {
        surah: 2,
        from: 286,
        to: 286,
        minutes: 2,
        note: {
          uz: "Ko'tarayotgan yukingiz aynan sizga o'lchab berilgani haqidagi eslatma.",
          ru: "Напоминание о том, что ноша, которую вы несёте, отмерена именно для вас.",
          en: "A reminder that the burden you carry was measured for you.",
        },
      },
    ],
  },
  {
    id: "grateful",
    label: { uz: "Shukrdaman", ru: "Благодарно", en: "Grateful" },
    arabic: "شُكْر",
    title: {
      uz: "Shukr qalbi uchun tanlangan uch parcha",
      ru: "Три отрывка для благодарного сердца",
      en: "Three passages, chosen for a grateful heart",
    },
    passages: [
      {
        surah: 14,
        from: 7,
        to: 7,
        minutes: 2,
        note: {
          uz: "Shukrga berilgan aniq va'da — ko'proq shukr, ko'proq ziyoda.",
          ru: "Прямое обещание за благодарность — больше благодарности, больше прибавления.",
          en: "The explicit promise attached to gratitude — more thanks, more increase.",
        },
      },
      {
        surah: 93,
        from: 1,
        to: 11,
        minutes: 3,
        note: {
          uz: "Sura o'tmishdagi ne'matlarni sanab, shukrni yodga solish bilan tugaydi.",
          ru: "Сура перечисляет прошлые милости и завершается напоминанием о благодарности.",
          en: "The surah recounts past favours and closes by asking that they be spoken of.",
        },
      },
      {
        surah: 2,
        from: 152,
        to: 152,
        minutes: 2,
        note: {
          uz: "Zikr o'zaro: Meni yodga oling — Men sizni yodga olaman.",
          ru: "Поминание взаимно: помните Меня — Я помяну вас.",
          en: "Remembrance is mutual: remember Me, and I will remember you.",
        },
      },
    ],
  },
  {
    id: "grieving",
    label: { uz: "Qayg'udaman", ru: "В горе", en: "Grieving" },
    arabic: "حُزْن",
    title: {
      uz: "Qayg'uli qalb uchun tanlangan uch parcha",
      ru: "Три отрывка для скорбящего сердца",
      en: "Three passages, chosen for a grieving heart",
    },
    passages: [
      {
        surah: 2,
        from: 155,
        to: 157,
        minutes: 3,
        note: {
          uz: "Sinov ta'rifi va sabr qilganlarga berilgan xushxabar bir joyda.",
          ru: "Описание испытания и радостная весть терпеливым — в одном месте.",
          en: "Names the trial, then gives the glad tidings promised to those who endure it.",
        },
      },
      {
        surah: 9,
        from: 40,
        to: 40,
        minutes: 2,
        note: {
          uz: "G'or ichida aytilgan so'z: «G'am yema, Alloh biz bilan».",
          ru: "Слова, сказанные в пещере: «Не печалься, Аллах с нами».",
          en: "The words spoken inside the cave: do not grieve, Allah is with us.",
        },
      },
      {
        surah: 12,
        from: 86,
        to: 86,
        minutes: 2,
        note: {
          uz: "Ya'qub alayhissalom g'amini faqat Allohga shikoyat qiladi.",
          ru: "Йакуб (мир ему) жалуется на свою скорбь только Аллаху.",
          en: "Ya'qub (peace be upon him) takes his grief to Allah alone.",
        },
      },
    ],
  },
  {
    id: "regretful",
    label: { uz: "Pushaymonman", ru: "С сожалением", en: "Regretful" },
    arabic: "نَدَم",
    title: {
      uz: "Pushaymon qalb uchun tanlangan uch parcha",
      ru: "Три отрывка для раскаивающегося сердца",
      en: "Three passages, chosen for a regretful heart",
    },
    passages: [
      {
        surah: 39,
        from: 53,
        to: 53,
        minutes: 2,
        note: {
          uz: "Ko'p mufassirlar buni Qur'ondagi eng keng umid oyati deb ataydi.",
          ru: "Многие комментаторы называют это самым широким аятом надежды в Коране.",
          en: "Many commentators call this the widest verse of hope in the Qur'an.",
        },
      },
      {
        surah: 3,
        from: 135,
        to: 135,
        minutes: 2,
        note: {
          uz: "Xato qilgach darhol Allohni eslash — taqvodorlarning belgisi.",
          ru: "Вспомнить Аллаха сразу после ошибки — признак богобоязненных.",
          en: "Turning back immediately after a fault is described as a mark of the God-conscious.",
        },
      },
      {
        surah: 66,
        from: 8,
        to: 8,
        minutes: 3,
        note: {
          uz: "Chin tavba — «tavbatan nasuha» — nima ekanini bayon qiladi.",
          ru: "Определяет, что такое искреннее покаяние — «тауба насуха».",
          en: "Defines sincere repentance — tawbatan nasuha — and what follows it.",
        },
      },
    ],
  },
  {
    id: "guidance",
    label: { uz: "Yo'l izlayapman", ru: "Ищу руководство", en: "Seeking guidance" },
    arabic: "حَيْرَة",
    title: {
      uz: "Yo'l izlayotgan qalb uchun tanlangan uch parcha",
      ru: "Три отрывка для ищущего сердца",
      en: "Three passages, chosen for a searching heart",
    },
    passages: [
      {
        surah: 18,
        from: 10,
        to: 10,
        minutes: 2,
        note: {
          uz: "G'or yigitlarining duosi — rahmat va to'g'ri yo'l so'rash.",
          ru: "Мольба юношей пещеры — просьба о милости и верном пути.",
          en: "The prayer of the youths of the cave — mercy, and a right way through the matter.",
        },
      },
      {
        surah: 2,
        from: 186,
        to: 186,
        minutes: 2,
        note: {
          uz: "Hukmlar orasida to'satdan keladigan yaqinlik oyati.",
          ru: "Аят близости, внезапно возникающий посреди предписаний.",
          en: "A verse of nearness that appears suddenly in the middle of legislation.",
        },
      },
      {
        surah: 1,
        from: 1,
        to: 7,
        minutes: 3,
        note: {
          uz: "Kuniga o'n marta takrorlanadigan hidoyat so'rovi.",
          ru: "Просьба о руководстве, повторяемая десятки раз в день.",
          en: "The request for guidance repeated more than any other words a Muslim says.",
        },
      },
    ],
  },
  {
    id: "fear",
    label: {
      uz: "Kelajakdan qo'rqaman",
      ru: "Страшно за будущее",
      en: "Fearful of the future",
    },
    arabic: "خَوْف",
    title: {
      uz: "Kelajakdan cho'chigan qalb uchun tanlangan uch parcha",
      ru: "Три отрывка для сердца, боящегося будущего",
      en: "Three passages, chosen for a heart afraid of what comes",
    },
    passages: [
      {
        surah: 65,
        from: 2,
        to: 3,
        minutes: 3,
        note: {
          uz: "Chiqish yo'li va kutilmagan tomondan riziq va'dasi.",
          ru: "Обещание выхода и удела оттуда, откуда не ждёшь.",
          en: "A way out, and provision from where it was not expected.",
        },
      },
      {
        surah: 3,
        from: 173,
        to: 173,
        minutes: 2,
        note: {
          uz: "Qo'rquv onida aytilgan so'z: «Hasbunallohu va ni'mal vakiyl».",
          ru: "Слова, сказанные в момент страха: «Достаточно нам Аллаха».",
          en: "The words said at the moment of fear: Allah is sufficient for us.",
        },
      },
      {
        surah: 9,
        from: 51,
        to: 51,
        minutes: 2,
        note: {
          uz: "Bizga faqat Alloh yozgan narsa yetadi — tavakkulning asosi.",
          ru: "Нас постигает лишь то, что предписал Аллах — основа упования.",
          en: "Nothing reaches us but what Allah has written — the ground of tawakkul.",
        },
      },
    ],
  },
];

export function getMood(id: MoodId): Mood {
  return MOODS.find((m) => m.id === id) ?? MOODS[0];
}

/* ————————————————————————————————————————————————————————————
   Sessiya sozlamalari (Figmadagi 4 ta savol — bitta ekranga yig'ilgan)
———————————————————————————————————————————————————————————— */

export type IntentionId =
  | "comfort"
  | "gratitude"
  | "patience"
  | "forgiveness"
  | "guidance"
  | "strength";

export const INTENTIONS: { id: IntentionId; label: L10n; arabic: string }[] = [
  {
    id: "comfort",
    label: {
      uz: "Taskin va tinchlik",
      ru: "Утешение и покой",
      en: "Comfort and calm",
    },
    arabic: "طُمَأْنِينَة",
  },
  {
    id: "gratitude",
    label: {
      uz: "Shukrni oshirish",
      ru: "Больше благодарности",
      en: "More gratitude",
    },
    arabic: "شُكْر",
  },
  {
    id: "patience",
    label: { uz: "Sabr", ru: "Терпение", en: "Patience" },
    arabic: "صَبْر",
  },
  {
    id: "forgiveness",
    label: {
      uz: "Mag'firat so'rash",
      ru: "Прощение",
      en: "Seeking forgiveness",
    },
    arabic: "اِسْتِغْفَار",
  },
  {
    id: "guidance",
    label: { uz: "Yo'l topish", ru: "Руководство", en: "Clarity and guidance" },
    arabic: "هِدَايَة",
  },
  {
    id: "strength",
    label: { uz: "Kuch", ru: "Сила", en: "Strength" },
    arabic: "قُوَّة",
  },
];

/** 0 — «cheksiz»: to'xtatilmaguncha davom etadi */
export const DURATIONS = [10, 30, 45, 0] as const;
export type Duration = (typeof DURATIONS)[number];

export const DURATION_LABELS: Record<Duration, L10n> = {
  10: { uz: "10 daqiqa", ru: "10 минут", en: "10 minutes" },
  30: { uz: "30 daqiqa", ru: "30 минут", en: "30 minutes" },
  45: { uz: "45 daqiqa", ru: "45 минут", en: "45 minutes" },
  0: { uz: "Cheksiz", ru: "Без ограничения", en: "Open-ended" },
};

export const DURATION_SUB: Record<Duration, L10n> = {
  10: { uz: "Qisqa to'xtash", ru: "Короткая пауза", en: "A short pause" },
  30: { uz: "Bir o'tirish", ru: "Одно сидение", en: "One sitting" },
  45: { uz: "Uzoq o'tirish", ru: "Долгое сидение", en: "A long sitting" },
  0: { uz: "To'xtatmaguncha", ru: "Пока не остановите", en: "Until you stop" },
};

export const DURATION_ARABIC: Record<Duration, string> = {
  10: "١٠",
  30: "٣٠",
  45: "٤٥",
  0: "∞",
};

export type FormatId = "listen" | "both";

export const FORMATS: { id: FormatId; label: L10n; sub: L10n; arabic: string }[] =
  [
    {
      id: "listen",
      label: { uz: "Tinglash", ru: "Слушать", en: "Listen" },
      sub: {
        uz: "Faqat tilovat",
        ru: "Только чтение вслух",
        en: "Recitation only",
      },
      arabic: "إِسْتِمَاع",
    },
    {
      id: "both",
      label: {
        uz: "Tinglash + o'qish",
        ru: "Слушать + читать",
        en: "Listen + read",
      },
      sub: {
        uz: "Matn bilan birga",
        ru: "Вместе с текстом",
        en: "Recitation with the text",
      },
      arabic: "كِلَاهُمَا",
    },
  ];

/* ————————————————————————————————————————————————————————————
   Qorilar — audio everyayah.com CDN orqali
———————————————————————————————————————————————————————————— */

export interface Reciter {
  id: string;
  name: string;
  style: L10n;
  place: L10n;
  /** everyayah.com/data/<path>/SSSAAA.mp3 */
  path: string;
}

export const RECITERS: Reciter[] = [
  {
    id: "sudais",
    name: "Abdur Rahman As-Sudais",
    style: { uz: "Mujavvad", ru: "Муджаввад", en: "Mujawwad" },
    place: { uz: "Makka", ru: "Мекка", en: "Makkah" },
    path: "Abdurrahmaan_As-Sudais_192kbps",
  },
  {
    id: "alafasy",
    name: "Mishary Alafasy",
    style: { uz: "Murattal", ru: "Мураттал", en: "Murattal" },
    place: { uz: "Quvayt", ru: "Кувейт", en: "Kuwait" },
    path: "Alafasy_128kbps",
  },
  {
    id: "ghamdi",
    name: "Saad Al-Ghamdi",
    style: { uz: "Murattal", ru: "Мураттал", en: "Murattal" },
    place: { uz: "Riyod", ru: "Эр-Рияд", en: "Riyadh" },
    path: "Ghamadi_40kbps",
  },
  {
    id: "husary",
    name: "Mahmoud Al-Husary",
    style: { uz: "Muallim", ru: "Муаллим", en: "Muallim" },
    place: { uz: "Qohira", ru: "Каир", en: "Cairo" },
    path: "Husary_128kbps",
  },
];

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

export function audioUrl(reciterId: string, surah: number, ayah: number): string {
  const r = getReciter(reciterId);
  const pad = (n: number) => String(n).padStart(3, "0");
  return `https://everyayah.com/data/${r.path}/${pad(surah)}${pad(ayah)}.mp3`;
}

/* ————————————————————————————————————————————————————————————
   O'qish sahnasi — fonlar va tipografika
———————————————————————————————————————————————————————————— */

export type BackgroundId = "nur" | "mushaf" | "sakinah" | "layl";

export const BACKGROUNDS: { id: BackgroundId; label: string; sub: L10n }[] = [
  {
    id: "nur",
    label: "Nūr",
    sub: { uz: "tepadan", ru: "сверху", en: "from above" },
  },
  {
    id: "mushaf",
    label: "Mushaf",
    sub: { uz: "kitobdan", ru: "от книги", en: "from the book" },
  },
  {
    id: "sakinah",
    label: "Sakīnah",
    sub: { uz: "suzuvchi sharlar", ru: "плывущие сферы", en: "ambient orbs" },
  },
  {
    id: "layl",
    label: "Layl",
    sub: { uz: "tungi osmon", ru: "ночное небо", en: "night sky" },
  },
];

export type ScriptId = "uthmani" | "indopak";

export const SCRIPTS: { id: ScriptId; label: string }[] = [
  { id: "uthmani", label: "Uthmani" },
  { id: "indopak", label: "IndoPak" },
];

/* ————————————————————————————————————————————————————————————
   Tarjimalar — quran.com API v4 resurs id'lari
———————————————————————————————————————————————————————————— */

export interface TranslationOption {
  id: number;
  name: string;
}

/** Har til uchun mavjud tarjimalar — pleyerdan almashtiriladi */
export const TRANSLATIONS: Record<Locale, TranslationOption[]> = {
  uz: [
    { id: 55, name: "Muhammad Sodiq Muhammad Yusuf — lotin" },
    { id: 127, name: "Муҳаммад Содиқ Муҳаммад Юсуф — кирилл" },
    { id: 101, name: "Алоуддин Мансур — кирилл" },
  ],
  ru: [
    { id: 45, name: "Эльмир Кулиев" },
    { id: 79, name: "Абу Адель" },
    { id: 78, name: "Министерство вакфов, Египет" },
  ],
  en: [
    { id: 20, name: "Saheeh International" },
    { id: 85, name: "M.A.S. Abdel Haleem" },
    { id: 84, name: "Mufti Taqi Usmani" },
    { id: 22, name: "Abdullah Yusuf Ali" },
  ],
};

export const DEFAULT_TRANSLATION: Record<Locale, number> = {
  uz: 55,
  ru: 45,
  en: 20,
};

export function translationName(locale: Locale, id: number): string {
  return (
    TRANSLATIONS[locale].find((t) => t.id === id)?.name ??
    TRANSLATIONS[locale][0].name
  );
}

/** Berilgan id shu tilga tegishli emasmi — shunda tilning standarti olinadi */
export function resolveTranslation(locale: Locale, id: number | null): number {
  if (id !== null && TRANSLATIONS[locale].some((t) => t.id === id)) return id;
  return DEFAULT_TRANSLATION[locale];
}

/** quran.com'dagi inglizcha transliteratsiya resursi */
export const TRANSLITERATION_ID = 57;
