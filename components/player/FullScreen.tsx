"use client";

import { useState } from "react";
import { MajlisView } from "@/components/player/MajlisView";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ReadingScene } from "@/components/player/ReadingScene";
import { SurahPicker } from "@/components/player/SurahPicker";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { getMood } from "@/lib/sakinah";

type Tab = "sakinah" | "player";

/**
 * Ijro yuzasi. Tepada tab: «Sakinah (vibe)» va «Player». Ikkalasi mustaqil.
 * `embedded` — sidebar yonidagi kontent maydonida; `fullscreen` — butun ekran.
 */
export function FullScreen({
  onOpenOnboarding,
  embedded = false,
  fullscreen = false,
  onToggleFullscreen,
}: {
  onOpenOnboarding: () => void;
  embedded?: boolean;
  fullscreen?: boolean;
  onToggleFullscreen: () => void;
}) {
  const { t, locale, setLocale, prefs, vibe } = useApp();
  const player = usePlayer();

  const [picking, setPicking] = useState(false);
  const tab: Tab = player.mode;

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
      fill={embedded}
    >
      <div className={embedded ? "flex h-full flex-col" : "flex h-screen flex-col"}>
        <header className="flex shrink-0 items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={fullscreen ? t("player.collapse") : t("player.expand")}
            title={fullscreen ? t("player.collapse") : t("player.expand")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 active:scale-90"
          >
            <Icon name={fullscreen ? "minimize" : "maximize"} size={17} />
          </button>

          <div className="mx-auto flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur">
            {(["sakinah", "player"] as Tab[]).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => {
                  player.setMode(x);
                  setPicking(false);
                }}
                aria-pressed={tab === x}
                className={[
                  "h-9 rounded-full px-4 text-sm transition sm:px-5",
                  tab === x
                    ? "tone-bg font-semibold text-night-base"
                    : "text-white/65 hover:text-white",
                ].join(" ")}
              >
                {t(x === "player" ? "tab.player" : "tab.sakinah")}
              </button>
            ))}
          </div>

          {/* Til almashtirgich */}
          <div className="flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.06] p-0.5">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={[
                  "h-7 rounded-full px-2 text-[11px] font-semibold transition",
                  locale === l
                    ? "tone-bg text-night-base"
                    : "text-white/55 hover:text-white",
                ].join(" ")}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>
        </header>

        <div key={tab} className="anim-fade-in flex min-h-0 flex-1 flex-col">
          {tab === "player" ? (
            picking || !player.active ? (
              <SurahPicker onPicked={() => setPicking(false)} />
            ) : (
              <MajlisView onOpenSurahs={() => setPicking(true)} />
            )
          ) : player.active && vibe ? (
            <ReadingScene embedded onRetune={onOpenOnboarding} />
          ) : (
            <SakinahStart onBegin={onOpenOnboarding} />
          )}
        </div>
      </div>
    </Stage>
  );
}

function SakinahStart({ onBegin }: { onBegin: () => void }) {
  const { t, ln, history } = useApp();
  const player = usePlayer();

  return (
    <div className="sk-scroll anim-fade-up flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center">
      <span
        className="arabic font-arabic text-5xl text-white/20 sm:text-6xl"
        aria-hidden="true"
      >
        سَكِينَة
      </span>

      <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-white sm:text-4xl">
        {t("entry.title")}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">
        {t("entry.subtitle")}
      </p>

      <button
        type="button"
        onClick={onBegin}
        className="tone-bg mt-8 h-12 rounded-full px-10 text-base font-semibold text-night-base transition hover:brightness-110 active:scale-95"
      >
        {t("entry.begin")}
      </button>

      {history.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-wide text-white/35">
            {t("entry.recent")}
          </p>
          <div className="anim-stagger grid gap-2 sm:grid-cols-2">
            {history.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => player.startVibe(s.mood)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/25 active:scale-[0.98]"
              >
                <span className="tone-text text-xs font-medium">
                  {ln(getMood(s.mood).label)}
                </span>
                <span className="mt-1 block truncate text-sm text-white/80">
                  {s.refs.join(" · ")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 max-w-xl text-[11px] leading-relaxed text-white/30">
        {t("entry.disclaimer")}
      </p>
    </div>
  );
}
