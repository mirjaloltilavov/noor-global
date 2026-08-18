import type { Locale } from "./i18n";
import { TRANSLATION_IDS, TRANSLITERATION_ID } from "./sakinah";

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

async function fetchVerse(key: string, locale: Locale): Promise<Ayah> {
  const ids = [TRANSLATION_IDS[locale], TRANSLITERATION_ID].join(",");
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
    translation: byId(TRANSLATION_IDS[locale]),
    transliteration: byId(TRANSLITERATION_ID),
  };
}

/**
 * Parchadagi barcha oyatlarni oladi. Sakinah parchalari qisqa
 * (eng uzuni 8 oyat), shuning uchun parallel so'rov yetarli.
 */
export async function fetchPassage(
  surah: number,
  from: number,
  to: number,
  locale: Locale
): Promise<Ayah[]> {
  const keys: string[] = [];
  for (let a = from; a <= to; a++) keys.push(`${surah}:${a}`);
  return Promise.all(keys.map((k) => fetchVerse(k, locale)));
}
