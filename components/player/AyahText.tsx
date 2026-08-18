"use client";

import { useApp } from "@/components/providers/AppProvider";
import type { Ayah } from "@/lib/quran";

/**
 * Oyat matni: karaoke (o'qilayotgan so'z yorqinlashadi) va ixtiyoriy
 * so'zma-so'z tarjima — ma'no aynan o'sha so'zning ostida chiqadi.
 */
export function AyahText({
  ayah,
  active,
  wordIndex,
  fontPx,
}: {
  ayah: Ayah;
  /** Joriy o'qilayotgan oyatmi */
  active: boolean;
  wordIndex: number;
  fontPx: number;
}) {
  const { prefs } = useApp();

  const karaoke =
    active && prefs.karaoke && ayah.words.length > 0 && ayah.segments.length > 0;
  const wbw = active && prefs.wordByWord && ayah.words.length > 0;

  const size = active ? fontPx : Math.round(fontPx * 0.72);
  const style = {
    fontSize: `clamp(${Math.round(size * 0.55)}px, 6vw, ${size}px)`,
    lineHeight: prefs.lineHeight,
  };

  // So'zma-so'z ham, karaoke ham kerak bo'lmasa — oddiy matn
  if (!karaoke && !wbw) {
    return (
      <p className="arabic font-arabic text-white" style={style} dir="rtl">
        {prefs.script === "indopak" ? ayah.indopak : ayah.uthmani}
      </p>
    );
  }

  return (
    <p
      className="arabic flex flex-wrap justify-center gap-x-1 font-arabic text-white"
      style={style}
      dir="rtl"
    >
      {ayah.words.map((w, i) => {
        const now = i === wordIndex;
        const done = i < wordIndex;

        return (
          <span
            key={w.position}
            className="inline-flex flex-col items-center align-top"
          >
            <span
              className={[
                karaoke ? "kw" : "",
                karaoke && now ? "kw-now" : "",
                karaoke && done ? "kw-done" : "",
              ].join(" ")}
            >
              {prefs.script === "indopak" ? w.indopak : w.uthmani}
            </span>

            {/* Ma'no qatori — chiziqlar sakramasligi uchun joyi doim band */}
            {wbw && (
              <span
                className="flex h-8 flex-col items-center justify-start leading-tight"
                dir="ltr"
              >
                {now && (
                  <>
                    <span className="tone-text text-[11px] font-medium">
                      {w.latin}
                    </span>
                    <span className="text-[11px] text-white/55">
                      {w.meaning}
                    </span>
                  </>
                )}
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}
