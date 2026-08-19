"use client";

import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ayahCite } from "@/lib/cite";
import { appendToDoc, docTitle } from "@/lib/docs";
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
  const player = usePlayer();
  const [text, setText] = useState(initial);
  const [added, setAdded] = useState<string | null>(null);

  const name = SURAHS[surah]?.slug ?? `Surah ${surah}`;

  const save = () => {
    const note = text.trim();
    if (!note) return onClose();
    if (journalId) updateJournal(journalId, note);
    else addJournal({ surah, ayah, note, mood: vibe?.mood });
    onClose();
  };

  /** Oyatni (va yozilgan izohni) hujjat oxiriga qo'shadi */
  const toDocument = () => {
    const a = player.ayah;
    const cite = a
      ? ayahCite(a, name)
      : `> — ${name}, ${surah}:${ayah}`;
    const note = text.trim();
    const doc = appendToDoc(note ? `${cite}\n\n${note}` : cite);
    setAdded(docTitle(doc, t("doc.untitled")));
    window.setTimeout(() => setAdded(null), 3000);
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
      <button
        type="button"
        onClick={toDocument}
        className="mt-4 flex items-center gap-2 text-xs text-white/50 transition hover:text-white"
      >
        <Icon name="notepad" size={13} />
        {t("doc.addTo")}
      </button>

      {added && (
        <p className="tone-text anim-fade-in mt-2 text-[11px]">
          {t("doc.added", { title: added })}
        </p>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-white/30">
        {t("journal.private")}
      </p>
    </Modal>
  );
}
