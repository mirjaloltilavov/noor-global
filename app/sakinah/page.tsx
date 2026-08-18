"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Onboarding } from "@/components/player/Onboarding";
import { useApp } from "@/components/providers/AppProvider";
import { AppShell } from "@/components/shell/AppShell";
import { TopBar } from "@/components/shell/TopBar";
import { Icon } from "@/components/ui/Icon";
import { DURATION_LABELS, RECITERS, getMood, type MoodId } from "@/lib/sakinah";
import { relativeDay } from "@/lib/session";

export default function SakinahHome() {
  const router = useRouter();
  const { t, ln, locale, prefs, setPrefs, vibe, setVibe, history, ready } =
    useApp();

  const [query, setQuery] = useState("");
  const [howOpen, setHowOpen] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  const shownHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (s) =>
        s.refs.some((r) => r.toLowerCase().includes(q)) ||
        ln(getMood(s.mood).label).toLowerCase().includes(q)
    );
  }, [history, query, ln]);

  /** Kayfiyat tanlandi — sessiya ochiladi va full-screen pleyerga o'tiladi */
  function begin(mood: MoodId) {
    setPrefs({ onboarded: true });
    setVibe({
      mood,
      startedAt: Date.now(),
      minutes: prefs.duration,
      done: false,
    });
    setOnboarding(false);
    router.push("/sakinah/player");
  }

  return (
    <AppShell>
      <TopBar
        title={t("nav.sakinah")}
        searchPlaceholder={t("entry.search")}
        search={query}
        onSearch={setQuery}
      />

      <main className="mx-auto max-w-content px-8 pb-20 pt-8">
        {/* Tugallanmagan sessiya */}
        {ready && vibe && !vibe.done && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-brand/30 bg-brand-soft px-6 py-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                {t("compose.continueTitle")}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-secondary">
                {ln(getMood(vibe.mood).label)} ·{" "}
                {ln(DURATION_LABELS[vibe.minutes])}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVibe(null)}
                className="h-10 rounded-full px-4 text-sm font-medium text-ink-secondary transition hover:text-ink"
              >
                {t("compose.continueNew")}
              </button>
              <Link
                href="/sakinah/player"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-strong"
              >
                {t("compose.continueGo")}
                <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand-soft/60 px-10 py-9">
          <span
            className="arabic pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none font-arabic text-[110px] leading-none text-brand/20 lg:block"
            aria-hidden="true"
          >
            سَكِينَة
          </span>

          <h2 className="max-w-2xl text-[42px] font-semibold leading-[1.1] tracking-tightest text-ink">
            {t("entry.title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-secondary">
            {t("entry.subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setOnboarding(true)}
              className="h-12 rounded-full bg-brand px-9 text-base font-semibold text-white transition hover:bg-brand-strong"
            >
              {t("entry.begin")}
            </button>
            <button
              type="button"
              onClick={() => setHowOpen((v) => !v)}
              aria-expanded={howOpen}
              className="h-12 rounded-full border border-line-bold bg-surface px-6 text-sm font-semibold text-ink transition hover:border-ink-muted"
            >
              {t("entry.how")}
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1.5 text-xs font-medium text-brand-strong">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("entry.reviewed")}
            </span>
          </div>

          {howOpen && (
            <ol className="mt-5 max-w-2xl space-y-2 rounded-xl bg-surface/70 px-6 py-5 text-sm leading-relaxed text-ink-secondary">
              <li>1. {t("onboard.subtitle")}</li>
              <li>2. {t("entry.reviewed")}</li>
              <li>3. {t("finish.noHint")}</li>
            </ol>
          )}
        </section>

        {/* Standart qori */}
        <section className="mt-8">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-lg font-semibold text-ink">
              {t("compose.reciter")}
            </h3>
            <p className="text-xs text-ink-muted">{t("compose.reciterHint")}</p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {RECITERS.map((r) => {
              const active = r.id === prefs.reciter;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setPrefs({ reciter: r.id })}
                  aria-pressed={active}
                  className={[
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-line-bold bg-surface hover:border-ink-muted",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      active
                        ? "bg-brand text-white"
                        : "bg-surface-raised text-ink-secondary",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {r.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {r.name}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">
                      {ln(r.style)} · {ln(r.place)}
                    </span>
                  </span>
                  {active && (
                    <Icon name="check" size={18} className="text-brand" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-muted">
          {t("entry.disclaimer")}
        </p>

        {/* So'nggi sessiyalar */}
        <section className="mt-12">
          <h3 className="text-lg font-semibold text-ink">{t("entry.recent")}</h3>

          {shownHistory.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-line-bold bg-surface px-6 py-8 text-sm text-ink-muted">
              {t("entry.empty")}
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shownHistory.map((s) => (
                <article
                  key={s.id}
                  className="rounded-2xl border border-line-bold bg-surface p-5"
                >
                  <p className="text-xs text-ink-muted">
                    {relativeDay(s.at, locale)}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-strong">
                    {ln(getMood(s.mood).label)}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {s.refs.join(" · ")}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-ink-muted">
                      {t("reminder.min", { n: s.minutes })}
                    </span>
                    <button
                      type="button"
                      onClick={() => begin(s.mood)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-strong transition hover:gap-2"
                    >
                      {t("entry.repeat")}
                      <Icon name="arrowRight" size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {onboarding && (
        <Onboarding
          initialMood={vibe?.mood ?? null}
          dismissible
          onBegin={begin}
          onSkip={() => {
            setPrefs({ onboarded: true });
            setVibe(null);
            setOnboarding(false);
            router.push("/sakinah/player");
          }}
          onClose={() => setOnboarding(false)}
        />
      )}
    </AppShell>
  );
}
