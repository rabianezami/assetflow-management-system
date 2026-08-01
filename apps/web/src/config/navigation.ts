import { LayoutDashboard, Package, type LucideIcon } from "lucide-react";

export type DashboardNavItem = {
  href: string;
  labelKey: "dashboard" | "assets";
  icon: LucideIcon;
};

/** App-shell nav only — marketing routes stay out of the dashboard chrome. */
export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/assets", labelKey: "assets", icon: Package },
];
