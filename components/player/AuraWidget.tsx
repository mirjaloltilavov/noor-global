"use client";

import { usePathname, useRouter } from "next/navigation";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { SURAHS, TONES } from "@/lib/sakinah";

/**
 * Pleyer fonda ishlayotganda o'ng pastki burchakda turadigan dumaloq vidjet.
 * Halqalari tilovat bilan birga pulsatsiya qiladi.
 */
export function AuraWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, prefs } = useApp();
  const player = usePlayer();

  if (!player.active || !player.minimized) return null;

  const tone = TONES[prefs.background];
  const surah = player.segment?.surah;
  const name = surah
    ? SURAHS[surah]?.slug ??
      player.chapters.find((c) => c.id === surah)?.slug ??
      ""
    : "";

  function restore() {
    player.setMinimized(false);
    if (pathname !== "/sakinah") router.push("/sakinah");
  }

  return (
    <div
      className="fixed bottom-24 right-4 z-40 flex items-center gap-3 md:bottom-6 md:right-6"
      style={
        {
          "--sk-accent": tone.accent,
          "--sk-accent-soft": tone.accentSoft,
        } as React.CSSProperties
      }
    >
      {/* Matnli qism — kichik ekranda yashiriladi */}
      <div className="hidden rounded-full border border-line-bold bg-surface/95 px-4 py-2 shadow-soft backdrop-blur sm:block">
        <p className="text-[11px] text-ink-muted">{t("aura.playing")}</p>
        <p className="text-xs font-semibold text-ink">
          {name}
          {player.track && ` ${player.track.surah}:${player.track.ayah}`}
        </p>
      </div>

      <div className="relative h-14 w-14">
        {/* Aura halqalari */}
        {player.playing && (
          <>
            <span className="sk-aura-ring tone-bg-soft absolute inset-0 rounded-full" />
            <span className="sk-aura-ring sk-aura-ring-2 tone-bg-soft absolute inset-0 rounded-full" />
            <span className="sk-aura-ring sk-aura-ring-3 tone-bg-soft absolute inset-0 rounded-full" />
          </>
        )}

        <button
          type="button"
          onClick={restore}
          aria-label={t("aura.resume")}
          title={t("aura.resume")}
          className="tone-bg relative flex h-14 w-14 items-center justify-center rounded-full text-night-base shadow-panel transition hover:brightness-110 active:scale-90"
        >
          <Icon name="aura" size={22} />
        </button>

        {/* Ijro/pauza — vidjet ustidagi kichik tugma */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            player.toggle();
          }}
          aria-label={player.playing ? "pause" : "play"}
          className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-line-bold bg-surface text-ink shadow-soft transition hover:bg-surface-raised active:scale-90"
        >
          <Icon
            name={player.playing ? "pause" : "play"}
            size={11}
            filled={!player.playing}
          />
        </button>
      </div>
    </div>
  );
}
