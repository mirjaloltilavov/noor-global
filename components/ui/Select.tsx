"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

/** Figmadagi "chip + popover" tanlagichi (Comfort and calm ⌄, 15 minutes ⌄ …) */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex h-10 items-center gap-2 rounded-full border border-line-bold bg-surface px-4 text-sm font-medium text-ink transition hover:border-ink-muted"
      >
        {selected.label}
        <Icon
          name="chevronDown"
          size={14}
          className={`text-ink-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-12 z-30 min-w-[220px] overflow-hidden rounded-xl border border-line-bold bg-surface p-1 shadow-panel"
        >
          {options.map((o) => (
            <li key={String(o.value)}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm transition",
                  o.value === value
                    ? "bg-brand-soft font-semibold text-brand-strong"
                    : "text-ink-secondary hover:bg-surface-raised hover:text-ink",
                ].join(" ")}
              >
                {o.label}
                {o.value === value && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
