"use client";

import { useServerInsertedHTML } from "next/navigation";

import { themeInitScript } from "@/lib/theme/script";

/**
 * Injects the theme boot script during SSR via useServerInsertedHTML.
 * Returns null so React 19 never client-renders a <script> (which warns).
 */
export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="assetflow-theme-init"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  ));

  return null;
}
