"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { DirectionalIcon } from "@/components/common/directional-icon";
import { dashboardNavItems } from "@/config/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const appName = tCommon("appName");

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-svh shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed
          ? "w-[var(--sidebar-width-collapsed)]"
          : "w-[var(--sidebar-width)]",
      )}
    >
      <div className="flex h-[var(--header-height)] items-center border-b border-sidebar-border px-4">
        {!collapsed ? (
          <span className="truncate text-label font-semibold">{appName}</span>
        ) : (
          <span className="mx-auto text-label font-semibold">
            {appName.charAt(0)}
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2" aria-label={t("main")}>
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const label = t(item.labelKey);
          const active = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active &&
                  "border-s-2 border-sidebar-primary bg-sidebar-accent font-medium text-sidebar-primary",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {!collapsed ? <span className="truncate">{label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={t("collapse")}
          aria-expanded={!collapsed}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <DirectionalIcon icon={ChevronLeft} className="size-4" />
        </button>
      </div>
    </aside>
  );
}
