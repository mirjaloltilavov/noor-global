"use client";

import { useApp } from "@/components/providers/AppProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Modal } from "@/components/ui/Modal";
import { SURAHS } from "@/lib/sakinah";
import { totalMinutes } from "@/lib/queue";

export function QueueModal({ onClose }: { onClose: () => void }) {
  const { t, ln } = useApp();
  const { segments, segIndex, jumpToSegment, play } = usePlayer();

  return (
    <Modal
      title={t("player.queue")}
      subtitle={t("reminder.min", { n: totalMinutes(segments) })}
      onClose={onClose}
    >
      {segments.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/45">
          {t("player.empty")}
        </p>
      ) : (
        <ol className="space-y-1.5">
          {segments.map((s, i) => {
            const active = i === segIndex;
            const name = SURAHS[s.surah]?.slug ?? `Surah ${s.surah}`;
            return (
              <li key={`${s.surah}-${s.from}-${i}`}>
                <button
                  type="button"
                  onClick={() => {
                    jumpToSegment(i);
                    play();
                    onClose();
                  }}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left transition",
                    active
                      ? "border-brand bg-brand/15"
                      : "border-white/[0.07] bg-white/[0.03] hover:border-white/25",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                        active
                          ? "bg-brand text-night-base"
                          : "bg-white/10 text-white/55",
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
                    <span className="shrink-0 text-[11px] text-white/35">
                      {t("reminder.min", { n: s.minutes })}
                    </span>
                  </div>
                  {s.note && (
                    <p className="mt-2 pl-10 text-[11px] leading-relaxed text-white/40">
                      {ln(s.note)}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </Modal>
  );
}
