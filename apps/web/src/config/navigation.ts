import {
  LayoutDashboard,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  labelKey: "dashboard" | "assets" | "settings";
  icon: LucideIcon;
};

/** App-shell nav only — marketing routes stay out of the dashboard chrome. */
export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/assets", labelKey: "assets", icon: Package },
  { href: "/settings", labelKey: "settings", icon: Settings },
];
