import { NavRail } from "./NavRail";

/** Desktopda 88px chap ustun, mobilda pastdagi panel uchun joy */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <NavRail />
      <div className="pb-20 md:pb-0 md:pl-[88px]">{children}</div>
    </div>
  );
}
