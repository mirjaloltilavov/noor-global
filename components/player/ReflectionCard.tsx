"use client";

import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { SURAHS } from "@/lib/sakinah";

/**
 * «Tinglash + o'ylash» — parcha tugagach tilovat sekin to'xtaydi va
 * o'qilgan oyat ustida qisqa to'xtash taklif qilinadi.
 * Yozilgani Qur'on kundaligiga tushadi.
 */
export function ReflectionCard() {
  const { t, prefs, vibe, addJournal } = useApp();
  const player = usePlayer();
  const [note, setNote] = useState("");

  const track = player.track;
  const ayah = player.ayah;
  if (!track) return null;

  const name =
    SURAHS[track.surah]?.slug ??
    player.chapters.find((c) => c.id === track.surah)?.slug ??
    "";

  function done(save: boolean) {
    if (save && note.trim() && track) {
      addJournal({
        surah: track.surah,
        ayah: track.ayah,
        note: note.trim(),
        mood: vibe?.mood,
      });
    }
    setNote("");
    player.resumeAfterReflection();
  }

  return (
    <div className="anim-fade-in fixed inset-0 z-40 flex items-center justify-center bg-night-base/85 p-5 backdrop-blur-md">
      <div className="anim-pop w-full max-w-xl">
        <p className="text-center text-xs uppercase tracking-widest text-white/35">
          {t("reflect.pause")}
        </p>

        {ayah && (
          <p
            className="arabic mt-6 text-center font-arabic leading-relaxed text-white"
            style={{ fontSize: "clamp(20px,4.5vw,30px)" }}
            dir="rtl"
          >
            {prefs.script === "indopak" ? ayah.indopak : ayah.uthmani}
          </p>
        )}

        {ayah?.translation && (
          <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-white/55">
            {ayah.translation}
          </p>
        )}

        <p className="mt-2 text-center text-[11px] text-white/25">
          {name} {track.surah}:{track.ayah}
        </p>

        <p className="mt-8 text-center text-base text-white/80">
          {t("reflect.question")}
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={t("reflect.placeholder")}
          className="sk-scroll mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-[color:var(--sk-accent)]"
        />

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => done(true)}
            className="tone-bg h-12 w-full rounded-2xl text-sm font-semibold text-night-base transition hover:brightness-110 active:scale-[0.98]"
          >
            {note.trim() ? t("reflect.saveAndGo") : t("reflect.continue")}
          </button>
          <button
            type="button"
            onClick={() => done(false)}
            className="text-xs text-white/40 underline-offset-4 transition hover:text-white hover:underline"
          >
            {t("reflect.skip")}
          </button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-white/25">
          <Icon name="notepad" size={12} />
          {t("reflect.private")}
        </p>
      </div>
    </div>
  );
}
