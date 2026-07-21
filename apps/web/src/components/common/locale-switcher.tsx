"use client";

import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { localeNames, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LocaleSwitcherProps = {
  label: string;
  pathname: string;
};

export function LocaleSwitcher({ label, pathname }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={label}
    >
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
