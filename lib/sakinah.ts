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
  4: { slug: "An-Nisa", arabic: "النساء", verses: 176 },
  9: { slug: "At-Tawbah", arabic: "التوبة", verses: 129 },
  12: { slug: "Yusuf", arabic: "يوسف", verses: 111 },
  13: { slug: "Ar-Ra'd", arabic: "الرعد", verses: 43 },
  14: { slug: "Ibrahim", arabic: "إبراهيم", verses: 52 },
  16: { slug: "An-Nahl", arabic: "النحل", verses: 128 },
  18: { slug: "Al-Kahf", arabic: "الكهف", verses: 110 },
  20: { slug: "Ta-Ha", arabic: "طه", verses: 135 },
  39: { slug: "Az-Zumar", arabic: "الزمر", verses: 75 },
  65: { slug: "At-Talaq", arabic: "الطلاق", verses: 12 },
  66: { slug: "At-Tahrim", arabic: "التحريم", verses: 12 },
  93: { slug: "Ad-Duha", arabic: "الضحى", verses: 11 },
  94: { slug: "Ash-Sharh", arabic: "الشرح", verses: 8 },
};

/**
 * Sessiya bir tekis ro'yxat emas — to'rt bosqichli sayohat:
 * kelish → o'ylash → chuqurlashish → yakunlash.
 */
export type Stage = "arrival" | "reflection" | "deepening" | "closing";

export const STAGES: Stage[] = [
  "arrival",
  "reflection",
  "deepening",
  "closing",
];

export const STAGE_LABEL: Record<Stage, L10n> = {
  arrival: { uz: "Kelish", ru: "Прибытие", en: "Arrival" },
  reflection: { uz: "O'ylash", ru: "Размышление", en: "Reflection" },
  deepening: { uz: "Chuqurlashish", ru: "Углубление", en: "Deepening" },
  closing: { uz: "Yakunlash", ru: "Завершение", en: "Closing" },
};

export const STAGE_SUB: Record<Stage, L10n> = {
  arrival: {
    uz: "Qalbni joyiga qo'yadigan qisqa parcha",
    ru: "Короткий отрывок, чтобы успокоиться",
    en: "A short passage to settle",
  },
  reflection: {
    uz: "Niyatingizga bevosita tegishli parcha",
    ru: "Отрывок, прямо связанный с вашим намерением",
    en: "A passage tied to your intention",
  },
  deepening: {
    uz: "Mavzuni kengaytiradigan ikkinchi parcha",
    ru: "Второй отрывок, расширяющий тему",
    en: "A second passage expanding the theme",
  },
  closing: {
    uz: "Umid va tinchlik bilan yakun",
    ru: "Завершение с надеждой и покоем",
    en: "A hopeful, calming close",
  },
};

export type ThemeId =
  | "comfort"
  | "patience"
  | "hope"
  | "mercy"
  | "forgiveness"
  | "gratitude"
  | "trust"
  | "guidance"
  | "provision"
  | "remembrance";

export const THEME_LABEL: Record<ThemeId, L10n> = {
  comfort: { uz: "Taskin", ru: "Утешение", en: "Comfort" },
  patience: { uz: "Sabr", ru: "Терпение", en: "Patience" },
  hope: { uz: "Umid", ru: "Надежда", en: "Hope" },
  mercy: { uz: "Rahmat", ru: "Милость", en: "Mercy" },
  forgiveness: { uz: "Mag'firat", ru: "Прощение", en: "Forgiveness" },
  gratitude: { uz: "Shukr", ru: "Благодарность", en: "Gratitude" },
  trust: { uz: "Tavakkul", ru: "Упование", en: "Trust" },
  guidance: { uz: "Hidoyat", ru: "Руководство", en: "Guidance" },
  provision: { uz: "Rizq", ru: "Удел", en: "Provision" },
  remembrance: { uz: "Zikr", ru: "Поминание", en: "Remembrance" },
};

export interface Passage {
  surah: number;
  from: number;
  to: number;
  minutes: number;
  /** Sayohatdagi o'rni */
  stage: Stage;
  /** Mavzular — «shunga o'xshash» tavsiyalari uchun */
  themes: ThemeId[];
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
      uz: "Notinch qalb uchun tayyorlangan sayohat",
      ru: "Путь, подготовленный для встревоженного сердца",
      en: "A journey prepared for a heavy heart",
    },
    passages: [
      {
        surah: 20,
        from: 25,
        to: 28,
        minutes: 2,
        stage: "arrival",
        themes: ["comfort","trust"],
        note: {
          uz: "Muso alayhissalomning duosi — qiyin ish oldidan ko'ngilni kengaytirishni so'rash.",
          ru: "Мольба Мусы (мир ему) — просьба раскрыть грудь перед трудным делом.",
          en: "The prayer of Musa (peace be upon him) — asking for the chest to be opened before a hard task.",
        },
      },
      {
        surah: 13,
        from: 28,
        to: 28,
        minutes: 2,
        stage: "reflection",
        themes: ["comfort","remembrance"],
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
        stage: "deepening",
        themes: ["hope","comfort"],
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
        stage: "closing",
        themes: ["mercy","trust"],
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
      uz: "Shukr qalbi uchun tayyorlangan sayohat",
      ru: "Путь для благодарного сердца",
      en: "A journey for a grateful heart",
    },
    passages: [
      {
        surah: 16,
        from: 18,
        to: 18,
        minutes: 2,
        stage: "arrival",
        themes: ["gratitude","mercy"],
        note: {
          uz: "Ne'matlarni sanashning imkoni yo'qligi — shukr shu yerdan boshlanadi.",
          ru: "Милости невозможно сосчитать — с этого начинается благодарность.",
          en: "The favours cannot be counted — gratitude begins here.",
        },
      },
      {
        surah: 14,
        from: 7,
        to: 7,
        minutes: 2,
        stage: "reflection",
        themes: ["gratitude","hope"],
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
        stage: "deepening",
        themes: ["gratitude","comfort"],
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
        stage: "closing",
        themes: ["remembrance","gratitude"],
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
      uz: "Qayg'uli qalb uchun tayyorlangan sayohat",
      ru: "Путь для скорбящего сердца",
      en: "A journey for a grieving heart",
    },
    passages: [
      {
        surah: 93,
        from: 3,
        to: 3,
        minutes: 1,
        stage: "arrival",
        themes: ["comfort","hope"],
        note: {
          uz: "Vahiy to'xtagan og'ir kunlarda nozil bo'lgan: «Robbing seni tark etgani yo'q».",
          ru: "Ниспослано в тяжёлые дни: «Не покинул тебя твой Господь».",
          en: "Revealed in heavy days: your Lord has not forsaken you.",
        },
      },
      {
        surah: 2,
        from: 155,
        to: 157,
        minutes: 3,
        stage: "reflection",
        themes: ["patience","hope"],
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
        stage: "deepening",
        themes: ["comfort","trust"],
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
        stage: "closing",
        themes: ["patience","comfort"],
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
      uz: "Pushaymon qalb uchun tayyorlangan sayohat",
      ru: "Путь для раскаивающегося сердца",
      en: "A journey for a regretful heart",
    },
    passages: [
      {
        surah: 4,
        from: 110,
        to: 110,
        minutes: 2,
        stage: "arrival",
        themes: ["forgiveness","mercy"],
        note: {
          uz: "Eshik ochiq ekanini eslatadi — kechirim so'ragan kishi Allohni G'afur topadi.",
          ru: "Напоминает, что дверь открыта — просящий прощения найдёт Аллаха Прощающим.",
          en: "A reminder that the door is open — whoever seeks forgiveness finds Allah forgiving.",
        },
      },
      {
        surah: 39,
        from: 53,
        to: 53,
        minutes: 2,
        stage: "reflection",
        themes: ["forgiveness","hope"],
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
        stage: "deepening",
        themes: ["forgiveness","mercy"],
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
        stage: "closing",
        themes: ["forgiveness","hope"],
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
      uz: "Yo'l izlayotgan qalb uchun tayyorlangan sayohat",
      ru: "Путь для ищущего сердца",
      en: "A journey for a searching heart",
    },
    passages: [
      {
        surah: 2,
        from: 257,
        to: 257,
        minutes: 2,
        stage: "arrival",
        themes: ["guidance","hope"],
        note: {
          uz: "Alloh imon keltirganlarni zulmatdan nurga chiqaradi — yo'l izlashning boshlanishi.",
          ru: "Аллах выводит верующих из мрака к свету — начало поиска пути.",
          en: "Allah brings the believers out of darkness into light — where the search begins.",
        },
      },
      {
        surah: 18,
        from: 10,
        to: 10,
        minutes: 2,
        stage: "reflection",
        themes: ["guidance","mercy"],
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
        stage: "deepening",
        themes: ["guidance","remembrance"],
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
        stage: "closing",
        themes: ["guidance","mercy"],
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
      uz: "Kelajakdan cho'chigan qalb uchun tayyorlangan sayohat",
      ru: "Путь для сердца, боящегося будущего",
      en: "A journey for a heart afraid of what comes",
    },
    passages: [
      {
        surah: 3,
        from: 160,
        to: 160,
        minutes: 2,
        stage: "arrival",
        themes: ["trust","hope"],
        note: {
          uz: "Yordam Allohdan ekanini eslatib, qo'rquvni o'z o'lchoviga qaytaradi.",
          ru: "Напоминает, что помощь — от Аллаха, и возвращает страху его меру.",
          en: "Puts fear back in proportion: if Allah helps you, none can overcome you.",
        },
      },
      {
        surah: 65,
        from: 2,
        to: 3,
        minutes: 3,
        stage: "reflection",
        themes: ["trust","provision"],
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
        stage: "deepening",
        themes: ["trust","patience"],
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
        stage: "closing",
        themes: ["trust","patience"],
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

export type FormatId = "listen" | "both" | "reflect";

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
    {
      id: "reflect",
      label: {
        uz: "Tinglash + o'ylash",
        ru: "Слушать + размышлять",
        en: "Listen + reflect",
      },
      sub: {
        uz: "Har parchadan keyin qisqa to'xtash",
        ru: "Короткая пауза после каждого отрывка",
        en: "A short pause after each passage",
      },
      arabic: "تَدَبُّر",
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
  /** quran.com recitation id — so'zma-so'z vaqt belgilari shundan keladi */
  recitationId: number;
}

export const RECITERS: Reciter[] = [
  {
    id: "sudais",
    name: "Abdur Rahman As-Sudais",
    style: { uz: "Mujavvad", ru: "Муджаввад", en: "Mujawwad" },
    place: { uz: "Makka", ru: "Мекка", en: "Makkah" },
    recitationId: 3,
  },
  {
    id: "alafasy",
    name: "Mishary Alafasy",
    style: { uz: "Murattal", ru: "Мураттал", en: "Murattal" },
    place: { uz: "Quvayt", ru: "Кувейт", en: "Kuwait" },
    recitationId: 7,
  },
  {
    id: "shuraym",
    name: "Saud Ash-Shuraym",
    style: { uz: "Murattal", ru: "Мураттал", en: "Murattal" },
    place: { uz: "Makka", ru: "Мекка", en: "Makkah" },
    recitationId: 10,
  },
  {
    id: "husary",
    name: "Mahmoud Al-Husary",
    style: { uz: "Muallim", ru: "Муаллим", en: "Muallim" },
    place: { uz: "Qohira", ru: "Каир", en: "Cairo" },
    recitationId: 12,
  },
];

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

/* ————————————————————————————————————————————————————————————
   Fon ohangi — fon o'zgarganda interfeys rangi ham unga moslashadi
———————————————————————————————————————————————————————————— */

export interface Tone {
  /** Asosiy urg'u rangi */
  accent: string;
  /** Urg'uning shaffof varianti */
  accentSoft: string;
  /** Qorong'i yuza */
  panel: string;
}

export const TONES: Record<BackgroundId, Tone> = {
  nur: {
    accent: "#7dffc5",
    accentSoft: "rgba(125, 255, 197, 0.18)",
    panel: "rgba(8, 32, 22, 0.92)",
  },
  mushaf: {
    accent: "#f2c879",
    accentSoft: "rgba(242, 200, 121, 0.18)",
    panel: "rgba(34, 26, 12, 0.92)",
  },
  sakinah: {
    accent: "#1ece83",
    accentSoft: "rgba(30, 206, 131, 0.18)",
    panel: "rgba(13, 36, 26, 0.92)",
  },
  layl: {
    accent: "#8fb6ff",
    accentSoft: "rgba(143, 182, 255, 0.18)",
    panel: "rgba(12, 20, 44, 0.92)",
  },
  dawn: {
    accent: "#ffc98b",
    accentSoft: "rgba(255, 201, 139, 0.18)",
    panel: "rgba(38, 24, 18, 0.92)",
  },
  rain: {
    accent: "#9ec6e8",
    accentSoft: "rgba(158, 198, 232, 0.18)",
    panel: "rgba(16, 26, 34, 0.92)",
  },
  quiet: {
    accent: "#b9c4d6",
    accentSoft: "rgba(185, 196, 214, 0.16)",
    panel: "rgba(10, 14, 22, 0.94)",
  },
};

/* ————————————————————————————————————————————————————————————
   O'qish sahnasi — fonlar va tipografika
———————————————————————————————————————————————————————————— */

export type BackgroundId =
  | "nur"
  | "mushaf"
  | "sakinah"
  | "layl"
  | "dawn"
  | "rain"
  | "quiet";

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
  {
    id: "dawn",
    label: "Fajr",
    sub: { uz: "tong yorishuvi", ru: "рассвет", en: "first light" },
  },
  {
    id: "rain",
    label: "Matar",
    sub: { uz: "yomg'ir", ru: "дождь", en: "rain" },
  },
  {
    id: "quiet",
    label: "Sukut",
    sub: { uz: "sokinlik", ru: "тишина", en: "stillness" },
  },
];

/**
 * Har kayfiyatga mos atmosfera. Foydalanuvchi o'zi tanlamaguncha
 * sessiya boshlanganda shu qo'yiladi.
 */
export const MOOD_BACKGROUND: Record<MoodId, BackgroundId> = {
  anxious: "quiet",
  grateful: "dawn",
  grieving: "rain",
  regretful: "layl",
  guidance: "nur",
  fear: "mushaf",
};

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
