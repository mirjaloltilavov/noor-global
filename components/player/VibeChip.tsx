"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import {
  DURATION_LABELS,
  getMood,
  type Duration,
  type MoodId,
} from "@/lib/sakinah";

/**
 * Vibe sessiyasi pleyerning pastki chap burchagida bo'limcha sifatida qoladi.
 * Sessiya tugagach ham yo'qolmaydi — bosib qayta boshlash yoki chiqish mumkin.
 */
export function VibeChip({
  mood,
  minutes,
  active,
  done,
  total,
  onRetune,
  onRestart,
  onExit,
}: {
  mood: MoodId;
  minutes: Duration;
  active: boolean;
  done: number;
  total: number;
  onRetune: () => void;
  onRestart: () => void;
  onExit: () => void;
}) {
  const { t, ln } = useApp();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = ln(getMood(mood).label);

  return (
    <div ref={root} className="absolute bottom-6 left-6 z-30">
      {open && (
        <div className="mb-2 w-[260px] rounded-2xl border border-white/10 bg-night-panel/95 p-4 shadow-panel backdrop-blur-md">
          <p className="text-sm font-semibold text-white">{label}</p>
          {total > 0 && (
            <p className="mt-1 text-xs text-white/45">
              {t("vibe.progress", { done: Math.min(done, total), total })}
            </p>
          )}

          <div className="mt-4 space-y-1">
            <MenuItem
              icon="sakinah"
              label={t("vibe.retune")}
              onClick={() => {
                setOpen(false);
                onRetune();
              }}
            />
            <MenuItem
              icon="back10"
              label={t("vibe.restart")}
              onClick={() => {
                setOpen(false);
                onRestart();
              }}
            />
            <MenuItem
              icon="close"
              label={t("vibe.exit")}
              onClick={() => {
                setOpen(false);
                onExit();
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 text-xs text-white/85 backdrop-blur-md transition hover:bg-black/60"
      >
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            active ? "bg-brand" : "bg-white/35",
          ].join(" ")}
        />
        {minutes === 0
          ? t("vibe.chipOpen", { mood: label })
          : t("vibe.chip", {
              mood: label,
              minutes: ln(DURATION_LABELS[minutes]),
            })}
        <Icon name="chevronDown" size={12} className="text-white/45" />
      </button>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: "sakinah" | "back10" | "close";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
    >
      <Icon name={icon} size={15} />
      {label}
    </button>
  );
}
