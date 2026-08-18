"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Onboarding } from "@/components/player/Onboarding";
import { SidePanel, type PanelTab } from "@/components/player/SidePanel";
import { VibeChip } from "@/components/player/VibeChip";
import { Stage } from "@/components/sakinah/Stage";
import { NavRail } from "@/components/shell/NavRail";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  extendPlan,
  flattenTracks,
  planSegments,
  surahPlan,
  totalMinutes,
  type Segment,
} from "@/lib/queue";
import {
  SURAHS,
  audioUrl,
  getMood,
  type MoodId,
} from "@/lib/sakinah";
import {
  ARABIC_SIZES,
  RATES,
  formatClock,
  type RepeatMode,
} from "@/lib/session";
import { prefetchPassage, useChapters, usePassage } from "@/lib/useQuran";

const REPEATS: RepeatMode[] = ["off", "ayah", "segment"];

export function PlayerScreen() {
  const {
    t,
    ln,
    locale,
    prefs,
    setPrefs,
    translationId,
    vibe,
    setVibe,
    pushHistory,
    ready,
  } = useApp();

  const [segments, setSegments] = useState<Segment[]>([]);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clipLength, setClipLength] = useState(0);
  const [panel, setPanel] = useState<PanelTab | null>(null);
  const [onboarding, setOnboarding] = useState(false);
  const [finished, setFinished] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chapters = useChapters(locale);

  const tracks = useMemo(() => flattenTracks(segments), [segments]);
  const track = tracks[pos] ?? null;
  const segIndex = track?.segment ?? 0;
  const segment = segments[segIndex] ?? null;

  const inVibe = vibe !== null && !vibe.done;

  const { ayahs, loading, error } = usePassage(
    segment?.surah ?? null,
    segment?.from ?? null,
    segment?.to ?? null,
    translationId
  );
  const ayah = ayahs?.find((a) => a.ayah === track?.ayah) ?? null;

  /* ——— Rejimni boshlash ——————————————————————————————— */

  const startVibe = useCallback(
    (mood: MoodId) => {
      const segs = planSegments(getMood(mood), prefs.duration);
      setSegments(segs);
      setPos(0);
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
    setSegments(surahPlan(surah, verses));
    setPos(0);
  }, []);

  // Birinchi yuklanish
  useEffect(() => {
    if (!ready || segments.length > 0) return;

    if (vibe && !vibe.done) {
      setSegments(planSegments(getMood(vibe.mood), vibe.minutes));
      setPos(0);
    } else {
      startSurah(1, SURAHS[1].verses);
    }

    if (!prefs.onboarded) setOnboarding(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* ——— Audio ——————————————————————————————————————— */

  const src = track ? audioUrl(prefs.reciter, track.surah, track.ayah) : "";

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

  // Keyingi parchani oldindan yuklab qo'yamiz
  useEffect(() => {
    const next = segments[segIndex + 1];
    if (next) prefetchPassage(next.surah, next.from, next.to, translationId);
  }, [segments, segIndex, translationId]);

  /* ——— Navbat bo'ylab harakat ——————————————————————— */

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
        .map((s) =>
          s.from === s.to
            ? `${SURAHS[s.surah]?.slug ?? s.surah} ${s.surah}:${s.from}`
            : `${SURAHS[s.surah]?.slug ?? s.surah} ${s.surah}:${s.from}–${s.to}`
        ),
      minutes: totalMinutes(segments),
    });
  }, [vibe, segments, setVibe, pushHistory]);

  const goNext = useCallback(() => {
    const next = pos + 1;

    if (next < tracks.length) {
      if (prefs.repeat === "segment" && tracks[next].segment !== segIndex) {
        setPos(tracks.findIndex((x) => x.segment === segIndex));
      } else {
        setPos(next);
      }
      return;
    }

    // Navbat tugadi
    if (inVibe && vibe) {
      if (vibe.minutes === 0) {
        setSegments(extendPlan(getMood(vibe.mood), segments));
        setPos(next);
        return;
      }
      finishSession();
      return;
    }

    // Oddiy rejim — keyingi suraga o'tamiz
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
  ]);

  const goPrev = useCallback(() => {
    const el = audioRef.current;
    // 3 soniyadan keyin — oyat boshiga qaytaramiz
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    setPos((p) => Math.max(0, p - 1));
  }, []);

  function handleEnded() {
    if (prefs.repeat === "ayah") {
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
        void el.play().catch(() => setPlaying(false));
      }
      return;
    }
    goNext();
  }

  function seekBy(delta: number) {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(
      Math.max(0, el.currentTime + delta),
      el.duration - 0.1
    );
  }

  function seekTo(fraction: number) {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = el.duration * Math.min(1, Math.max(0, fraction));
  }

  /* ——— Sessiya yakuni ——————————————————————————————— */

  function continueSession() {
    if (!vibe) return;
    setSegments((prev) => extendPlan(getMood(vibe.mood), prev, 20));
    setVibe({ ...vibe, done: false });
    setFinished(false);
    setPos((p) => p + 1);
    setPlaying(true);
  }

  function endSession() {
    // Pleyerdan chiqmaymiz — oddiy rejimga o'tamiz, vibe burchakda qoladi
    setFinished(false);
    const surah = segment?.surah ?? 1;
    const verses = SURAHS[surah]?.verses ?? chapters.find((c) => c.id === surah)?.verses ?? 7;
    startSurah(surah, verses);
    setPanel("surahs");
  }

  /* ——— Ko'rinish ———————————————————————————————————— */

  const showTranslation = prefs.showTranslation && prefs.format === "both";
  const showTransliteration =
    prefs.showTransliteration && prefs.format === "both";
  const arabicText =
    prefs.script === "indopak" ? ayah?.indopak ?? "" : ayah?.uthmani ?? "";
  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];
  const surahName = segment ? SURAHS[segment.surah]?.slug ?? chapters.find((c) => c.id === segment.surah)?.slug ?? "" : "";
  const clipProgress = clipLength > 0 ? elapsed / clipLength : 0;
  const vibeDone = segments.filter(
    (s, i) => s.kind === "vibe" && i < segIndex
  ).length;
  const vibeTotal = segments.filter((s) => s.kind === "vibe").length;

  return (
    <div className="flex h-screen overflow-hidden bg-night-base">
      <NavRail />

      <div className="relative ml-[88px] flex-1">
        <Stage
          background={prefs.background}
          brightness={prefs.brightness}
          reduceMotion={prefs.reduceMotion}
          className="!min-h-0 h-full"
        >
          <div className="flex h-screen">
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Yuqori qator */}
              <header className="flex items-center justify-between gap-4 px-8 py-5">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-white/40">
                    {t("player.nowPlaying")}
                  </p>
                  <h1 className="truncate text-lg font-semibold text-white">
                    {surahName}
                    {track && (
                      <span className="ml-2 font-normal text-white/55">
                        {track.surah}:{track.ayah}
                      </span>
                    )}
                  </h1>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboarding(true)}
                    className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white/85 transition hover:bg-white/15"
                  >
                    <Icon name="sakinah" size={16} />
                    {t("onboard.open")}
                  </button>
                  <PanelButton
                    icon="quran"
                    label={t("player.surahs")}
                    active={panel === "surahs"}
                    onClick={() =>
                      setPanel(panel === "surahs" ? null : "surahs")
                    }
                  />
                  <PanelButton
                    icon="layers"
                    label={t("player.queue")}
                    active={panel === "queue"}
                    onClick={() => setPanel(panel === "queue" ? null : "queue")}
                  />
                  <PanelButton
                    icon="settings"
                    label={t("player.settings")}
                    active={panel === "settings"}
                    onClick={() =>
                      setPanel(panel === "settings" ? null : "settings")
                    }
                  />
                </div>
              </header>

              {/* Matn */}
              <main className="flex flex-1 items-center justify-center overflow-y-auto px-10">
                <div className="w-full max-w-4xl py-8 text-center">
                  {loading && (
                    <p className="text-sm text-white/45">{t("common.loading")}</p>
                  )}
                  {error && (
                    <p className="text-sm text-white/70">{t("common.error")}</p>
                  )}

                  {ayah && (
                    <>
                      <p
                        className="arabic font-arabic text-white"
                        style={{
                          fontSize: `${fontPx}px`,
                          lineHeight: prefs.lineHeight,
                        }}
                      >
                        {arabicText}
                      </p>

                      {showTransliteration && ayah.transliteration && (
                        <p className="mt-6 text-sm italic text-white/40">
                          {ayah.transliteration}
                        </p>
                      )}

                      {showTranslation && ayah.translation && (
                        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
                          {ayah.translation}
                        </p>
                      )}

                      {segment?.note && segment.kind === "vibe" && (
                        <p className="mx-auto mt-8 max-w-xl text-xs leading-relaxed text-white/35">
                          {ln(segment.note)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </main>

              {/* Pleyer */}
              <footer className="px-8 pb-6">
                <div className="mx-auto max-w-3xl">
                  <ProgressBar
                    value={clipProgress}
                    elapsed={elapsed}
                    total={clipLength}
                    onSeek={seekTo}
                  />

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <RateButton
                      rate={prefs.rate}
                      onChange={(r) => setPrefs({ rate: r })}
                    />

                    <RoundButton icon="arrowLeft" label="prev" onClick={goPrev} />
                    <RoundButton
                      icon="back10"
                      label="-10"
                      onClick={() => seekBy(-10)}
                    />
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? "pause" : "play"}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-night-base transition hover:bg-brand"
                    >
                      <Icon
                        name={playing ? "pause" : "play"}
                        size={20}
                        filled={!playing}
                      />
                    </button>
                    <RoundButton
                      icon="forward10"
                      label="+10"
                      onClick={() => seekBy(10)}
                    />
                    <RoundButton icon="arrowRight" label="next" onClick={goNext} />

                    <RepeatButton
                      mode={prefs.repeat}
                      onChange={(m) => setPrefs({ repeat: m })}
                    />
                  </div>

                  <p className="mt-3 text-center text-[11px] text-white/30">
                    {segments.length > 0 &&
                      t("player.segmentOf", {
                        i: segIndex + 1,
                        n: segments.length,
                      })}
                  </p>
                </div>
              </footer>
            </div>

            {panel && (
              <SidePanel
                tab={panel}
                onTab={setPanel}
                onClose={() => setPanel(null)}
                segments={segments}
                activeSegment={segIndex}
                onSelectSegment={(i) => {
                  const start = tracks.findIndex((x) => x.segment === i);
                  if (start >= 0) setPos(start);
                }}
                chapters={chapters}
                currentSurah={segment?.surah ?? 1}
                onSelectSurah={(surah, verses) => {
                  startSurah(surah, verses);
                  setPlaying(true);
                }}
              />
            )}
          </div>

          {/* Burchakdagi vibe bo'limchasi */}
          {vibe && (
            <VibeChip
              mood={vibe.mood}
              minutes={vibe.minutes}
              active={inVibe}
              done={vibeDone}
              total={vibeTotal}
              onRetune={() => setOnboarding(true)}
              onRestart={() => startVibe(vibe.mood)}
              onExit={() => {
                setVibe(null);
                const surah = segment?.surah ?? 1;
                startSurah(
                  surah,
                  SURAHS[surah]?.verses ??
                    chapters.find((c) => c.id === surah)?.verses ??
                    7
                );
              }}
            />
          )}
        </Stage>

        <audio
          ref={audioRef}
          preload="auto"
          onEnded={handleEnded}
          onLoadedMetadata={(e) => setClipLength(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
          onError={() => setPlaying(false)}
        />

        {onboarding && (
          <Onboarding
            initialMood={vibe?.mood ?? null}
            dismissible={prefs.onboarded}
            onBegin={(mood) => {
              setPrefs({ onboarded: true });
              setOnboarding(false);
              startVibe(mood);
            }}
            onSkip={() => {
              setPrefs({ onboarded: true });
              setOnboarding(false);
              setVibe(null);
              startSurah(1, SURAHS[1].verses);
            }}
            onClose={() => setOnboarding(false)}
          />
        )}

        {finished && vibe && (
          <FinishPrompt
            moodLabel={ln(getMood(vibe.mood).label)}
            minutes={totalMinutes(segments)}
            onContinue={continueSession}
            onEnd={endSession}
          />
        )}
      </div>
    </div>
  );
}

/* ——————————————————————————————————————————————————————— */

function FinishPrompt({
  moodLabel,
  minutes,
  onContinue,
  onEnd,
}: {
  moodLabel: string;
  minutes: number;
  onContinue: () => void;
  onEnd: () => void;
}) {
  const { t } = useApp();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-night-base/75 p-6 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-night-panel/90 p-8 text-center shadow-panel">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand/40">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-night-base">
            <Icon name="check" size={16} />
          </span>
        </span>

        <h2 className="mt-6 text-2xl font-semibold text-white">
          {t("finish.title")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {t("finish.body", { mood: moodLabel, minutes })}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-night-base transition hover:bg-brand-strong hover:text-white"
          >
            {t("finish.yes")}
          </button>
          <button
            type="button"
            onClick={onEnd}
            className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
          >
            {t("finish.no")}
          </button>
        </div>

        <p className="mt-4 text-xs text-white/35">{t("finish.noHint")}</p>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  elapsed,
  total,
  onSeek,
}: {
  value: number;
  elapsed: number;
  total: number;
  onSeek: (fraction: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-white/45">
        {formatClock(elapsed)}
      </span>
      <button
        type="button"
        aria-label="seek"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onSeek((e.clientX - rect.left) / rect.width);
        }}
        className="group relative h-4 flex-1"
      >
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
        <span
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand transition-[width]"
          style={{ width: `${Math.min(100, value * 100)}%` }}
        />
      </button>
      <span className="w-10 shrink-0 text-[11px] tabular-nums text-white/45">
        {formatClock(total)}
      </span>
    </div>
  );
}

function RoundButton({
  icon,
  label,
  onClick,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/15 hover:text-white"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function PanelButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={[
        "flex h-10 w-10 items-center justify-center rounded-full border transition",
        active
          ? "border-brand bg-brand/20 text-white"
          : "border-white/10 bg-white/[0.06] text-white/75 hover:bg-white/15",
      ].join(" ")}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function RateButton({
  rate,
  onChange,
}: {
  rate: number;
  onChange: (r: number) => void;
}) {
  const { t } = useApp();
  return (
    <button
      type="button"
      onClick={() => onChange(RATES[(RATES.indexOf(rate) + 1) % RATES.length])}
      aria-label={t("player.speed")}
      className="h-9 w-14 rounded-full bg-white/10 text-xs font-semibold text-white/80 transition hover:bg-white/20"
    >
      {rate}x
    </button>
  );
}

function RepeatButton({
  mode,
  onChange,
}: {
  mode: RepeatMode;
  onChange: (m: RepeatMode) => void;
}) {
  const { t } = useApp();
  return (
    <button
      type="button"
      onClick={() => onChange(REPEATS[(REPEATS.indexOf(mode) + 1) % REPEATS.length])}
      aria-label={t("player.repeat")}
      className={[
        "h-9 rounded-full px-3 text-xs font-semibold transition",
        mode === "off"
          ? "bg-white/10 text-white/60 hover:bg-white/20"
          : "bg-brand/25 text-brand",
      ].join(" ")}
    >
      {t(`player.repeat.${mode}`)}
    </button>
  );
}
