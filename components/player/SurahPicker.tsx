"use client";

import { useMemo, useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { SURAHS } from "@/lib/sakinah";

/**
 * Pleyerga birinchi kirganda ochiladigan suralar jadvali.
 * Eng tepada — qolgan joyidan davom ettirish.
 */
export function SurahPicker({ onPicked }: { onPicked?: () => void }) {
  const { t, prefs } = useApp();
  const player = usePlayer();
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return player.chapters;
    return player.chapters.filter(
      (c) =>
        c.slug.toLowerCase().includes(q) ||
        c.translated.toLowerCase().includes(q) ||
        c.arabic.includes(query.trim()) ||
        String(c.id) === q
    );
  }, [player.chapters, query]);

  const last = prefs.lastSurah;
  const lastChapter = last
    ? player.chapters.find((c) => c.id === last)
    : undefined;

  function pick(id: number, verses: number, ayah = 1) {
    player.startSurah(id, verses);
    if (ayah > 1) player.jumpToAyah(ayah - 1);
    player.play();
    onPicked?.();
  }

  return (
    <div className="sk-scroll anim-fade-up min-h-0 flex-1 overflow-y-auto px-4 pb-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="pt-2 text-center text-2xl font-semibold tracking-tightest text-white sm:text-3xl">
          {t("player.pickTitle")}
        </h2>

        {/* Qolgan joyidan davom */}
        {lastChapter && (
          <button
            type="button"
            onClick={() =>
              pick(lastChapter.id, lastChapter.verses, prefs.lastAyah)
            }
            className="anim-pop tone-border mt-6 flex w-full items-center gap-4 rounded-2xl border bg-white/[0.05] px-5 py-4 text-left transition hover:bg-white/[0.09] active:scale-[0.99]"
          >
            <span className="tone-bg flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-night-base">
              <Icon name="play" size={18} filled />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-white/45">
                {t("player.continue")}
              </span>
              <span className="block truncate text-base font-semibold text-white">
                {lastChapter.slug} {lastChapter.id}:{prefs.lastAyah}
              </span>
              <span className="block truncate text-[11px] text-white/40">
                {lastChapter.translated}
              </span>
            </span>
            <span className="arabic shrink-0 font-arabic text-lg text-white/45">
              {lastChapter.arabic}
            </span>
          </button>
        )}

        {/* Qidiruv */}
        <label className="relative mt-6 block">
          <span className="sr-only">{t("player.searchSurah")}</span>
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("player.searchSurah")}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.06] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand"
          />
        </label>

        {player.chapters.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/45">
            {t("common.loading")}
          </p>
        ) : (
          <ul className="anim-stagger mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => {
              const active = c.id === player.segment?.surah;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => pick(c.id, c.verses)}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition hover:-translate-y-0.5 active:translate-y-0",
                      active
                        ? "tone-border tone-bg-soft"
                        : "border-white/[0.07] bg-white/[0.03] hover:border-white/25",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-lg text-[11px] font-semibold",
                        active
                          ? "tone-bg text-night-base"
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

        {/* Fotiha — ro'yxat yuklanmasa ham ishlasin */}
        {player.chapters.length === 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => pick(1, SURAHS[1].verses)}
              className="tone-bg h-11 rounded-full px-7 text-sm font-semibold text-night-base transition hover:brightness-110"
            >
              Al-Fatihah
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
