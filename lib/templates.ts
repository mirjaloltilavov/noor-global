import type { Locale } from "./i18n";

/**
 * Hujjat qoliplari — bo'sh varaqdan boshlash o'rniga tayyor tuzilma.
 * Qolip faqat sarlavhalar beradi, mazmunni foydalanuvchi yozadi.
 */
export interface Template {
  id: string;
  label: Record<Locale, string>;
  hint: Record<Locale, string>;
  /** Bo'sh qolip uchun matn bo'lmaydi */
  body: Record<Locale, string>;
}

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    label: { uz: "Bo'sh hujjat", ru: "Пустой документ", en: "Blank document" },
    hint: {
      uz: "Toza varaqdan boshlash",
      ru: "Начать с чистого листа",
      en: "Start from a clean page",
    },
    body: { uz: "", ru: "", en: "" },
  },
  {
    id: "khutbah",
    label: { uz: "Xutba", ru: "Хутба", en: "Khutbah" },
    hint: {
      uz: "Hamd · mavzu · dalillar · nasihat · duo",
      ru: "Хвала · тема · доводы · наставление · дуа",
      en: "Praise · theme · evidence · counsel · dua",
    },
    body: {
      uz: `## Hamd va salovat

## Mavzuning bayoni

## Qur'ondan dalil

## Sunnatdan dalil

## Hayotdagi misol

## Amaliy nasihat

## Yakun va duo
`,
      ru: `## Хвала и салават

## Изложение темы

## Довод из Корана

## Довод из Сунны

## Пример из жизни

## Практическое наставление

## Завершение и дуа
`,
      en: `## Praise and salawat

## Statement of the theme

## Evidence from the Qur'an

## Evidence from the Sunnah

## An example from life

## Practical counsel

## Closing and dua
`,
    },
  },
  {
    id: "lecture",
    label: { uz: "Ma'ruza", ru: "Лекция", en: "Lecture" },
    hint: {
      uz: "Maqsad · reja · asosiy qism · xulosa",
      ru: "Цель · план · основная часть · вывод",
      en: "Aim · outline · body · conclusion",
    },
    body: {
      uz: `## Maqsad

## Reja

1.
2.
3.

## Kirish

## Asosiy qism

## Muhokama uchun savollar

## Xulosa

## Manbalar
`,
      ru: `## Цель

## План

1.
2.
3.

## Введение

## Основная часть

## Вопросы для обсуждения

## Вывод

## Источники
`,
      en: `## Aim

## Outline

1.
2.
3.

## Introduction

## Main part

## Questions for discussion

## Conclusion

## Sources
`,
    },
  },
  {
    id: "lesson",
    label: { uz: "Dars rejasi", ru: "План урока", en: "Lesson plan" },
    hint: {
      uz: "Mavzu · vaqt · bosqichlar · vazifa",
      ru: "Тема · время · этапы · задание",
      en: "Topic · time · stages · homework",
    },
    body: {
      uz: `## Mavzu

## Davomiyligi

## Kutilayotgan natija

## Dars bosqichlari

- Takrorlash
- Yangi mavzu
- Mustahkamlash

## Uyga vazifa

## Manbalar
`,
      ru: `## Тема

## Продолжительность

## Ожидаемый результат

## Этапы урока

- Повторение
- Новая тема
- Закрепление

## Домашнее задание

## Источники
`,
      en: `## Topic

## Duration

## Expected outcome

## Lesson stages

- Review
- New material
- Consolidation

## Homework

## Sources
`,
    },
  },
  {
    id: "research",
    label: { uz: "Tadqiqot bo'limi", ru: "Раздел исследования", en: "Research section" },
    hint: {
      uz: "Muammo · tahlil · dalillar · xulosa · manbalar",
      ru: "Проблема · анализ · доводы · вывод · источники",
      en: "Problem · analysis · evidence · conclusion · sources",
    },
    body: {
      uz: `## Muammoning qo'yilishi

## Mavzuning o'rganilganligi

## Tahlil

## Dalillar

## Xulosa

## Manbalar
`,
      ru: `## Постановка проблемы

## Степень изученности

## Анализ

## Доводы

## Вывод

## Источники
`,
      en: `## Statement of the problem

## Prior work

## Analysis

## Evidence

## Conclusion

## Sources
`,
    },
  },
];

/**
 * Matndagi iqtiboslardan manbalar ro'yxatini yig'adi.
 * Iqtibos oxiri har doim «> — manba» ko'rinishida bo'ladi.
 */
export function collectSources(body: string): string[] {
  const out: string[] = [];
  for (const raw of body.split("\n")) {
    const m = raw.match(/^>\s*—\s*(.+?)\s*$/);
    if (!m) continue;
    const source = m[1].trim();
    if (source && !out.includes(source)) out.push(source);
  }
  return out;
}

/** «Manbalar» bo'limini tuzadi (raqamlangan ro'yxat) */
export function sourcesSection(heading: string, sources: string[]): string {
  const list = sources.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `## ${heading}\n\n${list}\n`;
}
