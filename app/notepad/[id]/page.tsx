"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HadithPicker } from "@/components/docs/HadithPicker";
import { QuranPicker } from "@/components/docs/QuranPicker";
import {
  SlashMenu,
  filterCommands,
  useCommands,
  type CommandId,
} from "@/components/docs/SlashMenu";
import { useApp } from "@/components/providers/AppProvider";
import { AppShell } from "@/components/shell/AppShell";
import { TopBar } from "@/components/shell/TopBar";
import { Icon } from "@/components/ui/Icon";
import { getDoc, saveDoc, setLastDoc, wordCount, type Doc } from "@/lib/docs";
import { renderMarkdown, tidy, toWordHtml } from "@/lib/format";

/** Hujjat muharriri — matn, «/» buyruqlari, ko'rinish va eksport */
export default function Page() {
  const { t } = useApp();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const area = useRef<HTMLTextAreaElement>(null);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState(false);
  const [tidyNote, setTidyNote] = useState<string | null>(null);

  const [slash, setSlash] = useState<{ from: number; query: string } | null>(
    null
  );
  const [picker, setPicker] = useState<"quran" | "hadith" | null>(null);
  /** «/buyruq» yozuvi qayerdan qayergacha — iqtibos o'shani almashtiradi */
  const [range, setRange] = useState<{ from: number; to: number } | null>(null);

  const commands = useCommands();
  const shown = useMemo(
    () => (slash ? filterCommands(commands, slash.query) : []),
    [commands, slash]
  );

  useEffect(() => {
    if (!id) return;
    const d = getDoc(id);
    if (!d) {
      router.replace("/notepad");
      return;
    }
    setDoc(d);
    setTitle(d.title);
    setBody(d.body);
    setLastDoc(d.id);
  }, [id, router]);

  // Avtomatik saqlash
  useEffect(() => {
    if (!doc) return;
    if (title === doc.title && body === doc.body) return;
    setSaved(false);
    const timer = window.setTimeout(() => {
      saveDoc(doc.id, { title, body });
      setDoc((prev) => (prev ? { ...prev, title, body } : prev));
      setSaved(true);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [title, body, doc]);

  /** Kursor o'rniga matn qo'yadi, «/buyruq» yozuvini almashtiradi */
  const insert = useCallback(
    (text: string, replace?: { from: number; to: number } | null) => {
      const el = area.current;
      const caretNow = el ? el.selectionStart : body.length;
      const from = replace ? replace.from : caretNow;
      const to = replace ? replace.to : caretNow;

      const before = body.slice(0, from);
      const after = body.slice(to);
      const pad = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
      const next = `${before}${pad}${text}\n\n${after.replace(/^\n+/, "")}`;

      setBody(next);
      setSlash(null);

      const caret = before.length + pad.length + text.length + 2;
      window.setTimeout(() => {
        el?.focus();
        el?.setSelectionRange(caret, caret);
      }, 0);
    },
    [body]
  );

  /** Matn o'zgarganda «/» boshlangan buyruqni kuzatamiz */
  function onBody(value: string, caret: number) {
    setBody(value);

    const upto = value.slice(0, caret);
    const m = upto.match(/(^|\n|\s)\/([a-zA-Z\u0400-\u04ff'’]*)$/);
    if (m) setSlash({ from: caret - m[2].length - 1, query: m[2] });
    else setSlash(null);
  }

  function runCommand(cmd: CommandId) {
    const from = slash?.from ?? body.length;
    setSlash(null);

    const el = area.current;
    const to = el ? el.selectionStart : body.length;

    if (cmd === "quran" || cmd === "hadith") {
      setRange({ from, to });
      setPicker(cmd);
      return;
    }

    const snippets: Record<string, string> = {
      heading: "## ",
      sub: "### ",
      quote: "> ",
      list: "- ",
      rule: "---",
    };
    const text = snippets[cmd] ?? "";

    // Belgi qo'yiladi, kursor uning oxirida qoladi
    const next = body.slice(0, from) + text + body.slice(to);
    setBody(next);
    const caret = from + text.length;
    window.setTimeout(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    }, 0);
  }

  function onTidy() {
    const res = tidy(body);
    setBody(res.text);
    const total = res.changes.reduce(
      (sum, c) => sum + Number(c.split(":")[1] || 0),
      0
    );
    setTidyNote(total > 0 ? t("doc.tidyDone", { n: String(total) }) : t("doc.tidyClean"));
    window.setTimeout(() => setTidyNote(null), 4000);
  }

  const html = useMemo(() => renderMarkdown(body), [body]);
  const shownTitle = title.trim() || t("doc.untitled");

  function download(ext: "md" | "doc") {
    const content =
      ext === "md"
        ? `# ${shownTitle}\n\n${body}`
        : toWordHtml(shownTitle, html);
    const type =
      ext === "md" ? "text/markdown;charset=utf-8" : "application/msword";
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shownTitle.replace(/[\\/:*?"<>|]/g, "-")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function print() {
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "100%";
    frame.style.width = "0";
    frame.style.height = "0";
    document.body.appendChild(frame);
    const w = frame.contentWindow;
    if (!w) return;
    w.document.open();
    w.document.write(toWordHtml(shownTitle, html));
    w.document.close();
    w.focus();
    w.print();
    window.setTimeout(() => frame.remove(), 1000);
  }

  if (!doc) return null;

  return (
    <AppShell>
      <TopBar title={t("nav.notepad")} />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/notepad")}
            className="flex h-9 items-center gap-2 rounded-full border border-line-bold px-4 text-sm text-ink-secondary transition hover:border-brand hover:text-ink"
          >
            <Icon name="arrowLeft" size={15} />
            {t("doc.all")}
          </button>

          <span className="text-xs text-ink-muted">
            {saved ? t("doc.saved") : t("doc.saving")} ·{" "}
            {t("doc.words", { n: String(wordCount(body)) })}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Tool
              icon={preview ? "type" : "layers"}
              label={preview ? t("doc.edit") : t("doc.preview")}
              onClick={() => setPreview((v) => !v)}
            />
            <Tool icon="sparkle" label={t("doc.tidy")} onClick={onTidy} />
            <Tool
              icon="share"
              label={t("doc.copy")}
              onClick={() => navigator.clipboard?.writeText(body)}
            />
            <Tool icon="arrowRight" label=".md" onClick={() => download("md")} />
            <Tool icon="arrowRight" label=".doc" onClick={() => download("doc")} />
            <Tool icon="quran" label={t("doc.print")} onClick={print} />
          </div>
        </div>

        {tidyNote && (
          <p className="anim-fade-in mt-4 rounded-xl bg-brand-soft px-4 py-2.5 text-sm text-brand-strong">
            {tidyNote}
          </p>
        )}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("doc.titlePlaceholder")}
          className="mt-6 w-full bg-transparent text-3xl font-semibold tracking-tightest text-ink outline-none placeholder:text-ink-muted"
        />

        <div className="relative mt-4">
          {preview ? (
            <div
              className="doc-preview min-h-[50vh] rounded-2xl border border-line-bold bg-surface p-6 sm:p-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <>
              <textarea
                ref={area}
                value={body}
                onChange={(e) => onBody(e.target.value, e.target.selectionStart)}
                onClick={() => setSlash(null)}
                placeholder={t("doc.bodyPlaceholder")}
                className="min-h-[55vh] w-full resize-none rounded-2xl border border-line-bold bg-surface p-6 font-sans text-[15px] leading-relaxed text-ink outline-none transition placeholder:text-ink-muted focus:border-brand sm:p-8"
              />

              {slash && (
                <SlashMenu
                  commands={shown}
                  onPick={runCommand}
                  onClose={() => setSlash(null)}
                />
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
          {t("doc.hint")}
        </p>
      </main>

      {picker === "quran" && (
        <QuranPicker
          onInsert={(md) => {
            insert(md, range);
            setPicker(null);
            setRange(null);
          }}
          onClose={() => {
            setPicker(null);
            setRange(null);
          }}
        />
      )}

      {picker === "hadith" && (
        <HadithPicker
          onInsert={(md) => {
            insert(md, range);
            setPicker(null);
            setRange(null);
          }}
          onClose={() => {
            setPicker(null);
            setRange(null);
          }}
        />
      )}
    </AppShell>
  );
}

function Tool({
  icon,
  label,
  onClick,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-1.5 rounded-full border border-line-bold px-3.5 text-xs text-ink-secondary transition hover:border-brand hover:text-ink"
    >
      <Icon name={icon} size={14} />
      {label}
    </button>
  );
}
