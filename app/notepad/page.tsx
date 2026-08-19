"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { AppShell } from "@/components/shell/AppShell";
import { TopBar } from "@/components/shell/TopBar";
import { Icon } from "@/components/ui/Icon";
import { fullDate, useJournalRows } from "@/lib/journal";
import { SURAHS, getMood } from "@/lib/sakinah";
import { relativeDay } from "@/lib/session";

/** Daftar — saqlangan oyatlar va ular haqida yozilganlar */
export default function Page() {
  const {
    t,
    ln,
    locale,
    journal,
    saved,
    updateJournal,
    removeJournal,
    toggleSaved,
  } = useApp();
  const player = usePlayer();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const rows = useJournalRows(query);
  const empty = journal.length === 0 && saved.length === 0;

  function open(surah: number, ayah: number) {
    const verses =
      SURAHS[surah]?.verses ??
      player.chapters.find((c) => c.id === surah)?.verses ??
      7;
    player.startSurah(surah, verses, ayah);
    player.play();
    router.push("/sakinah");
  }

  return (
    <AppShell>
      <TopBar title={t("nav.notepad")} />

      <main className="mx-auto max-w-content px-6 py-10 sm:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tightest text-ink">
              {t("journal.title")}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
              {t("notepad.sub")}
            </p>
          </div>

          {!empty && (
            <p className="text-sm text-ink-secondary">
              {t("notepad.counts", {
                notes: String(journal.length),
                saved: String(saved.length),
              })}
            </p>
          )}
        </header>

        {empty ? (
          <div className="mt-10 rounded-2xl border border-line-bold bg-surface p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-ink-icon">
              <Icon name="notepad" size={26} />
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-secondary">
              {t("notepad.empty")}
            </p>
            <button
              type="button"
              onClick={() => router.push("/sakinah")}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              {t("nav.sakinah")}
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        ) : (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("notepad.search")}
              className="mt-8 h-11 w-full rounded-full border border-line-bold bg-surface px-5 text-sm text-ink outline-none transition placeholder:text-ink-icon focus:border-brand sm:max-w-sm"
            />

            {rows.length === 0 ? (
              <p className="mt-10 text-sm text-ink-secondary">
                {t("notepad.noMatch")}
              </p>
            ) : (
              <ol className="mt-6 space-y-3">
                {rows.map((r) => {
                  const name =
                    SURAHS[r.surah]?.slug ??
                    player.chapters.find((c) => c.id === r.surah)?.slug ??
                    `Surah ${r.surah}`;
                  const isEditing = editing === r.key;
                  const fresh = Date.now() - r.at < 7 * 86_400_000;

                  return (
                    <li
                      key={r.key}
                      className="rounded-2xl border border-line-bold bg-surface p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                          {r.bookmarked && (
                            <Icon
                              name="bookmark"
                              size={12}
                              filled
                              className="text-ink-icon"
                            />
                          )}
                          {name} {r.surah}:{r.ayah}
                        </span>
                        {r.mood && (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-strong">
                            {ln(getMood(r.mood).label)}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-ink-icon">
                          {fresh
                            ? relativeDay(r.at, locale)
                            : fullDate(r.at, locale)}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-3">
                          <textarea
                            autoFocus
                            rows={4}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full resize-none rounded-xl border border-line-bold bg-surface-subtle p-4 text-sm leading-relaxed text-ink outline-none focus:border-brand"
                          />
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (r.journalId)
                                  updateJournal(r.journalId, draft.trim());
                                setEditing(null);
                              }}
                              className="h-9 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-strong"
                            >
                              {t("note.save")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(null)}
                              className="text-sm text-ink-secondary transition hover:text-ink"
                            >
                              {t("common.close")}
                            </button>
                          </div>
                        </div>
                      ) : r.note ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">
                          {r.note}
                        </p>
                      ) : (
                        <p className="mt-3 text-xs italic text-ink-icon">
                          {t("journal.bookmarkOnly")}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="mt-4 flex flex-wrap items-center gap-5">
                          <Action
                            icon="play"
                            label={t("journal.open")}
                            onClick={() => open(r.surah, r.ayah)}
                          />
                          {r.journalId && (
                            <Action
                              icon="notepad"
                              label={t("notepad.edit")}
                              onClick={() => {
                                setDraft(r.note ?? "");
                                setEditing(r.key);
                              }}
                            />
                          )}
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
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            <p className="mt-8 text-xs leading-relaxed text-ink-icon">
              {t("journal.private")}
            </p>
          </>
        )}
      </main>
    </AppShell>
  );
}

function Action({
  icon,
  label,
  onClick,
}: {
  icon: "play" | "close" | "notepad";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-ink-secondary transition hover:text-ink"
    >
      <Icon name={icon} size={13} />
      {label}
    </button>
  );
}
