"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Slider, Toggle } from "@/components/sakinah/Popover";
import { StageThumb } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import type { Chapter } from "@/lib/quran";
import type { Segment } from "@/lib/queue";
import { ARABIC_SIZES, RATES, type RepeatMode } from "@/lib/session";
import {
  BACKGROUNDS,
  RECITERS,
  SCRIPTS,
  SURAHS,
  TRANSLATIONS,
} from "@/lib/sakinah";

export type PanelTab = "queue" | "surahs" | "settings";

export function SidePanel({
  tab,
  onTab,
  onClose,
  segments,
  activeSegment,
  onSelectSegment,
  chapters,
  currentSurah,
  onSelectSurah,
}: {
  tab: PanelTab;
  onTab: (t: PanelTab) => void;
  onClose: () => void;
  segments: Segment[];
  activeSegment: number;
  onSelectSegment: (index: number) => void;
  chapters: Chapter[];
  currentSurah: number;
  onSelectSurah: (surah: number, verses: number) => void;
}) {
  const { t } = useApp();

  const TABS: { id: PanelTab; label: string }[] = [
    { id: "queue", label: t("player.queue") },
    { id: "surahs", label: t("player.surahs") },
    { id: "settings", label: t("player.settings") },
  ];

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-white/10 bg-night-panel/70 backdrop-blur-md">
      <div className="flex items-center gap-1 border-b border-white/10 px-3 py-3">
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => onTab(x.id)}
            aria-pressed={tab === x.id}
            className={[
              "h-9 rounded-lg px-3 text-sm transition",
              tab === x.id
                ? "bg-white/10 font-semibold text-white"
                : "text-white/55 hover:text-white",
            ].join(" ")}
          >
            {x.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="sk-scroll flex-1 overflow-y-auto p-3">
        {tab === "queue" && (
          <QueueTab
            segments={segments}
            activeSegment={activeSegment}
            onSelectSegment={onSelectSegment}
          />
        )}
        {tab === "surahs" && (
          <SurahTab
            chapters={chapters}
            currentSurah={currentSurah}
            onSelectSurah={onSelectSurah}
          />
        )}
        {tab === "settings" && <SettingsTab />}
      </div>
    </aside>
  );
}

function QueueTab({
  segments,
  activeSegment,
  onSelectSegment,
}: {
  segments: Segment[];
  activeSegment: number;
  onSelectSegment: (index: number) => void;
}) {
  const { t, ln } = useApp();

  if (segments.length === 0) {
    return <p className="p-3 text-sm text-white/45">{t("player.empty")}</p>;
  }

  return (
    <ol className="space-y-1">
      {segments.map((s, i) => {
        const active = i === activeSegment;
        const name = SURAHS[s.surah]?.slug ?? `Surah ${s.surah}`;
        return (
          <li key={`${s.surah}-${s.from}-${i}`}>
            <button
              type="button"
              onClick={() => onSelectSegment(i)}
              aria-current={active ? "true" : undefined}
              className={[
                "w-full rounded-xl px-3 py-2.5 text-left transition",
                active ? "bg-brand/20" : "hover:bg-white/[0.07]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                    active
                      ? "bg-brand text-night-base"
                      : "bg-white/10 text-white/60",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                  {name} {s.surah}:{s.from}
                  {s.to !== s.from && `–${s.to}`}
                </span>
                {s.kind === "vibe" && (
                  <span className="shrink-0 rounded-full bg-brand/25 px-2 py-0.5 text-[10px] font-semibold text-brand">
                    vibe
                  </span>
                )}
              </div>
              {s.note && (
                <p className="mt-1.5 line-clamp-2 pl-8 text-[11px] leading-relaxed text-white/40">
                  {ln(s.note)}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function SurahTab({
  chapters,
  currentSurah,
  onSelectSurah,
}: {
  chapters: Chapter[];
  currentSurah: number;
  onSelectSurah: (surah: number, verses: number) => void;
}) {
  const { t } = useApp();
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (c) =>
        c.slug.toLowerCase().includes(q) ||
        c.translated.toLowerCase().includes(q) ||
        String(c.id) === q
    );
  }, [chapters, query]);

  return (
    <>
      <label className="relative mb-2 block">
        <span className="sr-only">{t("player.searchSurah")}</span>
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("player.searchSurah")}
          className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.06] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand"
        />
      </label>

      {chapters.length === 0 ? (
        <p className="p-3 text-sm text-white/45">{t("common.loading")}</p>
      ) : (
        <ul className="space-y-0.5">
          {shown.map((c) => {
            const active = c.id === currentSurah;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectSurah(c.id, c.verses)}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                    active ? "bg-brand/20" : "hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <span className="w-6 shrink-0 text-xs text-white/40">
                    {c.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">
                      {c.slug}
                    </span>
                    <span className="block truncate text-[11px] text-white/40">
                      {c.translated} · {t("player.versesN", { n: c.verses })}
                    </span>
                  </span>
                  <span className="arabic shrink-0 font-arabic text-sm text-white/45">
                    {c.arabic}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function SettingsTab() {
  const { t, ln, locale, prefs, setPrefs, translationId } = useApp();

  return (
    <div className="space-y-6 px-1 pb-6">
      <Group title={t("player.reciter")}>
        <div className="space-y-1">
          {RECITERS.map((r) => (
            <Option
              key={r.id}
              active={prefs.reciter === r.id}
              onClick={() => setPrefs({ reciter: r.id })}
              title={r.name}
              sub={`${ln(r.style)} · ${ln(r.place)}`}
            />
          ))}
        </div>
      </Group>

      <Group title={t("player.translation")}>
        <div className="space-y-1">
          {TRANSLATIONS[locale].map((tr) => (
            <Option
              key={tr.id}
              active={translationId === tr.id}
              onClick={() => setPrefs({ translation: tr.id })}
              title={tr.name}
            />
          ))}
        </div>
        <label className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-white/75">
            {t("read.showTranslation")}
          </span>
          <Toggle
            label={t("read.showTranslation")}
            checked={prefs.showTranslation}
            onChange={(v) => setPrefs({ showTranslation: v })}
          />
        </label>
        <label className="mt-2 flex items-center justify-between gap-4">
          <span className="text-sm text-white/75">
            {t("read.showTransliteration")}
          </span>
          <Toggle
            label={t("read.showTransliteration")}
            checked={prefs.showTransliteration}
            onChange={(v) => setPrefs({ showTransliteration: v })}
          />
        </label>
      </Group>

      <Group title={t("read.typography")}>
        <div className="flex gap-2">
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

        <LabeledSlider
          label={t("read.fontSize")}
          value={prefs.fontSize}
          display={String(prefs.fontSize)}
          min={1}
          max={ARABIC_SIZES.length}
          onChange={(v) => setPrefs({ fontSize: v })}
        />
        <LabeledSlider
          label={t("read.lineHeight")}
          value={prefs.lineHeight}
          display={prefs.lineHeight.toFixed(1)}
          min={1.6}
          max={2.6}
          step={0.1}
          onChange={(v) => setPrefs({ lineHeight: v })}
        />
      </Group>

      <Group title={t("read.background")}>
        <div className="grid grid-cols-2 gap-2">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setPrefs({ background: b.id })}
              aria-pressed={prefs.background === b.id}
              className={[
                "rounded-xl border p-1 text-left transition",
                prefs.background === b.id
                  ? "border-brand"
                  : "border-white/10 hover:border-white/30",
              ].join(" ")}
            >
              <StageThumb background={b.id} />
              <span className="mt-1 block px-1 text-xs font-semibold text-white">
                {b.label}
              </span>
              <span className="block px-1 pb-1 text-[10px] text-white/40">
                {ln(b.sub)}
              </span>
            </button>
          ))}
        </div>

        <LabeledSlider
          label={t("read.brightness")}
          value={prefs.brightness}
          display={`${prefs.brightness}%`}
          min={30}
          max={100}
          onChange={(v) => setPrefs({ brightness: v })}
        />

        <label className="mt-3 flex items-center justify-between gap-4">
          <span>
            <span className="block text-sm text-white/75">
              {t("read.reduceMotion")}
            </span>
            <span className="block text-[11px] text-white/40">
              {t("read.reduceMotionHint")}
            </span>
          </span>
          <Toggle
            label={t("read.reduceMotion")}
            checked={prefs.reduceMotion}
            onChange={(v) => setPrefs({ reduceMotion: v })}
          />
        </label>
      </Group>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-white/35">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Option({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition",
        active ? "bg-brand/20" : "hover:bg-white/[0.07]",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm text-white">{title}</span>
        {sub && (
          <span className="block truncate text-[11px] text-white/40">{sub}</span>
        )}
      </span>
      {active && <Icon name="check" size={15} className="shrink-0 text-brand" />}
    </button>
  );
}

function LabeledSlider({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/45">{label}</span>
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

export const REPEAT_ORDER: RepeatMode[] = ["off", "ayah", "segment"];
