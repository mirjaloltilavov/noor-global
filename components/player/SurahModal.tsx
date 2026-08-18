"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { usePlayer } from "@/components/player/PlayerProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";

/** 114 sura — markazdagi popup, qidiruv va ikki ustunli grid bilan */
export function SurahModal({ onClose }: { onClose: () => void }) {
  const { t } = useApp();
  const { chapters, segment, startSurah, play } = usePlayer();
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chapters;
    return chapters.filter(
      (c) =>
        c.slug.toLowerCase().includes(q) ||
        c.translated.toLowerCase().includes(q) ||
        c.arabic.includes(query.trim()) ||
        String(c.id) === q
    );
  }, [chapters, query]);

  const current = segment?.surah ?? 0;

  return (
    <Modal
      title={t("player.surahs")}
      subtitle={t("player.chooseSurah")}
      onClose={onClose}
      width="xl"
    >
      <label className="relative mb-5 block">
        <span className="sr-only">{t("player.searchSurah")}</span>
        <Icon
          name="search"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
        />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("player.searchSurah")}
          className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand"
        />
      </label>

      {chapters.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/45">
          {t("common.loading")}
        </p>
      ) : shown.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/45">
          {t("entry.empty")}
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {shown.map((c) => {
            const active = c.id === current;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    startSurah(c.id, c.verses);
                    play();
                    onClose();
                  }}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                    active
                      ? "border-brand bg-brand/15"
                      : "border-white/[0.07] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-lg text-[11px] font-semibold",
                      active
                        ? "bg-brand text-night-base"
                        : "bg-white/[0.07] text-white/55",
                    ].join(" ")}
                  >
                    <span className="-rotate-45">{c.id}</span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {c.slug}
                    </span>
                    <span className="block truncate text-[11px] text-white/40">
                      {c.translated} · {t("player.versesN", { n: c.verses })}
                    </span>
                  </span>

                  <span className="arabic shrink-0 font-arabic text-base text-white/45">
                    {c.arabic}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
