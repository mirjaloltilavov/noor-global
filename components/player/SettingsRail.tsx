"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Popover, Slider, Toggle } from "@/components/sakinah/Popover";
import { StageThumb } from "@/components/sakinah/Stage";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  BACKGROUNDS,
  RECITERS,
  SCRIPTS,
  TRANSLATIONS,
  translationName,
} from "@/lib/sakinah";
import { ARABIC_SIZES, WORD_SIZES } from "@/lib/session";

type Panel = "type" | "translation" | "background" | "audio" | null;

/**
 * O'ngdagi minimalistik sozlama ustuni — Sakinah sahnasidagidek.
 * Pleyer ham, Sakinah ham shu bitta komponentdan foydalanadi.
 */
export function SettingsRail({
  extra,
  visible = true,
}: {
  /** Ustunga qo'shimcha tugmalar (masalan sura tanlash) */
  extra?: { icon: IconName; label: string; onClick: () => void }[];
  visible?: boolean;
}) {
  const { t, ln, locale, prefs, setPrefs, translationId } = useApp();
  const [panel, setPanel] = useState<Panel>(null);

  const fade = visible ? "opacity-100" : "pointer-events-none opacity-0";

  return (
    <>
      <div
        className={`fixed bottom-36 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 ${fade}`}
      >
        <div className="flex flex-row items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 backdrop-blur-md md:flex-col">
          <RailButton
            icon="type"
            label={t("read.typography")}
            active={panel === "type"}
            onClick={() => setPanel(panel === "type" ? null : "type")}
          />
          <RailButton
            icon="translate"
            label={t("read.translation")}
            active={panel === "translation"}
            onClick={() =>
              setPanel(panel === "translation" ? null : "translation")
            }
          />
          <RailButton
            icon="image"
            label={t("read.background")}
            active={panel === "background"}
            onClick={() =>
              setPanel(panel === "background" ? null : "background")
            }
          />
          <RailButton
            icon="headphones"
            label={t("read.audio")}
            active={panel === "audio"}
            onClick={() => setPanel(panel === "audio" ? null : "audio")}
          />

          {extra && extra.length > 0 && (
            <>
              <span className="mx-1 h-6 w-px bg-white/10 md:mx-0 md:my-1 md:h-px md:w-6" />
              {extra.map((x) => (
                <RailButton
                  key={x.label}
                  icon={x.icon}
                  label={x.label}
                  active={false}
                  onClick={x.onClick}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {panel && (
        <div className="anim-pop fixed inset-x-4 bottom-52 z-30 md:inset-x-auto md:bottom-auto md:right-24 md:top-1/2 md:-translate-y-1/2">
          {panel === "type" && (
            <Popover title={t("read.typography")} onClose={() => setPanel(null)}>
              <p className="text-xs text-white/50">{t("read.script")}</p>
              <div className="mt-2 flex gap-2">
                {SCRIPTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPrefs({ script: s.id })}
                    aria-pressed={prefs.script === s.id}
                    className={[
                      "h-9 flex-1 rounded-lg text-sm transition",
                      prefs.script === s.id
                        ? "bg-white font-semibold text-night-base"
                        : "bg-white/10 text-white/70 hover:bg-white/20",
                    ].join(" ")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <Row label={t("read.fontSize")}>
                <Stepper
                  value={prefs.fontSize}
                  min={1}
                  max={ARABIC_SIZES.length}
                  onChange={(v) => setPrefs({ fontSize: v })}
                />
              </Row>

              <LabeledSlider
                label={t("read.lineHeight")}
                display={prefs.lineHeight.toFixed(1)}
                value={prefs.lineHeight}
                min={1.6}
                max={2.6}
                step={0.1}
                onChange={(v) => setPrefs({ lineHeight: v })}
              />

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <span className="flex items-center gap-2 text-sm text-white/80">
                  <Icon name="waveform" size={15} />
                  {t("read.karaoke")}
                </span>
                <Toggle
                  label={t("read.karaoke")}
                  checked={prefs.karaoke}
                  onChange={(v) => setPrefs({ karaoke: v })}
                />
              </div>
            </Popover>
          )}

          {panel === "translation" && (
            <Popover title={t("read.translation")} onClose={() => setPanel(null)}>
              <ul className="space-y-1">
                {TRANSLATIONS[locale].map((tr) => (
                  <li key={tr.id}>
                    <button
                      type="button"
                      onClick={() => setPrefs({ translation: tr.id })}
                      aria-pressed={translationId === tr.id}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                        translationId === tr.id
                          ? "tone-bg-soft text-white"
                          : "text-white/70 hover:bg-white/10",
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

              <label className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <span className="text-sm text-white/80">
                  {t("read.showTranslation")}
                </span>
                <Toggle
                  label={t("read.showTranslation")}
                  checked={prefs.showTranslation}
                  onChange={(v) => setPrefs({ showTranslation: v })}
                />
              </label>
              <label className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm text-white/80">
                  {t("read.showTransliteration")}
                </span>
                <Toggle
                  label={t("read.showTransliteration")}
                  checked={prefs.showTransliteration}
                  onChange={(v) => setPrefs({ showTransliteration: v })}
                />
              </label>

              <div className="mt-3 border-t border-white/10 pt-3">
                <label className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-sm text-white/80">
                      {t("read.wordByWord")}
                    </span>
                    <span className="block text-[11px] text-white/45">
                      {t("read.wordByWordHint")}
                    </span>
                  </span>
                  <Toggle
                    label={t("read.wordByWord")}
                    checked={prefs.wordByWord}
                    onChange={(v) => setPrefs({ wordByWord: v })}
                  />
                </label>

                {prefs.wordByWord && (
                  <Row label={t("read.wordSize")}>
                    <Stepper
                      value={prefs.wordSize}
                      min={1}
                      max={WORD_SIZES.length}
                      onChange={(v) => setPrefs({ wordSize: v })}
                    />
                  </Row>
                )}
              </div>
            </Popover>
          )}

          {panel === "background" && (
            <Popover title={t("read.background")} onClose={() => setPanel(null)}>
              <div className="grid grid-cols-2 gap-3">
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
                  <span className="block text-sm text-white/80">
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
            </Popover>
          )}

          {panel === "audio" && (
            <Popover title={t("read.audio")} onClose={() => setPanel(null)}>
              <ul className="space-y-1">
                {RECITERS.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setPrefs({ reciter: r.id })}
                      aria-pressed={prefs.reciter === r.id}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition",
                        prefs.reciter === r.id
                          ? "tone-bg-soft"
                          : "hover:bg-white/10",
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

              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-white/40">
                {translationName(locale, translationId)}
              </p>
            </Popover>
          )}
        </div>
      )}
    </>
  );
}

function RailButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: IconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={[
        "flex h-10 w-10 items-center justify-center rounded-xl transition active:scale-90",
        active ? "tone-bg text-night-base" : "text-white/80 hover:bg-white/15",
      ].join(" ")}
    >
      <Icon name={icon} size={18} />
    </button>
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
    <div className="mt-4 flex items-center justify-between gap-4">
      <span className="text-xs text-white/50">{label}</span>
      {children}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <span className="flex items-center gap-3 rounded-full bg-white/10 px-2 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="−"
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15"
      >
        −
      </button>
      <span className="w-4 text-center text-sm text-white">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="+"
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15"
      >
        +
      </button>
    </span>
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
