"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/components/player/PlayerProvider";
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
  { href: "/sakinah", icon: "play", labelKey: "nav.sakinah" },
  { href: "/hadith", icon: "hadith", labelKey: "nav.hadith", soon: true },
  { href: "/ai", icon: "ai", labelKey: "nav.ai", soon: true },
  { href: "/tafsir", icon: "tafsir", labelKey: "nav.tafsir", soon: true },
  { href: "/notepad", icon: "notepad", labelKey: "nav.notepad" },
];

/** Desktopda chapdagi 88px ustun, mobilda pastdagi panel */
export function NavRail() {
  const pathname = usePathname();
  const { t } = useApp();
  const player = usePlayer();

  /** Sakinah bosilganda to'g'ridan-to'g'ri full ekranga qaytamiz */
  const open = () => player.setMinimized(false);

  return (
    <>
      {/* Desktop */}
      <nav
        className="fixed inset-y-0 left-0 z-30 hidden w-[88px] flex-col items-center border-r border-line bg-surface-subtle py-4 md:flex"
        aria-label={t("brand.name")}
      >
        <Link
          href="/sakinah"
          onClick={open}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-soft transition hover:bg-brand-strong active:scale-95"
          aria-label={t("brand.name")}
        >
          <span className="arabic font-arabic text-2xl leading-none">ن</span>
        </Link>

        <ul className="mt-6 flex w-16 flex-col gap-1">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <RailLink
                item={item}
                active={pathname === item.href}
                onOpen={item.href === "/sakinah" ? open : undefined}
              />
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-icon transition hover:bg-surface-raised active:scale-95"
            aria-label={t("nav.settings")}
          >
            <Icon name="settings" size={22} />
          </button>
          <span className="h-8 w-8 rounded-full bg-line-bold" aria-hidden="true" />
        </div>
      </nav>

      {/* Mobil */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label={t("brand.name")}
      >
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={item.href === "/sakinah" ? open : undefined}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2 transition active:scale-95"
            >
              <Icon
                name={item.icon}
                size={20}
                className={active ? "text-brand" : "text-ink-secondary"}
              />
              <span
                className={[
                  "text-[10px] leading-tight",
                  active ? "font-semibold text-ink" : "text-ink-muted",
                ].join(" ")}
              >
                {t(item.labelKey)}
              </span>
              {item.soon && (
                <span
                  className="absolute right-1/2 top-1.5 h-1 w-1 translate-x-3 rounded-full bg-ink-muted/50"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function RailLink({
  item,
  active,
  onOpen,
}: {
  item: NavItem;
  active: boolean;
  onOpen?: () => void;
}) {
  const { t } = useApp();

  return (
    <Link
      href={item.href}
      onClick={onOpen}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl transition duration-200",
        active
          ? "border border-line-bold bg-surface shadow-soft"
          : "border border-transparent hover:bg-surface-raised active:scale-95",
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
  );
}
