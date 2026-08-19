"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { AppShell } from "@/components/shell/AppShell";
import { TopBar } from "@/components/shell/TopBar";
import { Icon } from "@/components/ui/Icon";
import {
  createDoc,
  docTitle,
  duplicateDoc,
  removeDoc,
  useDocs,
  wordCount,
} from "@/lib/docs";
import { fullDate, useJournalRows } from "@/lib/journal";
import { SURAHS, getMood } from "@/lib/sakinah";
import { relativeDay } from "@/lib/session";

type Tab = "docs" | "journal";

/** Daftar — hujjatlar (ma'ruza, xutba, tadqiqot) va Qur'on kundaligi */
export default function Page() {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>("docs");

  return (
    <AppShell>
      <TopBar title={t("nav.notepad")} />

      <main className="mx-auto max-w-content px-6 py-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <TabButton
            active={tab === "docs"}
            label={t("doc.tab")}
            onClick={() => setTab("docs")}
          />
          <TabButton
            active={tab === "journal"}
            label={t("journal.title")}
            onClick={() => setTab("journal")}
          />
        </div>

        {tab === "docs" ? <Documents /> : <Journal />}
      </main>
    </AppShell>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-10 rounded-full px-5 text-sm font-medium transition",
        active
          ? "bg-ink text-white"
          : "border border-line-bold text-ink-secondary hover:border-brand hover:text-ink",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

/* ——— Hujjatlar ————————————————————————————————————— */

function Documents() {
  const { t, locale } = useApp();
  const router = useRouter();
  const docs = useDocs();
  const [query, setQuery] = useState("");

  const shown = query.trim()
    ? docs.filter((d) =>
        `${d.title} ${d.body}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : docs;

  const start = () => {
    const doc = createDoc("");
    router.push(`/notepad/${doc.id}`);
  };

  return (
    <>
      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tightest text-ink">
            {t("doc.tab")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
            {t("doc.sub")}
          </p>
        </div>

        <button
          type="button"
          onClick={start}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong"
        >
          <Icon name="notepad" size={17} />
          {t("doc.new")}
        </button>
      </header>

      {docs.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line-bold bg-surface p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-ink-icon">
            <Icon name="notepad" size={26} />
          </div>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ink-secondary">
            {t("doc.empty")}
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            {t("doc.new")}
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      ) : (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("doc.search")}
            className="mt-8 h-11 w-full rounded-full border border-line-bold bg-surface px-5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand sm:max-w-sm"
          />

          {shown.length === 0 ? (
            <p className="mt-10 text-sm text-ink-secondary">
              {t("notepad.noMatch")}
            </p>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col rounded-2xl border border-line-bold bg-surface p-5 transition hover:border-brand"
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/notepad/${d.id}`)}
                    className="flex-1 text-left"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-ink">
                      {docTitle(d, t("doc.untitled"))}
                    </p>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-secondary">
                      {d.body.replace(/[#>*_-]/g, " ").trim() || t("doc.blank")}
                    </p>
                  </button>

                  <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                    <span className="text-[11px] text-ink-muted">
                      {Date.now() - d.updatedAt < 7 * 86_400_000
                        ? relativeDay(d.updatedAt, locale)
                        : fullDate(d.updatedAt, locale)}{" "}
                      · {t("doc.words", { n: String(wordCount(d.body)) })}
                    </span>

                    <button
                      type="button"
                      onClick={() => duplicateDoc(d.id)}
                      title={t("doc.duplicate")}
                      aria-label={t("doc.duplicate")}
                      className="ml-auto text-ink-icon transition hover:text-ink"
                    >
                      <Icon name="layers" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDoc(d.id)}
                      title={t("journal.remove")}
                      aria-label={t("journal.remove")}
                      className="text-ink-icon transition hover:text-ink"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

/* ——— Qur'on kundaligi ————————————————————————————— */

function Journal() {
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
    <>
      <header className="mt-8 flex flex-wrap items-end justify-between gap-4">
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
            <Icon name="bookmark" size={26} />
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
            className="mt-8 h-11 w-full rounded-full border border-line-bold bg-surface px-5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand sm:max-w-sm"
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
    </>
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
