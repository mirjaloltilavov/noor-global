import type { Locale } from "./i18n";

/**
 * Hadis manbasi — hadeethenc.com (bepul, API kalitsiz, uz/ru/en).
 * Diqqat: o'zbekcha matnlar manbada kirill alifbosida.
 * Manbada qidiruv endpointi yo'q — mavzu tanlanadi, so'ng ro'yxat
 * sarlavhalari bo'yicha filtrlanadi.
 */
const API = "https://hadeethenc.com/api/v1";

export interface HadithCategory {
  id: string;
  title: string;
  count: number;
}

export interface HadithItem {
  id: string;
  title: string;
}

export interface HadithFull {
  id: string;
  title: string;
  text: string;
  attribution: string;
  grade: string;
  explanation: string;
}

async function get(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`hadeethenc ${res.status}`);
  const text = await res.text();
  if (!text.trim()) return null;
  return JSON.parse(text);
}

export async function fetchHadithCategories(
  locale: Locale
): Promise<HadithCategory[]> {
  const data = (await get(`${API}/categories/list/?language=${locale}`)) as
    | { id: string; title: string; hadeeths_count?: string }[]
    | null;
  if (!Array.isArray(data)) return [];
  return data
    .map((c) => ({
      id: String(c.id),
      title: c.title ?? "",
      count: Number(c.hadeeths_count) || 0,
    }))
    .filter((c) => c.count > 0);
}

export async function fetchHadithList(
  locale: Locale,
  categoryId: string,
  page = 1,
  perPage = 40
): Promise<HadithItem[]> {
  const data = (await get(
    `${API}/hadeeths/list/?language=${locale}&category_id=${categoryId}&page=${page}&per_page=${perPage}`
  )) as { data?: { id: string; title: string }[] } | null;
  if (!data?.data) return [];
  return data.data.map((h) => ({ id: String(h.id), title: h.title ?? "" }));
}

export async function fetchHadith(
  locale: Locale,
  id: string
): Promise<HadithFull | null> {
  const d = (await get(
    `${API}/hadeeths/one/?language=${locale}&id=${id}`
  )) as Record<string, string> | null;
  if (!d) return null;
  return {
    id: String(d.id),
    title: d.title ?? "",
    text: d.hadeeth ?? "",
    attribution: d.attribution ?? "",
    grade: d.grade ?? "",
    explanation: d.explanation ?? "",
  };
}
