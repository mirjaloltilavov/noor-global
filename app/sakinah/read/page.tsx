"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Popover, Slider, Toggle } from "@/components/sakinah/Popover";
import { Stage, StageThumb } from "@/components/sakinah/Stage";
import { Icon, type IconName } from "@/components/ui/Icon";
import { usePassage } from "@/lib/usePassage";
import { ARABIC_SIZES } from "@/lib/session";
import {
  BACKGROUNDS,
  MOODS,
  RECITERS,
  SCRIPTS,
  TRANSLATOR_NAMES,
  audioUrl,
  getMood,
  getReciter,
  passageRef,
} from "@/lib/sakinah";

type Panel = "type" | "translation" | "background" | "audio" | "mood" | null;

const IDLE_MS = 4000;

export default function ReadPage() {
  const router = useRouter();
  const { t, ln, locale, prefs, setPrefs, current, setCurrent, ready } = useApp();

  const [panel, setPanel] = useState<Panel>(null);
  const [controls, setControls] = useState(true);
  const [ayahIdx, setAyahIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (ready && !current) router.replace("/sakinah");
  }, [ready, current, router]);

  const mood = current ? getMood(current.mood) : MOODS[0];
  const index = current?.index ?? 0;
  const passage = mood.passages[Math.min(index, mood.passages.length - 1)];

  const { ayahs, loading, error } = usePassage(
    passage.surah,
    passage.from,
    passage.to,
    locale
  );

  const ayah = ayahs?.[ayahIdx] ?? null;
  const total = ayahs?.length ?? 0;

  /* ——— Boshqaruv paneli: harakatsizlikda yashirinadi ——— */
  const wake = useCallback(() => {
    setControls(true);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setControls(false), IDLE_MS);
  }, []);

  useEffect(() => {
    wake();
    const onMove = () => wake();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onMove);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [wake]);

  // Panel ochiq turganda boshqaruv yashirinmasin
  useEffect(() => {
    if (panel) setControls(true);
  }, [panel]);

  /* ——— Parchaning fazilati — bir necha soniyadan so'ng (S9) ——— */
  useEffect(() => {
    setShowTip(false);
    const id = window.setTimeout(() => setShowTip(true), 3500);
    return () => window.clearTimeout(id);
  }, [index]);

  /* ——— Audio ——— */
  const src = useMemo(
    () => (ayah ? audioUrl(prefs.reciter, ayah.surah, ayah.ayah) : ""),
    [ayah, prefs.reciter]
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    el.src = src;
    setProgress(0);
    if (playing) void el.play().catch(() => setPlaying(false));
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing]);

  // "Faqat o'qish" rejimida avtomatik ijro yo'q
  useEffect(() => {
    if (prefs.format !== "read") setPlaying(true);
  }, [prefs.format]);

  const finishPassage = useCallback(() => {
    setPlaying(false);
    router.push("/sakinah/complete");
  }, [router]);

  function nextAyah() {
    if (ayahIdx + 1 < total) {
      setAyahIdx((i) => i + 1);
    } else {
      finishPassage();
    }
  }

  function prevAyah() {
    setAyahIdx((i) => Math.max(0, i - 1));
  }

  function seek(delta: number) {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.min(
      Math.max(0, el.currentTime + delta),
      el.duration - 0.1
    );
  }

  if (!ready || !current) {
    return (
      <Stage
        background={prefs.background}
        brightness={prefs.brightness}
        reduceMotion={prefs.reduceMotion}
      >
        <div className="flex min-h-screen items-center justify-center text-sm text-white/60">
          {t("common.loading")}
        </div>
      </Stage>
    );
  }

  const arabicText =
    prefs.script === "indopak" ? ayah?.indopak ?? "" : ayah?.uthmani ?? "";
  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];
  const passageProgress = total > 0 ? (ayahIdx + progress) / total : 0;

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={nextAyah}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (Number.isFinite(el.duration) && el.duration > 0) {
            setProgress(el.currentTime / el.duration);
          }
        }}
        onError={() => setPlaying(false)}
      />

      <div className="flex min-h-screen flex-col">
        {/* Yuqori qator */}
        <header
          className={[
            "flex items-center justify-between px-8 py-6 transition-opacity duration-500",
            controls ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => router.push("/sakinah/reminder")}
            className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white/85 transition hover:bg-white/20"
          >
            <Icon name="arrowLeft" size={16} />
            {t("common.back")}
          </button>

          <p className="text-sm text-white/60">{passageRef(passage)}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPanel(panel === "background" ? null : "background")}
              aria-label={t("read.background")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Icon name="settings" size={18} />
            </button>
            <button
              type="button"
              onClick={() => router.push("/sakinah")}
              aria-label={t("common.close")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </header>

        {/* Fazilat maslahati (S9) */}
        <div
          className={[
            "px-8 text-center transition-opacity duration-700",
            showTip && controls ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/45">
            {ln(passage.note)}
          </p>
        </div>

        {/* Matn */}
        <main className="flex flex-1 items-center justify-center px-10">
          <div className="w-full max-w-5xl text-center">
            {loading && (
              <p className="text-sm text-white/50">{t("common.loading")}</p>
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

                {prefs.showTransliteration && ayah.transliteration && (
                  <p className="mt-6 text-sm italic text-white/45">
                    {ayah.transliteration}
                  </p>
                )}

                {prefs.showTranslation && ayah.translation && (
                  <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
                    {ayah.translation}
                  </p>
                )}

                {total > 1 && (
                  <p className="mt-8 text-xs text-white/35">
                    {t("read.passageOf", { i: ayahIdx + 1, n: total })}
                  </p>
                )}
              </>
            )}
          </div>
        </main>

        {/* O'ng vertikal panel */}
        <div
          className={[
            "fixed right-6 top-1/2 z-20 -translate-y-1/2 transition-opacity duration-500",
            controls ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 backdrop-blur-md">
            <RailButton
              icon="type"
              label={t("read.typography")}
              active={panel === "type"}
              onClick={() => setPanel(panel === "type" ? null : "type")}
            />
            <RailButton
              icon="hadith"
              label={t("read.translation")}
              active={panel === "translation"}
              onClick={() =>
                setPanel(panel === "translation" ? null : "translation")
              }
            />
            <RailButton
              icon="layers"
              label={t("read.background")}
              active={panel === "background"}
              onClick={() =>
                setPanel(panel === "background" ? null : "background")
              }
            />
            <RailButton
              icon="sun"
              label={t("read.brightness")}
              active={false}
              onClick={() =>
                setPrefs({ brightness: prefs.brightness >= 90 ? 55 : prefs.brightness + 15 })
              }
            />
            <RailButton
              icon="headphones"
              label={t("read.audio")}
              active={panel === "audio"}
              onClick={() => setPanel(panel === "audio" ? null : "audio")}
            />
          </div>
        </div>

        {/* Panellar */}
        {panel && panel !== "mood" && (
          <div className="fixed right-24 top-1/2 z-30 -translate-y-1/2">
            {panel === "type" && (
              <Popover title={t("read.typography")} onClose={() => setPanel(null)}>
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
                          ? "bg-white text-night-base font-semibold"
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

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      {t("read.lineHeight")}
                    </span>
                    <span className="text-xs text-white/70">
                      {prefs.lineHeight.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Slider
                      label={t("read.lineHeight")}
                      value={prefs.lineHeight}
                      min={1.6}
                      max={2.6}
                      step={0.1}
                      onChange={(v) => setPrefs({ lineHeight: v })}
                    />
                  </div>
                </div>
              </Popover>
            )}

            {panel === "translation" && (
              <Popover title={t("read.translation")} onClose={() => setPanel(null)}>
                <label className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm text-white/80">
                    {t("read.showTranslation")}
                  </span>
                  <Toggle
                    label={t("read.showTranslation")}
                    checked={prefs.showTranslation}
                    onChange={(v) => setPrefs({ showTranslation: v })}
                  />
                </label>
                <label className="flex items-center justify-between gap-4 py-2">
                  <span className="text-sm text-white/80">
                    {t("read.showTransliteration")}
                  </span>
                  <Toggle
                    label={t("read.showTransliteration")}
                    checked={prefs.showTransliteration}
                    onChange={(v) => setPrefs({ showTransliteration: v })}
                  />
                </label>
                <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/45">
                  {TRANSLATOR_NAMES[locale]}
                </p>
              </Popover>
            )}

            {panel === "background" && (
              <Popover title={t("read.background")} onClose={() => setPanel(null)}>
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

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      {t("read.brightness")}
                    </span>
                    <span className="text-xs text-white/70">
                      {prefs.brightness}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <Slider
                      label={t("read.brightness")}
                      value={prefs.brightness}
                      min={30}
                      max={100}
                      onChange={(v) => setPrefs({ brightness: v })}
                    />
                  </div>
                </div>

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

            {panel === "audio" && (
              <Popover title={t("read.audio")} onClose={() => setPanel(null)}>
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
              </Popover>
            )}
          </div>
        )}

        {/* Pastki boshqaruv */}
        <footer
          className={[
            "px-8 pb-8 transition-opacity duration-500",
            controls ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-center gap-2 rounded-full">
            <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
              <CircleButton icon="arrowLeft" label="prev" onClick={prevAyah} />
              <CircleButton
                icon="back10"
                label="-10s"
                onClick={() => seek(-10)}
              />
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "pause" : "play"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-night-base transition hover:bg-brand"
              >
                <Icon name={playing ? "pause" : "play"} size={20} filled={!playing} />
              </button>
              <CircleButton
                icon="forward10"
                label="+10s"
                onClick={() => seek(10)}
              />
              <CircleButton icon="arrowRight" label="next" onClick={nextAyah} />
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-white/35">
            {t("read.fade")}
          </p>
        </footer>

        {/* Pastki chap — kayfiyat chipi (v2 C) */}
        <div className="fixed bottom-8 left-8 z-30">
          {panel === "mood" && (
            <div className="mb-3">
              <Popover title={t("compose.retune")} onClose={() => setPanel(null)}>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setCurrent({
                          mood: m.id,
                          startedAt: Date.now(),
                          index: 0,
                          done: false,
                        });
                        setAyahIdx(0);
                        setPanel(null);
                      }}
                      aria-pressed={m.id === current.mood}
                      className={[
                        "rounded-lg px-3 py-2 text-left text-xs transition",
                        m.id === current.mood
                          ? "bg-brand/25 font-semibold text-white"
                          : "bg-white/5 text-white/70 hover:bg-white/15",
                      ].join(" ")}
                    >
                      {ln(m.label)}
                    </button>
                  ))}
                </div>
              </Popover>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPanel(panel === "mood" ? null : "mood")}
            className={[
              "flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 text-xs text-white/85 backdrop-blur-md transition hover:bg-black/50",
              controls ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {ln(mood.label)}
            <span className="text-white/40">·</span>
            {t("reminder.min", { n: prefs.duration })}
            <Icon name="chevronDown" size={12} className="text-white/50" />
          </button>
        </div>

        {/* Progress */}
        <div className="fixed inset-x-0 bottom-0 h-1 bg-white/10">
          <div
            className="h-full bg-brand transition-[width] duration-300"
            style={{ width: `${Math.min(100, passageProgress * 100)}%` }}
          />
        </div>
      </div>
    </Stage>
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
