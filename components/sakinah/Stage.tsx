"use client";

import { TONES, type BackgroundId } from "@/lib/sakinah";

/**
 * Figmadagi 4 ta o'qish foni. Har biri sekin harakatlanadi;
 * "Reduce motion" yoqilganda animatsiya to'xtaydi (globals.css → .sk-still).
 */
export function Stage({
  background,
  brightness,
  reduceMotion,
  children,
  className = "",
  bare = false,
  fill = false,
}: {
  background: BackgroundId;
  brightness: number;
  reduceMotion: boolean;
  children: React.ReactNode;
  className?: string;
  /** Fon qatlamlarisiz — tashqi Stage ichida ishlatiladi */
  bare?: boolean;
  /** min-h-screen o'rniga h-full — kontent maydoniga joylashadi */
  fill?: boolean;
}) {
  const vars = {
    "--sk-brightness": brightness / 100,
    "--sk-accent": TONES[background].accent,
    "--sk-accent-soft": TONES[background].accentSoft,
    "--sk-panel": TONES[background].panel,
  } as React.CSSProperties;

  if (bare) {
    return (
      <div
        className={["flex min-h-0 flex-1 flex-col text-white", className].join(" ")}
        style={vars}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden bg-night-base text-white",
        fill ? "h-full" : "min-h-screen",
        reduceMotion ? "sk-still" : "",
        className,
      ].join(" ")}
      style={
        {
          "--sk-brightness": brightness / 100,
          "--sk-accent": TONES[background].accent,
          "--sk-accent-soft": TONES[background].accentSoft,
          "--sk-panel": TONES[background].panel,
        } as React.CSSProperties
      }
    >
      <div className="sk-stage" aria-hidden="true">
        {background === "nur" && <div className="sk-layer sk-nur" />}
        {background === "mushaf" && <div className="sk-layer sk-mushaf" />}
        {background === "sakinah" && (
          <div className="sk-layer">
            <div className="sk-orb sk-orb-a" />
            <div className="sk-orb sk-orb-b" />
          </div>
        )}
        {background === "layl" && (
          <>
            <div className="sk-layer sk-layl" />
            <div className="sk-layer sk-stars" />
          </>
        )}
        {background === "dawn" && (
          <>
            <div className="sk-layer sk-dawn" />
            <div className="sk-layer sk-dawn-glow" />
          </>
        )}
        {background === "rain" && (
          <>
            <div className="sk-layer sk-rain" />
            <div className="sk-layer sk-rain-fall" />
          </>
        )}
        {background === "quiet" && <div className="sk-layer sk-quiet" />}

        {/* Matn o'qilishi uchun yengil qoraytirish */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
      </div>

      {/* Kontent butun balandlikni egallaydi — ichkarida markazlash ishlashi uchun */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

/** Fon tanlash popoveridagi kichik ko'rinish */
export function StageThumb({ background }: { background: BackgroundId }) {
  return (
    <span className="relative block h-[72px] w-full overflow-hidden rounded-lg bg-night-base">
      <span className="sk-stage absolute inset-0" aria-hidden="true">
        {background === "nur" && <span className="sk-layer sk-nur block" />}
        {background === "mushaf" && <span className="sk-layer sk-mushaf block" />}
        {background === "sakinah" && (
          <span className="sk-layer block">
            <span className="sk-orb sk-orb-a block" />
            <span className="sk-orb sk-orb-b block" />
          </span>
        )}
        {background === "layl" && (
          <>
            <span className="sk-layer sk-layl block" />
            <span className="sk-layer sk-stars block" />
          </>
        )}
        {background === "dawn" && (
          <>
            <span className="sk-layer sk-dawn block" />
            <span className="sk-layer sk-dawn-glow block" />
          </>
        )}
        {background === "rain" && (
          <>
            <span className="sk-layer sk-rain block" />
            <span className="sk-layer sk-rain-fall block" />
          </>
        )}
        {background === "quiet" && <span className="sk-layer sk-quiet block" />}
      </span>
    </span>
  );
}
