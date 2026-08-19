"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet } from "@/components/docs/Sheet";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { Icon } from "@/components/ui/Icon";
import { ayahCite } from "@/lib/cite";
import { fetchPassage, searchVerses, type Ayah, type SearchHit } from "@/lib/quran";
import { SURAHS } from "@/lib/sakinah";

/**
 * Oyat qidirish va hujjatga qo'yish.
 * Ikki yo'l: so'z bo'yicha qidiruv (quran.com indeksi) yoki
 * to'g'ridan-to'g'ri manzil — «2:255».
 */
export function QuranPicker({
  onInsert,
  onClose,
}: {
  onInsert: (markdown: string) => void;
  onClose: () => void;
}) {
  const { t, locale, translationId } = useApp();
  const player = usePlayer();

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [picked, setPicked] = useState<Ayah | null>(null);
  const [withArabic, setWithArabic] = useState(true);
  const [withTranslation, setWithTranslation] = useState(true);

  // «2:255» yoki «2 255» — to'g'ridan-to'g'ri manzil
  const direct = useMemo(() => {
    const m = query.trim().match(/^(\d{1,3})\s*[:. ]\s*(\d{1,3})$/);
    if (!m) return null;
    const surah = Number(m[1]);
    const ayah = Number(m[2]);
    if (surah < 1 || surah > 114 || ayah < 1) return null;
    return { surah, ayah };
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    if (direct || q.length < 2) {
      setHits([]);
      return;
    }

    let alive = true;
    setBusy(true);
    setError(false);
    const id = window.setTimeout(async () => {
      try {
        const found = await searchVerses(q, locale, 12);
        if (alive) setHits(found);
      } catch {
        if (alive) setError(true);
      } finally {
        if (alive) setBusy(false);
      }
    }, 350);

    return () => {
      alive = false;
      window.clearTimeout(id);
    };
  }, [query, locale, direct]);

  const surahName = (surah: number) =>
    SURAHS[surah]?.slug ??
    player.chapters.find((c) => c.id === surah)?.slug ??
    `Surah ${surah}`;

  async function choose(surah: number, ayah: number) {
    setBusy(true);
    setError(false);
    try {
      const [verse] = await fetchPassage(surah, ayah, ayah, translationId, 7);
      setPicked(verse);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet
      title={t("cmd.quran")}
      subtitle={t("cmd.quranSub")}
      onClose={onClose}
      footer={
        picked ? (
          <div className="flex flex-wrap items-center gap-3">
            <Toggle
              label={t("cite.arabic")}
              checked={withArabic}
              onChange={setWithArabic}
            />
            <Toggle
              label={t("cite.translation")}
              checked={withTranslation}
              onChange={setWithTranslation}
            />
            <button
              type="button"
              onClick={() =>
                onInsert(
                  ayahCite(picked, surahName(picked.surah), {
                    arabic: withArabic,
                    translation: withTranslation,
                  })
                )
              }
              disabled={!withArabic && !withTranslation}
              className="ml-auto h-10 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-40"
            >
              {t("cite.insert")}
            </button>
          </div>
        ) : null
      }
    >
      <input
        autoFocus
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPicked(null);
        }}
        placeholder={t("cmd.quranPlaceholder")}
        className="h-11 w-full rounded-full border border-line-bold bg-surface-subtle px-5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand"
      />

      {error && (
        <p className="mt-4 text-sm text-ink-secondary">{t("common.error")}</p>
      )}

      {picked ? (
        <div className="mt-5 rounded-2xl border border-line-bold bg-surface-subtle p-5">
          <p className="text-xs font-semibold text-ink-secondary">
            {surahName(picked.surah)} {picked.surah}:{picked.ayah}
          </p>
          {withArabic && (
            <p
              dir="rtl"
              className="arabic mt-3 font-arabic text-2xl leading-loose text-ink"
            >
              {picked.uthmani}
            </p>
          )}
          {withTranslation && (
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              {picked.translation}
            </p>
          )}
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="mt-4 text-xs text-ink-secondary underline-offset-4 transition hover:text-ink hover:underline"
          >
            {t("cite.another")}
          </button>
        </div>
      ) : (
        <>
          {direct && (
            <button
              type="button"
              onClick={() => choose(direct.surah, direct.ayah)}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-line-bold bg-surface-subtle px-4 py-3 text-left transition hover:border-brand"
            >
              <Icon name="quran" size={16} className="text-brand" />
              <span className="text-sm font-semibold text-ink">
                {surahName(direct.surah)} {direct.surah}:{direct.ayah}
              </span>
              <Icon
                name="arrowRight"
                size={15}
                className="ml-auto text-ink-icon"
              />
            </button>
          )}

          {busy && (
            <p className="mt-4 text-sm text-ink-secondary">
              {t("common.loading")}
            </p>
          )}

          {hits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {hits.map((h) => (
                <li key={h.key}>
                  <button
                    type="button"
                    onClick={() => choose(h.surah, h.ayah)}
                    className="w-full rounded-xl border border-line-bold bg-surface px-4 py-3 text-left transition hover:border-brand"
                  >
                    <span className="text-xs font-semibold text-ink-secondary">
                      {surahName(h.surah)} {h.key}
                    </span>
                    <span
                      dir="rtl"
                      className="arabic mt-1.5 block truncate font-arabic text-lg text-ink"
                    >
                      {h.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!busy && !direct && query.trim().length >= 2 && hits.length === 0 && (
            <p className="mt-4 text-sm text-ink-secondary">{t("cmd.noResult")}</p>
          )}
        </>
      )}
    </Sheet>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brand"
      />
      {label}
    </label>
  );
}
