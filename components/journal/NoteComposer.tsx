"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Modal } from "@/components/ui/Modal";
import { SURAHS } from "@/lib/sakinah";

/**
 * Oyat haqida qisqa yozuv — Daftarga tushadi.
 * Yangi yozuv uchun `journalId` bo'lmaydi, tahrirlashda beriladi.
 */
export function NoteComposer({
  surah,
  ayah,
  journalId,
  initial = "",
  onClose,
}: {
  surah: number;
  ayah: number;
  journalId?: string;
  initial?: string;
  onClose: () => void;
}) {
  const { t, addJournal, updateJournal, vibe } = useApp();
  const [text, setText] = useState(initial);

  const name = SURAHS[surah]?.slug ?? `Surah ${surah}`;

  const save = () => {
    const note = text.trim();
    if (!note) return onClose();
    if (journalId) updateJournal(journalId, note);
    else addJournal({ surah, ayah, note, mood: vibe?.mood });
    onClose();
  };

  return (
    <Modal
      title={t("note.title")}
      subtitle={`${name} ${surah}:${ayah}`}
      onClose={onClose}
      width="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-4 text-sm text-white/55 transition hover:text-white"
          >
            {t("common.close")}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={text.trim().length === 0}
            className="tone-bg h-10 rounded-full px-6 text-sm font-semibold text-night-base transition hover:brightness-110 disabled:opacity-35"
          >
            {t("note.save")}
          </button>
        </div>
      }
    >
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={t("note.placeholder")}
        className="sk-scroll w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-white/30"
      />
      <p className="mt-3 text-[11px] leading-relaxed text-white/30">
        {t("journal.private")}
      </p>
    </Modal>
  );
}
