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
  6: { slug: "Al-An'am", arabic: "الأنعام", verses: 165 },
  7: { slug: "Al-A'raf", arabic: "الأعراف", verses: 206 },
  10: { slug: "Yunus", arabic: "يونس", verses: 109 },
  25: { slug: "Al-Furqan", arabic: "الفرقان", verses: 77 },
  29: { slug: "Al-'Ankabut", arabic: "العنكبوت", verses: 69 },
  30: { slug: "Ar-Rum", arabic: "الروم", verses: 60 },
  47: { slug: "Muhammad", arabic: "محمد", verses: 38 },
  48: { slug: "Al-Fath", arabic: "الفتح", verses: 29 },
  50: { slug: "Qaf", arabic: "ق", verses: 45 },
  51: { slug: "Adh-Dhariyat", arabic: "الذاريات", verses: 60 },
  53: { slug: "An-Najm", arabic: "النجم", verses: 62 },
  57: { slug: "Al-Hadid", arabic: "الحديد", verses: 29 },
  59: { slug: "Al-Hashr", arabic: "الحشر", verses: 24 },
  87: { slug: "Al-A'la", arabic: "الأعلى", verses: 19 },
  89: { slug: "Al-Fajr", arabic: "الفجر", verses: 30 },
  103: { slug: "Al-'Asr", arabic: "العصر", verses: 3 },
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
  | "remembrance"
  | "strength"
  | "closeness"
  | "hereafter"
  | "faith"
  | "reflection";

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
  strength: { uz: "Kuch", ru: "Сила", en: "Strength" },
  closeness: { uz: "Yaqinlik", ru: "Близость", en: "Closeness" },
  hereafter: { uz: "Oxirat", ru: "Ахира", en: "The Hereafter" },
  faith: { uz: "Iymon", ru: "Вера", en: "Faith" },
  reflection: { uz: "Tafakkur", ru: "Размышление", en: "Reflection" },
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
  | "fear"
  | "hopeful"
  | "peaceful"
  | "lonely"
  | "overwhelmed"
  | "motivated"
  | "reflective"
  | "unsure";

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
  {
    id: "hopeful",
    label: { uz: "Umiddaman", ru: "С надеждой", en: "Hopeful" },
    arabic: "رَجَاء",
    title: {
      uz: "Umidni mustahkamlaydigan sayohat",
      ru: "Путь, укрепляющий надежду",
      en: "A journey that strengthens hope",
    },
    passages: [
      {
        surah: 94,
        from: 5,
        to: 8,
        minutes: 2,
        stage: "arrival",
        themes: ["hope","comfort"],
        note: {
          uz: "Qiyinchilik bilan birga yengillik keladi — ikki marta takrorlangan va'da.",
          ru: "С трудностью приходит облегчение — обещание, повторённое дважды.",
          en: "With hardship comes ease — a promise repeated twice.",
        },
      },
      {
        surah: 12,
        from: 87,
        to: 87,
        minutes: 2,
        stage: "reflection",
        themes: ["hope","trust"],
        note: {
          uz: "Ya'qub alayhissalom o'g'illariga: Allohning rahmatidan umid uzmang.",
          ru: "Йакуб (мир ему) сыновьям: не отчаивайтесь в милости Аллаха.",
          en: "Ya'qub (peace be upon him) to his sons: do not despair of Allah's mercy.",
        },
      },
      {
        surah: 2,
        from: 214,
        to: 214,
        minutes: 2,
        stage: "deepening",
        themes: ["hope","patience"],
        note: {
          uz: "Sinov og'irlashganda savol tug'iladi — javob: Allohning yordami yaqin.",
          ru: "Когда испытание тяжелеет, возникает вопрос — ответ: помощь Аллаха близка.",
          en: "When the trial grows heavy the question comes — the answer: Allah's help is near.",
        },
      },
      {
        surah: 3,
        from: 139,
        to: 141,
        minutes: 2,
        stage: "closing",
        themes: ["hope","strength"],
        note: {
          uz: "Zaiflashmang va g'am chekmang — iymon bilan yuqori bo'lasiz.",
          ru: "Не слабейте и не печальтесь — с верой вы будете выше.",
          en: "Do not weaken or grieve — with faith you will be superior.",
        },
      },
    ],
  },
  {
    id: "peaceful",
    label: { uz: "Tinchman", ru: "Спокойно", en: "Peaceful" },
    arabic: "طُمَأْنِينَة",
    title: {
      uz: "Tinchlikni chuqurlashtiradigan sayohat",
      ru: "Путь, углубляющий покой",
      en: "A journey that deepens the calm",
    },
    passages: [
      {
        surah: 89,
        from: 27,
        to: 30,
        minutes: 2,
        stage: "arrival",
        themes: ["comfort","closeness"],
        note: {
          uz: "Xotirjam qalbga qilingan chaqiriq — Rabbingga rozi holda qayt.",
          ru: "Обращение к спокойной душе — вернись к Господу довольной.",
          en: "The call to the tranquil soul — return to your Lord well-pleased.",
        },
      },
      {
        surah: 48,
        from: 4,
        to: 4,
        minutes: 2,
        stage: "reflection",
        themes: ["comfort","faith"],
        note: {
          uz: "Sakinah — qalblarga tushirilgan tinchlik, iymonni ziyoda qiladi.",
          ru: "Сакина — покой, ниспосланный в сердца, увеличивающий веру.",
          en: "Sakinah — the calm sent down into hearts, increasing faith.",
        },
      },
      {
        surah: 10,
        from: 62,
        to: 64,
        minutes: 2,
        stage: "deepening",
        themes: ["comfort","closeness"],
        note: {
          uz: "Allohning do'stlariga qo'rquv ham, g'am ham yo'q.",
          ru: "У приближённых Аллаха нет ни страха, ни печали.",
          en: "The friends of Allah have neither fear nor grief.",
        },
      },
      {
        surah: 6,
        from: 127,
        to: 127,
        minutes: 2,
        stage: "closing",
        themes: ["hope","hereafter"],
        note: {
          uz: "Tinchlik yurti — Rabbning huzurida, va U ularning do'sti.",
          ru: "Обитель мира — у их Господа, и Он их Покровитель.",
          en: "The Home of Peace is with their Lord, and He is their protector.",
        },
      },
    ],
  },
  {
    id: "lonely",
    label: { uz: "Yolg'izman", ru: "Одиноко", en: "Lonely" },
    arabic: "وَحْدَة",
    title: {
      uz: "Yolg'izlik his qilgan qalb uchun sayohat",
      ru: "Путь для сердца, ощущающего одиночество",
      en: "A journey for a heart that feels alone",
    },
    passages: [
      {
        surah: 50,
        from: 16,
        to: 16,
        minutes: 2,
        stage: "arrival",
        themes: ["closeness","comfort"],
        note: {
          uz: "Alloh insonga jon tomiridan ham yaqinroq — hech qachon yolg'iz emassiz.",
          ru: "Аллах ближе к человеку, чем яремная вена — вы никогда не одни.",
          en: "Allah is nearer to man than his jugular vein — you are never alone.",
        },
      },
      {
        surah: 20,
        from: 46,
        to: 46,
        minutes: 2,
        stage: "reflection",
        themes: ["closeness","trust"],
        note: {
          uz: "Musoga aytilgan: Men ikkovingiz bilanman, eshitaman va ko'raman.",
          ru: "Сказано Мусе: Я с вами обоими, слышу и вижу.",
          en: "Said to Musa: I am with you both, hearing and seeing.",
        },
      },
      {
        surah: 18,
        from: 16,
        to: 16,
        minutes: 2,
        stage: "deepening",
        themes: ["mercy","closeness"],
        note: {
          uz: "G'or yigitlari yolg'izlikka chekinganda rahmat ular uchun yoyildi.",
          ru: "Когда юноши уединились в пещере, милость была простёрта для них.",
          en: "When the youths withdrew to the cave, mercy was spread out for them.",
        },
      },
      {
        surah: 39,
        from: 36,
        to: 38,
        minutes: 2,
        stage: "closing",
        themes: ["trust","faith"],
        note: {
          uz: "Alloh bandasiga yetarli emasmi? — savol shaklidagi tasalli.",
          ru: "Разве Аллаха не достаточно для Его раба? — утешение в форме вопроса.",
          en: "Is Allah not sufficient for His servant? — comfort in the form of a question.",
        },
      },
    ],
  },
  {
    id: "overwhelmed",
    label: { uz: "Charchaganman", ru: "Всё навалилось", en: "Overwhelmed" },
    arabic: "إِرْهَاق",
    title: {
      uz: "Yuk og'ir kelgan kunlar uchun sayohat",
      ru: "Путь для дней, когда ноша тяжела",
      en: "A journey for days when the load is heavy",
    },
    passages: [
      {
        surah: 20,
        from: 1,
        to: 2,
        minutes: 2,
        stage: "arrival",
        themes: ["comfort","mercy"],
        note: {
          uz: "Qur'on qiynash uchun emas, yengillik uchun nozil bo'lgan.",
          ru: "Коран ниспослан не для того, чтобы обременять, а для облегчения.",
          en: "The Qur'an was not sent down to cause distress.",
        },
      },
      {
        surah: 7,
        from: 42,
        to: 42,
        minutes: 2,
        stage: "reflection",
        themes: ["mercy","patience"],
        note: {
          uz: "Hech kim toqatidan ortiq yuklanmaydi — o'lchov Allohning o'zida.",
          ru: "Ни на кого не возлагается сверх его возможностей — мера у Аллаха.",
          en: "No soul is burdened beyond its capacity — the measure is with Allah.",
        },
      },
      {
        surah: 65,
        from: 7,
        to: 7,
        minutes: 2,
        stage: "deepening",
        themes: ["provision","hope"],
        note: {
          uz: "Alloh qiyinchilikdan keyin yengillik beradi — vaqt Uning qo'lida.",
          ru: "Аллах даёт облегчение после трудности — время в Его руке.",
          en: "Allah brings ease after hardship — the timing is in His hand.",
        },
      },
      {
        surah: 25,
        from: 58,
        to: 58,
        minutes: 2,
        stage: "closing",
        themes: ["trust","remembrance"],
        note: {
          uz: "O'lmaydigan Tirikka tavakkul qiling va Uni hamd bilan yodlang.",
          ru: "Уповай на Живого, Который не умирает, и славь Его.",
          en: "Rely upon the Ever-Living who does not die, and glorify Him.",
        },
      },
    ],
  },
  {
    id: "motivated",
    label: { uz: "Ruhlanganman", ru: "Есть силы", en: "Motivated" },
    arabic: "هِمَّة",
    title: {
      uz: "Harakatni to'g'ri yo'nalishga soladigan sayohat",
      ru: "Путь, направляющий усилие",
      en: "A journey that aims the effort",
    },
    passages: [
      {
        surah: 9,
        from: 105,
        to: 105,
        minutes: 2,
        stage: "arrival",
        themes: ["strength","faith"],
        note: {
          uz: "Ishlang — amalingizni Alloh ham, mo'minlar ham ko'radi.",
          ru: "Трудитесь — ваши дела увидят Аллах и верующие.",
          en: "Work — Allah and the believers will see your deeds.",
        },
      },
      {
        surah: 53,
        from: 39,
        to: 41,
        minutes: 2,
        stage: "reflection",
        themes: ["strength","hereafter"],
        note: {
          uz: "Insonga faqat o'zi intilgan narsa bor — sa'y-harakat zoye ketmaydi.",
          ru: "Человеку — лишь то, к чему он стремился; усилие не пропадает.",
          en: "Man will have nothing but what he strove for — effort is not wasted.",
        },
      },
      {
        surah: 29,
        from: 69,
        to: 69,
        minutes: 2,
        stage: "deepening",
        themes: ["strength","guidance"],
        note: {
          uz: "Biz uchun jahd qilganlarni Biz yo'llarimizga boshlaymiz.",
          ru: "Тех, кто усердствует ради Нас, Мы направим на Наши пути.",
          en: "Those who strive for Us — We will guide them to Our ways.",
        },
      },
      {
        surah: 18,
        from: 30,
        to: 31,
        minutes: 2,
        stage: "closing",
        themes: ["hope","hereafter"],
        note: {
          uz: "Yaxshi ish qilganning ajri zoye ketmaydi — hisob aniq.",
          ru: "Награда совершающего добро не пропадает — счёт точен.",
          en: "The reward of one who does good is never wasted.",
        },
      },
    ],
  },
  {
    id: "reflective",
    label: { uz: "O'ylanyapman", ru: "Хочется подумать", en: "Reflective" },
    arabic: "تَفَكُّر",
    title: {
      uz: "Tafakkurga ochilgan qalb uchun sayohat",
      ru: "Путь для сердца, открытого размышлению",
      en: "A journey for a heart open to reflection",
    },
    passages: [
      {
        surah: 3,
        from: 190,
        to: 191,
        minutes: 2,
        stage: "arrival",
        themes: ["reflection","faith"],
        note: {
          uz: "Osmonlar va yerning yaratilishida aql egalari uchun belgilar bor.",
          ru: "В сотворении небес и земли — знамения для обладающих разумом.",
          en: "In the creation of the heavens and the earth are signs for people of understanding.",
        },
      },
      {
        surah: 47,
        from: 24,
        to: 24,
        minutes: 2,
        stage: "reflection",
        themes: ["reflection","guidance"],
        note: {
          uz: "Qur'on ustida o'ylanmaydilarmi? — savol o'quvchining o'ziga qaratilgan.",
          ru: "Неужели они не размышляют над Кораном? — вопрос обращён к читателю.",
          en: "Do they not reflect upon the Qur'an? — the question is aimed at the reader.",
        },
      },
      {
        surah: 59,
        from: 21,
        to: 21,
        minutes: 2,
        stage: "deepening",
        themes: ["reflection","faith"],
        note: {
          uz: "Bu Qur'on tog'ga tushirilganda tog' bo'linib ketardi.",
          ru: "Если бы этот Коран был ниспослан горе, она раскололась бы.",
          en: "Had this Qur'an been sent down upon a mountain, it would have split apart.",
        },
      },
      {
        surah: 51,
        from: 20,
        to: 21,
        minutes: 2,
        stage: "closing",
        themes: ["reflection","closeness"],
        note: {
          uz: "Yerda va o'z ichingizda belgilar bor — ko'rmayapsizmi?",
          ru: "На земле и в вас самих — знамения. Неужели вы не видите?",
          en: "On the earth and within yourselves are signs — do you not see?",
        },
      },
    ],
  },
  {
    id: "unsure",
    label: { uz: "Bilmayman — shunchaki eslatma bering", ru: "Не знаю — просто напоминание", en: "I don't know — just give me a reminder" },
    arabic: "ذِكْرَى",
    title: {
      uz: "Nomlanmagan holat uchun umumiy eslatma",
      ru: "Общее напоминание, без названия состояния",
      en: "A general reminder, no label needed",
    },
    passages: [
      {
        surah: 1,
        from: 1,
        to: 7,
        minutes: 2,
        stage: "arrival",
        themes: ["guidance","mercy"],
        note: {
          uz: "Fotiha — har namozda takrorlanadigan duo va hidoyat so'rovi.",
          ru: "Аль-Фатиха — мольба, повторяемая в каждой молитве.",
          en: "Al-Fatihah — the supplication repeated in every prayer.",
        },
      },
      {
        surah: 103,
        from: 1,
        to: 3,
        minutes: 2,
        stage: "reflection",
        themes: ["reflection","hereafter"],
        note: {
          uz: "Uch oyatda butun umr o'lchovi: iymon, amal, sabr va haqni tavsiya.",
          ru: "Три аята — мера всей жизни: вера, дела, терпение и призыв к истине.",
          en: "Three verses that measure a whole life: faith, deeds, patience and truth.",
        },
      },
      {
        surah: 57,
        from: 16,
        to: 16,
        minutes: 2,
        stage: "deepening",
        themes: ["remembrance","faith"],
        note: {
          uz: "Qalblar Allohning zikriga bo'ysunadigan vaqt kelmadimi?",
          ru: "Не пришло ли время сердцам смириться перед поминанием Аллаха?",
          en: "Has the time not come for hearts to humble themselves at the remembrance of Allah?",
        },
      },
      {
        surah: 13,
        from: 28,
        to: 28,
        minutes: 2,
        stage: "closing",
        themes: ["comfort","remembrance"],
        note: {
          uz: "Qalblar Allohning zikri bilan orom topadi.",
          ru: "Сердца успокаиваются поминанием Аллаха.",
          en: "Hearts find rest in the remembrance of Allah.",
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
  | "strength"
  | "hope"
  | "trust"
  | "hereafter"
  | "faith"
  | "closeness"
  | "listen";

export const INTENTIONS: {
  id: IntentionId;
  label: L10n;
  arabic: string;
  themes: ThemeId[];
}[] = [
  {
    id: "comfort",
    label: { uz: "Taskin va tinchlik", ru: "Утешение и покой", en: "Comfort and calm" },
    arabic: "طُمَأْنِينَة",
    themes: ["comfort"],
  },
  {
    id: "gratitude",
    label: { uz: "Shukrni oshirish", ru: "Больше благодарности", en: "More gratitude" },
    arabic: "شُكْر",
    themes: ["gratitude"],
  },
  {
    id: "patience",
    label: { uz: "Sabr", ru: "Терпение", en: "Patience" },
    arabic: "صَبْر",
    themes: ["patience"],
  },
  {
    id: "forgiveness",
    label: { uz: "Mag'firat so'rash", ru: "Прощение", en: "Seeking forgiveness" },
    arabic: "اِسْتِغْفَار",
    themes: ["forgiveness"],
  },
  {
    id: "guidance",
    label: { uz: "Yo'l topish", ru: "Ясность и руководство", en: "Clarity and guidance" },
    arabic: "هِدَايَة",
    themes: ["guidance"],
  },
  {
    id: "strength",
    label: { uz: "Kuch", ru: "Сила", en: "Strength" },
    arabic: "قُوَّة",
    themes: ["strength"],
  },
  {
    id: "hope",
    label: { uz: "Umid", ru: "Надежда", en: "Hope" },
    arabic: "رَجَاء",
    themes: ["hope"],
  },
  {
    id: "trust",
    label: { uz: "Allohga tavakkul", ru: "Упование на Аллаха", en: "Trust in Allah" },
    arabic: "تَوَكُّل",
    themes: ["trust"],
  },
  {
    id: "hereafter",
    label: { uz: "Oxiratni eslash", ru: "Напоминание об Ахира", en: "A reminder of the Hereafter" },
    arabic: "آخِرَة",
    themes: ["hereafter"],
  },
  {
    id: "faith",
    label: { uz: "Iymonni mustahkamlash", ru: "Укрепить веру", en: "To strengthen my faith" },
    arabic: "إِيمَان",
    themes: ["faith"],
  },
  {
    id: "closeness",
    label: { uz: "Allohga yaqinlashish", ru: "Стать ближе к Аллаху", en: "To come closer to Allah" },
    arabic: "قُرْب",
    themes: ["closeness", "remembrance"],
  },
  {
    id: "listen",
    label: { uz: "Shunchaki Qur'on tinglash", ru: "Просто слушать Коран", en: "To simply listen to the Qur'an" },
    arabic: "قُرْآن",
    themes: [],
  },
];

export function getIntention(id: IntentionId) {
  return INTENTIONS.find((x) => x.id === id) ?? INTENTIONS[0];
}

/** Tanlangan niyatlardan mavzular ro'yxati */
export function intentionThemes(ids: IntentionId[]): ThemeId[] {
  const out: ThemeId[] = [];
  for (const id of ids)
    for (const th of getIntention(id).themes)
      if (!out.includes(th)) out.push(th);
  return out;
}

/** 0 — «cheksiz»: to'xtatilmaguncha davom etadi */
export const DURATIONS = [5, 10, 20, 30, 45, 0] as const;
export type Duration = (typeof DURATIONS)[number];

export const DURATION_LABELS: Record<Duration, L10n> = {
  5: { uz: "5 daqiqa", ru: "5 минут", en: "5 minutes" },
  10: { uz: "10 daqiqa", ru: "10 минут", en: "10 minutes" },
  20: { uz: "20 daqiqa", ru: "20 минут", en: "20 minutes" },
  30: { uz: "30 daqiqa", ru: "30 минут", en: "30 minutes" },
  45: { uz: "45 daqiqa", ru: "45 минут", en: "45 minutes" },
  0: { uz: "Cheksiz", ru: "Без ограничения", en: "Open-ended" },
};

export const DURATION_SUB: Record<Duration, L10n> = {
  5: { uz: "Qisqa to'xtash", ru: "Короткая пауза", en: "A short pause" },
  10: { uz: "Sokin daqiqa", ru: "Тихая минута", en: "A quiet moment" },
  20: { uz: "Chuqurroq o'ylash", ru: "Более глубокое размышление", en: "A deeper reflection" },
  30: { uz: "Bir o'tirish", ru: "Одно сидение", en: "One sitting" },
  45: { uz: "Uzoq o'tirish", ru: "Долгое сидение", en: "A long sitting" },
  0: { uz: "To'xtatmaguncha", ru: "Пока не остановите", en: "Until you stop" },
};

export const DURATION_ARABIC: Record<Duration, string> = {
  5: "٥",
  10: "١٠",
  20: "٢٠",
  30: "٣٠",
  45: "٤٥",
  0: "∞",
};

export type FormatId = "listen" | "reflect" | "read" | "understand" | "study";

export const FORMATS: {
  id: FormatId;
  label: L10n;
  sub: L10n;
  arabic: string;
  /** Manba hali ulanmagan — tanlanmaydi */
  pending?: boolean;
}[] = [
  {
    id: "listen",
    label: { uz: "Shunchaki tinglash", ru: "Просто слушать", en: "Just listen" },
    sub: {
      uz: "Faqat tilovat — matnsiz",
      ru: "Только чтение вслух, без текста",
      en: "Recitation only",
    },
    arabic: "إِسْتِمَاع",
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
      en: "Moments for reflection",
    },
    arabic: "تَدَبُّر",
  },
  {
    id: "read",
    label: { uz: "Tinglash + o'qish", ru: "Слушать + читать", en: "Listen + read" },
    sub: {
      uz: "Matnni so'zma-so'z kuzatib borish",
      ru: "Следить за текстом слово за словом",
      en: "Follow along with the words",
    },
    arabic: "قِرَاءَة",
  },
  {
    id: "understand",
    label: { uz: "Tushunish", ru: "Понимать", en: "Understand" },
    sub: {
      uz: "Tarjima, so'zma-so'z ma'no va qisqa izohlar",
      ru: "Перевод, пословный смысл и краткие пояснения",
      en: "Translation and selected explanations",
    },
    arabic: "فَهْم",
  },
  {
    id: "study",
    label: { uz: "Chuqur o'rganish", ru: "Изучать", en: "Study" },
    sub: {
      uz: "Tafsir manbasi hali ulanmagan",
      ru: "Источник тафсира ещё не подключён",
      en: "Tafsir source not connected yet",
    },
    arabic: "تَفْسِير",
    pending: true,
  },
];

export function getFormat(id: FormatId) {
  return FORMATS.find((x) => x.id === id) ?? FORMATS[2];
}

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
    id: "alafasy",
    name: "Mishary Rashid Alafasy",
    style: { uz: "Aniq · bir maromda", ru: "Ясно · размеренно", en: "Clear · measured" },
    place: { uz: "Quvayt", ru: "Кувейт", en: "Kuwait" },
    recitationId: 7,
  },
  {
    id: "abdulbasit",
    name: "Abdul Basit Abdus-Samad",
    style: { uz: "Kuchli · ta'sirchan", ru: "Мощно · выразительно", en: "Powerful · expressive" },
    place: { uz: "Misr", ru: "Египет", en: "Egypt" },
    recitationId: 2,
  },
  {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    style: { uz: "Aniq · o'lchovli", ru: "Точно · размеренно", en: "Precise · measured" },
    place: { uz: "Qohira", ru: "Каир", en: "Cairo" },
    recitationId: 6,
  },
  {
    id: "minshawi",
    name: "Mohamed Siddiq Al-Minshawi",
    style: { uz: "Sokin · mayin", ru: "Спокойно · мягко", en: "Calm · gentle" },
    place: { uz: "Misr", ru: "Египет", en: "Egypt" },
    recitationId: 9,
  },
  {
    id: "sudais",
    name: "Abdur Rahman As-Sudais",
    style: { uz: "Mujavvad", ru: "Муджаввад", en: "Mujawwad" },
    place: { uz: "Makka", ru: "Мекка", en: "Makkah" },
    recitationId: 3,
  },
  {
    id: "shuraym",
    name: "Saud Ash-Shuraym",
    style: { uz: "Murattal", ru: "Мураттал", en: "Murattal" },
    place: { uz: "Makka", ru: "Мекка", en: "Makkah" },
    recitationId: 10,
  },
];

/**
 * «O'zi tanlasin» — sessiyaga qarab qori tanlanadi.
 * Tasodifiy emas: kayfiyatga mos ovoz, shuning uchun har safar
 * bir xil kayfiyatda bir xil qori chiqadi.
 */
export const MOOD_RECITER: Record<MoodId, string> = {
  anxious: "husary",
  grateful: "alafasy",
  grieving: "minshawi",
  regretful: "abdulbasit",
  guidance: "husary",
  fear: "minshawi",
  hopeful: "alafasy",
  peaceful: "minshawi",
  lonely: "husary",
  overwhelmed: "minshawi",
  motivated: "sudais",
  reflective: "husary",
  unsure: "alafasy",
};

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
  hopeful: "dawn",
  peaceful: "sakinah",
  lonely: "layl",
  overwhelmed: "quiet",
  motivated: "nur",
  reflective: "mushaf",
  unsure: "nur",
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
