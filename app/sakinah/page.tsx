"use client";

import { useState } from "react";
import { FullScreen } from "@/components/player/FullScreen";
import { OnboardingFlow } from "@/components/player/OnboardingFlow";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useApp } from "@/components/providers/AppProvider";
import { NavRail } from "@/components/shell/NavRail";

export default function SakinahPage() {
  const player = usePlayer();
  const { setPrefs, vibe } = useApp();
  const [onboarding, setOnboarding] = useState(false);
  const [full, setFull] = useState(false);

  const surface = (
    <FullScreen
      embedded={!full}
      fullscreen={full}
      onToggleFullscreen={() => setFull((v) => !v)}
      onOpenOnboarding={() => setOnboarding(true)}
    />
  );

  return (
    <>
      {full ? (
        // To'liq ekran — sidebarsiz
        surface
      ) : (
        // Sidebar qoladi, pleyer kontent maydonida
        <div className="flex min-h-[100dvh] bg-surface-subtle">
          <NavRail />
          <div className="flex-1 md:pl-[88px]">
            <div className="h-[calc(100dvh-56px)] md:h-[100dvh]">{surface}</div>
          </div>
        </div>
      )}

      {onboarding && (
        <OnboardingFlow
          initialMood={vibe?.mood ?? null}
          onBegin={(moods, lead) => {
            setPrefs({ onboarded: true });
            setOnboarding(false);
            player.startVibe(moods, lead);
          }}
          onClose={() => setOnboarding(false)}
        />
      )}
    </>
  );
}
