import { NextResponse } from "next/server";
import { fetchPassage } from "@/lib/quran";

export const revalidate = 604800; // 7 kun

function num(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const surah = num(params.get("surah"));
  const from = num(params.get("from"));
  const to = num(params.get("to"));
  const translation = num(params.get("translation"));

  if (
    surah === null ||
    from === null ||
    to === null ||
    translation === null ||
    surah < 1 ||
    surah > 114 ||
    from < 1 ||
    to < from ||
    to - from > 20 ||
    translation < 1
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  try {
    const ayahs = await fetchPassage(surah, from, to, translation);
    return NextResponse.json({ ayahs });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
