"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./i18n";
import type { Ayah, Chapter } from "./quran";

const passageCache = new Map<string, Ayah[]>();
const chapterCache = new Map<string, Chapter[]>();

interface PassageState {
  ayahs: Ayah[] | null;
  loading: boolean;
  error: boolean;
}

/**
 * Parcha matnini /api/passage orqali oladi.
 * Bir xil so'rov qayta yuborilmasligi uchun oddiy xotira keshi.
 */
export function usePassage(
  surah: number | null,
  from: number | null,
  to: number | null,
  translationId: number,
  recitationId: number
): PassageState {
  const key = `${surah}:${from}-${to}:${translationId}:${recitationId}`;
  const [state, setState] = useState<PassageState>(() => ({
    ayahs: passageCache.get(key) ?? null,
    loading: !passageCache.has(key),
    error: false,
  }));

  useEffect(() => {
    if (surah === null || from === null || to === null) return;

    const cached = passageCache.get(key);
    if (cached) {
      setState({ ayahs: cached, loading: false, error: false });
      return;
    }

    let alive = true;
    setState({ ayahs: null, loading: true, error: false });

    fetch(
      `/api/passage?surah=${surah}&from=${from}&to=${to}&translation=${translationId}&recitation=${recitationId}`
    )
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(String(r.status)))
      )
      .then((data: { ayahs: Ayah[] }) => {
        if (!alive) return;
        passageCache.set(key, data.ayahs);
        setState({ ayahs: data.ayahs, loading: false, error: false });
      })
      .catch(() => {
        if (alive) setState({ ayahs: null, loading: false, error: true });
      });

    return () => {
      alive = false;
    };
  }, [key, surah, from, to, translationId, recitationId]);

  return state;
}

/** Keyingi parchani oldindan yuklab qo'yadi — tilovat uzilmasligi uchun */
export function prefetchPassage(
  surah: number,
  from: number,
  to: number,
  translationId: number,
  recitationId: number
): void {
  const key = `${surah}:${from}-${to}:${translationId}:${recitationId}`;
  if (passageCache.has(key)) return;

  void fetch(
    `/api/passage?surah=${surah}&from=${from}&to=${to}&translation=${translationId}&recitation=${recitationId}`
  )
    .then((r) => (r.ok ? r.json() : null))
    .then((data: { ayahs: Ayah[] } | null) => {
      if (data) passageCache.set(key, data.ayahs);
    })
    .catch(() => {
      /* oldindan yuklash — xato bo'lsa jim o'tamiz */
    });
}

/** 114 sura ro'yxati */
export function useChapters(locale: Locale): Chapter[] {
  const [chapters, setChapters] = useState<Chapter[]>(
    () => chapterCache.get(locale) ?? []
  );

  useEffect(() => {
    const cached = chapterCache.get(locale);
    if (cached) {
      setChapters(cached);
      return;
    }

    let alive = true;
    fetch(`/api/chapters?locale=${locale}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("chapters"))))
      .then((data: { chapters: Chapter[] }) => {
        if (!alive) return;
        chapterCache.set(locale, data.chapters);
        setChapters(data.chapters);
      })
      .catch(() => {
        /* ro'yxat kelmasa panel bo'sh qoladi */
      });

    return () => {
      alive = false;
    };
  }, [locale]);

  return chapters;
}
