"use client";

import { useMemo } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SURAHS, getMood } from "@/lib/sakinah";
import { relativeDay } from "@/lib/session";

interface Row {
  key: string;
  at: number;
  surah: number;
  ayah: number;
  note?: string;
  mood?: string;
  journalId?: string;
}

/**
 * Qur'on kundaligi — saqlangan oyatlar va o'ylanmalar bitta vaqt chizig'ida.
 * Hammasi qurilmada saqlanadi.
 */
export function JournalModal({ onClose }: { onClose: () => void }) {
  const { t, ln, locale, journal, removeJournal, saved, toggleSaved } = useApp();
  const player = usePlayer();

  // Yozuvlar va xatcho'plar — bitta ro'yxat, sana bo'yicha
  const rows = useMemo<Row[]>(() => {
    const fromJournal: Row[] = journal.map((j) => ({
      key: `j-${j.id}`,
      at: j.at,
      surah: j.surah,
      ayah: j.ayah,
      note: j.note,
      mood: j.mood,
      journalId: j.id,
    }));
    const fromSaved: Row[] = saved.map((s) => ({
      key: `s-${s.surah}:${s.ayah}`,
      at: s.at,
      surah: s.surah,
      ayah: s.ayah,
    }));
    return [...fromJournal, ...fromSaved].sort((a, b) => b.at - a.at);
  }, [journal, saved]);

  function open(surah: number, ayah: number) {
    const verses =
      SURAHS[surah]?.verses ??
      player.chapters.find((c) => c.id === surah)?.verses ??
      7;
    player.startSurah(surah, verses);
    player.jumpToAyah(ayah - 1);
    player.play();
    onClose();
  }

  return (
    <Modal
      title={t("journal.title")}
      subtitle={t("journal.sub")}
      onClose={onClose}
      width="lg"
    >
      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/45">
          {t("journal.empty")}
        </p>
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => {
            const name =
              SURAHS[r.surah]?.slug ??
              player.chapters.find((c) => c.id === r.surah)?.slug ??
              `Surah ${r.surah}`;

            return (
              <li
                key={r.key}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-white/35">
                    {relativeDay(r.at, locale)}
                  </span>
                  {r.mood && (
                    <span className="tone-bg-soft tone-text rounded-full px-2 py-0.5 text-[10px] font-medium">
                      {ln(getMood(r.mood as never).label)}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-white">
                    {name} {r.surah}:{r.ayah}
                  </span>
                </div>

                {r.note ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                    {r.note}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-white/30">
                    {t("journal.bookmarkOnly")}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-4">
                  <Action
                    icon="play"
                    label={t("journal.open")}
                    onClick={() => open(r.surah, r.ayah)}
                  />
                  <Action
                    icon="close"
                    label={t("journal.remove")}
                    onClick={() =>
                      r.journalId
                        ? removeJournal(r.journalId)
                        : toggleSaved(r.surah, r.ayah)
                    }
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-6 text-center text-[11px] leading-relaxed text-white/25">
        {t("journal.private")}
      </p>
    </Modal>
  );
}

function Action({
  icon,
  label,
  onClick,
}: {
  icon: "play" | "close";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-[11px] text-white/45 transition hover:text-white"
    >
      <Icon name={icon} size={12} />
      {label}
    </button>
  );
}
