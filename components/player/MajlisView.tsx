"use client";

import { useEffect, useRef, useState } from "react";
import { AyahText } from "@/components/player/AyahText";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { BISMILLAH_TEXT, totalMinutes } from "@/lib/queue";
import { SURAHS, getReciter } from "@/lib/sakinah";
import { ARABIC_SIZES, formatClock } from "@/lib/session";

const SLEEP_OPTIONS = [0, 15, 30, 45, 60];

/**
 * Figmadagi «Player / Majlis — Ambient Session» (Concept B):
 * chapda sessiya ro'yxati, markazda oyatlar, o'ngda qori va so'zma-so'z,
 * pastda oyatlarga bo'lingan vaqt chizig'i.
 */
export function MajlisView({ onEditSession }: { onEditSession: () => void }) {
  const { t, ln, prefs, setPrefs } = useApp();
  const player = usePlayer();
  const { segment, track, ayah, ayahs, cursor } = player;

  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const centerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Joriy oyatni ko'rinishda ushlab turamiz
  useEffect(() => {
    if (!autoScroll || !activeRef.current) return;
    activeRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [track?.ayah, autoScroll]);

  if (!segment || !track) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-white/50">{t("player.empty")}</p>
      </div>
    );
  }

  const surahName =
    SURAHS[segment.surah]?.slug ??
    player.chapters.find((c) => c.id === segment.surah)?.slug ??
    "";
  const reciter = getReciter(prefs.reciter);
  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];

  const clipProgress =
    player.clipLength > 0 ? player.elapsed / player.clipLength : 0;
  const remaining = Math.max(0, player.clipLength - player.elapsed);

  async function shareAyah() {
    if (!ayah) return;
    try {
      await navigator.clipboard.writeText(
        `${ayah.uthmani}\n\n${ayah.translation}\n— ${surahName} ${ayah.surah}:${ayah.ayah}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard yo'q bo'lsa jim o'tamiz */
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 gap-4 px-4 pb-2 sm:px-6 xl:gap-5">
        {/* ——— Chap: sessiya ro'yxati ——— */}
        <aside className="hidden w-[280px] shrink-0 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 backdrop-blur-sm lg:flex">
          <p className="text-[10px] font-semibold tracking-widest text-white/35">
            {t("majlis.session")}
          </p>
          <h2 className="mt-1 text-base font-semibold text-white">
            {surahName} {segment.surah}:{segment.from}
            {segment.to !== segment.from && ` – ${segment.to}`}
          </h2>

          <ol className="sk-scroll mt-4 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
            {(ayahs ?? []).map((a) => {
              const active = a.ayah === track.ayah;
              return (
                <li key={a.key}>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = player.tracks.findIndex(
                        (x) => x.surah === a.surah && x.ayah === a.ayah
                      );
                      player.jumpToAyah(idx);
                    }}
                    className={[
                      "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition",
                      active ? "bg-white/[0.09]" : "hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    {active && (
                      <span className="tone-bg absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full" />
                    )}
                    <span
                      className={[
                        "w-9 shrink-0 text-xs tabular-nums",
                        active ? "font-semibold text-white" : "text-white/40",
                      ].join(" ")}
                    >
                      {a.surah}:{a.ayah}
                    </span>
                    <span
                      className="arabic min-w-0 flex-1 truncate text-right font-arabic text-sm text-white/55"
                      dir="rtl"
                    >
                      {a.words
                        .slice(0, 2)
                        .map((w) => w.uthmani)
                        .join(" ")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                {t("majlis.round", {
                  i: player.segIndex + 1,
                  n: player.segments.length,
                })}
              </span>
              <span className="text-white/45">
                {t("majlis.left", {
                  n: Math.max(
                    0,
                    totalMinutes(player.segments.slice(player.segIndex))
                  ),
                })}
              </span>
            </div>

            <div className="mt-2 flex gap-1.5">
              {player.segments.slice(0, 8).map((_, i) => (
                <span
                  key={i}
                  className={[
                    "h-1 flex-1 rounded-full",
                    i <= player.segIndex ? "tone-bg" : "bg-white/15",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onEditSession}
              className="mt-4 h-10 w-full rounded-xl bg-white/[0.07] text-sm font-medium text-white/85 transition hover:bg-white/15 active:scale-95"
            >
              {t("majlis.edit")}
            </button>
          </div>
        </aside>

        {/* ——— Markaz: oyatlar ——— */}
        <div className="flex min-w-0 flex-1 flex-col">
          <button
            type="button"
            onClick={() => setAutoScroll((v) => !v)}
            aria-pressed={autoScroll}
            className="mb-2 inline-flex h-8 w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 text-[11px] text-white/70 transition hover:bg-white/10"
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                autoScroll ? "tone-bg" : "bg-white/30",
              ].join(" ")}
            />
            {t("majlis.autoscroll")}
          </button>

          <div
            ref={centerRef}
            className="sk-scroll min-h-0 flex-1 overflow-y-auto pb-6 pl-1 pr-4"
          >
            {cursor.bismillah && (
              <p
                className="arabic anim-fade-in py-8 text-center font-arabic text-white"
                style={{ fontSize: `${Math.round(fontPx * 0.8)}px` }}
              >
                {BISMILLAH_TEXT}
              </p>
            )}

            {(ayahs ?? []).map((a) => {
              const active = a.ayah === track.ayah && !cursor.bismillah;
              return (
                <div
                  key={a.key}
                  ref={active ? activeRef : undefined}
                  className={[
                    "py-4 transition-opacity duration-500",
                    active ? "opacity-100" : "opacity-35",
                  ].join(" ")}
                >
                  {active && (
                    <span className="tone-bg-soft tone-text mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
                      <span className="tone-bg h-1.5 w-1.5 rounded-full" />
                      {a.surah}:{a.ayah}
                    </span>
                  )}

                  <AyahText
                    ayah={a}
                    active={active}
                    wordIndex={player.wordIndex}
                    fontPx={fontPx}
                  />

                  {active && (
                    <>
                      {prefs.showTransliteration && a.transliteration && (
                        <p className="mt-3 text-sm italic text-white/45">
                          {a.transliteration}
                        </p>
                      )}
                      {prefs.showTranslation && a.translation && (
                        <p className="mt-3 text-base leading-relaxed text-white/80">
                          {a.translation}
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ——— O'ng: qori va so'zma-so'z ——— */}
        <aside className="hidden w-[250px] shrink-0 flex-col gap-4 xl:flex">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 text-center backdrop-blur-sm">
            <span className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white/[0.07] text-2xl font-semibold text-white/70">
              {reciter.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </span>

            <p className="mt-3 text-sm font-semibold text-white">
              {reciter.name}
            </p>
            <p className="text-[11px] text-white/45">
              {ln(reciter.style)} · {ln(reciter.place)}
            </p>

          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-2 backdrop-blur-sm">
            <Row
              icon="back10"
              label={t("majlis.speed")}
              value={`${prefs.rate}x`}
              onClick={() => {
                const rates = [0.75, 1, 1.25, 1.5, 2];
                setPrefs({
                  rate: rates[(rates.indexOf(prefs.rate) + 1) % rates.length],
                });
              }}
            />
            <Row
              icon="sun"
              label={t("majlis.sleep")}
              value={
                player.sleepMinutes === 0
                  ? t("majlis.sleepOff")
                  : formatClock(player.sleepLeft)
              }
              onClick={() => {
                const i = SLEEP_OPTIONS.indexOf(player.sleepMinutes);
                player.setSleepMinutes(
                  SLEEP_OPTIONS[(i + 1) % SLEEP_OPTIONS.length]
                );
              }}
            />
            <Row
              icon="share"
              label={copied ? t("complete.copied") : t("majlis.share")}
              onClick={shareAyah}
            />
          </div>
        </aside>
      </div>

      {/* ——— Pastki chiziq ——— */}
      <div className="px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/30 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => player.seekBy(-10)}
            aria-label="-10"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 active:scale-90"
          >
            <Icon name="back10" size={18} />
          </button>

          <button
            type="button"
            onClick={player.toggle}
            aria-label={player.playing ? "pause" : "play"}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-night-base transition hover:brightness-90 active:scale-90"
          >
            <Icon
              name={player.playing ? "pause" : "play"}
              size={18}
              filled={!player.playing}
            />
          </button>

          <button
            type="button"
            onClick={() => player.seekBy(10)}
            aria-label="+10"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 active:scale-90"
          >
            <Icon name="forward10" size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              setPrefs({
                repeat:
                  prefs.repeat === "off"
                    ? "ayah"
                    : prefs.repeat === "ayah"
                      ? "segment"
                      : "off",
              })
            }
            aria-label={t("player.repeat")}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90",
              prefs.repeat === "off"
                ? "text-white/60 hover:bg-white/10"
                : "tone-bg-soft tone-text",
            ].join(" ")}
          >
            <Icon name="back10" size={17} />
          </button>

          <span className="text-xs tabular-nums text-white/60">
            {formatClock(player.elapsed)}
          </span>

          {/* Bitta silliq progress chizig'i */}
          <button
            type="button"
            aria-label="seek"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              player.seekTo((e.clientX - r.left) / r.width);
            }}
            className="group relative h-4 min-w-[160px] flex-1"
          >
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
            <span
              className="tone-bg absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
              style={{ width: `${Math.min(100, clipProgress * 100)}%` }}
            />
            <span
              className="tone-bg absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              style={{ left: `${Math.min(100, clipProgress * 100)}%` }}
            />
          </button>

          <span className="text-xs tabular-nums text-white/60">
            −{formatClock(remaining)}
          </span>

          <label className="flex items-center gap-2">
            <Icon name="headphones" size={16} className="text-white/55" />
            <span className="sr-only">{t("majlis.volume")}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(player.volume * 100)}
              onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-[color:var(--sk-accent)]"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  onClick,
}: {
  icon: "back10" | "sun" | "share";
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.07] active:scale-[0.98]"
    >
      <Icon name={icon} size={16} className="shrink-0 text-white/55" />
      <span className="min-w-0 flex-1 truncate text-sm text-white/85">
        {label}
      </span>
      {value && (
        <span className="shrink-0 text-xs text-white/45">{value}</span>
      )}
    </button>
  );
}
