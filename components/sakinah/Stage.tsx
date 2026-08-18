"use client";

import type { BackgroundId } from "@/lib/sakinah";

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
}: {
  background: BackgroundId;
  brightness: number;
  reduceMotion: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative min-h-screen overflow-hidden bg-night-base text-white",
        reduceMotion ? "sk-still" : "",
        className,
      ].join(" ")}
      style={
        { "--sk-brightness": brightness / 100 } as React.CSSProperties
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
        {/* Matn o'qilishi uchun yengil qoraytirish */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />
      </div>

      <div className="relative z-10">{children}</div>
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
      </span>
    </span>
  );
}
