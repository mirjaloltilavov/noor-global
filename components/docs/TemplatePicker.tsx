"use client";

import { Sheet } from "@/components/docs/Sheet";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { TEMPLATES, type Template } from "@/lib/templates";

/** Yangi hujjat — bo'sh varaq yoki tayyor tuzilma */
export function TemplatePicker({
  onPick,
  onClose,
}: {
  onPick: (tpl: Template) => void;
  onClose: () => void;
}) {
  const { t, locale } = useApp();

  return (
    <Sheet title={t("doc.new")} subtitle={t("tpl.sub")} onClose={onClose}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map((tpl) => (
          <li key={tpl.id}>
            <button
              type="button"
              onClick={() => onPick(tpl)}
              className="flex h-full w-full flex-col rounded-2xl border border-line-bold bg-surface p-5 text-left transition hover:border-brand"
            >
              <span className="flex items-center gap-2">
                <Icon
                  name={tpl.id === "blank" ? "notepad" : "list"}
                  size={16}
                  className="text-brand"
                />
                <span className="text-sm font-semibold text-ink">
                  {tpl.label[locale]}
                </span>
              </span>
              <span className="mt-2 text-xs leading-relaxed text-ink-secondary">
                {tpl.hint[locale]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] leading-relaxed text-ink-muted">
        {t("tpl.note")}
      </p>
    </Sheet>
  );
}
