"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

export type CommandId =
  | "quran"
  | "hadith"
  | "heading"
  | "sub"
  | "quote"
  | "list"
  | "rule";

export interface Command {
  id: CommandId;
  icon: IconName;
  label: string;
  hint: string;
  /** Yozilganda mos keladigan so'zlar (uz/ru/en) */
  keys: string[];
}

export function useCommands(): Command[] {
  const { t } = useApp();
  return [
    {
      id: "quran",
      icon: "quran",
      label: t("cmd.quran"),
      hint: t("cmd.quranHint"),
      keys: ["oyat", "quran", "qur'on", "аят", "коран", "verse"],
    },
    {
      id: "hadith",
      icon: "hadith",
      label: t("cmd.hadith"),
      hint: t("cmd.hadithHint"),
      keys: ["hadis", "hadith", "хадис"],
    },
    {
      id: "heading",
      icon: "type",
      label: t("cmd.heading"),
      hint: t("cmd.headingHint"),
      keys: ["sarlavha", "heading", "заголовок", "h2"],
    },
    {
      id: "sub",
      icon: "type",
      label: t("cmd.sub"),
      hint: t("cmd.subHint"),
      keys: ["kichik", "sub", "подзаголовок", "h3"],
    },
    {
      id: "quote",
      icon: "layers",
      label: t("cmd.quote"),
      hint: t("cmd.quoteHint"),
      keys: ["iqtibos", "quote", "цитата"],
    },
    {
      id: "list",
      icon: "list",
      label: t("cmd.list"),
      hint: t("cmd.listHint"),
      keys: ["royxat", "ro'yxat", "list", "список"],
    },
    {
      id: "rule",
      icon: "minimize",
      label: t("cmd.rule"),
      hint: t("cmd.ruleHint"),
      keys: ["ajratgich", "chiziq", "rule", "линия", "divider"],
    },
  ];
}

/** «/» dan keyin yozilgan so'z bo'yicha filtr */
export function filterCommands(list: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.keys.some((k) => k.startsWith(q) || k.includes(q))
  );
}

export function SlashMenu({
  commands,
  onPick,
  onClose,
}: {
  commands: Command[];
  onPick: (id: CommandId) => void;
  onClose: () => void;
}) {
  const { t } = useApp();
  const [active, setActive] = useState(0);

  useEffect(() => setActive(0), [commands.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => (v + 1) % Math.max(1, commands.length));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => (v - 1 + commands.length) % Math.max(1, commands.length));
      }
      if (e.key === "Enter" && commands[active]) {
        e.preventDefault();
        onPick(commands[active].id);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [commands, active, onPick, onClose]);

  if (commands.length === 0)
    return (
      <div className="absolute bottom-4 left-4 z-20 rounded-xl border border-line-bold bg-surface px-4 py-3 text-xs text-ink-secondary shadow-panel">
        {t("cmd.noResult")}
      </div>
    );

  return (
    <div className="absolute bottom-4 left-4 z-20 w-[min(360px,calc(100%-2rem))] overflow-hidden rounded-xl border border-line-bold bg-surface shadow-panel">
      <p className="border-b border-line px-4 py-2 text-[11px] uppercase tracking-wide text-ink-muted">
        {t("cmd.title")}
      </p>
      <ul className="max-h-64 overflow-y-auto py-1">
        {commands.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(c.id);
              }}
              className={[
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                i === active ? "bg-brand-soft" : "hover:bg-surface-raised",
              ].join(" ")}
            >
              <Icon name={c.icon} size={16} className="shrink-0 text-brand" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">
                  {c.label}
                </span>
                <span className="block truncate text-[11px] text-ink-secondary">
                  {c.hint}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
