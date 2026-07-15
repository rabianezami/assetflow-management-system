"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { themeConfig, type ThemeName } from "@/lib/theme/config"

const MEDIA_QUERY = "(prefers-color-scheme: dark)"

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  resolvedTheme: "light" | "dark"
  systemTheme: "light" | "dark"
  themes: ThemeName[]
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light"
}

function readStoredTheme(): ThemeName {
  if (typeof window === "undefined") {
    return themeConfig.defaultTheme as ThemeName
  }

  try {
    const stored = localStorage.getItem(themeConfig.storageKey)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
  } catch {
    // Ignore storage access errors.
  }

  return themeConfig.defaultTheme as ThemeName
}

function resolveTheme(theme: ThemeName): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme()
  }

  return theme
}

function disableTransitions() {
  if (typeof document === "undefined") {
    return () => {}
  }

  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    setTimeout(() => {
      document.head.removeChild(style)
    }, 1)
  }
}

type ThemeProviderProps = {
  children: ReactNode
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(themeConfig.defaultTheme as ThemeName)
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  const applyTheme = useCallback(
    (nextTheme: ThemeName) => {
      if (typeof document === "undefined") {
        return
      }

      const resolved = resolveTheme(nextTheme)
      const root = document.documentElement
      const enableTransition = disableTransitionOnChange ? disableTransitions() : null

      root.classList.remove(...themeConfig.themes)
      root.classList.add(resolved)

      if (themeConfig.enableColorScheme) {
        root.style.colorScheme = resolved
      }

      enableTransition?.()
    },
    [disableTransitionOnChange]
  )

  useLayoutEffect(() => {
    const stored = readStoredTheme()
    const system = getSystemTheme()

    setThemeState(stored)
    setSystemTheme(system)
    applyTheme(stored)
  }, [applyTheme])

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [applyTheme, theme, systemTheme])

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY)
    const onChange = () => {
      const nextSystemTheme = getSystemTheme()
      setSystemTheme(nextSystemTheme)

      if (theme === "system") {
        applyTheme("system")
      }
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [applyTheme, theme])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== themeConfig.storageKey) {
        return
      }

      setThemeState(
        event.newValue === "light" ||
          event.newValue === "dark" ||
          event.newValue === "system"
          ? event.newValue
          : (themeConfig.defaultTheme as ThemeName)
      )
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setTheme = useCallback((nextTheme: ThemeName) => {
    setThemeState(nextTheme)

    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.setItem(themeConfig.storageKey, nextTheme)
    } catch {
      // Ignore storage access errors.
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme: resolveTheme(theme),
      systemTheme,
      themes: themeConfig.enableSystem
        ? [...themeConfig.themes, "system"]
        : [...themeConfig.themes],
    }),
    [setTheme, systemTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
