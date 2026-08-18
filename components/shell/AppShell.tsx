import { NavRail } from "./NavRail";

/** Figmadagi 88px chap nav rail + kontent maydoni */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <NavRail />
      <div className="pl-[88px]">{children}</div>
    </div>
  );
}
