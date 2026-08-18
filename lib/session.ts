import type { Locale } from "./i18n";
import type {
  BackgroundId,
  Duration,
  FormatId,
  IntentionId,
  MoodId,
  ScriptId,
} from "./sakinah";

export interface Prefs {
  locale: Locale;
  intention: IntentionId;
  duration: Duration;
  format: FormatId;
  reciter: string;
  background: BackgroundId;
  script: ScriptId;
  /** 1–6 — Figmadagi «Font size» steperi */
  fontSize: number;
  /** 1.6–2.6 */
  lineHeight: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  /** 30–100 */
  brightness: number;
  reduceMotion: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  locale: "uz",
  intention: "comfort",
  duration: 15,
  format: "both",
  reciter: "sudais",
  background: "sakinah",
  script: "uthmani",
  fontSize: 4,
  lineHeight: 2.1,
  showTranslation: true,
  showTransliteration: false,
  brightness: 72,
  reduceMotion: false,
};

/** Figmadagi steper 1–6 → arabcha matn o'lchami */
export const ARABIC_SIZES = [26, 32, 38, 46, 54, 64];

export interface CurrentSession {
  mood: MoodId;
  startedAt: number;
  /** Reminder ro'yxatidagi joriy parcha indeksi */
  index: number;
  done: boolean;
}

export interface PastSession {
  id: string;
  at: number;
  mood: MoodId;
  refs: string[];
  minutes: number;
  liked?: boolean;
}

const PREFS_KEY = "noor.prefs.v1";
const CURRENT_KEY = "noor.session.current.v1";
const HISTORY_KEY = "noor.session.history.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as object) } as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* kvota to'lgan bo'lishi mumkin — jim o'tamiz */
  }
}

export function loadPrefs(): Prefs {
  return read<Prefs>(PREFS_KEY, DEFAULT_PREFS);
}

export function savePrefs(p: Prefs): void {
  write(PREFS_KEY, p);
}

export function loadCurrent(): CurrentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as CurrentSession) : null;
  } catch {
    return null;
  }
}

export function saveCurrent(s: CurrentSession | null): void {
  if (typeof window === "undefined") return;
  if (s === null) window.localStorage.removeItem(CURRENT_KEY);
  else write(CURRENT_KEY, s);
}

export function loadHistory(): PastSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as PastSession[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: PastSession[]): void {
  write(HISTORY_KEY, list.slice(0, 12));
}

/** "Kecha", "3 kun oldin", "O'tgan hafta" — Figmadagi kabi */
export function relativeDay(at: number, locale: Locale): string {
  const days = Math.floor((Date.now() - at) / 86_400_000);
  const table: Record<Locale, (d: number) => string> = {
    uz: (d) =>
      d <= 0 ? "Bugun" : d === 1 ? "Kecha" : d < 7 ? `${d} kun oldin` : "O'tgan hafta",
    ru: (d) =>
      d <= 0 ? "Сегодня" : d === 1 ? "Вчера" : d < 7 ? `${d} дн. назад` : "На прошлой неделе",
    en: (d) =>
      d <= 0 ? "Today" : d === 1 ? "Yesterday" : d < 7 ? `${d} days ago` : "Last week",
  };
  return table[locale](days);
}
