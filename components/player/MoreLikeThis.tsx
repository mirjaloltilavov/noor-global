"use client";

import { useMemo } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import {
  MOODS,
  THEME_LABEL,
  passageRef,
  type Passage,
  type ThemeId,
} from "@/lib/sakinah";

/**
 * «Shunga o'xshash» — joriy parchaning mavzulari bo'yicha
 * boshqa kuratsiya qilingan parchalarni taklif qiladi.
 * Tanlangani joriy sayohatga qo'shiladi.
 */
export function MoreLikeThis({ onClose }: { onClose: () => void }) {
  const { t, ln } = useApp();
  const player = usePlayer();
  const segment = player.segment;

  // Joriy parchaning mavzulari
  const current = useMemo(() => {
    if (!segment) return null;
    for (const m of MOODS) {
      const p = m.passages.find(
        (x) => x.surah === segment.surah && x.from === segment.from
      );
      if (p) return { passage: p, mood: m };
    }
    return null;
  }, [segment]);

  const themes: ThemeId[] = current?.passage.themes ?? [];

  const related = useMemo(() => {
    if (themes.length === 0) return [];
    const out: { passage: Passage; moodLabel: string; shared: ThemeId[] }[] = [];

    for (const m of MOODS) {
      for (const p of m.passages) {
        if (
          current &&
          p.surah === current.passage.surah &&
          p.from === current.passage.from
        )
          continue;
        const shared = p.themes.filter((x) => themes.includes(x));
        if (shared.length > 0)
          out.push({ passage: p, moodLabel: ln(m.label), shared });
      }
    }

    // Ko'proq mos kelgani yuqorida
    return out.sort((a, b) => b.shared.length - a.shared.length).slice(0, 8);
  }, [themes, current, ln]);

  return (
    <Modal
      title={t("more.title")}
      subtitle={
        themes.length
          ? themes.map((x) => ln(THEME_LABEL[x])).join(" · ")
          : undefined
      }
      onClose={onClose}
    >
      {related.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/45">
          {t("more.empty")}
        </p>
      ) : (
        <ul className="space-y-2">
          {related.map(({ passage, moodLabel, shared }) => (
            <li key={`${passage.surah}-${passage.from}`}>
              <button
                type="button"
                onClick={() => {
                  player.appendPassage(passage);
                  onClose();
                }}
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-left transition hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.99]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {passageRef(passage)}
                  </span>
                  <span className="text-[11px] text-white/35">{moodLabel}</span>
                  <span className="ml-auto flex gap-1">
                    {shared.map((x) => (
                      <span
                        key={x}
                        className="tone-bg-soft tone-text rounded-full px-2 py-0.5 text-[10px] font-medium"
                      >
                        {ln(THEME_LABEL[x])}
                      </span>
                    ))}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">
                  {ln(passage.note)}
                </p>
                <span className="tone-text mt-2 flex items-center gap-1.5 text-[11px]">
                  <Icon name="arrowRight" size={12} />
                  {t("more.add")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
