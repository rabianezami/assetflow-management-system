import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { localeNames } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
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

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-16">
      <main className="flex w-full max-w-2xl flex-col gap-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-caption tracking-wide text-muted-foreground uppercase">
              {t("localeLabel")}: {localeNames[locale]}
            </p>
            <h1 className="text-heading-lg font-heading text-foreground">
              {t("title")}
            </h1>
            <p className="text-body text-muted-foreground">{t("description")}</p>
          </div>
          <ThemeToggle
            labelToLight={tTheme("toLight")}
            labelToDark={tTheme("toDark")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {routing.locales.map((item) => (
            <Button
              key={item}
              nativeButton={false}
              render={<Link href="/" locale={item} />}
              variant={item === locale ? "default" : "outline"}
              size="sm"
            >
              {localeNames[item]}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
