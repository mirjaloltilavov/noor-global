"use client";

import { useState } from "react";
import { MajlisView } from "@/components/player/MajlisView";
import { usePlayer } from "@/components/player/PlayerProvider";
import { QueueModal } from "@/components/player/QueueModal";
import { ReadingScene } from "@/components/player/ReadingScene";
import { SettingsModal } from "@/components/player/SettingsModal";
import { SurahModal } from "@/components/player/SurahModal";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { SURAHS, getMood } from "@/lib/sakinah";

type Tab = "player" | "sakinah";
type ModalKind = "surahs" | "queue" | "settings" | null;

/**
 * Full-screen pleyer. Tepadagi tab orqali «Pleyer» (Majlis ko'rinishi) va
 * «Sakinah» (kayfiyat sessiyasi) o'rtasida almashadi.
 */
export function FullScreen({ onOpenOnboarding }: { onOpenOnboarding: () => void }) {
  const { t, prefs, vibe } = useApp();
  const player = usePlayer();

  const [modal, setModal] = useState<ModalKind>(null);
  const tab: Tab = player.mode;

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
    >
      <div className="flex h-screen flex-col">
        {/* Yuqori qator */}
        <header className="flex shrink-0 items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => player.setMinimized(true)}
            aria-label={t("player.minimize")}
            title={t("player.minimize")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 active:scale-90"
          >
            <Icon name="chevronDown" size={18} />
          </button>

          {/* Tab almashtirgich */}
          <div className="mx-auto flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur">
            {(["player", "sakinah"] as Tab[]).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => player.setMode(x)}
                aria-pressed={tab === x}
                className={[
                  "h-9 rounded-full px-5 text-sm transition",
                  tab === x
                    ? "tone-bg font-semibold text-night-base"
                    : "text-white/65 hover:text-white",
                ].join(" ")}
              >
                {t(x === "player" ? "tab.player" : "tab.sakinah")}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {tab === "player" && (
              <>
            <HeaderButton
              icon="quran"
              label={t("player.surahs")}
              onClick={() => setModal("surahs")}
            />
            <HeaderButton
              icon="list"
              label={t("player.queue")}
              onClick={() => setModal("queue")}
            />
            <HeaderButton
              icon="settings"
              label={t("player.settings")}
              onClick={() => setModal("settings")}
            />
              </>
            )}
          </div>
        </header>

        {/* Tanasi */}
        <div key={tab} className="anim-fade-in flex min-h-0 flex-1 flex-col">
          {tab === "player" ? (
            player.active ? (
              <MajlisView onEditSession={onOpenOnboarding} />
            ) : (
              <EmptyPlayer onPickSurah={() => setModal("surahs")} />
            )
          ) : player.active && vibe ? (
            <ReadingScene embedded onRetune={onOpenOnboarding} />
          ) : (
            <SakinahStart onBegin={onOpenOnboarding} />
          )}
        </div>
      </div>

      {modal === "surahs" && <SurahModal onClose={() => setModal(null)} />}
      {modal === "queue" && <QueueModal onClose={() => setModal(null)} />}
      {modal === "settings" && <SettingsModal onClose={() => setModal(null)} />}
    </Stage>
  );
}

function HeaderButton({
  icon,
  label,
  onClick,
}: {
  icon: "quran" | "list" | "settings";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition hover:bg-white/15 active:scale-90"
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function EmptyPlayer({ onPickSurah }: { onPickSurah: () => void }) {
  const { t } = useApp();
  const player = usePlayer();

  return (
    <div className="anim-fade-up flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="tone-bg-soft flex h-20 w-20 items-center justify-center rounded-full">
        <Icon name="play" size={26} className="tone-text" filled />
      </span>
      <p className="mt-6 text-lg text-white/80">{t("player.empty")}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPickSurah}
          className="tone-bg h-11 rounded-full px-7 text-sm font-semibold text-night-base transition hover:brightness-110 active:scale-95"
        >
          {t("player.chooseSurah")}
        </button>
        <button
          type="button"
          onClick={() => {
            player.startSurah(1, SURAHS[1].verses);
            player.play();
          }}
          className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20 active:scale-95"
        >
          Al-Fatihah
        </button>
      </div>
    </div>
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
