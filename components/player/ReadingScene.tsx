"use client";

import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { QueueModal } from "@/components/player/QueueModal";
import { SurahModal } from "@/components/player/SurahModal";
import { VibeChip } from "@/components/player/VibeChip";
import { Popover, Slider, Toggle } from "@/components/sakinah/Popover";
import { Stage, StageThumb } from "@/components/sakinah/Stage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BISMILLAH_TEXT, totalMinutes } from "@/lib/queue";
import {
  BACKGROUNDS,
  RECITERS,
  SCRIPTS,
  SURAHS,
  TRANSLATIONS,
  getMood,
  translationName,
} from "@/lib/sakinah";
import { ARABIC_SIZES } from "@/lib/session";
import { prefetchPassage, usePassage } from "@/lib/useQuran";

type Rail = "type" | "translation" | "background" | "audio" | null;
type ModalKind = "surahs" | "queue" | null;

const IDLE_MS = 4000;

/** Figmadagi Sakinah o'qish sahnasi (S8–S15) */
export function ReadingScene({
  onExit,
  onRetune,
}: {
  onExit: () => void;
  onRetune: () => void;
}) {
  const { t, ln, locale, prefs, setPrefs, translationId, vibe, setVibe } =
    useApp();
  const player = usePlayer();

  const [rail, setRail] = useState<Rail>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [controls, setControls] = useState(true);
  const [showTip, setShowTip] = useState(false);

  const { segment, track, cursor, segments, segIndex } = player;

  const { ayahs, loading, error } = usePassage(
    segment?.surah ?? null,
    segment?.from ?? null,
    segment?.to ?? null,
    translationId
  );
  const ayah = ayahs?.find((a) => a.ayah === track?.ayah) ?? null;

  // Keyingi parcha oldindan yuklanadi — tilovat uzilmasin
  useEffect(() => {
    const nextSeg = segments[segIndex + 1];
    if (nextSeg)
      prefetchPassage(nextSeg.surah, nextSeg.from, nextSeg.to, translationId);
  }, [segments, segIndex, translationId]);

  /* ——— Boshqaruv harakatsizlikda yashirinadi ——— */
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

  // Panel yoki modal ochiq bo'lsa boshqaruv yashirinmasin
  useEffect(() => {
    if (rail || modal) setControls(true);
  }, [rail, modal]);

  /* ——— Parchaning fazilati (S9) ——— */
  useEffect(() => {
    setShowTip(false);
    const id = window.setTimeout(() => setShowTip(true), 3500);
    return () => window.clearTimeout(id);
  }, [segIndex]);

  const showTranslation = prefs.showTranslation && prefs.format === "both";
  const showTransliteration =
    prefs.showTransliteration && prefs.format === "both";
  const arabicText = cursor.bismillah
    ? BISMILLAH_TEXT
    : prefs.script === "indopak"
      ? ayah?.indopak ?? ""
      : ayah?.uthmani ?? "";
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

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
    >
      <div className="flex h-screen flex-col">
        {/* Yuqori qator */}
        <header
          className={`flex items-center justify-between gap-3 px-4 py-5 transition-opacity duration-500 sm:px-8 sm:py-6 ${fade}`}
        >
          <button
            type="button"
            onClick={onExit}
            className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white/85 transition hover:bg-white/20"
          >
            <Icon name="arrowLeft" size={16} />
            {t("nav.sakinah")}
          </button>

          <p className="text-sm text-white/60">
            {cursor.bismillah
              ? "Bismillah"
              : track && `${surahName} ${track.surah}:${track.ayah}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRail(rail === "background" ? null : "background")}
              aria-label={t("read.background")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Icon name="settings" size={18} />
            </button>
            <button
              type="button"
              onClick={onExit}
              aria-label={t("common.close")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>

        {/* Fazilat maslahati */}
        <div
          className={`px-8 text-center transition-opacity duration-700 ${
            showTip && controls && segment?.note ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/45">
            {segment?.note ? ln(segment.note) : " "}
          </p>
        </div>

        {/* Matn */}
        <main className="sk-scroll flex flex-1 items-center justify-center overflow-y-auto px-5 py-4 sm:px-10">
          <div key={`${track?.surah}:${track?.ayah}:${cursor.bismillah}`} className="anim-fade-in w-full max-w-5xl text-center">
            {loading && !cursor.bismillah && (
              <p className="text-sm text-white/45">{t("common.loading")}</p>
            )}
            {error && !cursor.bismillah && (
              <p className="text-sm text-white/70">{t("common.error")}</p>
            )}

            {(ayah || cursor.bismillah) && (
              <>
                <p
                  className="arabic font-arabic text-white"
                  style={{
                    fontSize: `clamp(${Math.round(fontPx * 0.55)}px, 7vw, ${fontPx}px)`,
                    lineHeight: prefs.lineHeight,
                  }}
                >
                  {arabicText}
                </p>

                {!cursor.bismillah && (
                  <>
                    {showTransliteration && ayah?.transliteration && (
                      <p className="mt-6 text-sm italic text-white/45">
                        {ayah.transliteration}
                      </p>
                    )}
                    {showTranslation && ayah?.translation && (
                      <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
                        {ayah.translation}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>

        {/* O'ng ikonka ustuni */}
        <div
          className={`fixed bottom-36 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 ${fade}`}
        >
          <div className="flex flex-row items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 backdrop-blur-md md:flex-col">
            <RailButton
              icon="type"
              label={t("read.typography")}
              active={rail === "type"}
              onClick={() => setRail(rail === "type" ? null : "type")}
            />
            <RailButton
              icon="hadith"
              label={t("read.translation")}
              active={rail === "translation"}
              onClick={() =>
                setRail(rail === "translation" ? null : "translation")
              }
            />
            <RailButton
              icon="layers"
              label={t("read.background")}
              active={rail === "background"}
              onClick={() =>
                setRail(rail === "background" ? null : "background")
              }
            />
            <RailButton
              icon="headphones"
              label={t("read.audio")}
              active={rail === "audio"}
              onClick={() => setRail(rail === "audio" ? null : "audio")}
            />

            <span className="mx-1 h-6 w-px bg-white/10 md:mx-0 md:my-1 md:h-px md:w-6" />

            <RailButton
              icon="quran"
              label={t("player.surahs")}
              active={modal === "surahs"}
              onClick={() => setModal("surahs")}
            />
            <RailButton
              icon="bookmark"
              label={t("player.queue")}
              active={modal === "queue"}
              onClick={() => setModal("queue")}
            />
          </div>
        </div>

        {/* Popoverlar */}
        {rail && (
          <div className="anim-pop fixed inset-x-4 bottom-52 z-30 md:inset-x-auto md:bottom-auto md:right-24 md:top-1/2 md:-translate-y-1/2">
            {rail === "type" && (
              <Popover title={t("read.typography")} onClose={() => setRail(null)}>
                <p className="text-xs text-white/50">{t("read.script")}</p>
                <div className="mt-2 flex gap-2">
                  {SCRIPTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPrefs({ script: s.id })}
                      aria-pressed={prefs.script === s.id}
                      className={[
                        "h-9 flex-1 rounded-lg text-sm transition",
                        prefs.script === s.id
                          ? "bg-white font-semibold text-night-base"
                          : "bg-white/10 text-white/70 hover:bg-white/20",
                      ].join(" ")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    {t("read.fontSize")}
                  </span>
                  <Stepper
                    value={prefs.fontSize}
                    min={1}
                    max={ARABIC_SIZES.length}
                    onChange={(v) => setPrefs({ fontSize: v })}
                  />
                </div>

                <LabeledSlider
                  label={t("read.lineHeight")}
                  display={prefs.lineHeight.toFixed(1)}
                  value={prefs.lineHeight}
                  min={1.6}
                  max={2.6}
                  step={0.1}
                  onChange={(v) => setPrefs({ lineHeight: v })}
                />
              </Popover>
            )}

            {rail === "translation" && (
              <Popover
                title={t("read.translation")}
                onClose={() => setRail(null)}
              >
                <ul className="space-y-1">
                  {TRANSLATIONS[locale].map((tr) => (
                    <li key={tr.id}>
                      <button
                        type="button"
                        onClick={() => setPrefs({ translation: tr.id })}
                        aria-pressed={translationId === tr.id}
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                          translationId === tr.id
                            ? "bg-brand/20 text-white"
                            : "text-white/70 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span className="min-w-0 truncate">{tr.name}</span>
                        {translationId === tr.id && (
                          <Icon name="check" size={15} className="text-brand" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                <label className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <span className="text-sm text-white/80">
                    {t("read.showTranslation")}
                  </span>
                  <Toggle
                    label={t("read.showTranslation")}
                    checked={prefs.showTranslation}
                    onChange={(v) => setPrefs({ showTranslation: v })}
                  />
                </label>
                <label className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-sm text-white/80">
                    {t("read.showTransliteration")}
                  </span>
                  <Toggle
                    label={t("read.showTransliteration")}
                    checked={prefs.showTransliteration}
                    onChange={(v) => setPrefs({ showTransliteration: v })}
                  />
                </label>
              </Popover>
            )}

            {rail === "background" && (
              <Popover title={t("read.background")} onClose={() => setRail(null)}>
                <div className="grid grid-cols-2 gap-3">
                  {BACKGROUNDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setPrefs({ background: b.id })}
                      aria-pressed={prefs.background === b.id}
                      className={[
                        "rounded-xl border p-1 text-left transition",
                        prefs.background === b.id
                          ? "border-brand"
                          : "border-white/10 hover:border-white/30",
                      ].join(" ")}
                    >
                      <StageThumb background={b.id} />
                      <span className="mt-1.5 block px-1 text-xs font-semibold text-white">
                        {b.label}
                      </span>
                      <span className="block px-1 pb-1 text-[11px] text-white/45">
                        {ln(b.sub)}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-white/45">
                  {t("read.bgHint")}
                </p>

                <LabeledSlider
                  label={t("read.brightness")}
                  display={`${prefs.brightness}%`}
                  value={prefs.brightness}
                  min={30}
                  max={100}
                  onChange={(v) => setPrefs({ brightness: v })}
                />

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm text-white/80">
                      {t("read.reduceMotion")}
                    </span>
                    <span className="block text-[11px] text-white/45">
                      {t("read.reduceMotionHint")}
                    </span>
                  </span>
                  <Toggle
                    label={t("read.reduceMotion")}
                    checked={prefs.reduceMotion}
                    onChange={(v) => setPrefs({ reduceMotion: v })}
                  />
                </div>
              </Popover>
            )}

            {rail === "audio" && (
              <Popover title={t("read.audio")} onClose={() => setRail(null)}>
                <ul className="space-y-1">
                  {RECITERS.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setPrefs({ reciter: r.id })}
                        aria-pressed={prefs.reciter === r.id}
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition",
                          prefs.reciter === r.id
                            ? "bg-brand/20"
                            : "hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-white">
                            {r.name}
                          </span>
                          <span className="block truncate text-[11px] text-white/45">
                            {ln(r.style)} · {ln(r.place)}
                          </span>
                        </span>
                        {prefs.reciter === r.id && (
                          <Icon name="check" size={16} className="text-brand" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-xs text-white/50">{t("player.speed")}</p>
                  <div className="mt-2 flex gap-2">
                    {[0.75, 1, 1.25, 1.5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setPrefs({ rate: r })}
                        aria-pressed={prefs.rate === r}
                        className={[
                          "h-8 flex-1 rounded-lg text-xs font-semibold transition",
                          prefs.rate === r
                            ? "bg-white text-night-base"
                            : "bg-white/10 text-white/70 hover:bg-white/20",
                        ].join(" ")}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-white/40">
                  {translationName(locale, translationId)}
                </p>
              </Popover>
            )}
          </div>
        )}

        {/* Pastdagi suzuvchi boshqaruv */}
        <footer
          className={`px-4 pb-6 transition-opacity duration-500 sm:px-8 sm:pb-8 ${fade}`}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
              <CircleButton
                icon="arrowLeft"
                label="prev"
                onClick={player.prev}
              />
              <CircleButton
                icon="back10"
                label="-10"
                onClick={() => player.seekBy(-10)}
              />
              <button
                type="button"
                onClick={player.toggle}
                aria-label={player.playing ? "pause" : "play"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-night-base transition hover:bg-brand active:scale-90"
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
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-white/35">
            {t("read.fade")}
          </p>
        </footer>

        {/* Pastki chap — kayfiyat bo'limchasi */}
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
              onExit={() => {
                setVibe(null);
                const surah = segment?.surah ?? 1;
                player.startSurah(
                  surah,
                  SURAHS[surah]?.verses ??
                    player.chapters.find((c) => c.id === surah)?.verses ??
                    7
                );
              }}
            />
          </div>
        )}

        {/* Progress */}
        <div className="fixed inset-x-0 bottom-0 h-1 bg-white/10">
          <div
            className="h-full bg-brand transition-[width] duration-300"
            style={{ width: `${Math.min(100, queueProgress * 100)}%` }}
          />
        </div>
      </div>

      {modal === "surahs" && <SurahModal onClose={() => setModal(null)} />}
      {modal === "queue" && <QueueModal onClose={() => setModal(null)} />}

      {player.finished && vibe && (
        <FinishPrompt
          moodLabel={ln(getMood(vibe.mood).label)}
          minutes={totalMinutes(segments)}
          onContinue={player.continueSession}
          onEnd={player.endSession}
        />
      )}
    </Stage>
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

function RailButton({
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
        "flex h-10 w-10 items-center justify-center rounded-xl transition",
        active ? "bg-brand text-night-base" : "text-white/80 hover:bg-white/15",
      ].join(" ")}
    >
      <Icon name={icon} size={18} />
    </button>
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
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <span className="flex items-center gap-3 rounded-full bg-white/10 px-2 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="−"
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15"
      >
        −
      </button>
      <span className="w-4 text-center text-sm text-white">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="+"
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15"
      >
        +
      </button>
    </span>
  );
}

function LabeledSlider({
  label,
  display,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70">{display}</span>
      </div>
      <div className="mt-2">
        <Slider
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
