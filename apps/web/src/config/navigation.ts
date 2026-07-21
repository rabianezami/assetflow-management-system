export type NavItem = {
  href: string;
  labelKey: "home" | "dashboard";
};

export const mainNavItems: NavItem[] = [{ href: "/", labelKey: "home" }];
