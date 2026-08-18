"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import {
  DURATIONS,
  DURATION_ARABIC,
  DURATION_LABELS,
  DURATION_SUB,
  FORMATS,
  INTENTIONS,
  MOODS,
  getReciter,
  type Duration,
  type MoodId,
} from "@/lib/sakinah";

const STEPS = 4;
const PREPARE_MS = 2200;
/** «Boshlash» bosilgach yorug'lik ochilishi */
const BLOOM_MS = 1500;

/**
 * Figmadagi Sakinah onboardingi (S2–S6): to'rtta ketma-ket savol,
 * tepada to'rt bo'lakli progress, so'ng «tayyorlanmoqda» ekrani.
 */
export function OnboardingFlow({
  initialMood,
  onBegin,
  onClose,
}: {
  initialMood: MoodId | null;
  onBegin: (mood: MoodId) => void;
  onClose: () => void;
}) {
  const { t, ln, prefs, setPrefs } = useApp();

  // -1 — yorug'lik ochilishi, 0..3 — savollar, 4 — tayyorlanish
  const [step, setStep] = useState(-1);
  const [mood, setMood] = useState<MoodId>(initialMood ?? "anxious");

  // Yorug'lik tugagach birinchi savol
  useEffect(() => {
    if (step !== -1) return;
    const id = window.setTimeout(() => setStep(0), BLOOM_MS);
    return () => window.clearTimeout(id);
  }, [step]);

  // Oxirgi qadam — tayyorlanish, so'ng tilovat boshlanadi.
  // onBegin/mood ref orqali o'qiladi, aks holda har renderda taymer tiklanadi.
  const beginRef = useRef(onBegin);
  const moodRef = useRef(mood);
  beginRef.current = onBegin;
  moodRef.current = mood;

  useEffect(() => {
    if (step !== STEPS) return;
    const id = window.setTimeout(() => beginRef.current(moodRef.current), PREPARE_MS);
    return () => window.clearTimeout(id);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const back = () => (step <= 0 ? onClose() : setStep((s) => s - 1));
  const forward = () => setStep((s) => s + 1);

  return (
    <div className="fixed inset-0 z-50">
      <Stage
        background={prefs.background}
        brightness={prefs.brightness}
        reduceMotion={prefs.reduceMotion}
      >
        <div className="flex h-screen flex-col">
          {step === -1 && <Bloom />}

          {/* Yuqori qator */}
          <header
            className={[
              "flex items-center gap-4 px-4 py-5 transition-opacity duration-500 sm:px-8",
              step === -1 ? "opacity-0" : "opacity-100",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={back}
              className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-white/10 pl-2.5 pr-4 text-sm text-white/85 transition hover:bg-white/20 active:scale-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <Icon name="arrowLeft" size={15} />
              </span>
              <span className="hidden sm:inline">{t("nav.sakinah")}</span>
            </button>

            <div className="flex flex-1 items-center justify-center gap-1.5">
              {Array.from({ length: STEPS }).map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] w-8 overflow-hidden rounded-full bg-white/15 sm:w-12"
                >
                  <span
                    className="tone-bg block h-full rounded-full transition-all duration-500"
                    style={{ width: step >= 0 && i <= step ? "100%" : "0%" }}
                  />
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 active:scale-95"
            >
              <Icon name="close" size={18} />
            </button>
          </header>

          {step === STEPS ? (
            <Preparing />
          ) : (
            <div
              key={step}
              className="sk-scroll anim-fade-up flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-8"
            >
              {step === 0 && (
                <Question
                  title={t("q.mood.title")}
                  sub={t("q.mood.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
                  onSkip={forward}
                  footer={t("q.mood.footer")}
                  columns={3}
                >
                  {MOODS.map((m) => (
                    <Card
                      key={m.id}
                      title={ln(m.label)}
                      arabic={m.arabic}
                      selected={mood === m.id}
                      onClick={() => setMood(m.id)}
                    />
                  ))}
                </Question>
              )}

              {step === 1 && (
                <Question
                  title={t("q.intention.title")}
                  sub={t("q.intention.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
                  onSkip={forward}
                  columns={3}
                >
                  {INTENTIONS.map((i) => (
                    <Card
                      key={i.id}
                      title={ln(i.label)}
                      arabic={i.arabic}
                      selected={prefs.intention === i.id}
                      onClick={() => setPrefs({ intention: i.id })}
                    />
                  ))}
                </Question>
              )}

              {step === 2 && (
                <Question
                  title={t("q.time.title")}
                  sub={t("q.time.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
                  onSkip={forward}
                  columns={2}
                >
                  {DURATIONS.map((d) => (
                    <Card
                      key={d}
                      title={ln(DURATION_LABELS[d as Duration])}
                      sub={ln(DURATION_SUB[d as Duration])}
                      arabic={DURATION_ARABIC[d as Duration]}
                      selected={prefs.duration === d}
                      onClick={() => setPrefs({ duration: d as Duration })}
                    />
                  ))}
                </Question>
              )}

              {step === 3 && (
                <Question
                  title={t("q.format.title")}
                  sub={t("q.format.sub")}
                  cta={t("q.prepare")}
                  onNext={forward}
                  onSkip={forward}
                  footer={t("q.format.footer", {
                    reciter: getReciter(prefs.reciter).name,
                  })}
                  columns={2}
                >
                  {FORMATS.map((f) => (
                    <Card
                      key={f.id}
                      title={ln(f.label)}
                      sub={ln(f.sub)}
                      arabic={f.arabic}
                      selected={prefs.format === f.id}
                      onClick={() => setPrefs({ format: f.id })}
                    />
                  ))}
                </Question>
              )}
            </div>
          )}
        </div>
      </Stage>
    </div>
  );
}

/* ——————————————————————————————————————————————————————— */

function Question({
  title,
  sub,
  cta,
  onNext,
  onSkip,
  footer,
  columns,
  children,
}: {
  title: string;
  sub: string;
  cta: string;
  onNext: () => void;
  onSkip: () => void;
  footer?: string;
  columns: 2 | 3;
  children: React.ReactNode;
}) {
  const { t } = useApp();

  const grid =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full max-w-4xl text-center">
      <h1 className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[46px]">
        {title}
      </h1>
      <p className="mt-3 text-sm text-white/55">{sub}</p>

      <div className={`anim-stagger mt-9 grid gap-3 ${grid}`}>{children}</div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onNext}
          className="tone-bg h-12 rounded-full px-10 text-base font-semibold text-night-base transition hover:brightness-110 active:scale-95"
        >
          {cta}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-white/45 transition hover:text-white/80"
        >
          {t("q.skip")}
        </button>
      </div>

      {footer && (
        <p className="mt-10 text-[11px] leading-relaxed text-white/30">
          {footer}
        </p>
      )}
    </div>
  );
}

function Card({
  title,
  sub,
  arabic,
  selected,
  onClick,
}: {
  title: string;
  sub?: string;
  arabic: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "relative flex min-h-[92px] flex-col justify-center rounded-2xl border px-5 py-4 text-left transition duration-200",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        selected
          ? "tone-border tone-bg-soft"
          : "border-white/[0.09] bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-base font-semibold text-white">{title}</span>
        <span
          className="arabic shrink-0 font-arabic text-lg text-white/35"
          aria-hidden="true"
        >
          {arabic}
        </span>
      </span>

      {sub && (
        <span className="mt-1 text-xs text-white/45">{sub}</span>
      )}

      {selected && (
        <span className="tone-bg anim-fade-in absolute bottom-3 left-5 h-1.5 w-1.5 rounded-full" />
      )}
    </button>
  );
}

/** «Boshlash» bosilgach — yorug'lik ochilishi */
function Bloom() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="sk-bloom-rays absolute h-[140vmax] w-[140vmax] rounded-full" />
      <span className="sk-bloom-core absolute h-[70vmax] w-[70vmax] rounded-full" />
    </div>
  );
}

/** S6 · Tayyorlanmoqda */
function Preparing() {
  const { t } = useApp();

  return (
    <div className="anim-fade-in flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center">
        <span className="tone-bg-soft anim-breathe absolute inset-0 rounded-full" />
        <span className="tone-bg relative h-3 w-3 rounded-full" />
      </span>

      <p className="mt-8 text-lg font-medium text-white/90">{t("prep.title")}</p>

      <p className="arabic mt-8 font-arabic text-3xl text-white sm:text-4xl">
        رَبِّ زِدْنِي عِلْمًا
      </p>
      <p className="mt-3 text-sm text-white/55">{t("prep.dua")}</p>
      <p className="mt-1 text-sm text-white/40">{t("prep.duaTr")}</p>
    </div>
  );
}
