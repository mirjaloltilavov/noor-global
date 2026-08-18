"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Slider, Toggle } from "@/components/sakinah/Popover";
import { StageThumb } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import {
  BACKGROUNDS,
  RECITERS,
  SCRIPTS,
  TRANSLATIONS,
} from "@/lib/sakinah";
import { ARABIC_SIZES } from "@/lib/session";

type Tab = "type" | "translation" | "background" | "audio";

/** Barcha o'qish sozlamalari — markazdagi modalda */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t, ln, locale, prefs, setPrefs, translationId } = useApp();
  const [tab, setTab] = useState<Tab>("type");

  const TABS: { id: Tab; label: string; icon: "type" | "translate" | "image" | "headphones" }[] =
    [
      { id: "type", label: t("read.typography"), icon: "type" },
      { id: "translation", label: t("read.translation"), icon: "translate" },
      { id: "background", label: t("read.background"), icon: "image" },
      { id: "audio", label: t("read.audio"), icon: "headphones" },
    ];

  return (
    <Modal title={t("player.settings")} onClose={onClose}>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setTab(x.id)}
            aria-pressed={tab === x.id}
            className={[
              "flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition",
              tab === x.id
                ? "tone-bg-soft font-semibold text-white"
                : "text-white/55 hover:bg-white/[0.07] hover:text-white",
            ].join(" ")}
          >
            <Icon name={x.icon} size={15} />
            {x.label}
          </button>
        ))}
      </div>

      {tab === "type" && (
        <>
          <p className="text-xs text-white/50">{t("read.script")}</p>
          <div className="mt-2 flex gap-2">
            {SCRIPTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPrefs({ script: s.id })}
                aria-pressed={prefs.script === s.id}
                className={[
                  "h-10 flex-1 rounded-lg text-sm transition",
                  prefs.script === s.id
                    ? "bg-white font-semibold text-night-base"
                    : "bg-white/10 text-white/70 hover:bg-white/20",
                ].join(" ")}
              >
                {s.label}
              </button>
            ))}
          </div>

          <LabeledSlider
            label={t("read.fontSize")}
            display={String(prefs.fontSize)}
            value={prefs.fontSize}
            min={1}
            max={ARABIC_SIZES.length}
            onChange={(v) => setPrefs({ fontSize: v })}
          />
          <LabeledSlider
            label={t("read.lineHeight")}
            display={prefs.lineHeight.toFixed(1)}
            value={prefs.lineHeight}
            min={1.6}
            max={2.6}
            step={0.1}
            onChange={(v) => setPrefs({ lineHeight: v })}
          />

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <span>
              <span className="flex items-center gap-2 text-sm text-white/85">
                <Icon name="waveform" size={15} />
                {t("read.karaoke")}
              </span>
              <span className="mt-0.5 block text-[11px] text-white/45">
                {t("read.karaokeHint")}
              </span>
            </span>
            <Toggle
              label={t("read.karaoke")}
              checked={prefs.karaoke}
              onChange={(v) => setPrefs({ karaoke: v })}
            />
          </div>
        </>
      )}

      {tab === "translation" && (
        <>
          <ul className="space-y-1">
            {TRANSLATIONS[locale].map((tr) => (
              <li key={tr.id}>
                <button
                  type="button"
                  onClick={() => setPrefs({ translation: tr.id })}
                  aria-pressed={translationId === tr.id}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                    translationId === tr.id
                      ? "tone-bg-soft text-white"
                      : "text-white/70 hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <span className="min-w-0 truncate">{tr.name}</span>
                  {translationId === tr.id && (
                    <Icon name="check" size={15} className="tone-text" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <label className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <span className="text-sm text-white/85">
              {t("read.showTranslation")}
            </span>
            <Toggle
              label={t("read.showTranslation")}
              checked={prefs.showTranslation}
              onChange={(v) => setPrefs({ showTranslation: v })}
            />
          </label>
          <label className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-white/85">
              {t("read.showTransliteration")}
            </span>
            <Toggle
              label={t("read.showTransliteration")}
              checked={prefs.showTransliteration}
              onChange={(v) => setPrefs({ showTransliteration: v })}
            />
          </label>
        </>
      )}

      {tab === "background" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setPrefs({ background: b.id })}
                aria-pressed={prefs.background === b.id}
                className={[
                  "rounded-xl border p-1 text-left transition",
                  prefs.background === b.id
                    ? "tone-border"
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

          <LabeledSlider
            label={t("read.brightness")}
            display={`${prefs.brightness}%`}
            value={prefs.brightness}
            min={30}
            max={100}
            onChange={(v) => setPrefs({ brightness: v })}
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm text-white/85">
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
        </>
      )}

      {tab === "audio" && (
        <>
          <ul className="space-y-1">
            {RECITERS.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setPrefs({ reciter: r.id })}
                  aria-pressed={prefs.reciter === r.id}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition",
                    prefs.reciter === r.id
                      ? "tone-bg-soft"
                      : "hover:bg-white/[0.07]",
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
                    <Icon name="check" size={16} className="tone-text" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs text-white/50">{t("player.speed")}</p>
            <div className="mt-2 flex gap-2">
              {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setPrefs({ rate: r })}
                  aria-pressed={prefs.rate === r}
                  className={[
                    "h-9 flex-1 rounded-lg text-xs font-semibold transition",
                    prefs.rate === r
                      ? "bg-white text-night-base"
                      : "bg-white/10 text-white/70 hover:bg-white/20",
                  ].join(" ")}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

function LabeledSlider({
  label,
  display,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs text-white/70">{display}</span>
      </div>
      <div className="mt-2">
        <Slider
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
