"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { matchIntent } from "@/lib/intent";
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
  THEME_LABEL,
  getMood,
  intentionThemes,
  passageRef,
  type Duration,
  type IntentionId,
  type MoodId,
  type Passage,
  type ThemeId,
} from "@/lib/sakinah";

/** Qalb → niyat → vaqt → qanday. Erkin matn va qori — ixtiyoriy. */
const STEPS = 4;
const BLOOM_MS = 1500;
/** Har tayyorlash qadami */
const PREP_STEP_MS = 700;

type Phase = "bloom" | "questions" | "preparing" | "why";

/** «Bilmayman» — alohida karta, qolganlaridan ajratib ko'rsatiladi */
const UNSURE: MoodId = "unsure";

export function OnboardingFlow({
  initialMood,
  onBegin,
  onClose,
}: {
  initialMood: MoodId | null;
  onBegin: (moods: MoodId[], lead?: Passage | null) => void;
  onClose: () => void;
}) {
  const { t, ln, prefs, setPrefs } = useApp();

  const [phase, setPhase] = useState<Phase>("bloom");
  const [step, setStep] = useState(0);
  const [moods, setMoods] = useState<MoodId[]>(
    initialMood ? [initialMood] : []
  );
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

  /** Holatni qo'shish/olib tashlash. «Bilmayman» boshqalari bilan birga bo'lmaydi. */
  const toggleMood = (id: MoodId) => {
    setLead(null);
    setMoods((prev) => {
      if (id === UNSURE) return prev.includes(UNSURE) ? [] : [UNSURE];
      const without = prev.filter((x) => x !== UNSURE);
      return without.includes(id)
        ? without.filter((x) => x !== id)
        : [...without, id];
    });
  };

  const toggleIntention = (id: IntentionId) => {
    const prev = prefs.intentions;
    setPrefs({
      intentions: prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id],
    });
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
            <WhyThis
              moods={moods}
              lead={lead}
              onBegin={() => onBegin(moods, lead)}
            />
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
                  hint={t("q.multi")}
                  cta={t("q.continue")}
                  onNext={forward}
                  onSkip={() => {
                    setMoods([]);
                    setLead(null);
                    forward();
                  }}
                  footer={t("q.mood.footer")}
                  extra={
                    <>
                      <div className="anim-stagger mt-3">
                        <Card
                          title={ln(getMood(UNSURE).label)}
                          arabic={getMood(UNSURE).arabic}
                          selected={moods.includes(UNSURE)}
                          onClick={() => toggleMood(UNSURE)}
                          wide
                        />
                      </div>

                      <Expandable label={t("heart.expand")}>
                        <HeartNote
                          lead={lead}
                          onPick={(p, m) => {
                            setLead(p);
                            setMoods((prev) =>
                              prev.includes(m)
                                ? prev
                                : [...prev.filter((x) => x !== UNSURE), m]
                            );
                          }}
                          onClear={() => setLead(null)}
                        />
                      </Expandable>
                    </>
                  }
                >
                  {MOODS.filter((m) => m.id !== UNSURE).map((m) => (
                    <Card
                      key={m.id}
                      title={ln(m.label)}
                      arabic={m.arabic}
                      selected={moods.includes(m.id)}
                      onClick={() => toggleMood(m.id)}
                    />
                  ))}
                </Question>
              )}

              {step === 1 && (
                <Question
                  title={t("q.intention.title")}
                  sub={t("q.intention.sub")}
                  hint={t("q.multi")}
                  cta={t("q.continue")}
                  onNext={forward}
                  onSkip={() => {
                    setPrefs({ intentions: [], intentionNote: "" });
                    forward();
                  }}
                  extra={
                    <Expandable label={t("intent.other")}>
                      <textarea
                        rows={3}
                        value={prefs.intentionNote}
                        onChange={(e) =>
                          setPrefs({ intentionNote: e.target.value })
                        }
                        placeholder={t("intent.otherPlaceholder")}
                        className="sk-scroll w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
                      />
                    </Expandable>
                  }
                >
                  {INTENTIONS.map((x) => (
                    <Card
                      key={x.id}
                      title={ln(x.label)}
                      arabic={x.arabic}
                      selected={prefs.intentions.includes(x.id)}
                      onClick={() => toggleIntention(x.id)}
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
                  extra={
                    <Expandable label={t("q.voice.title")}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Card
                          title={t("voice.auto")}
                          sub={t("voice.autoSub")}
                          arabic=""
                          selected={prefs.reciterAuto}
                          onClick={() => setPrefs({ reciterAuto: true })}
                        />
                        {RECITERS.map((r) => (
                          <Card
                            key={r.id}
                            title={r.name}
                            sub={`${ln(r.style)} · ${ln(r.place)}`}
                            arabic=""
                            selected={!prefs.reciterAuto && prefs.reciter === r.id}
                            onClick={() =>
                              setPrefs({ reciter: r.id, reciterAuto: false })
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-center text-[11px] text-white/30">
                        {t("voice.anytime")}
                      </p>
                    </Expandable>
                  }
                >
                  {FORMATS.map((x) => (
                    <Card
                      key={x.id}
                      title={ln(x.label)}
                      sub={ln(x.sub)}
                      arabic={x.arabic}
                      selected={prefs.format === x.id}
                      disabled={x.pending}
                      onClick={() => setPrefs({ format: x.id })}
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
  moods,
  lead,
  onBegin,
}: {
  moods: MoodId[];
  lead: Passage | null;
  onBegin: () => void;
}) {
  const { t, ln, prefs } = useApp();

  const list = (moods.length > 0 ? moods : [UNSURE]).map(getMood);
  const primary = list[0];

  const plan = planSegments(list, prefs.duration, {
    lead,
    themes: intentionThemes(prefs.intentions),
  });
  const journey = plan.filter((s) => s.kind === "vibe").slice(0, 6);

  const timeLabel = ln(DURATION_LABELS[prefs.duration]);
  const intentions = prefs.intentions.map((id) =>
    INTENTIONS.find((x) => x.id === id)
  );

  // «Siz … aytdingiz» — faqat javob berilgan qismlardan yig'iladi
  const said = [
    moods.length > 0
      ? t("why.said.mood", {
          x: list.map((m) => ln(m.label)).join(", "),
        })
      : "",
    intentions.length > 0
      ? t("why.said.intention", {
          x: intentions
            .map((x) => (x ? ln(x.label) : ""))
            .filter(Boolean)
            .join(", "),
        })
      : "",
    t("why.said.time", { x: timeLabel }),
  ].filter(Boolean);

  // Bugun nima haqida — sayohatdagi mavzular
  const themes: ThemeId[] = [];
  for (const m of list)
    for (const p of m.passages)
      for (const th of p.themes) if (!themes.includes(th)) themes.push(th);
  const topThemes = themes.slice(0, 3);

  const tags = [
    ...list.map((m) => ln(m.label)),
    ...intentions.map((x) => (x ? ln(x.label) : "")),
    timeLabel,
  ].filter(Boolean);

  return (
    <div className="sk-scroll anim-fade-up min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-8">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center">
        <p className="text-center text-xs uppercase tracking-widest text-white/35">
          {t("why.title")}
        </p>

        <p className="mt-4 text-center text-lg leading-relaxed text-white/70">
          {t("why.frame", { parts: said.join("; ") })}
        </p>

        <h2 className="mt-6 text-center text-2xl font-semibold leading-snug tracking-tightest text-white sm:text-3xl">
          {ln(primary.title)}
        </h2>

        <p className="mt-4 text-center text-sm leading-relaxed text-white/55">
          {topThemes.length > 0
            ? t("why.tonight", {
                themes: topThemes.map((x) => ln(THEME_LABEL[x]).toLowerCase()).join(", "),
              })
            : t("why.tonightPlain")}
        </p>

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

        {/* Sayohat — bosqichma-bosqich */}
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
                    {p.stage ? ln(STAGE_LABEL[p.stage]) : ""}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/45">
                    {p.stage ? ln(STAGE_SUB[p.stage]) : ""}
                  </span>
                  {p.note && (
                    <span className="mt-1.5 block text-xs leading-relaxed text-white/60">
                      {ln(p.note)}
                    </span>
                  )}
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
        PREP_STEP_MS * (steps.length + 2)
      )
    );
    return () => timers.forEach((x) => window.clearTimeout(x));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = i >= steps.length;

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

      <p
        className="tone-text mt-6 text-sm font-semibold transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }}
      >
        {t("prep.ready")}
      </p>

      <p className="arabic mt-8 font-arabic text-3xl text-white">
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
  hint,
  cta,
  onNext,
  onSkip,
  footer,
  extra,
  children,
}: {
  title: string;
  sub: string;
  hint?: string;
  cta: string;
  onNext: () => void;
  onSkip?: () => void;
  footer?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useApp();

  return (
    <div className="w-full max-w-4xl text-center">
      <h1 className="text-3xl font-semibold tracking-tightest text-white sm:text-4xl lg:text-[46px]">
        {title}
      </h1>
      <p className="mt-3 text-sm text-white/55">{sub}</p>
      {hint && <p className="mt-1 text-[11px] text-white/30">{hint}</p>}

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

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-white/35 underline-offset-4 transition hover:text-white/70 hover:underline"
          >
            {t("q.skip")}
          </button>
        )}
      </div>

      {footer && (
        <p className="mt-10 text-[11px] leading-relaxed text-white/30">
          {footer}
        </p>
      )}
    </div>
  );
}

/** Ochilib-yopiladigan ixtiyoriy bo'lim */
function Expandable({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-6 w-full max-w-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mx-auto flex items-center gap-2 text-xs text-white/45 transition hover:text-white"
      >
        <Icon
          name="chevronDown"
          size={13}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
        {label}
      </button>

      {open && <div className="anim-fade-up mt-4 text-left">{children}</div>}
    </div>
  );
}

/**
 * «Qalbingizda nima bor?» — ixtiyoriy erkin matn.
 * Sun'iy intellekt emas: yozilgan so'zlar mavzu lug'ati bilan solishtiriladi
 * va nima topilgani ochiq ko'rsatiladi. Holat sharhlanmaydi.
 */
function HeartNote({
  lead,
  onPick,
  onClear,
}: {
  lead: Passage | null;
  onPick: (p: Passage, mood: MoodId) => void;
  onClear: () => void;
}) {
  const { t, ln, prefs, setPrefs } = useApp();
  const text = prefs.heartNote;

  const result = useMemo(() => matchIntent(text), [text]);
  const typed = text.trim().length >= 3;

  return (
    <div>
      <p className="text-center text-xs leading-relaxed text-white/45">
        {t("heart.sub")}
      </p>

      <textarea
        rows={3}
        value={text}
        onChange={(e) => {
          setPrefs({ heartNote: e.target.value });
          if (lead) onClear();
        }}
        placeholder={t("heart.placeholder")}
        className="sk-scroll mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
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
        </div>
      )}

      <p className="mt-4 text-center text-[11px] leading-relaxed text-white/30">
        {t("heart.privacy")}
      </p>
    </div>
  );
}

function Card({
  title,
  sub,
  arabic,
  selected,
  disabled,
  wide,
  onClick,
}: {
  title: string;
  sub?: string;
  arabic: string;
  selected: boolean;
  disabled?: boolean;
  wide?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={[
        "relative flex min-h-[92px] flex-col justify-center rounded-2xl border px-5 py-4 text-left transition duration-200",
        wide ? "w-full" : "",
        disabled
          ? "cursor-not-allowed border-white/[0.06] bg-white/[0.02] opacity-45"
          : "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
        selected
          ? "tone-border tone-bg-soft"
          : disabled
            ? ""
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
