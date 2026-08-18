import { TRANSLITERATION_ID } from "./sakinah";

const API = "https://api.quran.com/api/v4";

export interface Ayah {
  key: string;
  surah: number;
  ayah: number;
  uthmani: string;
  indopak: string;
  translation: string;
  transliteration: string;
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

interface RawVerse {
  verse_key: string;
  text_uthmani?: string;
  text_indopak?: string;
  translations?: { resource_id: number; text: string }[];
}

async function fetchVerse(key: string, translationId: number): Promise<Ayah> {
  const ids = [translationId, TRANSLITERATION_ID].join(",");
  const url =
    `${API}/verses/by_key/${key}` +
    `?fields=text_uthmani,text_indopak&translations=${ids}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 7 } });
  if (!res.ok) throw new Error(`quran.com ${res.status} for ${key}`);

  const json = (await res.json()) as { verse: RawVerse };
  const v = json.verse;
  const [surah, ayah] = key.split(":").map(Number);

  const byId = (id: number) =>
    stripHtml(v.translations?.find((t) => t.resource_id === id)?.text ?? "");

  return {
    key,
    surah,
    ayah,
    uthmani: v.text_uthmani ?? "",
    indopak: v.text_indopak ?? v.text_uthmani ?? "",
    translation: byId(translationId),
    transliteration: byId(TRANSLITERATION_ID),
  };
}

/** Parchadagi oyatlarni oladi (bir so'rovda ko'pi bilan 20 ta). */
export async function fetchPassage(
  surah: number,
  from: number,
  to: number,
  translationId: number
): Promise<Ayah[]> {
  const keys: string[] = [];
  for (let a = from; a <= to; a++) keys.push(`${surah}:${a}`);
  return Promise.all(keys.map((k) => fetchVerse(k, translationId)));
}

interface RawChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  translated_name?: { name: string };
}

/** 114 sura ro'yxati — pleyerdagi sura tanlagichi uchun */
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
