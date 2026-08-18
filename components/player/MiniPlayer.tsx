"use client";

import { usePathname, useRouter } from "next/navigation";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { SURAHS, TONES, getReciter } from "@/lib/sakinah";
import { formatClock } from "@/lib/session";

/** Pleyer fonda ishlayotganda pastda turadigan mini pleyer */
export function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, ln, prefs } = useApp();
  const player = usePlayer();

  const tone = TONES[prefs.background];
  const surah = player.segment?.surah;
  const name = surah
    ? SURAHS[surah]?.slug ??
      player.chapters.find((c) => c.id === surah)?.slug ??
      ""
    : "";
  const reciter = getReciter(prefs.reciter);

  const clipProgress =
    player.clipLength > 0 ? player.elapsed / player.clipLength : 0;
  const surahProgress =
    player.tracks.length > 0
      ? (player.cursor.pos + clipProgress) / player.tracks.length
      : 0;

  function open() {
    player.setMinimized(false);
    if (pathname !== "/sakinah") router.push("/sakinah");
  }

  return (
    <div
      className="fixed inset-x-3 bottom-20 z-40 md:inset-x-auto md:bottom-6 md:right-6 md:w-[440px]"
      style={
        {
          "--sk-accent": tone.accent,
          "--sk-accent-soft": tone.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="anim-pop overflow-hidden rounded-2xl border border-line-bold bg-surface/95 shadow-panel backdrop-blur">
        {/* Progress — to'liq sura bo'yicha */}
        <div className="h-0.5 w-full bg-line">
          <div
            className="tone-bg h-full"
            style={{ width: `${Math.min(100, surahProgress * 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <button
            type="button"
            onClick={open}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={t("aura.resume")}
          >
            <span className="tone-bg-soft tone-text flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Icon name="waveform" size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">
                {name}
                {player.track && ` ${player.track.surah}:${player.track.ayah}`}
              </span>
              <span className="block truncate text-[11px] text-ink-muted">
                {reciter.name} · {ln(reciter.style)}
              </span>
            </span>
          </button>

          <span className="hidden shrink-0 text-[11px] tabular-nums text-ink-muted sm:block">
            {formatClock(player.elapsed)}
          </span>

          <div className="flex shrink-0 items-center gap-1">
            <MiniButton
              icon="arrowLeft"
              label="prev"
              onClick={player.prev}
            />
            <button
              type="button"
              onClick={player.toggle}
              aria-label={player.playing ? "pause" : "play"}
              className="tone-bg flex h-10 w-10 items-center justify-center rounded-full text-night-base transition hover:brightness-110 active:scale-90"
            >
              <Icon
                name={player.playing ? "pause" : "play"}
                size={16}
                filled={!player.playing}
              />
            </button>
            <MiniButton icon="arrowRight" label="next" onClick={player.next} />
            <MiniButton
              icon="minimize"
              label={t("aura.resume")}
              onClick={open}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniButton({
  icon,
  label,
  onClick,
}: {
  icon: "arrowLeft" | "arrowRight" | "minimize";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition hover:bg-surface-raised hover:text-ink active:scale-90"
    >
      <Icon name={icon} size={16} />
    </button>
  );
}
