"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApp } from "@/components/providers/AppProvider";
import {
  extendPlan,
  flattenTracks,
  needsBismillah,
  planSegments,
  surahPlan,
  totalMinutes,
  type Segment,
  type Track,
} from "@/lib/queue";
import { SURAHS, getMood, getReciter, type MoodId } from "@/lib/sakinah";
import type { Ayah, Chapter } from "@/lib/quran";
import { prefetchPassage, useChapters, usePassage } from "@/lib/useQuran";

interface Cursor {
  pos: number;
  bismillah: boolean;
}

interface PlayerValue {
  active: boolean;
  segments: Segment[];
  tracks: Track[];
  cursor: Cursor;
  track: Track | null;
  segment: Segment | null;
  segIndex: number;
  playing: boolean;
  elapsed: number;
  clipLength: number;
  chapters: Chapter[];
  finished: boolean;

  ayah: Ayah | null;
  /** Joriy parchadagi barcha oyatlar */
  ayahs: Ayah[] | null;
  loading: boolean;
  error: boolean;
  /** Karaoke uchun — hozir o'qilayotgan so'z tartibi (0 dan), yo'q bo'lsa -1 */
  wordIndex: number;

  /** Pleyer fonda — sayt interfeysi ko'rinadi, tilovat davom etadi */
  minimized: boolean;
  setMinimized: (v: boolean) => void;
  /** Uyqu taymeri (daqiqa, 0 — o'chiq) */
  sleepMinutes: number;
  setSleepMinutes: (m: number) => void;
  /** Qolgan vaqt (soniya) */
  sleepLeft: number;
  /** 0–1 */
  volume: number;
  setVolume: (v: number) => void;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekBy: (delta: number) => void;
  seekTo: (fraction: number) => void;
  jumpToSegment: (index: number) => void;
  /** Navbatdagi aniq oyatga o'tish (track indeksi) */
  jumpToAyah: (trackIndex: number) => void;

  startVibe: (mood: MoodId) => void;
  startSurah: (surah: number, verses: number) => void;
  continueSession: () => void;
  endSession: () => void;
  closePlayer: () => void;
}

const Ctx = createContext<PlayerValue | null>(null);

/** Bismillah — o'sha qorining Fotiha 1-oyati */
function bismillahUrl(anyAyahAudio: string): string {
  if (!anyAyahAudio) return "";
  return anyAyahAudio.replace(/\d{6}\.mp3$/, "001001.mp3");
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { locale, prefs, translationId, vibe, setVibe, pushHistory } = useApp();
  const recitationId = getReciter(prefs.reciter).recitationId;

  const [segments, setSegments] = useState<Segment[]>([]);
  const [cursor, setCursor] = useState<Cursor>({ pos: 0, bismillah: false });
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clipLength, setClipLength] = useState(0);
  const [finished, setFinished] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [sleepMinutes, setSleepMinutesState] = useState(0);
  const [sleepDeadline, setSleepDeadline] = useState<number | null>(null);
  const [sleepLeft, setSleepLeft] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chapters = useChapters(locale);

  const tracks = useMemo(() => flattenTracks(segments), [segments]);
  const pos = cursor.pos;
  const track = tracks[pos] ?? null;
  const segIndex = track?.segment ?? 0;
  const segment = segments[segIndex] ?? null;

  const inVibe = vibe !== null && !vibe.done;

  const { ayahs, loading, error } = usePassage(
    segment?.surah ?? null,
    segment?.from ?? null,
    segment?.to ?? null,
    translationId,
    recitationId
  );
  const ayah = ayahs?.find((a) => a.ayah === track?.ayah) ?? null;

  /* ——— Kursor ——————————————————————————————————————— */

  const moveTo = useCallback(
    (nextPos: number, segs: Segment[] = segments, trs: Track[] = tracks) => {
      setCursor({ pos: nextPos, bismillah: needsBismillah(segs, trs, nextPos) });
    },
    [segments, tracks]
  );

  /* ——— Audio ——————————————————————————————————————— */

  const src = cursor.bismillah
    ? bismillahUrl(ayah?.audio ?? "")
    : ayah?.audio ?? "";

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    el.src = src;
    el.playbackRate = prefs.rate;
    setElapsed(0);
    setClipLength(0);
    if (playing) void el.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = prefs.rate;
  }, [prefs.rate]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ——— Uyqu taymeri ——————————————————————————————— */

  const setSleepMinutes = useCallback((m: number) => {
    setSleepMinutesState(m);
    setSleepDeadline(m > 0 ? Date.now() + m * 60_000 : null);
    setSleepLeft(m * 60);
  }, []);

  useEffect(() => {
    if (sleepDeadline === null) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((sleepDeadline - Date.now()) / 1000));
      setSleepLeft(left);
      if (left === 0) {
        setPlaying(false);
        setSleepDeadline(null);
        setSleepMinutesState(0);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [sleepDeadline]);

  // Keyingi parcha oldindan yuklanadi
  useEffect(() => {
    const nextSeg = segments[segIndex + 1];
    if (nextSeg)
      prefetchPassage(
        nextSeg.surah,
        nextSeg.from,
        nextSeg.to,
        translationId,
        recitationId
      );
  }, [segments, segIndex, translationId, recitationId]);

  /* ——— Karaoke ————————————————————————————————————— */

  const wordIndex = useMemo(() => {
    if (cursor.bismillah || !prefs.karaoke || !ayah?.segments.length) return -1;
    const ms = elapsed * 1000;
    for (let i = 0; i < ayah.segments.length; i++) {
      const s = ayah.segments[i];
      if (ms >= s[2] && ms < s[3]) return i;
    }
    // Oxirgi so'zdan keyin ham u yorqin qolsin
    const last = ayah.segments[ayah.segments.length - 1];
    return ms >= last[3] ? ayah.segments.length - 1 : -1;
  }, [elapsed, ayah, prefs.karaoke, cursor.bismillah]);

  /* ——— Rejimlar ——————————————————————————————————— */

  const startVibe = useCallback(
    (mood: MoodId) => {
      const segs = planSegments(getMood(mood), prefs.duration);
      setSegments(segs);
      setCursor({
        pos: 0,
        bismillah: needsBismillah(segs, flattenTracks(segs), 0),
      });
      setVibe({
        mood,
        startedAt: Date.now(),
        minutes: prefs.duration,
        done: false,
      });
      setFinished(false);
      setMinimized(false);
      setPlaying(true);
    },
    [prefs.duration, setVibe]
  );

  const startSurah = useCallback((surah: number, verses: number) => {
    const segs = surahPlan(surah, verses);
    setSegments(segs);
    setCursor({
      pos: 0,
      bismillah: needsBismillah(segs, flattenTracks(segs), 0),
    });
  }, []);

  /* ——— Navbat bo'ylab ——————————————————————————————— */

  const finishSession = useCallback(() => {
    if (!vibe) return;
    setPlaying(false);
    setFinished(true);
    setMinimized(false);
    setVibe({ ...vibe, done: true });

    pushHistory({
      id: `${vibe.mood}-${vibe.startedAt}`,
      at: vibe.startedAt,
      mood: vibe.mood,
      refs: segments
        .filter((s) => s.kind === "vibe")
        .map((s) => {
          const name = SURAHS[s.surah]?.slug ?? `Surah ${s.surah}`;
          return s.from === s.to
            ? `${name} ${s.surah}:${s.from}`
            : `${name} ${s.surah}:${s.from}–${s.to}`;
        }),
      minutes: totalMinutes(segments),
    });
  }, [vibe, segments, setVibe, pushHistory]);

  const next = useCallback(() => {
    const nextPos = pos + 1;

    if (nextPos < tracks.length) {
      if (prefs.repeat === "segment" && tracks[nextPos].segment !== segIndex) {
        moveTo(tracks.findIndex((x) => x.segment === segIndex));
      } else {
        moveTo(nextPos);
      }
      return;
    }

    if (inVibe && vibe) {
      if (vibe.minutes === 0) {
        const grown = extendPlan(getMood(vibe.mood), segments);
        setSegments(grown);
        moveTo(nextPos, grown, flattenTracks(grown));
        return;
      }
      finishSession();
      return;
    }

    const nextSurah = (segment?.surah ?? 0) + 1;
    const ch = chapters.find((c) => c.id === nextSurah);
    if (ch) startSurah(ch.id, ch.verses);
    else setPlaying(false);
  }, [
    pos,
    tracks,
    prefs.repeat,
    segIndex,
    inVibe,
    vibe,
    segments,
    finishSession,
    segment,
    chapters,
    startSurah,
    moveTo,
  ]);

  const prev = useCallback(() => {
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    moveTo(Math.max(0, pos - 1));
  }, [pos, moveTo]);

  function handleEnded() {
    if (cursor.bismillah) {
      setCursor((c) => ({ ...c, bismillah: false }));
      return;
    }
    if (prefs.repeat === "ayah") {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        void el.play().catch(() => setPlaying(false));
      }
      return;
    }
    next();
  }

  const seekBy = useCallback((delta: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(
      Math.max(0, el.currentTime + delta),
      el.duration - 0.1
    );
  }, []);

  const seekTo = useCallback((fraction: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = el.duration * Math.min(1, Math.max(0, fraction));
  }, []);

  const jumpToSegment = useCallback(
    (index: number) => {
      const start = tracks.findIndex((x) => x.segment === index);
      if (start >= 0) moveTo(start);
    },
    [tracks, moveTo]
  );

  const jumpToAyah = useCallback(
    (trackIndex: number) => {
      if (trackIndex >= 0 && trackIndex < tracks.length) moveTo(trackIndex);
    },
    [tracks, moveTo]
  );

  const continueSession = useCallback(() => {
    if (!vibe) return;
    const grown = extendPlan(getMood(vibe.mood), segments, 20);
    setSegments(grown);
    setVibe({ ...vibe, done: false });
    setFinished(false);
    moveTo(pos + 1, grown, flattenTracks(grown));
    setPlaying(true);
  }, [vibe, segments, setVibe, pos, moveTo]);

  const endSession = useCallback(() => {
    setFinished(false);
    const surah = segment?.surah ?? 1;
    const verses =
      SURAHS[surah]?.verses ?? chapters.find((c) => c.id === surah)?.verses ?? 7;
    startSurah(surah, verses);
  }, [segment, chapters, startSurah]);

  const closePlayer = useCallback(() => {
    setPlaying(false);
    setSegments([]);
    setCursor({ pos: 0, bismillah: false });
    setFinished(false);
    setMinimized(false);
  }, []);

  const value = useMemo<PlayerValue>(
    () => ({
      active: segments.length > 0,
      segments,
      tracks,
      cursor,
      track,
      segment,
      segIndex,
      playing,
      elapsed,
      clipLength,
      chapters,
      finished,
      ayah,
      ayahs: ayahs ?? null,
      loading,
      error,
      wordIndex,
      minimized,
      setMinimized,
      sleepMinutes,
      setSleepMinutes,
      sleepLeft,
      volume,
      setVolume: setVolumeState,
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      toggle: () => setPlaying((p) => !p),
      next,
      prev,
      seekBy,
      seekTo,
      jumpToSegment,
      jumpToAyah,
      startVibe,
      startSurah,
      continueSession,
      endSession,
      closePlayer,
    }),
    [
      segments,
      tracks,
      cursor,
      track,
      segment,
      segIndex,
      playing,
      elapsed,
      clipLength,
      chapters,
      finished,
      ayah,
      ayahs,
      loading,
      error,
      wordIndex,
      minimized,
      sleepMinutes,
      setSleepMinutes,
      sleepLeft,
      volume,
      next,
      prev,
      seekBy,
      seekTo,
      jumpToSegment,
      jumpToAyah,
      startVibe,
      startSurah,
      continueSession,
      endSession,
      closePlayer,
    ]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleEnded}
        onLoadedMetadata={(e) => setClipLength(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onError={() => setPlaying(false)}
      />
    </Ctx.Provider>
  );
}

export function usePlayer(): PlayerValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer PlayerProvider ichida chaqirilishi kerak");
  return v;
}
