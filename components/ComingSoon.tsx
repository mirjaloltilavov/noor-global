"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { AppShell } from "@/components/shell/AppShell";
import { TopBar } from "@/components/shell/TopBar";
import { Icon, type IconName } from "@/components/ui/Icon";

export function ComingSoon({
  sectionKey,
  icon,
}: {
  sectionKey: string;
  icon: IconName;
}) {
  const { t } = useApp();
  const section = t(sectionKey);

  return (
    <AppShell>
      <TopBar title={section} />
      <main className="mx-auto flex max-w-content flex-col items-start px-8 py-16">
        <div className="w-full rounded-2xl border border-line-bold bg-surface p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t("soon.badge")}
          </span>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised text-ink-icon">
            <Icon name={icon} size={26} />
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tightest text-ink">
            {t("soon.title", { section })}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary">
            {t("soon.body")}
          </p>

          <Link
            href="/sakinah"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            {t("soon.cta")}
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
