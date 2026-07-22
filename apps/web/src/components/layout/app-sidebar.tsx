"use client";

import { ChevronLeft, LayoutDashboard, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";

import { DirectionalIcon } from "@/components/common/directional-icon";
import { mainNavItems } from "@/config/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  appName: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  collapseLabel: string;
};

const navIcons = {
  home: LayoutGrid,
  dashboard: LayoutDashboard,
} as const;

export function AppSidebar({
  appName,
  collapsed = false,
  onToggleCollapse,
  collapseLabel,
}: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-svh shrink-0 flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
      )}
    >
      <div className="flex h-[var(--header-height)] items-center border-b border-sidebar-border px-4">
        {!collapsed ? (
          <span className="truncate text-label font-semibold">{appName}</span>
        ) : (
          <span className="mx-auto text-label font-semibold">{appName.charAt(0)}</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2" aria-label={t("main")}>
        {mainNavItems.map((item) => {
          const Icon = navIcons[item.labelKey];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "border-s-2 border-sidebar-primary bg-sidebar-accent font-medium text-sidebar-primary",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed ? <span className="truncate">{t(item.labelKey)}</span> : null}
            </Link>
          );
        })}
      </nav>

      {onToggleCollapse ? (
        <div className="border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapseLabel}
            className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <DirectionalIcon icon={ChevronLeft} className="size-4" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
