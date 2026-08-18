"use client";

import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";

export function TopBar({
  title,
  searchPlaceholder,
  search,
  onSearch,
}: {
  title: string;
  searchPlaceholder?: string;
  search?: string;
  onSearch?: (value: string) => void;
}) {
  const { locale, setLocale } = useApp();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-surface-subtle/90 px-4 backdrop-blur sm:gap-4 sm:px-8">
      <h1 className="text-sm font-semibold text-ink">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {searchPlaceholder && (
          <label className="relative hidden md:block">
            <span className="sr-only">{searchPlaceholder}</span>
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-[220px] rounded-xl lg:w-[280px] border border-line-bold bg-surface pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
            />
          </label>
        )}

        <div
          className="flex items-center rounded-xl border border-line-bold bg-surface p-0.5"
          role="group"
          aria-label="Language"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              aria-pressed={locale === l}
              className={[
                "h-8 rounded-lg px-2.5 text-xs font-semibold transition",
                locale === l
                  ? "bg-brand-soft text-brand-strong"
                  : "text-ink-secondary hover:text-ink",
              ].join(" ")}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
