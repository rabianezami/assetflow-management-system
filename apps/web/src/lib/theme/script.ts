import { themeConfig } from "./config";

/**
 * Blocking boot script generated from the same constants as the client resolver.
 * Must stay behaviorally identical to `resolveTheme(readStoredPreference(), system)`.
 */
export function buildThemeInitScript(): string {
  const storageKey = JSON.stringify(themeConfig.storageKey);
  const mediaQuery = JSON.stringify(themeConfig.mediaQuery);
  const defaultTheme = JSON.stringify(themeConfig.defaultTheme);

  return `(function(){try{var k=${storageKey};var s=localStorage.getItem(k);var pref=s==="light"||s==="dark"||s==="system"?s:${defaultTheme};var sys=window.matchMedia(${mediaQuery}).matches?"dark":"light";var t=pref==="system"?sys:pref;var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t;}catch(e){}})();`;
}

export const themeInitScript = buildThemeInitScript();
