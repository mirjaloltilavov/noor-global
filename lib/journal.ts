"use client";

import { useMemo } from "react";
import { useApp } from "@/components/providers/AppProvider";
import type { Locale } from "@/lib/i18n";
import type { MoodId } from "@/lib/sakinah";

/**
 * Kundalik yozuvlari va saqlangan oyatlar — bitta vaqt chizig'i.
 * Bu yerda faqat ma'lumot; ko'rinishi Daftar sahifasida va
 * pleyer ichidagi oynada har xil (biri yorug', biri qorong'i mavzu).
 */
export interface JournalRow {
  key: string;
  at: number;
  surah: number;
  ayah: number;
  note?: string;
  mood?: MoodId;
  /** Faqat kundalik yozuvlarida bo'ladi — tahrirlash va o'chirish uchun */
  journalId?: string;
  /** Shu oyat xatcho'plangan ham */
  bookmarked?: boolean;
}

export function useJournalRows(query = ""): JournalRow[] {
  const { journal, saved } = useApp();

  return useMemo(() => {
    // Oyat ham xatcho'plangan, ham yozilgan bo'lsa — bitta qator
    const written = new Set(journal.map((j) => `${j.surah}:${j.ayah}`));

    const rows: JournalRow[] = [
      ...journal.map((j) => ({
        key: `j-${j.id}`,
        at: j.at,
        surah: j.surah,
        ayah: j.ayah,
        note: j.note,
        mood: j.mood,
        journalId: j.id,
        bookmarked: saved.some(
          (x) => x.surah === j.surah && x.ayah === j.ayah
        ),
      })),
      ...saved
        .filter((s) => !written.has(`${s.surah}:${s.ayah}`))
        .map((s) => ({
          key: `s-${s.surah}:${s.ayah}`,
          at: s.at,
          surah: s.surah,
          ayah: s.ayah,
          bookmarked: true,
        })),
    ].sort((a, b) => b.at - a.at);

    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.note?.toLowerCase().includes(q) ||
        `${r.surah}:${r.ayah}`.includes(q)
    );
  }, [journal, saved, query]);
}

/** To'liq sana — Daftardagi eski yozuvlar uchun */
const UZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

export function fullDate(at: number, locale: Locale): string {
  const d = new Date(at);
  if (locale === "uz") {
    return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  }
  return d.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
