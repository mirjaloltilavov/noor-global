"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/** Markazda ochiladigan modal — yon drawer o'rniga */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = "lg",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "lg" | "xl";
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const maxW =
    width === "sm" ? "max-w-md" : width === "xl" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div
      className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center bg-night-base/70 p-4 backdrop-blur-md sm:p-6"
      onMouseDown={(e) => {
        if (!panel.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`anim-pop flex max-h-[86vh] w-full ${maxW} flex-col overflow-hidden rounded-2xl border border-white/10 bg-night-panel/95 text-white shadow-panel`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-white/45">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="sk-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <footer className="border-t border-white/10 px-6 py-4">{footer}</footer>
        )}
      </div>
    </div>
  );
}
