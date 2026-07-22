"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { localeNames, type Locale } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("Locale");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t("switch")}>
      {routing.locales.map((item) => (
        <Button
          key={item}
          nativeButton={false}
          render={<Link href={pathname} locale={item} />}
          variant={item === locale ? "default" : "outline"}
          size="sm"
        >
          {localeNames[item]}
        </Button>
      ))}
    </div>
  );
}
