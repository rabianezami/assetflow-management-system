export const THEME_STORAGE_KEY = "theme"

export const themeConfig = {
  attribute: "class" as const,
  storageKey: THEME_STORAGE_KEY,
  defaultTheme: "system",
  themes: ["light", "dark"] as const,
  enableSystem: true,
  enableColorScheme: true,
}

export type ThemeName = (typeof themeConfig.themes)[number] | "system"
