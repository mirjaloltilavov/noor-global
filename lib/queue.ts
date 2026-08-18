import { SURAHS, type L10n, type Mood } from "./sakinah";

/** Bir oyatning o'rtacha tilovat vaqti (daqiqa) — navbat rejasini tuzish uchun */
const MINUTES_PER_AYAH = 0.4;

/** Bitta so'rovda API 20 oyatgacha beradi — bo'laklarni shundan kichik olamiz */
const CHUNK = 15;

export interface Segment {
  surah: number;
  from: number;
  to: number;
  minutes: number;
  /** "vibe" — kayfiyat bo'yicha kuratsiya qilingan parcha, "surah" — davomi */
  kind: "vibe" | "surah";
  note?: L10n;
}

export function estimateMinutes(ayahCount: number): number {
  return Math.max(1, Math.round(ayahCount * MINUTES_PER_AYAH));
}

export function segmentAyahCount(s: Segment): number {
  return s.to - s.from + 1;
}

export function totalMinutes(segments: Segment[]): number {
  return segments.reduce((sum, s) => sum + s.minutes, 0);
}

/** Surani CHUNK o'lchamli bo'laklarga bo'ladi */
function chunkSurah(surah: number): Segment[] {
  const verses = SURAHS[surah]?.verses;
  if (!verses) return [];

  const out: Segment[] = [];
  for (let from = 1; from <= verses; from += CHUNK) {
    const to = Math.min(from + CHUNK - 1, verses);
    out.push({
      surah,
      from,
      to,
      minutes: estimateMinutes(to - from + 1),
      kind: "surah",
    });
  }
  return out;
}

/**
 * Kayfiyat va tanlangan davomiylik bo'yicha navbat tuzadi.
 *
 * Tartib: avval kuratsiya qilingan parchalar, so'ng o'sha suralarning
 * to'liq matni (bo'laklarga bo'linib). Vaqt yetmasa aylanma davom etadi.
 *
 * `minutes === 0` (cheksiz) bo'lsa boshlang'ich zaxira tuziladi va
 * navbat tugashiga yaqinlashganda `extendPlan` bilan uzaytiriladi.
 */
export function planSegments(mood: Mood, minutes: number): Segment[] {
  const target = minutes === 0 ? 45 : minutes;

  const curated: Segment[] = mood.passages.map((p) => ({
    surah: p.surah,
    from: p.from,
    to: p.to,
    minutes: p.minutes,
    kind: "vibe",
    note: p.note,
  }));

  const segments = [...curated];
  if (totalMinutes(segments) >= target) return trim(segments, target);

  // Kuratsiya qilingan parchalar qaysi surada bo'lsa — o'sha suralar to'liq
  const pool: Segment[] = [];
  const seen = new Set<number>();
  for (const p of mood.passages) {
    if (seen.has(p.surah)) continue;
    seen.add(p.surah);
    pool.push(...chunkSurah(p.surah));
  }

  if (pool.length === 0) return segments;

  let i = 0;
  // Aylanma: zaxira tugasa boshidan davom etadi (uzun sessiyalar uchun)
  while (totalMinutes(segments) < target && i < pool.length * 8) {
    segments.push(pool[i % pool.length]);
    i++;
  }

  return trim(segments, target);
}

/** Maqsad vaqtdan keyingi ortiqcha bo'laklarni olib tashlaydi */
function trim(segments: Segment[], target: number): Segment[] {
  const out: Segment[] = [];
  let sum = 0;
  for (const s of segments) {
    out.push(s);
    sum += s.minutes;
    if (sum >= target) break;
  }
  return out;
}

/** Cheksiz rejim uchun navbatni yana `minutes` daqiqaga uzaytiradi */
export function extendPlan(
  mood: Mood,
  existing: Segment[],
  minutes = 30
): Segment[] {
  const grown = planSegments(mood, totalMinutes(existing) + minutes);
  return grown.length > existing.length ? grown : existing;
}

/** Butun bir surani navbat sifatida beradi (oddiy pleyer rejimi) */
export function surahPlan(surah: number, verses: number): Segment[] {
  const out: Segment[] = [];
  for (let from = 1; from <= verses; from += CHUNK) {
    const to = Math.min(from + CHUNK - 1, verses);
    out.push({
      surah,
      from,
      to,
      minutes: estimateMinutes(to - from + 1),
      kind: "surah",
    });
  }
  return out;
}

/** Navbatdagi barcha oyatlar ro'yxati — pleyer shular bo'ylab yuradi */
export function flattenTracks(
  segments: Segment[]
): { surah: number; ayah: number; segment: number }[] {
  const out: { surah: number; ayah: number; segment: number }[] = [];
  segments.forEach((s, si) => {
    for (let a = s.from; a <= s.to; a++) {
      out.push({ surah: s.surah, ayah: a, segment: si });
    }
  });
  return out;
}
