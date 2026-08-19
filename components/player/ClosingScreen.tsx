"use client";

import { useState } from "react";
import { AyahText } from "@/components/player/AyahText";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { SURAHS } from "@/lib/sakinah";
import { ARABIC_SIZES } from "@/lib/session";

/**
 * Sessiya yakuni. Gamifikatsiya emas — sokin yopilish.
 * Asosiy harakat «Shu bilan qolish»: oxirgi oyat jim ekranda qoladi.
 */
export function ClosingScreen({
  minutes,
  onContinue,
  onEnd,
}: {
  minutes: number;
  onContinue: () => void;
  onEnd: () => void;
}) {
  const { t, prefs, isSaved, toggleSaved } = useApp();
  const player = usePlayer();
  const [sitting, setSitting] = useState(false);

  const ayah = player.ayah;
  const track = player.track;
  const fontPx = ARABIC_SIZES[Math.min(prefs.fontSize, ARABIC_SIZES.length) - 1];
  const saved = track ? isSaved(track.surah, track.ayah) : false;

  /* ——— «Shu bilan qolish» — hech narsa raqobatlashmaydi ——— */
  if (sitting) {
    const name = track
      ? SURAHS[track.surah]?.slug ??
        player.chapters.find((c) => c.id === track.surah)?.slug ??
        ""
      : "";

    return (
      <div className="anim-fade-in fixed inset-0 z-40 flex flex-col bg-night-base/95 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setSitting(false)}
          aria-label={t("common.close")}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white/70"
        >
          <Icon name="close" size={17} />
        </button>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          {ayah && (
            <>
              <AyahText
                ayah={ayah}
                active={false}
                wordIndex={-1}
                fontPx={fontPx}
              />
              {prefs.showTranslation && ayah.translation && (
                <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/50">
                  {ayah.translation}
                </p>
              )}
              <p className="mt-8 text-[11px] tracking-wide text-white/20">
                {name} {ayah.surah}:{ayah.ayah}
              </p>
            </>
          )}

          {/* Yagona boshqaruv — takror tinglash */}
          <button
            type="button"
            onClick={player.toggle}
            aria-label={player.playing ? "pause" : "play"}
            className="mt-12 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/40 transition hover:border-white/30 hover:text-white/80"
          >
            <Icon
              name={player.playing ? "pause" : "play"}
              size={16}
              filled={!player.playing}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fade-in fixed inset-0 z-40 flex items-center justify-center bg-night-base/80 p-6 backdrop-blur-md">
      <div className="anim-pop w-full max-w-lg text-center">
        <span className="tone-border mx-auto flex h-14 w-14 items-center justify-center rounded-full border">
          <Icon name="check" size={18} className="tone-text" />
        </span>

        <p className="mt-8 text-xl leading-relaxed text-white sm:text-2xl">
          {t("close.spent", { minutes })}
        </p>
        <p className="mt-3 text-sm text-white/50">{t("close.may")}</p>

        {/* Asosiy harakat — boshqalari bilan raqobatlashmaydi */}
        <button
          type="button"
          onClick={() => setSitting(true)}
          className="tone-bg mt-10 h-14 w-full rounded-2xl text-base font-semibold text-night-base transition hover:brightness-110 active:scale-[0.98]"
        >
          {t("close.sit")}
          <span className="mt-0.5 block text-[11px] font-normal opacity-70">
            {t("close.sitHint")}
          </span>
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <Quiet onClick={onContinue}>{t("close.continue")}</Quiet>
          <Quiet
            onClick={() => track && toggleSaved(track.surah, track.ayah)}
          >
            {saved ? t("complete.saved") : t("close.save")}
          </Quiet>
          <Quiet onClick={onEnd}>{t("close.done")}</Quiet>
        </div>
      </div>
    </div>
  );
}

function Quiet({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white/45 underline-offset-4 transition hover:text-white hover:underline"
    >
      {children}
    </button>
  );
}
