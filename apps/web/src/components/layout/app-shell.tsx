"use client";

import { useState, type ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

type AppShellProps = {
  appName: string;
  collapseLabel: string;
  headerActions?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  appName,
  collapseLabel,
  headerActions,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-svh w-full">
      <AppSidebar
        appName={appName}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        collapseLabel={collapseLabel}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader>{headerActions}</AppHeader>
        <main className="flex-1 overflow-auto px-[var(--page-padding-x)] py-[var(--page-padding-y)]">
          {children}
        </main>
      </div>
    </div>
  );
}
