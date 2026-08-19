"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet } from "@/components/docs/Sheet";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { hadithCite, stripTags } from "@/lib/cite";
import {
  fetchHadith,
  fetchHadithCategories,
  fetchHadithList,
  type HadithCategory,
  type HadithFull,
  type HadithItem,
} from "@/lib/hadith";

/**
 * Hadis tanlash. Manbada (hadeethenc.com) qidiruv endpointi yo'q —
 * shuning uchun avval mavzu tanlanadi, so'ng ro'yxat sarlavhalari
 * bo'yicha filtrlanadi.
 */
export function HadithPicker({
  onInsert,
  onClose,
}: {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}) {
  const { t, locale } = useApp();

  const [cats, setCats] = useState<HadithCategory[]>([]);
  const [cat, setCat] = useState<HadithCategory | null>(null);
  const [items, setItems] = useState<HadithItem[]>([]);
  const [picked, setPicked] = useState<HadithFull | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setBusy(true);
    fetchHadithCategories(locale)
      .then((list) => alive && setCats(list))
      .catch(() => alive && setError(true))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!cat) return;
    let alive = true;
    setBusy(true);
    setError(false);
    fetchHadithList(locale, cat.id, 1, 60)
      .then((list) => alive && setItems(list))
      .catch(() => alive && setError(true))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [cat, locale]);

  const shownCats = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? cats.filter((c) => c.title.toLowerCase().includes(q)) : cats;
  }, [cats, query]);

  const shownItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((x) => x.title.toLowerCase().includes(q)) : items;
  }, [items, query]);

  async function choose(id: string) {
    setBusy(true);
    setError(false);
    try {
      const full = await fetchHadith(locale, id);
      setPicked(full);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet
      title={t("cmd.hadith")}
      subtitle={cat ? cat.title : t("cmd.hadithSub")}
      onClose={onClose}
      footer={
        picked ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="text-xs text-ink-secondary underline-offset-4 transition hover:text-ink hover:underline"
            >
              {t("cite.another")}
            </button>
            <button
              type="button"
              onClick={() => onInsert(hadithCite(picked))}
              className="ml-auto h-10 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong"
            >
              {t("cite.insert")}
            </button>
          </div>
        ) : null
      }
    >
      {picked ? (
        <div className="rounded-2xl border border-line-bold bg-surface-subtle p-5">
          <p className="text-sm font-semibold text-ink">
            {stripTags(picked.title)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            {stripTags(picked.text)}
          </p>
          <p className="mt-3 text-xs text-ink-muted">
            {[picked.attribution, picked.grade]
              .map(stripTags)
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {cat && (
              <button
                type="button"
                onClick={() => {
                  setCat(null);
                  setItems([]);
                  setQuery("");
                }}
                aria-label={t("common.close")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-bold text-ink-icon transition hover:border-brand"
              >
                <Icon name="arrowLeft" size={16} />
              </button>
            )}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={cat ? t("cmd.filterHadith") : t("cmd.filterTopic")}
              className="h-11 w-full rounded-full border border-line-bold bg-surface-subtle px-5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-ink-secondary">{t("common.error")}</p>
          )}
          {busy && (
            <p className="mt-4 text-sm text-ink-secondary">
              {t("common.loading")}
            </p>
          )}

          {!cat && shownCats.length > 0 && (
            <ul className="mt-4 space-y-2">
              {shownCats.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setCat(c);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-line-bold bg-surface px-4 py-3 text-left transition hover:border-brand"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {c.title}
                    </span>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {c.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cat && shownItems.length > 0 && (
            <ul className="mt-4 space-y-2">
              {shownItems.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => choose(h.id)}
                    className="w-full rounded-xl border border-line-bold bg-surface px-4 py-3 text-left text-sm leading-relaxed text-ink transition hover:border-brand"
                  >
                    {stripTags(h.title)}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {cat && !busy && shownItems.length === 0 && (
            <p className="mt-4 text-sm text-ink-secondary">{t("cmd.noResult")}</p>
          )}

          <p className="mt-6 text-[11px] leading-relaxed text-ink-muted">
            {t("cmd.hadithSource")}
          </p>
        </>
      )}
    </Sheet>
  );
}
