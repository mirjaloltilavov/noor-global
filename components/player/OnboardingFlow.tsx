"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { planSegments, totalMinutes } from "@/lib/queue";
import {
  DURATIONS,
  DURATION_ARABIC,
  DURATION_LABELS,
  DURATION_SUB,
  FORMATS,
  INTENTIONS,
  MOODS,
  RECITERS,
  STAGE_LABEL,
  STAGE_SUB,
  getMood,
  type Duration,
  THEME_LABEL,
  passageRef,
  type MoodId,
  type Passage,
} from "@/lib/sakinah";
import { matchIntent } from "@/lib/intent";

/** Savollar: qalb → niyat → qanday → vaqt → ovoz */
const STEPS = 5;
const BLOOM_MS = 1500;
/** Har tayyorlash qadami */
const PREP_STEP_MS = 700;

type Phase = "bloom" | "questions" | "preparing" | "why";

export function OnboardingFlow({
  initialMood,
  onBegin,
  onClose,
}: {
  initialMood: MoodId | null;
  onBegin: (mood: MoodId, lead?: Passage | null) => void;
  onClose: () => void;
}) {
  const { t, ln, prefs, setPrefs } = useApp();

  const [phase, setPhase] = useState<Phase>("bloom");
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<MoodId>(initialMood ?? "anxious");
  // Erkin matn orqali tanlangan parcha — sayohat shundan boshlanadi
  const [lead, setLead] = useState<Passage | null>(null);

  useEffect(() => {
    if (phase !== "bloom") return;
    const id = window.setTimeout(() => setPhase("questions"), BLOOM_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const back = () => {
    if (phase === "why") return setPhase("questions");
    if (step <= 0) return onClose();
    setStep((v) => v - 1);
  };

  const forward = () => {
    if (step + 1 >= STEPS) setPhase("preparing");
    else setStep((v) => v + 1);
  };

  return (
    <div className="fixed inset-0 z-50">
      <Stage
        background={prefs.background}
        brightness={prefs.brightness}
        reduceMotion={prefs.reduceMotion}
      >
        <div className="flex h-screen flex-col">
          {phase === "bloom" && <Bloom />}

          <header
            className={[
              "flex shrink-0 items-center gap-4 px-4 py-5 transition-opacity duration-500 sm:px-8",
              phase === "bloom" ? "opacity-0" : "opacity-100",
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
                  className="h-[3px] w-7 overflow-hidden rounded-full bg-white/15 sm:w-10"
                >
                  <span
                    className="tone-bg block h-full rounded-full transition-all duration-500"
                    style={{
                      width:
                        phase === "questions"
                          ? i <= step
                            ? "100%"
                            : "0%"
                          : phase === "bloom"
                            ? "0%"
                            : "100%",
                    }}
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

          {phase === "preparing" && (
            <Preparing onDone={() => setPhase("why")} />
          )}

          {phase === "why" && (
            <WhyThis mood={mood} onBegin={() => onBegin(mood, lead)} />
          )}

          {phase === "questions" && (
            <div
              key={step}
              className="sk-scroll anim-fade-up flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-8"
            >
              {step === 0 && (
                <Question
                  title={t("q.mood.title")}
                  sub={t("q.mood.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
                  footer={t("q.mood.footer")}
                  extra={
                    <AskFreely
                      lead={lead}
                      onPick={(p, m) => {
                        setLead(p);
                        setMood(m);
                      }}
                      onClear={() => setLead(null)}
                    />
                  }
                >
                  {MOODS.map((m) => (
                    <Card
                      key={m.id}
                      title={ln(m.label)}
                      arabic={m.arabic}
                      selected={mood === m.id}
                      onClick={() => {
                        setMood(m.id);
                        setLead(null);
                      }}
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
                >
                  {INTENTIONS.map((x) => (
                    <Card
                      key={x.id}
                      title={ln(x.label)}
                      arabic={x.arabic}
                      selected={prefs.intention === x.id}
                      onClick={() => setPrefs({ intention: x.id })}
                    />
                  ))}
                </Question>
              )}

              {step === 2 && (
                <Question
                  title={t("q.format.title")}
                  sub={t("q.format.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
                >
                  {FORMATS.map((x) => (
                    <Card
                      key={x.id}
                      title={ln(x.label)}
                      sub={ln(x.sub)}
                      arabic={x.arabic}
                      selected={prefs.format === x.id}
                      onClick={() => setPrefs({ format: x.id })}
                    />
                  ))}
                </Question>
              )}

              {step === 3 && (
                <Question
                  title={t("q.time.title")}
                  sub={t("q.time.sub")}
                  cta={t("q.continue")}
                  onNext={forward}
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

              {step === 4 && (
                <Question
                  title={t("q.voice.title")}
                  sub={t("q.voice.sub")}
                  cta={t("q.prepare")}
                  onNext={forward}
                >
                  {RECITERS.map((r) => (
                    <Card
                      key={r.id}
                      title={r.name}
                      sub={`${ln(r.style)} · ${ln(r.place)}`}
                      arabic=""
                      selected={prefs.reciter === r.id}
                      onClick={() => setPrefs({ reciter: r.id })}
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

/* ——— «Nega aynan shular» ————————————————————————————— */

function WhyThis({
  mood,
  onBegin,
}: {
  mood: MoodId;
  onBegin: () => void;
}) {
  const { t, ln, prefs } = useApp();
  const m = getMood(mood);
  const plan = planSegments(m, prefs.duration);
  const journey = m.passages;

  const intention = INTENTIONS.find((x) => x.id === prefs.intention);
  const timeLabel = ln(DURATION_LABELS[prefs.duration]);

  const tags = [
    ln(m.label),
    intention ? ln(intention.label) : "",
    timeLabel,
  ].filter(Boolean);

  return (
    <div className="sk-scroll anim-fade-up min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-8">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center">
        <p className="text-center text-xs uppercase tracking-widest text-white/35">
          {t("why.title")}
        </p>

        <p className="mt-4 text-center text-lg leading-relaxed text-white/70">
          {t("why.recap", {
            mood: ln(m.label).toLowerCase(),
            intention: intention ? ln(intention.label).toLowerCase() : "",
            time: timeLabel.toLowerCase(),
          })}
        </p>

        <h2 className="mt-6 text-center text-2xl font-semibold leading-snug tracking-tightest text-white sm:text-3xl">
          {ln(m.title)}
        </h2>

        {/* Nega shular — teglar */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-white/35">
            {t("why.selected")}
          </p>
          <div className="anim-stagger mt-3 flex flex-wrap gap-2">
            {tags.map((x) => (
              <span
                key={x}
                className="tone-bg-soft tone-text inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
              >
                <Icon name="sparkle" size={13} />
                {x}
              </span>
            ))}
          </div>
        </div>

        {/* Sayohat — to'rt bosqich */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-white/35">
            {t("why.journeyTitle", { minutes: timeLabel })}
          </p>

          <ol className="anim-stagger mt-3 space-y-2">
            {journey.map((p, i) => (
              <li
                key={`${p.surah}-${p.from}`}
                className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3"
              >
                <span className="tone-text w-6 shrink-0 text-xs font-semibold tabular-nums">
                  0{i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {ln(STAGE_LABEL[p.stage])}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/45">
                    {ln(STAGE_SUB[p.stage])}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-white/60">
                    {ln(p.note)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onBegin}
            className="tone-bg h-12 rounded-full px-10 text-base font-semibold text-night-base transition hover:brightness-110 active:scale-95"
          >
            {t("why.begin")}
          </button>
          <p className="text-[11px] text-white/30">
            ≈ {totalMinutes(plan)} · {t("entry.reviewed")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ——— Tayyorlash — bosqichma-bosqich ————————————————— */

function Preparing({ onDone }: { onDone: () => void }) {
  const { t } = useApp();
  const [i, setI] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const steps = [t("prep.step1"), t("prep.step2"), t("prep.step3")];

  useEffect(() => {
    const timers: number[] = [];
    for (let k = 1; k <= steps.length; k++) {
      timers.push(window.setTimeout(() => setI(k), PREP_STEP_MS * k));
    }
    timers.push(
      window.setTimeout(
        () => doneRef.current(),
        PREP_STEP_MS * (steps.length + 1)
      )
    );
    return () => timers.forEach((x) => window.clearTimeout(x));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="anim-fade-in flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span className="tone-bg-soft anim-breathe absolute inset-0 rounded-full" />
        <span className="tone-bg relative h-2.5 w-2.5 rounded-full" />
      </span>

      <ol className="mt-8 space-y-2">
        {steps.map((s, k) => (
          <li
            key={s}
            className="flex items-center justify-center gap-2 text-sm transition-all duration-500"
            style={{ opacity: k < i ? 1 : k === i ? 0.6 : 0.2 }}
          >
            {k < i ? (
              <Icon name="check" size={14} className="tone-text" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            )}
            <span className="text-white/85">{s}</span>
          </li>
        ))}
      </ol>

      <p className="arabic mt-10 font-arabic text-3xl text-white">
        رَبِّ زِدْنِي عِلْمًا
      </p>
      <p className="mt-2 text-sm text-white/45">{t("prep.duaTr")}</p>

      <p className="mt-10 max-w-sm text-[11px] leading-relaxed text-white/25">
        {t("prep.honest")}
      </p>
    </div>
  );
}

/* ——— Yordamchilar ————————————————————————————————— */

function Bloom() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="sk-bloom-rays absolute h-[140vmax] w-[140vmax] rounded-full" />
      <span className="sk-bloom-core absolute h-[70vmax] w-[70vmax] rounded-full" />
    </div>
  );
}

function Question({
  title,
  sub,
  cta,
  onNext,
  footer,
  extra,
  children,
}: {
  title: string;
  sub: string;
  cta: string;
  onNext: () => void;
  footer?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-4xl text-center">
      <h1 className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[46px]">
        {title}
      </h1>
      <p className="mt-3 text-sm text-white/55">{sub}</p>

      <div className="anim-stagger mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>

      {extra}

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onNext}
          className="tone-bg h-12 rounded-full px-10 text-base font-semibold text-night-base transition hover:brightness-110 active:scale-95"
        >
          {cta}
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

/**
 * Erkin matn — «nima eshitmoqchisiz».
 * Sun'iy intellekt emas: yozilgan so'zlar mavzu lug'ati bilan solishtiriladi
 * va nima topilgani ochiq ko'rsatiladi.
 */
function AskFreely({
  lead,
  onPick,
  onClear,
}: {
  lead: Passage | null;
  onPick: (p: Passage, mood: MoodId) => void;
  onClear: () => void;
}) {
  const { t, ln } = useApp();
  const [text, setText] = useState("");

  const result = useMemo(() => matchIntent(text), [text]);
  const typed = text.trim().length >= 3;

  return (
    <div className="mx-auto mt-8 w-full max-w-xl text-left">
      <label className="block text-center text-[11px] uppercase tracking-[0.2em] text-white/35">
        {t("ask.label")}
      </label>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (lead) onClear();
        }}
        placeholder={t("ask.placeholder")}
        className="mt-3 h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-center text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.07]"
      />

      {typed && result.passages.length === 0 && (
        <p className="mt-3 text-center text-xs text-white/40">{t("ask.none")}</p>
      )}

      {result.passages.length > 0 && (
        <div className="anim-fade-up mt-4">
          <p className="text-center text-[11px] text-white/40">
            {t("ask.found")}:{" "}
            <span className="tone-text">
              {result.themes.map((x) => ln(THEME_LABEL[x])).join(" · ")}
            </span>
          </p>

          <ul className="mt-3 space-y-2">
            {result.passages.slice(0, 3).map(({ passage, mood: m, shared }) => {
              const active =
                lead?.surah === passage.surah && lead?.from === passage.from;
              return (
                <li key={`${passage.surah}-${passage.from}`}>
                  <button
                    type="button"
                    onClick={() => onPick(passage, m)}
                    className={[
                      "w-full rounded-xl border px-4 py-3 text-left transition active:scale-[0.99]",
                      active
                        ? "tone-border tone-bg-soft"
                        : "border-white/[0.07] bg-white/[0.03] hover:border-white/25",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {passageRef(passage)}
                      </span>
                      <span className="ml-auto flex gap-1">
                        {shared.map((x) => (
                          <span
                            key={x}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60"
                          >
                            {ln(THEME_LABEL[x])}
                          </span>
                        ))}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                      {ln(passage.note)}
                    </p>
                    {active && (
                      <span className="tone-text mt-2 block text-[11px]">
                        {t("ask.starts")}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-white/30">
            {t("ask.note")}
          </p>
        </div>
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
        {arabic && (
          <span
            className="arabic shrink-0 font-arabic text-lg text-white/35"
            aria-hidden="true"
          >
            {arabic}
          </span>
        )}
      </span>

      {sub && <span className="mt-1 text-xs text-white/45">{sub}</span>}

      {selected && (
        <span className="tone-bg anim-fade-in absolute bottom-3 left-5 h-1.5 w-1.5 rounded-full" />
      )}
    </button>
  );
}
