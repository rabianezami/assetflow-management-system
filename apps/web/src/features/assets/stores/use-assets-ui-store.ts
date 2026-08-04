"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AssetsUiState = {
  onboardingDismissed: boolean;
  dismissOnboarding: () => void;
};

/** UI-only preferences. Domain data lives in TanStack Query. */
export const useAssetsUiStore = create<AssetsUiState>()(
  persist(
    (set) => ({
      onboardingDismissed: false,
      dismissOnboarding: () => set({ onboardingDismissed: true }),
    }),
    { name: "assetflow-assets-ui" },
  ),
);
