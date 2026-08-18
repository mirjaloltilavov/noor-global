"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { Stage } from "@/components/sakinah/Stage";
import { Icon } from "@/components/ui/Icon";
import { usePassage } from "@/lib/usePassage";
import { getMood, passageRef } from "@/lib/sakinah";

/** Sessiya oxirida ko'rsatiladigan yakuniy oyat */
const CLOSING = { surah: 94, ayah: 6, ref: "Ash-Sharh 94:6" };

export default function CompletePage() {
  const router = useRouter();
  const { t, ln, locale, prefs, current, setCurrent, pushHistory, updateHistory, ready } =
    useApp();

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const recorded = useRef<string | null>(null);

  useEffect(() => {
    if (ready && !current) router.replace("/sakinah");
  }, [ready, current, router]);

  const mood = current ? getMood(current.mood) : null;
  const passages = mood?.passages ?? [];
  const index = current?.index ?? 0;
  const isLast = index >= passages.length - 1;
  const minutes = passages.reduce((s, p) => s + p.minutes, 0);

  const closing = usePassage(CLOSING.surah, CLOSING.ayah, CLOSING.ayah, locale);
  const closingAyah = closing.ayahs?.[0] ?? null;

  // Sessiya tugagach tarixga bir marta yoziladi
  useEffect(() => {
    if (!current || !mood || !isLast) return;
    const id = `${current.mood}-${current.startedAt}`;
    if (recorded.current === id) return;
    recorded.current = id;

    pushHistory({
      id,
      at: current.startedAt,
      mood: current.mood,
      refs: passages.map((p) => passageRef(p)),
      minutes,
    });
    setCurrent({ ...current, done: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.startedAt, isLast]);

  if (!ready || !current || !mood) {
    return (
      <Stage
        background={prefs.background}
        brightness={prefs.brightness}
        reduceMotion={prefs.reduceMotion}
      >
        <div className="flex min-h-screen items-center justify-center text-sm text-white/60">
          {t("common.loading")}
        </div>
      </Stage>
    );
  }

  function nextPassage() {
    setCurrent({ ...current!, index: index + 1, done: false });
    router.push("/sakinah/read");
  }

  async function share() {
    const text = closingAyah
      ? `${closingAyah.translation} — ${CLOSING.ref}`
      : CLOSING.ref;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard mavjud bo'lmasa — jim o'tamiz */
    }
  }

  function saveToCollection() {
    const id = `${current!.mood}-${current!.startedAt}`;
    updateHistory(id, { liked: true });
    setSaved(true);
  }

  return (
    <Stage
      background={prefs.background}
      brightness={prefs.brightness}
      reduceMotion={prefs.reduceMotion}
    >
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-brand/40">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-night-base">
            <Icon name="check" size={18} />
          </span>
        </span>

        <h1 className="mt-8 text-[40px] font-semibold tracking-tightest text-white">
          {isLast ? t("complete.title") : t("passage.title")}
        </h1>

        <p className="mt-3 text-sm text-white/55">
          {isLast
            ? `${t("complete.meta", { count: passages.length, minutes })} · ${passages
                .map((p) => passageRef(p))
                .join(", ")}`
            : passageRef(passages[index])}
        </p>

        {isLast ? (
          <>
            {closingAyah && (
              <div className="mt-10 w-full max-w-3xl">
                <p
                  className="arabic font-arabic text-3xl text-white"
                  style={{ lineHeight: 1.9 }}
                >
                  {closingAyah.uthmani}
                </p>
                <p className="mt-4 text-sm text-white/55">
                  “{closingAyah.translation}” · {CLOSING.ref}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={saveToCollection}
                className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-night-base transition hover:bg-brand-strong hover:text-white"
              >
                {saved ? t("complete.saved") : t("complete.save")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrent({ ...current, index: 0, done: false, startedAt: Date.now() });
                  router.push("/sakinah/read");
                }}
                className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {t("complete.again")}
              </button>
              <button
                type="button"
                onClick={share}
                className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {copied ? t("complete.copied") : t("complete.share")}
              </button>
              <button
                type="button"
                onClick={() => router.push("/sakinah")}
                className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {t("complete.done")}
              </button>
            </div>

            <div className="mt-10 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {t("complete.feedbackQ")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {liked === null
                      ? t("complete.feedbackHelp")
                      : t("complete.thanks")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLiked(true);
                      updateHistory(`${current.mood}-${current.startedAt}`, {
                        liked: true,
                      });
                    }}
                    aria-pressed={liked === true}
                    className={[
                      "h-9 rounded-full px-5 text-sm transition",
                      liked === true
                        ? "bg-brand text-night-base font-semibold"
                        : "bg-white/10 text-white/80 hover:bg-white/20",
                    ].join(" ")}
                  >
                    {t("complete.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLiked(false);
                      updateHistory(`${current.mood}-${current.startedAt}`, {
                        liked: false,
                      });
                    }}
                    aria-pressed={liked === false}
                    className={[
                      "h-9 rounded-full px-5 text-sm transition",
                      liked === false
                        ? "bg-white text-night-base font-semibold"
                        : "bg-white/10 text-white/80 hover:bg-white/20",
                    ].join(" ")}
                  >
                    {t("complete.no")}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-10 max-w-2xl text-xs leading-relaxed text-white/35">
              {t("complete.disclaimer")}
            </p>
          </>
        ) : (
          /* S12 · Parcha yakunlandi — to'liq sura yoki keyingi parcha */
          <>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/50">
              {ln(passages[index].note)}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={nextPassage}
                className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-night-base transition hover:bg-brand-strong hover:text-white"
              >
                {t("passage.next")}
              </button>
              <button
                type="button"
                onClick={() => router.push("/quran")}
                className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {t("passage.continueSurah")}
              </button>
              <button
                type="button"
                onClick={() => router.push("/sakinah")}
                className="h-11 rounded-full bg-white/10 px-7 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {t("passage.adjust")}
              </button>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
}
