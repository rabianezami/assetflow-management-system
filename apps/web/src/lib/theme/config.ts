export const THEME_STORAGE_KEY = "theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const themeConfig = {
  storageKey: THEME_STORAGE_KEY,
  mediaQuery: THEME_MEDIA_QUERY,
  /** Preference before the user explicitly picks light/dark. */
  defaultTheme: "system",
} as const;

export type ResolvedTheme = "light" | "dark";
export type ThemePreference = ResolvedTheme | "system";

export function parseThemePreference(value: string | null): ThemePreference | null {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }

  return null;
}
