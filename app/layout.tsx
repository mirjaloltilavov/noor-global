import type { Metadata, Viewport } from "next";
import { Inter, Scheherazade_New } from "next/font/google";
import { AppProvider } from "@/components/providers/AppProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noor Global — Sakinah",
  description:
    "Sakinah — Qur'ondan olimlar ko'rib chiqqan eslatmalar: kayfiyatingizga mos parchalar, tilovat va sokin o'qish sahnasi.",
};

export const viewport: Viewport = {
  themeColor: "#04140d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${inter.variable} ${arabic.variable}`}>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
