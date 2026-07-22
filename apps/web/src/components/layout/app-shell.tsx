"use client";

import { useState, type ReactNode } from "react";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-svh w-full">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader>
          <LocaleSwitcher />
          <ThemeToggle />
        </AppHeader>
        <main className="flex-1 overflow-auto px-[var(--page-padding-x)] py-[var(--page-padding-y)]">
          {children}
        </main>
      </div>
    </div>
  );
}
