import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { localeNames } from "@/i18n/config";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("HomePage");
  const tTheme = await getTranslations("Theme");
  const tLocale = await getTranslations("Locale");
  const tStatus = await getTranslations("Status");

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <PageHeader
          title={t("title")}
          description={t("description")}
          actions={
            <ThemeToggle
              labelToLight={tTheme("toLight")}
              labelToDark={tTheme("toDark")}
            />
          }
        />

        <p className="text-caption tracking-wide text-muted-foreground uppercase">
          {t("localeLabel")}: {localeNames[locale]}
        </p>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status="active" label={tStatus("active")} />
          <StatusBadge status="assigned" label={tStatus("assigned")} />
          <StatusBadge status="maintenance" label={tStatus("maintenance")} />
        </div>

        <LocaleSwitcher label={tLocale("switch")} pathname="/" />
      </main>
    </div>
  );
}
