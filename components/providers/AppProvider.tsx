"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translate, type Locale } from "@/lib/i18n";
import { resolveTranslation, type L10n } from "@/lib/sakinah";
import {
  DEFAULT_PREFS,
  loadHistory,
  loadPrefs,
  loadSaved,
  saveSaved,
  loadVibe,
  saveHistory,
  savePrefs,
  saveVibe,
  type PastSession,
  type Prefs,
  type SavedAyah,
  type VibeSession,
} from "@/lib/session";

interface AppValue {
  ready: boolean;
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** L10n obyektidan joriy tildagi qatorni oladi */
  ln: (value: L10n) => string;
  /** Joriy tilga mos tarjima resursi id'si */
  translationId: number;
  vibe: VibeSession | null;
  setVibe: (s: VibeSession | null) => void;
  /** Saqlangan oyatlar — pleyer va Sakinah uchun umumiy */
  saved: SavedAyah[];
  toggleSaved: (surah: number, ayah: number) => void;
  isSaved: (surah: number, ayah: number) => boolean;
  history: PastSession[];
  pushHistory: (s: PastSession) => void;
  updateHistory: (id: string, patch: Partial<PastSession>) => void;
}

const Ctx = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [vibe, setVibeState] = useState<VibeSession | null>(null);
  const [history, setHistory] = useState<PastSession[]>([]);
  const [saved, setSaved] = useState<SavedAyah[]>([]);

  // localStorage faqat brauzerda — birinchi renderdan keyin o'qiymiz,
  // shunda server va mijoz HTML'i mos keladi.
  useEffect(() => {
    setPrefsState(loadPrefs());
    setVibeState(loadVibe());
    setHistory(loadHistory());
    setSaved(loadSaved());
    setReady(true);
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  const setLocale = useCallback(
    (l: Locale) => setPrefs({ locale: l, translation: null }),
    [setPrefs]
  );

  const setVibe = useCallback((s: VibeSession | null) => {
    setVibeState(s);
    saveVibe(s);
  }, []);

  const toggleSaved = useCallback((surah: number, ayah: number) => {
    setSaved((prev) => {
      const exists = prev.some((x) => x.surah === surah && x.ayah === ayah);
      const next = exists
        ? prev.filter((x) => !(x.surah === surah && x.ayah === ayah))
        : [{ surah, ayah, at: Date.now() }, ...prev];
      saveSaved(next);
      return next;
    });
  }, []);

  const pushHistory = useCallback((s: PastSession) => {
    setHistory((prev) => {
      const next = [s, ...prev.filter((x) => x.id !== s.id)].slice(0, 12);
      saveHistory(next);
      return next;
    });
  }, []);

  const updateHistory = useCallback(
    (id: string, patch: Partial<PastSession>) => {
      setHistory((prev) => {
        const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x));
        saveHistory(next);
        return next;
      });
    },
    []
  );

  const value = useMemo<AppValue>(
    () => ({
      ready,
      prefs,
      setPrefs,
      locale: prefs.locale,
      setLocale,
      t: (key, vars) => translate(prefs.locale, key, vars),
      ln: (v) => v[prefs.locale],
      translationId: resolveTranslation(prefs.locale, prefs.translation),
      vibe,
      setVibe,
      saved,
      toggleSaved,
      isSaved: (surah, ayah) =>
        saved.some((x) => x.surah === surah && x.ayah === ayah),
      history,
      pushHistory,
      updateHistory,
    }),
    [
      ready,
      prefs,
      setPrefs,
      setLocale,
      vibe,
      setVibe,
      saved,
      toggleSaved,
      history,
      pushHistory,
      updateHistory,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp AppProvider ichida chaqirilishi kerak");
  return v;
}
