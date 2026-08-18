export const LOCALES = ["uz", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

type Dict = Record<string, string>;

const uz: Dict = {
  "brand.name": "Noor Global",

  "nav.quran": "Qur'on",
  "nav.sakinah": "Sakinah",
  "nav.player": "Pleyer",
  "nav.hadith": "Hadis",
  "nav.ai": "AI suhbat",
  "nav.tafsir": "Tafsir",
  "nav.notepad": "Daftar",
  "nav.settings": "Sozlamalar",

  "soon.badge": "Tez orada",
  "soon.title": "{section} bo'limi tayyorlanmoqda",
  "soon.body":
    "Bu bo'lim Figma dizayni bo'yicha keyingi bosqichda ishga tushadi. Hozircha Sakinah to'liq ishlaydi.",
  "soon.cta": "Sakinahga o'tish",

  "entry.search": "Oldingi eslatmalarni qidirish...",
  "entry.title": "Bugun qalbingiz qanday?",
  "entry.subtitle":
    "Bir nechta qisqa savolga javob bering va Qur'ondan eslatma oling — olimlar ko'rib chiqqan tanlovdan. Bu eslatma, fatvo emas.",
  "entry.begin": "Boshlash",
  "entry.how": "Qanday ishlaydi",
  "entry.reviewed": "Oyatlar tanlovi olimlar tomonidan ko'rib chiqilgan",
  "entry.recent": "So'nggi sessiyalar",
  "entry.repeat": "Takrorlash",
  "entry.empty": "Hali sessiya yo'q — birinchisini boshlang.",
  "entry.disclaimer":
    "Sakinah zikrni taklif qiladi — u sizning holatingizni sharhlamaydi va diniy hukm chiqarmaydi. Shaxsiy masalalarda bilimli olimga murojaat qiling.",

  "compose.title": "Bugun qalbingiz qanday?",
  "compose.subtitle":
    "Eng yaqinini tanlang — qolgani allaqachon sozlangan. Hammasini keyin o'zgartirsangiz bo'ladi.",
  "compose.reciter": "Qorini tanlang",
  "compose.reciterHint":
    "bir marta so'raladi — pleyerdan istalgan vaqt o'zgartiriladi",
  "compose.begin": "Boshlash",
  "compose.meta": "≈ {minutes} daqiqa · {count} parcha · olimlar ko'rib chiqqan",
  "compose.continueTitle": "Oldingi sessiyani davom ettirasizmi?",
  "compose.continueGo": "Davom etish",
  "compose.continueNew": "Yangisini boshlash",
  "compose.retune": "Kayfiyatni o'zgartirish",

  "prep.title": "Sizga eslatma tanlanmoqda",
  "prep.dua": "Robbi zidnii ilmaa",
  "prep.duaTr": "Robbim, ilmimni ziyoda qil.",

  "reminder.meta": "≈ {minutes} daqiqa · {count} parcha · {format}",
  "reminder.begin": "Boshlash",
  "reminder.save": "Keyinga saqlash",
  "reminder.footer":
    "Noor ilmiy kengashi ko'rib chiqqan · Tarjima: {translator} · Sakinah holatingizni sharhlamaydi",
  "reminder.min": "{n} daq",

  "read.fade": "Boshqaruv bir necha soniya harakatsizlikdan so'ng yashirinadi",
  "read.typography": "Tipografika",
  "read.script": "Yozuv",
  "read.fontSize": "Shrift o'lchami",
  "read.lineHeight": "Qatorlar orasi",
  "read.translation": "Tarjima",
  "read.showTranslation": "Tarjimani ko'rsatish",
  "read.showTransliteration": "Transliteratsiyani ko'rsatish",
  "read.background": "Fon",
  "read.bgHint":
    "Fonlar sekin harakatlanadi. Buni «Harakatni kamaytirish» bilan o'chiring.",
  "read.brightness": "Yorqinlik",
  "read.reduceMotion": "Harakatni kamaytirish",
  "read.reduceMotionHint": "Harakat o'rniga silliq o'tish",
  "read.audio": "Ovoz",
  "read.virtue": "Bu parchaning fazilati",
  "read.passageOf": "{i} / {n}-parcha",

  "complete.title": "Sessiya yakunlandi",
  "complete.meta": "{count} parcha · {minutes} daqiqa",
  "complete.save": "To'plamga saqlash",
  "complete.saved": "Saqlandi",
  "complete.again": "Qayta o'qish",
  "complete.share": "Ulashish",
  "complete.copied": "Nusxalandi",
  "complete.done": "Tayyor",
  "complete.feedbackQ": "Shunga o'xshash eslatmalar yana kerakmi?",
  "complete.feedbackHelp":
    "Faqat kelgusi tanlovlar tartibi uchun ishlatiladi — holatingizni sharhlash uchun emas.",
  "complete.yes": "Ha",
  "complete.no": "Yo'q",
  "complete.thanks": "Rahmat — hisobga olindi.",
  "complete.disclaimer":
    "Sakinah zikrni taklif qiladi, hukm emas. Shaxsiy yoki diniy masalalarda bilimli olimga murojaat qiling.",

  "passage.title": "Parcha yakunlandi",
  "passage.continueSurah": "To'liq surani davom ettirish",
  "passage.next": "Keyingi parcha",
  "passage.adjust": "Sozlamalarni o'zgartirish",

  "common.back": "Orqaga",
  "common.close": "Yopish",
  "common.minutes": "daqiqa",
  "common.loading": "Yuklanmoqda...",
  "common.error": "Matnni yuklab bo'lmadi. Internetni tekshiring.",
  "common.retry": "Qayta urinish",
};

const ru: Dict = {
  "brand.name": "Noor Global",

  "nav.quran": "Коран",
  "nav.sakinah": "Сакина",
  "nav.player": "Плеер",
  "nav.hadith": "Хадис",
  "nav.ai": "AI-чат",
  "nav.tafsir": "Тафсир",
  "nav.notepad": "Заметки",
  "nav.settings": "Настройки",

  "soon.badge": "Скоро",
  "soon.title": "Раздел «{section}» в разработке",
  "soon.body":
    "Этот раздел появится на следующем этапе по макету Figma. Сейчас полностью работает Сакина.",
  "soon.cta": "Перейти в Сакину",

  "entry.search": "Поиск по прошлым напоминаниям...",
  "entry.title": "Как ваше сердце сегодня?",
  "entry.subtitle":
    "Ответьте на несколько коротких вопросов и получите напоминание из Корана — из подборки, проверенной учёными. Это напоминание, а не фетва.",
  "entry.begin": "Начать",
  "entry.how": "Как это работает",
  "entry.reviewed": "Подборка аятов проверена учёными",
  "entry.recent": "Недавние сессии",
  "entry.repeat": "Повторить",
  "entry.empty": "Сессий пока нет — начните первую.",
  "entry.disclaimer":
    "Сакина предлагает поминание — она не толкует вашу ситуацию и не выносит религиозных решений. По личным вопросам обратитесь к знающему учёному.",

  "compose.title": "Как ваше сердце сегодня?",
  "compose.subtitle":
    "Выберите наиболее близкое — остальное уже настроено. Всё можно изменить позже.",
  "compose.reciter": "Выберите чтеца",
  "compose.reciterHint":
    "спрашиваем один раз — меняется в плеере в любой момент",
  "compose.begin": "Начать",
  "compose.meta": "≈ {minutes} минут · {count} отрывка · проверено учёными",
  "compose.continueTitle": "Продолжить прошлую сессию?",
  "compose.continueGo": "Продолжить",
  "compose.continueNew": "Начать заново",
  "compose.retune": "Изменить настроение",

  "prep.title": "Подбираем напоминание",
  "prep.dua": "Рабби зидни ильма",
  "prep.duaTr": "Господь мой, увеличь моё знание.",

  "reminder.meta": "≈ {minutes} минут · {count} отрывка · {format}",
  "reminder.begin": "Начать",
  "reminder.save": "Сохранить на потом",
  "reminder.footer":
    "Проверено научным советом Noor · Перевод: {translator} · Сакина не толкует вашу ситуацию",
  "reminder.min": "{n} мин",

  "read.fade": "Управление скрывается после нескольких секунд покоя",
  "read.typography": "Типографика",
  "read.script": "Начертание",
  "read.fontSize": "Размер шрифта",
  "read.lineHeight": "Межстрочный интервал",
  "read.translation": "Перевод",
  "read.showTranslation": "Показывать перевод",
  "read.showTransliteration": "Показывать транслитерацию",
  "read.background": "Фон",
  "read.bgHint": "Фоны движутся медленно. Отключите это в «Уменьшить движение».",
  "read.brightness": "Яркость",
  "read.reduceMotion": "Уменьшить движение",
  "read.reduceMotionHint": "Плавное затухание вместо движения",
  "read.audio": "Звук",
  "read.virtue": "Достоинство этого отрывка",
  "read.passageOf": "Отрывок {i} из {n}",

  "complete.title": "Сессия завершена",
  "complete.meta": "{count} отрывка · {minutes} минут",
  "complete.save": "Сохранить в коллекцию",
  "complete.saved": "Сохранено",
  "complete.again": "Прочитать снова",
  "complete.share": "Поделиться",
  "complete.copied": "Скопировано",
  "complete.done": "Готово",
  "complete.feedbackQ": "Хотите получать такие напоминания снова?",
  "complete.feedbackHelp":
    "Используется только для порядка будущих подборок — никогда для толкования вашей ситуации.",
  "complete.yes": "Да",
  "complete.no": "Нет",
  "complete.thanks": "Спасибо — учтено.",
  "complete.disclaimer":
    "Сакина предлагает поминание, а не решения. По личным или религиозным вопросам обратитесь к знающему учёному.",

  "passage.title": "Отрывок завершён",
  "passage.continueSurah": "Продолжить всю суру",
  "passage.next": "Следующий отрывок",
  "passage.adjust": "Изменить настройки",

  "common.back": "Назад",
  "common.close": "Закрыть",
  "common.minutes": "минут",
  "common.loading": "Загрузка...",
  "common.error": "Не удалось загрузить текст. Проверьте соединение.",
  "common.retry": "Повторить",
};

const en: Dict = {
  "brand.name": "Noor Global",

  "nav.quran": "Quran",
  "nav.sakinah": "Sakinah",
  "nav.player": "Player",
  "nav.hadith": "Hadith",
  "nav.ai": "AI Chat",
  "nav.tafsir": "Tafsir",
  "nav.notepad": "Notepad",
  "nav.settings": "Settings",

  "soon.badge": "Coming soon",
  "soon.title": "{section} is on the way",
  "soon.body":
    "This section ships in the next phase, following the Figma design. Sakinah is fully built today.",
  "soon.cta": "Go to Sakinah",

  "entry.search": "Search past reminders...",
  "entry.title": "How is your heart today?",
  "entry.subtitle":
    "Answer a few short questions and receive a reminder from the Qur'an — chosen from a selection reviewed by scholars. This is a reminder, not a ruling.",
  "entry.begin": "Begin",
  "entry.how": "How it works",
  "entry.reviewed": "Verse selection reviewed by scholars",
  "entry.recent": "Recent sessions",
  "entry.repeat": "Repeat",
  "entry.empty": "No sessions yet — start your first one.",
  "entry.disclaimer":
    "Sakinah suggests remembrance — it does not interpret your situation or give religious rulings. For personal matters, ask a qualified scholar.",

  "compose.title": "How is your heart today?",
  "compose.subtitle":
    "Pick what is closest — the rest is already set. You can change everything later.",
  "compose.reciter": "Choose your reciter",
  "compose.reciterHint": "asked once — change any time from the player",
  "compose.begin": "Begin",
  "compose.meta":
    "≈ {minutes} minutes · {count} passages · reviewed by scholars",
  "compose.continueTitle": "Continue your last session?",
  "compose.continueGo": "Continue",
  "compose.continueNew": "Start fresh",
  "compose.retune": "Re-tune mood",

  "prep.title": "Choosing your reminder",
  "prep.dua": "Rabbi zidni ilma",
  "prep.duaTr": "My Lord, increase me in knowledge.",

  "reminder.meta": "≈ {minutes} minutes · {count} passages · {format}",
  "reminder.begin": "Begin",
  "reminder.save": "Save for later",
  "reminder.footer":
    "Reviewed by the Noor scholarly board · Translation: {translator} · Sakinah does not interpret your situation",
  "reminder.min": "{n} min",

  "read.fade": "Controls fade away after a few seconds of stillness",
  "read.typography": "Typography",
  "read.script": "Script",
  "read.fontSize": "Font size",
  "read.lineHeight": "Line spacing",
  "read.translation": "Translation",
  "read.showTranslation": "Show translation",
  "read.showTransliteration": "Show transliteration",
  "read.background": "Background",
  "read.bgHint": "Backgrounds move slowly. Turn this off with Reduce motion.",
  "read.brightness": "Brightness",
  "read.reduceMotion": "Reduce motion",
  "read.reduceMotionHint": "Fades instead of movement",
  "read.audio": "Audio",
  "read.virtue": "Virtue of this passage",
  "read.passageOf": "Passage {i} of {n}",

  "complete.title": "Session complete",
  "complete.meta": "{count} passages · {minutes} minutes",
  "complete.save": "Save to collection",
  "complete.saved": "Saved",
  "complete.again": "Read again",
  "complete.share": "Share",
  "complete.copied": "Copied",
  "complete.done": "Done",
  "complete.feedbackQ": "Would you like reminders like this again?",
  "complete.feedbackHelp":
    "Used only to order future selections — never to interpret your situation.",
  "complete.yes": "Yes",
  "complete.no": "No",
  "complete.thanks": "Thank you — noted.",
  "complete.disclaimer":
    "Sakinah offers remembrance, not rulings. For personal or religious matters, consult a qualified scholar.",

  "passage.title": "Passage complete",
  "passage.continueSurah": "Continue the full surah",
  "passage.next": "Next passage",
  "passage.adjust": "Adjust settings",

  "common.back": "Back",
  "common.close": "Close",
  "common.minutes": "minutes",
  "common.loading": "Loading...",
  "common.error": "Could not load the text. Check your connection.",
  "common.retry": "Try again",
};

const DICTS: Record<Locale, Dict> = { uz, ru, en };

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>
): string {
  const raw = DICTS[locale][key] ?? DICTS.en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, name) =>
    name in vars ? String(vars[name]) : m
  );
}
