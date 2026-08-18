"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { usePassage } from "@/lib/usePassage";
import {
  FORMATS,
  SURAHS,
  TRANSLATOR_NAMES,
  getMood,
  passageRef,
  type Passage,
} from "@/lib/sakinah";

export default function ReminderPage() {
  const router = useRouter();
  const { t, ln, locale, prefs, current, setCurrent, ready } = useApp();
  const [preparing, setPreparing] = useState(true);

  useEffect(() => {
    if (ready && !current) router.replace("/sakinah");
  }, [ready, current, router]);

  useEffect(() => {
    const id = window.setTimeout(() => setPreparing(false), 2200);
    return () => window.clearTimeout(id);
  }, []);

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

  const mood = getMood(current.mood);
  const passages = mood.passages;
  const minutes = passages.reduce((s, p) => s + p.minutes, 0);
  const format = FORMATS.find((f) => f.id === prefs.format);

  function begin() {
    setCurrent({ ...current!, index: 0, done: false, startedAt: Date.now() });
    router.push("/sakinah/read");
  }

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
    >
      {preparing ? (
        /* S6 · Tayyorlanmoqda — kutish paytidagi duo */
        <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
            <span className="h-3 w-3 animate-ping rounded-full bg-brand" />
          </span>
          <p className="mt-8 text-lg font-medium text-white/90">
            {t("prep.title")}
          </p>
          <p className="arabic mt-6 font-arabic text-3xl text-white">
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <p className="mt-3 text-sm text-white/55">{t("prep.dua")}</p>
          <p className="mt-1 text-sm text-white/40">{t("prep.duaTr")}</p>
        </div>
      ) : (
        /* S7 · Sizning eslatmangiz */
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-8 py-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/sakinah")}
              className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white/85 transition hover:bg-white/20"
            >
              <Icon name="arrowLeft" size={16} />
              {t("nav.sakinah")}
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

          <header className="mt-12 text-center">
            <h1 className="text-[40px] font-semibold leading-tight tracking-tightest text-white">
              {ln(mood.title)}
            </h1>
            <p className="mt-3 text-sm text-white/55">
              {t("reminder.meta", {
                minutes,
                count: passages.length,
                format: format ? ln(format.label) : "",
              })}
            </p>
          </header>

          <ul className="mt-10 space-y-4">
            {passages.map((p, i) => (
              <PassageCard key={i} index={i + 1} passage={p} />
            ))}
          </ul>

          <p className="mt-10 text-center text-xs text-white/40">
            {t("reminder.footer", { translator: TRANSLATOR_NAMES[locale] })}
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 pb-10">
            <button
              type="button"
              onClick={begin}
              className="h-12 rounded-full bg-brand px-10 text-base font-semibold text-night-base transition hover:bg-brand-strong hover:text-white"
            >
              {t("reminder.begin")}
            </button>
            <button
              type="button"
              onClick={() => router.push("/sakinah")}
              className="text-sm text-white/55 transition hover:text-white"
            >
              {t("reminder.save")}
            </button>
          </div>
        </div>
      )}
    </Stage>
  );
}

function PassageCard({ index, passage }: { index: number; passage: Passage }) {
  const { t, ln, locale } = useApp();
  const { ayahs, loading, error } = usePassage(
    passage.surah,
    passage.from,
    passage.from, // kartada faqat birinchi oyat ko'rsatiladi
    locale
  );

  const excerpt = ayahs?.[0]?.translation ?? "";

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/25 text-sm font-semibold text-brand">
          {index}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-base font-semibold text-white">
              {passageRef(passage)}
            </h2>
            <span className="arabic font-arabic text-sm text-white/45">
              {SURAHS[passage.surah].arabic}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-white/75">
            {loading && t("common.loading")}
            {error && t("common.error")}
            {excerpt && `“${excerpt}”`}
          </p>

          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-white/45">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
            {ln(passage.note)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <span className="text-xs text-white/45">
            {t("reminder.min", { n: passage.minutes })}
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80"
            aria-hidden="true"
          >
            <Icon name="play" size={14} filled />
          </span>
        </div>
      </div>
    </li>
  );
}
