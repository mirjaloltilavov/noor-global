/**
 * Figmadagi ikonka to'plami — 24×24, stroke 1.5px, currentColor.
 * Tashqi kutubxonaga bog'lanmaslik uchun inline SVG.
 */

export type IconName =
  | "quran"
  | "sakinah"
  | "player"
  | "hadith"
  | "ai"
  | "tafsir"
  | "notepad"
  | "settings"
  | "search"
  | "arrowLeft"
  | "arrowRight"
  | "close"
  | "chevronDown"
  | "play"
  | "pause"
  | "back10"
  | "forward10"
  | "check"
  | "bookmark"
  | "share"
  | "type"
  | "sun"
  | "headphones"
  | "layers"
  | "globe"
  | "sparkle"
  | "translate"
  | "list"
  | "image"
  | "minimize"
  | "maximize"
  | "waveform"
  | "aura";

const PATHS: Record<IconName, React.ReactNode> = {
  quran: (
    <>
      <path d="M12 6.5S10 4.5 6 4.5H3v13h3c4 0 6 2 6 2s2-2 6-2h3v-13h-3c-4 0-6 2-6 2Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  tafsir: (
    <>
      <path d="M12 6.5S10 4.5 6 4.5H3v13h3c4 0 6 2 6 2s2-2 6-2h3v-13h-3c-4 0-6 2-6 2Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  sakinah: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  player: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 9.2 15 12l-4.8 2.8V9.2Z" />
    </>
  ),
  hadith: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),
  ai: (
    <path d="M12 3.5c.7 3.4 1.9 4.6 5.3 5.3-3.4.7-4.6 1.9-5.3 5.3-.7-3.4-1.9-4.6-5.3-5.3 3.4-.7 4.6-1.9 5.3-5.3ZM18 15c.35 1.7.95 2.3 2.65 2.65-1.7.35-2.3.95-2.65 2.65-.35-1.7-.95-2.3-2.65-2.65C17.05 17.3 17.65 16.7 18 15Z" />
  ),
  sparkle: (
    <path d="M12 3.5c.7 3.4 1.9 4.6 5.3 5.3-3.4.7-4.6 1.9-5.3 5.3-.7-3.4-1.9-4.6-5.3-5.3 3.4-.7 4.6-1.9 5.3-5.3Z" />
  ),
  notepad: (
    <>
      <path d="M16.5 4.5 19.5 7.5 9 18l-4 1 1-4 10.5-10.5Z" />
      <path d="M14.5 6.5 17.5 9.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64 1.7 1.7 0 0 0 10.03 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.54 1.03H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1.03Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  close: <path d="M6 6 18 18M18 6 6 18" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  play: <path d="M8 5.5 19 12 8 18.5v-13Z" />,
  pause: <path d="M9 5v14M15 5v14" />,
  back10: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 3.5v4h4" />
    </>
  ),
  forward10: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 3.5v4h-4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  bookmark: <path d="M6.5 4.5h11v15l-5.5-4-5.5 4v-15Z" />,
  share: (
    <>
      <path d="M12 15.5V4" />
      <path d="m8 8 4-4 4 4" />
      <path d="M5.5 13.5v4a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-4" />
    </>
  ),
  type: (
    <>
      <path d="M4 18 9 6l5 12" />
      <path d="M5.6 14h6.8" />
      <path d="M16 18h4M18 12v6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4" height="6.5" rx="2" />
      <rect x="17" y="13.5" width="4" height="6.5" rx="2" />
    </>
  ),
  layers: <rect x="6" y="6" width="12" height="12" rx="3" />,
  translate: (
    <>
      <path d="M3.5 6.5h8M7.5 4.5v2M9.5 6.5c-.6 4-3 6.4-6 7.5M5.5 9.5c.9 2.2 2.6 3.6 4.8 4.3" />
      <path d="m12.5 19.5 4-9 4 9M13.9 16.5h5.2" />
    </>
  ),
  list: (
    <>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
      <path d="M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4 17 4.5-4.5 4 3.5L16 12l4 4.5" />
    </>
  ),
  minimize: (
    <>
      <path d="M9.5 4.5v5h-5" />
      <path d="M14.5 19.5v-5h5" />
      <path d="m4.5 9.5 5-5M19.5 14.5l-5 5" />
    </>
  ),
  maximize: (
    <>
      <path d="M14.5 4.5h5v5" />
      <path d="M9.5 19.5h-5v-5" />
      <path d="m19.5 4.5-6 6M4.5 19.5l6-6" />
    </>
  ),
  waveform: (
    <path d="M3 12h2.5M8 7.5v9M12 4.5v15M16 8.5v7M20.5 11v2" />
  ),
  aura: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4.2a7.8 7.8 0 0 1 0 15.6M12 4.2a7.8 7.8 0 0 0 0 15.6" opacity=".55" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
};

export function Icon({
  name,
  size = 24,
  className = "",
  filled = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
