import type { HadithFull } from "./hadith";
import type { Ayah } from "./quran";
import { SURAHS } from "./sakinah";

/**
 * Iqtibos qoliplari — hujjatga tushadigan matn.
 * Manba har doim yoziladi: oyat raqami, hadis manbasi va darajasi.
 */

export function ayahCite(
  ayah: Ayah,
  surahName: string,
  opts: { arabic?: boolean; translation?: boolean } = {}
): string {
  const arabic = opts.arabic !== false;
  const translation = opts.translation !== false;
  const lines: string[] = [];

  if (arabic && ayah.uthmani) lines.push(`> ﴿ ${ayah.uthmani} ﴾`);
  if (translation && ayah.translation)
    lines.push(`> ${stripTags(ayah.translation)}`);
  lines.push(`> — ${surahName}, ${ayah.surah}:${ayah.ayah}`);

  return lines.join("\n");
}

export function ayahRefName(surah: number, fallback: string): string {
  return SURAHS[surah]?.slug ?? fallback;
}

export function hadithCite(h: HadithFull): string {
  const lines: string[] = [];
  if (h.title) lines.push(`> **${stripTags(h.title)}**`);
  if (h.text) lines.push(`> ${stripTags(h.text)}`);

  const source = [h.attribution, h.grade].map(stripTags).filter(Boolean);
  if (source.length) lines.push(`> — ${source.join(" · ")}`);

  return lines.join("\n");
}

/** Manbadagi matnlarda ba'zan HTML teglar keladi */
export function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
