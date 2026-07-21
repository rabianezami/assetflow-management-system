"use client";

import { useSyncExternalStore } from "react";

import { themeConfig, type ResolvedTheme, type ThemePreference } from "./config";
import {
  applyTheme,
  getSystemTheme,
  readStoredPreference,
  resolveTheme,
} from "./resolve";

type Listener = () => void;

let preference: ThemePreference = themeConfig.defaultTheme;
let hydrated = false;
let storageListening = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") {
    return;
  }

  hydrated = true;
  preference = readStoredPreference();
}

function ensureStorageListener() {
  if (storageListening || typeof window === "undefined") {
    return;
  }

  storageListening = true;
  window.addEventListener("storage", (event) => {
    if (event.key !== themeConfig.storageKey) {
      return;
    }

    preference = readStoredPreference();
    emit();
  });
}

function subscribe(listener: Listener) {
  hydrate();
  ensureStorageListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getPreferenceSnapshot() {
  hydrate();
  return preference;
}

function getPreferenceServerSnapshot(): ThemePreference {
  return themeConfig.defaultTheme;
}

function subscribeToSystemTheme(listener: Listener) {
  const media = window.matchMedia(themeConfig.mediaQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getSystemSnapshot(): ResolvedTheme {
  return getSystemTheme();
}

function getSystemServerSnapshot(): ResolvedTheme {
  return "light";
}

export function setTheme(next: ResolvedTheme) {
  preference = next;

  try {
    localStorage.setItem(themeConfig.storageKey, next);
  } catch {
    // Ignore storage access errors.
  }

  applyTheme(next);
  emit();
}

export function useTheme() {
  const themePreference = useSyncExternalStore(
    subscribe,
    getPreferenceSnapshot,
    getPreferenceServerSnapshot,
  );

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemSnapshot,
    getSystemServerSnapshot,
  );

  const resolvedTheme = resolveTheme(themePreference, systemTheme);

  return {
    resolvedTheme,
    setTheme,
  };
}
