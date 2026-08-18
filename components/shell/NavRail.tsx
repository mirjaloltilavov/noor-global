"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

interface NavItem {
  href: string;
  icon: IconName;
  labelKey: string;
  soon?: boolean;
}

const ITEMS: NavItem[] = [
  { href: "/quran", icon: "quran", labelKey: "nav.quran", soon: true },
  { href: "/sakinah", icon: "sakinah", labelKey: "nav.sakinah" },
  { href: "/player", icon: "player", labelKey: "nav.player", soon: true },
  { href: "/hadith", icon: "hadith", labelKey: "nav.hadith", soon: true },
  { href: "/ai", icon: "ai", labelKey: "nav.ai", soon: true },
  { href: "/tafsir", icon: "tafsir", labelKey: "nav.tafsir", soon: true },
  { href: "/notepad", icon: "notepad", labelKey: "nav.notepad", soon: true },
];

export function NavRail() {
  const pathname = usePathname();
  const { t } = useApp();

  return (
    <nav
      className="fixed inset-y-0 left-0 z-30 flex w-[88px] flex-col items-center border-r border-line bg-surface-subtle py-4"
      aria-label={t("brand.name")}
    >
      <Link
        href="/sakinah"
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-soft transition hover:bg-brand-strong"
        aria-label={t("brand.name")}
      >
        <span className="arabic font-arabic text-2xl leading-none">ن</span>
      </Link>

      <ul className="mt-6 flex w-16 flex-col gap-1">
        {ITEMS.map((item) => {
          // /sakinah va /sakinah/player alohida bo'limlar — aniq moslik
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl transition",
                  active
                    ? "border border-line-bold bg-surface shadow-soft"
                    : "border border-transparent hover:bg-surface-raised",
                ].join(" ")}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  className={active ? "text-brand" : "text-ink-icon"}
                />
                <span
                  className={[
                    "px-1 text-center text-[11px] leading-tight",
                    active ? "font-semibold text-ink" : "text-ink-secondary",
                  ].join(" ")}
                >
                  {t(item.labelKey)}
                </span>
                {item.soon && (
                  <span
                    className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-ink-muted/50"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-icon transition hover:bg-surface-raised"
          aria-label={t("nav.settings")}
        >
          <Icon name="settings" size={22} />
        </button>
        <span
          className="h-8 w-8 rounded-full bg-line-bold"
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
