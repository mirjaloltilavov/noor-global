"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import {
  DURATIONS,
  DURATION_LABELS,
  FORMATS,
  MOODS,
  RECITERS,
  getMood,
  type Duration,
  type MoodId,
} from "@/lib/sakinah";
import { planSegments, totalMinutes } from "@/lib/queue";

/**
 * Kayfiyat tanlash — pleyer ustidagi overlay.
 * Pleyer orqa fonda ko'rinib turadi, tanlagach overlay yopiladi.
 */
export function Onboarding({
  initialMood,
  onBegin,
  onSkip,
  onClose,
  dismissible,
}: {
  initialMood: MoodId | null;
  onBegin: (mood: MoodId) => void;
  onSkip: () => void;
  onClose: () => void;
  dismissible: boolean;
}) {
  const { t, ln, prefs, setPrefs } = useApp();
  const [mood, setMood] = useState<MoodId>(initialMood ?? "anxious");

  const plan = planSegments(getMood(mood), prefs.duration);
  const planned = totalMinutes(plan);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-night-base/75 p-6 backdrop-blur-md">
      <div className="my-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-night-panel/90 p-8 shadow-panel">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tightest text-white">
              {t("onboard.title")}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
              {t("onboard.subtitle")}
            </p>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("onboard.close")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Kayfiyat */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOODS.map((m) => {
            const active = m.id === mood;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                aria-pressed={active}
                className={[
                  "flex h-16 items-center justify-between rounded-xl border px-4 text-left transition",
                  active
                    ? "border-brand bg-brand/15"
                    : "border-white/10 bg-white/[0.04] hover:border-white/25",
                ].join(" ")}
              >
                <span className="text-sm font-semibold text-white">
                  {ln(m.label)}
                </span>
                <span
                  className="arabic font-arabic text-lg text-white/35"
                  aria-hidden="true"
                >
                  {m.arabic}
                </span>
              </button>
            );
          })}
        </div>

        {/* Davomiylik */}
        <Row label={t("onboard.duration")}>
          {DURATIONS.map((d) => (
            <Chip
              key={d}
              active={prefs.duration === d}
              onClick={() => setPrefs({ duration: d as Duration })}
            >
              {ln(DURATION_LABELS[d as Duration])}
            </Chip>
          ))}
        </Row>

        {/* Format */}
        <Row label={t("onboard.format")}>
          {FORMATS.map((f) => (
            <Chip
              key={f.id}
              active={prefs.format === f.id}
              onClick={() => setPrefs({ format: f.id })}
            >
              {ln(f.label)}
            </Chip>
          ))}
        </Row>

        {/* Qori */}
        <Row label={t("onboard.reciter")}>
          {RECITERS.map((r) => (
            <Chip
              key={r.id}
              active={prefs.reciter === r.id}
              onClick={() => setPrefs({ reciter: r.id })}
            >
              {r.name}
            </Chip>
          ))}
        </Row>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onBegin(mood)}
            className="h-12 rounded-full bg-brand px-9 text-base font-semibold text-night-base transition hover:bg-brand-strong hover:text-white"
          >
            {t("onboard.begin")}
          </button>

          <p className="text-sm text-white/50">
            {prefs.duration === 0
              ? t("onboard.metaOpen")
              : t("onboard.meta", {
                  minutes: ln(DURATION_LABELS[prefs.duration]),
                  count: plan.length,
                })}
          </p>

          <button
            type="button"
            onClick={onSkip}
            className="ml-auto text-sm text-white/45 underline-offset-4 transition hover:text-white hover:underline"
          >
            {t("onboard.skip")}
          </button>
        </div>

        {prefs.duration !== 0 && planned < prefs.duration && (
          <p className="mt-3 text-xs text-white/35">
            {t("player.versesN", {
              n: plan.reduce((s, x) => s + (x.to - x.from + 1), 0),
            })}
          </p>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="text-xs font-medium uppercase tracking-wide text-white/35">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "h-9 rounded-full border px-4 text-sm transition",
        active
          ? "border-brand bg-brand/20 font-semibold text-white"
          : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
