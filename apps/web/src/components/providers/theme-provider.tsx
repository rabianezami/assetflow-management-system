"use client";

import { useEffect, type ReactNode } from "react";

import { applyTheme } from "@/lib/theme/resolve";
import { useTheme } from "@/lib/theme/store";

/**
 * Keeps `<html>` class/`colorScheme` in sync after hydration.
 * Boot-time FOUC prevention is injected by `ThemeScript` (useServerInsertedHTML).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  return children;
}
