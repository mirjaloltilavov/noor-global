"use client";

import { useEffect, useRef, useState } from "react";
import { AyahText } from "@/components/player/AyahText";
import { usePlayer } from "@/components/player/PlayerProvider";
import { JournalModal } from "@/components/player/JournalModal";
import { SettingsRail } from "@/components/player/SettingsRail";
import { useApp } from "@/components/providers/AppProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { BISMILLAH_TEXT } from "@/lib/queue";
import { SURAHS } from "@/lib/sakinah";
import { ARABIC_SIZES, RATES, formatClock } from "@/lib/session";

const SLEEP_OPTIONS = [0, 15, 30, 45, 60];

/**
 * Qur'on pleyeri — Figmadagi «Majlis — Ambient Session» asosida.
 * Chapda yig'iladigan oyatlar jadvali, markazda oldingi/joriy/keyingi oyat,
 * pastda to'liq sura bo'yicha progress va boshqaruv, o'ngda sozlamalar.
 */
export function MajlisView({ onOpenSurahs }: { onOpenSurahs: () => void }) {
  const { t, prefs, setPrefs, isSaved, toggleSaved } = useApp();
  const player = usePlayer();
  const { segment, track, ayah, ayahs, cursor } = player;

  const [listOpen, setListOpen] = useState(true);
  const [journalOpen, setJournalOpen] = useState(false);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [track?.ayah]);

  if (!segment || !track) return null;

  const surahName =
    SURAHS[segment.surah]?.slug ??
    player.chapters.find((c) => c.id === segment.surah)?.slug ??
    "";
  const verses =
    SURAHS[segment.surah]?.verses ??
    player.chapters.find((c) => c.id === segment.surah)?.verses ??
    0;

  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];
  const clipProgress =
    player.clipLength > 0 ? player.elapsed / player.clipLength : 0;

  // Progress butun sura bo'yicha
  const surahProgress =
    player.tracks.length > 0
      ? (player.cursor.pos + clipProgress) / player.tracks.length
      : 0;

  const saved = isSaved(track.surah, track.ayah);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 gap-4 px-4 pb-2 sm:px-6">
        {/* ——— Chap: oyatlar jadvali (yig'iladi) ——— */}
        <aside
          className={[
            "hidden shrink-0 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-sm transition-all duration-300 lg:flex",
            listOpen ? "w-[280px] p-4" : "w-[56px] items-center p-2",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-label={listOpen ? t("player.collapse") : t("player.expand")}
            title={listOpen ? t("player.collapse") : t("player.expand")}
            className={[
              "flex h-9 items-center gap-2 rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95",
              listOpen ? "w-full px-2" : "w-9 justify-center",
            ].join(" ")}
          >
            <Icon name="list" size={17} />
            {listOpen && (
              <span className="min-w-0 truncate text-sm font-semibold text-white">
                {surahName} · {verses}
              </span>
            )}
          </button>

          {listOpen && (
            <ol className="sk-scroll mt-3 min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
              {(ayahs ?? []).map((a) => {
                const active = a.ayah === track.ayah;
                return (
                  <li key={a.key}>
                    <button
                      type="button"
                      onClick={() =>
                        player.jumpToAyah(
                          player.tracks.findIndex(
                            (x) => x.surah === a.surah && x.ayah === a.ayah
                          )
                        )
                      }
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
                          "w-6 shrink-0 text-xs tabular-nums",
                          active ? "font-semibold text-white" : "text-white/40",
                        ].join(" ")}
                      >
                        {a.ayah}
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
          )}
        </aside>

        {/* ——— Markaz: oldingi · joriy · keyingi ——— */}
        <div className="sk-scroll min-w-0 flex-1 overflow-y-auto px-1 pr-4">
          <div className="flex min-h-full flex-col justify-center py-6 text-center">
          {cursor.bismillah && (
            <p
              className="arabic anim-fade-in py-10 text-center font-arabic text-white"
              style={{ fontSize: `${Math.round(fontPx * 0.8)}px` }}
            >
              {BISMILLAH_TEXT}
            </p>
          )}

          {(ayahs ?? []).map((a) => {
            const active = a.ayah === track.ayah && !cursor.bismillah;
            const distance = a.ayah - track.ayah;
            // Oldingi (o'qilgan) — xiralashmaydi, keyingisi — biroz xira
            const opacity =
              active || distance === -1 ? 1 : distance === 1 ? 0.4 : 0;

            return (
              <div
                key={a.key}
                ref={active ? activeRef : undefined}
                aria-hidden={opacity === 0}
                className="transition-all duration-500"
                style={{
                  opacity,
                  height: opacity === 0 ? 0 : undefined,
                  overflow: opacity === 0 ? "hidden" : undefined,
                  paddingTop: opacity === 0 ? 0 : 16,
                  paddingBottom: opacity === 0 ? 0 : 16,
                }}
              >
                {active && (
                  <span className="tone-bg-soft tone-text mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
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
                      <p className="mx-auto mt-4 max-w-3xl text-center text-sm italic text-white/45">
                        {a.transliteration}
                      </p>
                    )}
                    {prefs.showTranslation && a.translation && (
                      <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-white/80">
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
      </div>

      {/* ——— Pastki boshqaruv ——— */}
      <div className="px-4 pb-4 sm:px-6">
        <div className="rounded-2xl border border-white/[0.07] bg-black/30 px-4 py-3 backdrop-blur-md">
          {/* To'liq sura progressi */}
          <div className="flex items-center gap-3">
            <span className="w-11 shrink-0 text-right text-[11px] tabular-nums text-white/50">
              {formatClock(player.elapsed)}
            </span>

            <button
              type="button"
              aria-label="seek"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                player.seekTo((e.clientX - r.left) / r.width);
              }}
              className="group relative h-4 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
              <span
                className="tone-bg absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
                style={{ width: `${Math.min(100, surahProgress * 100)}%` }}
              />
              <span
                className="tone-bg absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `${Math.min(100, surahProgress * 100)}%` }}
              />
            </button>

            <span className="w-16 shrink-0 text-[11px] tabular-nums text-white/50">
              {t("player.surahProgress", {
                done: track.ayah,
                total: verses || segment.to,
              })}
            </span>
          </div>

          {/* Tugmalar */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Pill
              onClick={() =>
                setPrefs({
                  rate: RATES[(RATES.indexOf(prefs.rate) + 1) % RATES.length],
                })
              }
              label={t("majlis.speed")}
            >
              {prefs.rate}x
            </Pill>

            <RoundButton
              icon="arrowLeft"
              label="prev"
              onClick={player.prev}
            />
            <RoundButton
              icon="back10"
              label="-10"
              onClick={() => player.seekBy(-10)}
            />
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
            <RoundButton
              icon="forward10"
              label="+10"
              onClick={() => player.seekBy(10)}
            />
            <RoundButton icon="arrowRight" label="next" onClick={player.next} />

            <Pill
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
              label={t("player.repeat")}
              active={prefs.repeat !== "off"}
            >
              {t(`player.repeat.${prefs.repeat}`)}
            </Pill>

            <Pill
              onClick={() =>
                player.setSleepMinutes(
                  SLEEP_OPTIONS[
                    (SLEEP_OPTIONS.indexOf(player.sleepMinutes) + 1) %
                      SLEEP_OPTIONS.length
                  ]
                )
              }
              label={t("majlis.sleep")}
              active={player.sleepMinutes > 0}
            >
              {player.sleepMinutes === 0
                ? t("majlis.sleepOff")
                : formatClock(player.sleepLeft)}
            </Pill>

            <button
              type="button"
              onClick={() => toggleSaved(track.surah, track.ayah)}
              aria-label={saved ? t("saved.remove") : t("saved.add")}
              title={saved ? t("saved.remove") : t("saved.add")}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90",
                saved ? "tone-bg-soft tone-text" : "text-white/70 hover:bg-white/10",
              ].join(" ")}
            >
              <Icon name="bookmark" size={17} filled={saved} />
            </button>

            <label className="ml-1 flex items-center gap-2">
              <Icon name="headphones" size={15} className="text-white/45" />
              <span className="sr-only">{t("majlis.volume")}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(player.volume * 100)}
                onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
                className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/20 accent-[color:var(--sk-accent)]"
              />
            </label>
          </div>
        </div>
      </div>

      <SettingsRail
        extra={[
          { icon: "quran", label: t("player.surahs"), onClick: onOpenSurahs },
          {
            icon: "notepad",
            label: t("journal.title"),
            onClick: () => setJournalOpen(true),
          },
        ]}
      />

      {journalOpen && <JournalModal onClose={() => setJournalOpen(false)} />}
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
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white active:scale-90"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function Pill({
  children,
  onClick,
  label,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "h-9 rounded-full px-3 text-xs font-semibold transition active:scale-95",
        active
          ? "tone-bg-soft tone-text"
          : "bg-white/10 text-white/65 hover:bg-white/20",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
