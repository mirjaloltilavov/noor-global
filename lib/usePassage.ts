"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./i18n";
import type { Ayah } from "./quran";

interface State {
  ayahs: Ayah[] | null;
  loading: boolean;
  error: boolean;
}

const cache = new Map<string, Ayah[]>();

/**
 * Parcha matnini /api/passage orqali oladi.
 * Bir xil so'rov qayta yuborilmasligi uchun oddiy xotira keshi.
 */
export function usePassage(
  surah: number | null,
  from: number | null,
  to: number | null,
  locale: Locale
): State {
  const key = `${surah}:${from}-${to}:${locale}`;
  const [state, setState] = useState<State>(() => ({
    ayahs: cache.get(key) ?? null,
    loading: !cache.has(key),
    error: false,
  }));

  useEffect(() => {
    if (surah === null || from === null || to === null) return;

    const cached = cache.get(key);
    if (cached) {
      setState({ ayahs: cached, loading: false, error: false });
      return;
    }

    let alive = true;
    setState({ ayahs: null, loading: true, error: false });

    fetch(`/api/passage?surah=${surah}&from=${from}&to=${to}&locale=${locale}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { ayahs: Ayah[] }) => {
        if (!alive) return;
        cache.set(key, data.ayahs);
        setState({ ayahs: data.ayahs, loading: false, error: false });
      })
      .catch(() => {
        if (alive) setState({ ayahs: null, loading: false, error: true });
      });

    return () => {
      alive = false;
    };
  }, [key, surah, from, to, locale]);

  return state;
}
