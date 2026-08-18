import { NextResponse } from "next/server";
import { fetchChapters } from "@/lib/quran";
import { LOCALES, type Locale } from "@/lib/i18n";

export const revalidate = 2592000; // 30 kun

/** quran.com til kodlari */
const API_LANG: Record<Locale, string> = { uz: "uz", ru: "ru", en: "en" };

export async function GET(request: Request) {
  const locale = (new URL(request.url).searchParams.get("locale") ??
    "en") as Locale;

  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  try {
    const chapters = await fetchChapters(API_LANG[locale]);
    return NextResponse.json({ chapters });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
