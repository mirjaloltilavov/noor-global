"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";

/** Daftar bo'limi uchun yorug' modal — pleyerdagi qorong'i Modal'dan farqli */
export function Sheet({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="anim-fade-in fixed inset-0 z-50 flex items-start justify-center bg-ink/30 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (!panel.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panel}
        className="flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line-bold bg-surface shadow-panel"
      >
        <header className="flex items-start gap-4 border-b border-line px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-ink-secondary">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-icon transition hover:bg-surface-raised"
          >
            <Icon name="close" size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="border-t border-line px-6 py-4">{footer}</footer>
        )}
      </div>
    </div>
  );
}
