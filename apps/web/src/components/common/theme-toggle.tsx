"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme/store";

type ThemeToggleProps = {
  labelToLight: string;
  labelToDark: string;
};

export function ThemeToggle({ labelToLight, labelToDark }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      aria-label={isDark ? labelToLight : labelToDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
