import type { Locale } from "./i18n";
import type {
  BackgroundId,
  Duration,
  FormatId,
  IntentionId,
  MoodId,
  ScriptId,
} from "./sakinah";

export type RepeatMode = "off" | "ayah" | "segment";

export interface Prefs {
  locale: Locale;
  intention: IntentionId;
  duration: Duration;
  format: FormatId;
  reciter: string;
  /** quran.com tarjima resursi — til bilan birga tekshiriladi */
  translation: number | null;
  background: BackgroundId;
  script: ScriptId;
  /** 1–6 */
  fontSize: number;
  /** 1.6–2.6 */
  lineHeight: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  /** 30–100 */
  brightness: number;
  reduceMotion: boolean;
  /** 0.5–2 */
  rate: number;
  repeat: RepeatMode;
  /** Karaoke — o'qilayotgan so'z yorqinroq ko'rsatiladi */
  karaoke: boolean;
  /** O'qilayotgan so'z ostida ma'nosi ko'rsatiladi */
  wordByWord: boolean;
  /** So'z tarjimasi o'lchami: 1–4 */
  wordSize: number;
  /** Pleyerda oxirgi to'xtagan joy */
  lastSurah: number | null;
  lastAyah: number;
  /** Onboarding overlay bir marta ko'rsatilgach yopiladi */
  onboarded: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  locale: "uz",
  intention: "comfort",
  duration: 10,
  format: "both",
  reciter: "sudais",
  translation: null,
  background: "sakinah",
  script: "uthmani",
  fontSize: 4,
  lineHeight: 2.1,
  showTranslation: true,
  showTransliteration: false,
  brightness: 72,
  reduceMotion: false,
  rate: 1,
  repeat: "off",
  karaoke: true,
  wordByWord: false,
  wordSize: 2,
  lastSurah: null,
  lastAyah: 1,
  onboarded: false,
};

/** Figmadagi steper 1–6 → arabcha matn o'lchami */
export const ARABIC_SIZES = [26, 32, 38, 46, 54, 64];

export const RATES = [0.75, 1, 1.25, 1.5, 2];

/** So'z tarjimasi o'lchami (px) */
export const WORD_SIZES = [11, 13, 15, 18];

export interface VibeSession {
  mood: MoodId;
  startedAt: number;
  minutes: Duration;
  /** Navbat tugadi — «davom ettirasizmi?» so'ralgan */
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

export interface SavedAyah {
  surah: number;
  ayah: number;
  at: number;
}

const SAVED_KEY = "noor.saved.v1";
const PREFS_KEY = "noor.prefs.v2";
const VIBE_KEY = "noor.vibe.v2";
const HISTORY_KEY = "noor.history.v2";

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* kvota to'lgan bo'lishi mumkin — jim o'tamiz */
  }
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadPrefs(): Prefs {
  const stored = readJson<Partial<Prefs>>(PREFS_KEY);
  return stored ? { ...DEFAULT_PREFS, ...stored } : DEFAULT_PREFS;
}

export function savePrefs(p: Prefs): void {
  write(PREFS_KEY, p);
}

export function loadVibe(): VibeSession | null {
  return readJson<VibeSession>(VIBE_KEY);
}

export function saveVibe(s: VibeSession | null): void {
  if (typeof window === "undefined") return;
  if (s === null) window.localStorage.removeItem(VIBE_KEY);
  else write(VIBE_KEY, s);
}

export function loadHistory(): PastSession[] {
  return readJson<PastSession[]>(HISTORY_KEY) ?? [];
}

export function saveHistory(list: PastSession[]): void {
  write(HISTORY_KEY, list.slice(0, 12));
}

export function loadSaved(): SavedAyah[] {
  return readJson<SavedAyah[]>(SAVED_KEY) ?? [];
}

export function saveSaved(list: SavedAyah[]): void {
  write(SAVED_KEY, list.slice(0, 200));
}

/** "Kecha", "3 kun oldin", "O'tgan hafta" */
export function relativeDay(at: number, locale: Locale): string {
  const days = Math.floor((Date.now() - at) / 86_400_000);
  const table: Record<Locale, (d: number) => string> = {
    uz: (d) =>
      d <= 0
        ? "Bugun"
        : d === 1
          ? "Kecha"
          : d < 7
            ? `${d} kun oldin`
            : "O'tgan hafta",
    ru: (d) =>
      d <= 0
        ? "Сегодня"
        : d === 1
          ? "Вчера"
          : d < 7
            ? `${d} дн. назад`
            : "На прошлой неделе",
    en: (d) =>
      d <= 0
        ? "Today"
        : d === 1
          ? "Yesterday"
          : d < 7
            ? `${d} days ago`
            : "Last week",
  };
  return table[locale](days);
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
