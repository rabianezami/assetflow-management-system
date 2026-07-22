"use client";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";

type ShellHeaderActionsProps = {
  pathname: string;
  localeLabel: string;
  labelToLight: string;
  labelToDark: string;
};

export function ShellHeaderActions({
  pathname,
  localeLabel,
  labelToLight,
  labelToDark,
}: ShellHeaderActionsProps) {
  return (
    <>
      <LocaleSwitcher label={localeLabel} pathname={pathname} />
      <ThemeToggle labelToLight={labelToLight} labelToDark={labelToDark} />
    </>
  );
}
