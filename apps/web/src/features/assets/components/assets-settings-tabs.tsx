"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/assets/settings/types", labelKey: "typesTab" as const },
  { href: "/assets/settings/sites", labelKey: "sitesTab" as const },
];

export function AssetsSettingsTabs() {
  const t = useTranslations("Assets.settings");
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 border-b border-border" aria-label={t("tabsLabel")}>
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 pb-3 text-body-sm font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {t(tab.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
