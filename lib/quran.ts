import { TRANSLITERATION_ID } from "./sakinah";

const API = "https://api.quran.com/api/v4";

/** [segment, so'z raqami, boshlanish ms, tugash ms] */
export type WordSegment = [number, number, number, number];

export interface Word {
  position: number;
  uthmani: string;
  indopak: string;
  /** So'zning lotin transliteratsiyasi */
  latin: string;
  /** So'z ma'nosi — quran.com faqat inglizchasini beradi */
  meaning: string;
}

export interface Ayah {
  key: string;
  surah: number;
  ayah: number;
  uthmani: string;
  indopak: string;
  translation: string;
  transliteration: string;
  /** Tilovat fayli (to'liq URL) */
  audio: string;
  /** So'zma-so'z vaqt belgilari — karaoke rejimi uchun */
  segments: WordSegment[];
  words: Word[];
}

export interface Chapter {
  id: number;
  slug: string;
  arabic: string;
  translated: string;
  verses: number;
}

/** quran.com tarjimalarida <sup foot_note="…">1</sup> kabi teglar uchraydi */
function stripHtml(input: string): string {
  return input
    .replace(/<sup[^>]*>.*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** API ba'zan nisbiy, ba'zan protokolsiz manzil qaytaradi */
function absoluteAudio(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `https://verses.quran.com/${url}`;
}

interface RawWord {
  position: number;
  char_type_name?: string;
  text_uthmani?: string;
  text_indopak?: string;
  transliteration?: { text: string | null };
  translation?: { text: string | null };
}

interface RawVerse {
  verse_key: string;
  text_uthmani?: string;
  text_indopak?: string;
  translations?: { resource_id: number; text: string }[];
  audio?: { url: string; segments?: WordSegment[] };
  words?: RawWord[];
}

async function fetchVerse(
  key: string,
  translationId: number,
  recitationId: number
): Promise<Ayah> {
  const ids = [translationId, TRANSLITERATION_ID].join(",");
  const url =
    `${API}/verses/by_key/${key}` +
    `?fields=text_uthmani,text_indopak` +
    `&translations=${ids}` +
    `&audio=${recitationId}` +
    `&words=true&word_fields=text_uthmani,text_indopak&word_translation_language=en`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 7 } });
  if (!res.ok) throw new Error(`quran.com ${res.status} for ${key}`);

  const json = (await res.json()) as { verse: RawVerse };
  const v = json.verse;
  const [surah, ayah] = key.split(":").map(Number);

  const byId = (id: number) =>
    stripHtml(v.translations?.find((t) => t.resource_id === id)?.text ?? "");

  // Oyat raqami belgisi so'z emas — uni tashlab yuboramiz
  const words = (v.words ?? [])
    .filter((w) => w.char_type_name !== "end")
    .map((w) => ({
      position: w.position,
      uthmani: w.text_uthmani ?? "",
      indopak: w.text_indopak ?? w.text_uthmani ?? "",
      latin: w.transliteration?.text ?? "",
      meaning: w.translation?.text ?? "",
    }));

  return {
    key,
    surah,
    ayah,
    uthmani: v.text_uthmani ?? "",
    indopak: v.text_indopak ?? v.text_uthmani ?? "",
    translation: byId(translationId),
    transliteration: byId(TRANSLITERATION_ID),
    audio: absoluteAudio(v.audio?.url ?? ""),
    segments: v.audio?.segments ?? [],
    words,
  };
}

/** Parchadagi oyatlarni oladi (bir so'rovda ko'pi bilan 20 ta). */
export async function fetchPassage(
  surah: number,
  from: number,
  to: number,
  translationId: number,
  recitationId: number
): Promise<Ayah[]> {
  const keys: string[] = [];
  for (let a = from; a <= to; a++) keys.push(`${surah}:${a}`);
  return Promise.all(keys.map((k) => fetchVerse(k, translationId, recitationId)));
}

interface RawChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  translated_name?: { name: string };
}

/** 114 sura ro'yxati */
export async function fetchChapters(language: string): Promise<Chapter[]> {
  const res = await fetch(`${API}/chapters?language=${language}`, {
    next: { revalidate: 60 * 60 * 24 * 30 },
  });
  if (!res.ok) throw new Error(`quran.com chapters ${res.status}`);

  const json = (await res.json()) as { chapters: RawChapter[] };
  return json.chapters.map((c) => ({
    id: c.id,
    slug: c.name_simple,
    arabic: c.name_arabic,
    translated: c.translated_name?.name ?? c.name_simple,
    verses: c.verses_count,
  }));
}

export interface SearchHit {
  key: string;
  surah: number;
  ayah: number;
  /** Arabcha matn — ro'yxatda ko'rsatish uchun */
  text: string;
}

/** Qidiruv — quran.com indeksidan oyat kalitlarini qaytaradi */
export async function searchVerses(
  query: string,
  language: string,
  size = 12
): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const res = await fetch(
    `${API}/search?q=${encodeURIComponent(q)}&size=${size}&language=${language}`
  );
  if (!res.ok) throw new Error(`quran.com search ${res.status}`);

  const json = (await res.json()) as {
    search?: { results?: { verse_key: string; text?: string }[] };
  };

  return (json.search?.results ?? []).map((r) => {
    const [s, a] = r.verse_key.split(":").map(Number);
    return { key: r.verse_key, surah: s, ayah: a, text: r.text ?? "" };
  });
}
