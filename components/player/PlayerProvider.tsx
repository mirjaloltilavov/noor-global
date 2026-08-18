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

/** Ikki mustaqil rejim: Qur'on pleyeri va kayfiyat sessiyasi */
export type Mode = "player" | "sakinah";

interface Cursor {
  pos: number;
  bismillah: boolean;
}

interface Queue {
  segments: Segment[];
  cursor: Cursor;
}

const EMPTY: Queue = { segments: [], cursor: { pos: 0, bismillah: false } };

interface PlayerValue {
  mode: Mode;
  setMode: (m: Mode) => void;
  /** Joriy rejimda navbat bormi */
  active: boolean;
  /** Har rejim uchun alohida */
  hasQueue: Record<Mode, boolean>;

  segments: Segment[];
  tracks: Track[];
  cursor: Cursor;
  track: Track | null;
  segment: Segment | null;
  segIndex: number;
  playing: boolean;
  /** Silliq animatsiya uchun har kadrda yangilanadi */
  elapsed: number;
  clipLength: number;
  chapters: Chapter[];
  finished: boolean;

  ayah: Ayah | null;
  ayahs: Ayah[] | null;
  loading: boolean;
  error: boolean;
  wordIndex: number;

  minimized: boolean;
  setMinimized: (v: boolean) => void;
  sleepMinutes: number;
  setSleepMinutes: (m: number) => void;
  sleepLeft: number;
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
  const { locale, prefs, setPrefs, translationId, vibe, setVibe, pushHistory } =
    useApp();
  const recitationId = getReciter(prefs.reciter).recitationId;

  const [mode, setModeState] = useState<Mode>("player");
  const [queues, setQueues] = useState<Record<Mode, Queue>>({
    player: EMPTY,
    sakinah: EMPTY,
  });

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

  const queue = queues[mode];
  const segments = queue.segments;
  const cursor = queue.cursor;

  const tracks = useMemo(() => flattenTracks(segments), [segments]);
  const pos = cursor.pos;
  const track = tracks[pos] ?? null;
  const segIndex = track?.segment ?? 0;
  const segment = segments[segIndex] ?? null;

  const inVibe = mode === "sakinah" && vibe !== null && !vibe.done;

  const { ayahs, loading, error } = usePassage(
    segment?.surah ?? null,
    segment?.from ?? null,
    segment?.to ?? null,
    translationId,
    recitationId
  );
  const ayah = ayahs?.find((a) => a.ayah === track?.ayah) ?? null;

  /* ——— Navbatlar ——————————————————————————————————— */

  const writeQueue = useCallback(
    (m: Mode, segs: Segment[], nextPos: number) => {
      setQueues((prev) => ({
        ...prev,
        [m]: {
          segments: segs,
          cursor: {
            pos: nextPos,
            bismillah: needsBismillah(segs, flattenTracks(segs), nextPos),
          },
        },
      }));
    },
    []
  );

  const moveTo = useCallback(
    (nextPos: number) => {
      setQueues((prev) => {
        const q = prev[mode];
        return {
          ...prev,
          [mode]: {
            ...q,
            cursor: {
              pos: nextPos,
              bismillah: needsBismillah(
                q.segments,
                flattenTracks(q.segments),
                nextPos
              ),
            },
          },
        };
      });
    },
    [mode]
  );

  /** Tab almashganda o'sha rejimning navbati o'z holidan davom etadi */
  const setMode = useCallback(
    (m: Mode) => {
      setModeState(m);
      setElapsed(0);
      setClipLength(0);
      if (queues[m].segments.length === 0) setPlaying(false);
    },
    [queues]
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

  /* ——— Silliq progress ————————————————————————————————
     timeupdate sekundiga ~4 marta keladi va chiziq sakrab yuradi;
     ijro paytida vaqtni har kadrda o'qiymiz. */

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const el = audioRef.current;
      if (el) setElapsed(el.currentTime);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [playing]);

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

  // Pleyer rejimida oxirgi to'xtagan joy eslab qolinadi
  useEffect(() => {
    if (mode !== "player" || !track) return;
    if (prefs.lastSurah === track.surah && prefs.lastAyah === track.ayah) return;
    setPrefs({ lastSurah: track.surah, lastAyah: track.ayah });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, track?.surah, track?.ayah]);

  /* ——— Karaoke ————————————————————————————————————— */

  const wordIndex = useMemo(() => {
    if (cursor.bismillah || !prefs.karaoke || !ayah?.segments.length) return -1;
    const ms = elapsed * 1000;
    for (let i = 0; i < ayah.segments.length; i++) {
      const s = ayah.segments[i];
      if (ms >= s[2] && ms < s[3]) return i;
    }
    const last = ayah.segments[ayah.segments.length - 1];
    return ms >= last[3] ? ayah.segments.length - 1 : -1;
  }, [elapsed, ayah, prefs.karaoke, cursor.bismillah]);

  /* ——— Rejimlarni boshlash ——————————————————————————— */

  const startVibe = useCallback(
    (mood: MoodId) => {
      const segs = planSegments(getMood(mood), prefs.duration);
      writeQueue("sakinah", segs, 0);
      setModeState("sakinah");
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
    [prefs.duration, setVibe, writeQueue]
  );

  const startSurah = useCallback(
    (surah: number, verses: number) => {
      writeQueue("player", surahPlan(surah, verses), 0);
      setModeState("player");
    },
    [writeQueue]
  );

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
        writeQueue(
          "sakinah",
          extendPlan(getMood(vibe.mood), segments),
          nextPos
        );
        return;
      }
      finishSession();
      return;
    }

    // Qur'on pleyeri — keyingi sura
    const nextSurah = (segment?.surah ?? 0) + 1;
    const ch = chapters.find((c) => c.id === nextSurah);
    if (ch) writeQueue("player", surahPlan(ch.id, ch.verses), 0);
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
    moveTo,
    writeQueue,
  ]);

  const prev = useCallback(() => {
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      setElapsed(0);
      return;
    }
    moveTo(Math.max(0, pos - 1));
  }, [pos, moveTo]);

  function handleEnded() {
    if (cursor.bismillah) {
      setQueues((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          cursor: { ...prev[mode].cursor, bismillah: false },
        },
      }));
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
    setElapsed(el.currentTime);
  }, []);

  const seekTo = useCallback((fraction: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = el.duration * Math.min(1, Math.max(0, fraction));
    setElapsed(el.currentTime);
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
    writeQueue(
      "sakinah",
      extendPlan(getMood(vibe.mood), segments, 20),
      pos + 1
    );
    setVibe({ ...vibe, done: false });
    setFinished(false);
    setPlaying(true);
  }, [vibe, segments, setVibe, pos, writeQueue]);

  /** Vibe tugadi — Qur'on pleyeriga o'tamiz */
  const endSession = useCallback(() => {
    setFinished(false);
    const surah = segment?.surah ?? 1;
    const verses =
      SURAHS[surah]?.verses ?? chapters.find((c) => c.id === surah)?.verses ?? 7;
    writeQueue("player", surahPlan(surah, verses), 0);
    setModeState("player");
    setPlaying(false);
  }, [segment, chapters, writeQueue]);

  const closePlayer = useCallback(() => {
    setPlaying(false);
    setQueues((prev) => ({ ...prev, [mode]: EMPTY }));
    setFinished(false);
    setMinimized(false);
  }, [mode]);

  const value = useMemo<PlayerValue>(
    () => ({
      mode,
      setMode,
      active: segments.length > 0,
      hasQueue: {
        player: queues.player.segments.length > 0,
        sakinah: queues.sakinah.segments.length > 0,
      },
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
      mode,
      setMode,
      queues,
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
        onTimeUpdate={(e) => {
          if (!playing) setElapsed(e.currentTarget.currentTime);
        }}
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
