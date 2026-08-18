"use client";

import { useApp } from "@/components/providers/AppProvider";
import type { Ayah } from "@/lib/quran";
import { WORD_SIZES } from "@/lib/session";

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

  const glossPx = WORD_SIZES[Math.min(prefs.wordSize, WORD_SIZES.length) - 1];
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
      className={`arabic flex flex-wrap justify-center font-arabic text-white ${
        wbw ? "gap-x-4 gap-y-2" : "gap-x-1"
      }`}
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
                className="flex flex-col items-center justify-start font-sans leading-snug"
                dir="ltr"
                style={{ minHeight: glossPx * 2.6, fontSize: glossPx }}
              >
                {now && (
                  <>
                    <span className="tone-text whitespace-nowrap font-medium italic">
                      {w.latin}
                    </span>
                    <span className="max-w-[16ch] text-center text-white/70">
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
