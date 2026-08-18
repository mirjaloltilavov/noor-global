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
import type { L10n } from "@/lib/sakinah";
import {
  DEFAULT_PREFS,
  loadCurrent,
  loadHistory,
  loadPrefs,
  saveCurrent,
  saveHistory,
  savePrefs,
  type CurrentSession,
  type PastSession,
  type Prefs,
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
  current: CurrentSession | null;
  setCurrent: (s: CurrentSession | null) => void;
  history: PastSession[];
  pushHistory: (s: PastSession) => void;
  updateHistory: (id: string, patch: Partial<PastSession>) => void;
}

const Ctx = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [current, setCurrentState] = useState<CurrentSession | null>(null);
  const [history, setHistory] = useState<PastSession[]>([]);

  // localStorage faqat brauzerda — birinchi renderdan keyin o'qiymiz,
  // shunda server va mijoz HTML'i mos keladi.
  useEffect(() => {
    setPrefsState(loadPrefs());
    setCurrentState(loadCurrent());
    setHistory(loadHistory());
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
    (l: Locale) => setPrefs({ locale: l }),
    [setPrefs]
  );

  const setCurrent = useCallback((s: CurrentSession | null) => {
    setCurrentState(s);
    saveCurrent(s);
  }, []);

  const pushHistory = useCallback((s: PastSession) => {
    setHistory((prev) => {
      const next = [s, ...prev.filter((x) => x.id !== s.id)].slice(0, 12);
      saveHistory(next);
      return next;
    });
  }, []);

  const updateHistory = useCallback((id: string, patch: Partial<PastSession>) => {
    setHistory((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, ...patch } : x));
      saveHistory(next);
      return next;
    });
  }, []);

  const value = useMemo<AppValue>(
    () => ({
      ready,
      prefs,
      setPrefs,
      locale: prefs.locale,
      setLocale,
      t: (key, vars) => translate(prefs.locale, key, vars),
      ln: (v) => v[prefs.locale],
      current,
      setCurrent,
      history,
      pushHistory,
      updateHistory,
    }),
    [
      ready,
      prefs,
      setPrefs,
      setLocale,
      current,
      setCurrent,
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
