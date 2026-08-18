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
  BISMILLAH_AYAH,
  BISMILLAH_SURAH,
  extendPlan,
  flattenTracks,
  needsBismillah,
  planSegments,
  surahPlan,
  totalMinutes,
  type Segment,
  type Track,
} from "@/lib/queue";
import { SURAHS, audioUrl, getMood, type MoodId } from "@/lib/sakinah";
import type { Chapter } from "@/lib/quran";
import { useChapters } from "@/lib/useQuran";

interface Cursor {
  pos: number;
  bismillah: boolean;
}

interface PlayerValue {
  /** Navbat bo'sh bo'lsa pleyer hali ochilmagan */
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
  /** Sessiya tugadi — «davom ettiramizmi?» so'ralmoqda */
  finished: boolean;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekBy: (delta: number) => void;
  seekTo: (fraction: number) => void;
  jumpToSegment: (index: number) => void;

  startVibe: (mood: MoodId) => void;
  startSurah: (surah: number, verses: number) => void;
  continueSession: () => void;
  endSession: () => void;
  closePlayer: () => void;
}

const Ctx = createContext<PlayerValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { locale, prefs, vibe, setVibe, pushHistory } = useApp();

  const [segments, setSegments] = useState<Segment[]>([]);
  const [cursor, setCursor] = useState<Cursor>({ pos: 0, bismillah: false });
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clipLength, setClipLength] = useState(0);
  const [finished, setFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chapters = useChapters(locale);

  const tracks = useMemo(() => flattenTracks(segments), [segments]);
  const pos = cursor.pos;
  const track = tracks[pos] ?? null;
  const segIndex = track?.segment ?? 0;
  const segment = segments[segIndex] ?? null;

  const inVibe = vibe !== null && !vibe.done;

  /* ——— Kursor ————————————————————————————————————————
     Bismillah kerakmi — o'rin bilan birga hisoblanadi, shunda audio
     manbasi bir freym ham noto'g'ri bo'lib qolmaydi. */

  const moveTo = useCallback(
    (nextPos: number, segs: Segment[] = segments, trs: Track[] = tracks) => {
      setCursor({ pos: nextPos, bismillah: needsBismillah(segs, trs, nextPos) });
    },
    [segments, tracks]
  );

  /* ——— Audio ——————————————————————————————————————— */

  const src = cursor.bismillah
    ? audioUrl(prefs.reciter, BISMILLAH_SURAH, BISMILLAH_AYAH)
    : track
      ? audioUrl(prefs.reciter, track.surah, track.ayah)
      : "";

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

  // Tugallanmagan sessiya bo'lsa navbatni tiklaymiz (ijro o'zi boshlanmaydi)
  useEffect(() => {
    if (segments.length > 0 || !vibe || vibe.done) return;
    const segs = planSegments(getMood(vibe.mood), vibe.minutes);
    setSegments(segs);
    setCursor({
      pos: 0,
      bismillah: needsBismillah(segs, flattenTracks(segs), 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibe]);

  /* ——— Navbat bo'ylab ——————————————————————————————— */

  const finishSession = useCallback(() => {
    if (!vibe) return;
    setPlaying(false);
    setFinished(true);
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

    // Oddiy rejim — keyingi sura
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

  const continueSession = useCallback(() => {
    if (!vibe) return;
    const grown = extendPlan(getMood(vibe.mood), segments, 20);
    setSegments(grown);
    setVibe({ ...vibe, done: false });
    setFinished(false);
    moveTo(pos + 1, grown, flattenTracks(grown));
    setPlaying(true);
  }, [vibe, segments, setVibe, pos, moveTo]);

  /** Vibe tugadi — pleyer yopilmaydi, oddiy rejimda davom etadi */
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
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      toggle: () => setPlaying((p) => !p),
      next,
      prev,
      seekBy,
      seekTo,
      jumpToSegment,
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
      next,
      prev,
      seekBy,
      seekTo,
      jumpToSegment,
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
