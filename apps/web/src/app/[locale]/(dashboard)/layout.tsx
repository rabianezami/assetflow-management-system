import { getTranslations } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { ShellHeaderActions } from "@/components/layout/shell-header-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Navigation");
  const tTheme = await getTranslations("Theme");
  const tLocale = await getTranslations("Locale");

  return (
    <AppShell
      appName={tCommon("appName")}
      collapseLabel={tNav("collapse")}
      headerActions={
        <ShellHeaderActions
          pathname="/dashboard"
          localeLabel={tLocale("switch")}
          labelToLight={tTheme("toLight")}
          labelToDark={tTheme("toDark")}
        />
      }
    >
      {children}
    </AppShell>
  );
}
