"use client";

import { useCallback, useEffect, useState } from "react";
import { AyahText } from "@/components/player/AyahText";
import { ClosingScreen } from "@/components/player/ClosingScreen";
import { usePlayer } from "@/components/player/PlayerProvider";
import { SettingsRail } from "@/components/player/SettingsRail";
import { VibeChip } from "@/components/player/VibeChip";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BISMILLAH_TEXT, totalMinutes } from "@/lib/queue";
import { STAGE_LABEL, SURAHS, getMood } from "@/lib/sakinah";
import { ARABIC_SIZES } from "@/lib/session";

const IDLE_MS = 4000;

/** Figmadagi Sakinah o'qish sahnasi (S8–S15) */
export function ReadingScene({
  onExit,
  onRetune,
  embedded = false,
}: {
  onExit?: () => void;
  onRetune: () => void;
  /** FullScreen ichida — o'z sarlavhasi va foni chizilmaydi */
  embedded?: boolean;
}) {
  const { t, ln, prefs, vibe, setVibe, isSaved, toggleSaved } = useApp();
  const player = usePlayer();

  const [controls, setControls] = useState(true);
  const [showTip, setShowTip] = useState(false);

  const { segment, track, cursor, segments, segIndex, ayah, loading, error } =
    player;

  /* Boshqaruv harakatsizlikda yashirinadi */
  const wake = useCallback(() => setControls(true), []);

  useEffect(() => {
    let timer: number | undefined;
    const reset = () => {
      wake();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setControls(false), IDLE_MS);
    };
    reset();
    window.addEventListener("pointermove", reset);
    window.addEventListener("keydown", reset);
    return () => {
      window.removeEventListener("pointermove", reset);
      window.removeEventListener("keydown", reset);
      window.clearTimeout(timer);
    };
  }, [wake]);

  /* Parchaning fazilati (S9) */
  useEffect(() => {
    setShowTip(false);
    const id = window.setTimeout(() => setShowTip(true), 3500);
    return () => window.clearTimeout(id);
  }, [segIndex]);

  const showTranslation = prefs.showTranslation && prefs.format === "both";
  const showTransliteration =
    prefs.showTransliteration && prefs.format === "both";
  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];

  const surahName = segment
    ? SURAHS[segment.surah]?.slug ??
      player.chapters.find((c) => c.id === segment.surah)?.slug ??
      ""
    : "";

  const clipProgress =
    player.clipLength > 0 ? player.elapsed / player.clipLength : 0;
  const queueProgress =
    player.tracks.length > 0
      ? (player.cursor.pos + clipProgress) / player.tracks.length
      : 0;

  const fade = controls ? "opacity-100" : "pointer-events-none opacity-0";
  const saved = track ? isSaved(track.surah, track.ayah) : false;

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
      bare={embedded}
    >
      <div
        className={
          embedded ? "flex min-h-0 flex-1 flex-col" : "flex h-screen flex-col"
        }
      >
        {!embedded && (
          <header
            className={`flex items-center justify-between gap-3 px-4 py-5 transition-opacity duration-500 sm:px-8 sm:py-6 ${fade}`}
          >
            <button
              type="button"
              onClick={onExit}
              className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white/85 transition hover:bg-white/20 active:scale-95"
            >
              <Icon name="arrowLeft" size={16} />
              <span className="hidden sm:inline">{t("nav.sakinah")}</span>
            </button>

            <p className="truncate text-sm text-white/60">
              {cursor.bismillah
                ? "Bismillah"
                : track && `${surahName} ${track.surah}:${track.ayah}`}
            </p>

            <button
              type="button"
              onClick={() => player.setMinimized(true)}
              aria-label={t("player.minimize")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 active:scale-95"
            >
              <Icon name="minimize" size={18} />
            </button>
          </header>
        )}

        {/* Fazilat maslahati */}
        <div
          className={`px-6 text-center transition-opacity duration-700 sm:px-8 ${
            showTip && controls && segment?.note ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/45">
            {segment?.stage && (
              <span className="tone-text mr-2 font-semibold uppercase tracking-wide">
                {ln(STAGE_LABEL[segment.stage])}
              </span>
            )}
            {segment?.note ? ln(segment.note) : " "}
          </p>
        </div>

        {/* Matn */}
        <main className="sk-scroll flex flex-1 items-center justify-center overflow-y-auto px-5 py-4 sm:px-10">
          <div
            key={`${track?.surah}:${track?.ayah}:${cursor.bismillah}`}
            className="anim-fade-in w-full max-w-5xl text-center"
          >
            {loading && !cursor.bismillah && (
              <p className="text-sm text-white/45">{t("common.loading")}</p>
            )}
            {error && !cursor.bismillah && (
              <p className="text-sm text-white/70">{t("common.error")}</p>
            )}

            {cursor.bismillah && (
              <p
                className="arabic font-arabic text-white"
                style={{
                  fontSize: `clamp(${Math.round(fontPx * 0.55)}px, 7vw, ${fontPx}px)`,
                  lineHeight: prefs.lineHeight,
                }}
              >
                {BISMILLAH_TEXT}
              </p>
            )}

            {ayah && !cursor.bismillah && (
              <>
                <AyahText
                  ayah={ayah}
                  active
                  wordIndex={player.wordIndex}
                  fontPx={fontPx}
                />

                {showTransliteration && ayah.transliteration && (
                  <p className="mx-auto mt-6 max-w-3xl text-center text-sm italic text-white/45">
                    {ayah.transliteration}
                  </p>
                )}
                {showTranslation && ayah.translation && (
                  <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-white/70">
                    {ayah.translation}
                  </p>
                )}
              </>
            )}
          </div>
        </main>

        {/* Pastdagi suzuvchi boshqaruv */}
        <footer
          className={`px-4 pb-6 transition-opacity duration-500 sm:px-8 sm:pb-8 ${fade}`}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
              <CircleButton icon="arrowLeft" label="prev" onClick={player.prev} />
              <CircleButton
                icon="back10"
                label="-10"
                onClick={() => player.seekBy(-10)}
              />
              <button
                type="button"
                onClick={player.toggle}
                aria-label={player.playing ? "pause" : "play"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-night-base transition hover:brightness-90 active:scale-90"
              >
                <Icon
                  name={player.playing ? "pause" : "play"}
                  size={20}
                  filled={!player.playing}
                />
              </button>
              <CircleButton
                icon="forward10"
                label="+10"
                onClick={() => player.seekBy(10)}
              />
              <CircleButton
                icon="arrowRight"
                label="next"
                onClick={player.next}
              />

              {track && (
                <button
                  type="button"
                  onClick={() => toggleSaved(track.surah, track.ayah)}
                  aria-label={saved ? t("saved.remove") : t("saved.add")}
                  title={saved ? t("saved.remove") : t("saved.add")}
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90",
                    saved
                      ? "tone-bg-soft tone-text"
                      : "text-white/70 hover:bg-white/15",
                  ].join(" ")}
                >
                  <Icon name="bookmark" size={17} filled={saved} />
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-white/35">
            {t("read.fade")}
          </p>
        </footer>

        {/* Kayfiyat bo'limchasi */}
        {vibe && (
          <div className={`transition-opacity duration-500 ${fade}`}>
            <VibeChip
              mood={vibe.mood}
              minutes={vibe.minutes}
              active={!vibe.done}
              done={
                segments.filter((s, i) => s.kind === "vibe" && i < segIndex)
                  .length
              }
              total={segments.filter((s) => s.kind === "vibe").length}
              onRetune={onRetune}
              onRestart={() => player.startVibe(vibe.mood)}
              onExit={() => setVibe(null)}
            />
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 h-1 bg-white/10">
          <div
            className="tone-bg h-full transition-[width] duration-300"
            style={{ width: `${Math.min(100, queueProgress * 100)}%` }}
          />
        </div>
      </div>

      <SettingsRail visible={controls} />

      {player.finished && vibe && (
        <ClosingScreen
          minutes={totalMinutes(segments)}
          onContinue={player.continueSession}
          onEnd={player.endSession}
        />
      )}
    </Stage>
  );
}

function CircleButton({
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
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-90"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
