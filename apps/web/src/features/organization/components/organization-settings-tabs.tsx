"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/organization", labelKey: "organizationTab" as const },
  { href: "/settings/members", labelKey: "membersTab" as const },
];

export function OrganizationSettingsTabs() {
  const t = useTranslations("Organization.settings");
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-6 border-b border-border"
      aria-label={t("tabsLabel")}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
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
