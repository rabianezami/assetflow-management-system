import {
  parseThemePreference,
  themeConfig,
  type ResolvedTheme,
  type ThemePreference,
} from "./config";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(themeConfig.mediaQuery).matches ? "dark" : "light";
}

export function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return themeConfig.defaultTheme;
  }

  try {
    return (
      parseThemePreference(localStorage.getItem(themeConfig.storageKey)) ??
      themeConfig.defaultTheme
    );
  } catch {
    return themeConfig.defaultTheme;
  }
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme = getSystemTheme(),
): ResolvedTheme {
  return preference === "system" ? systemTheme : preference;
}

export function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}
