"use client";

import { cn } from "@/lib/utils";

export type DetailTab = "overview" | "details";

type DetailTabNavProps = {
  tabs: { id: DetailTab; label: string }[];
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
};

export function DetailTabNav({ tabs, active, onChange }: DetailTabNavProps) {
  return (
    <nav className="flex gap-6 overflow-x-auto border-b border-border" aria-label="Asset sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 border-b-2 pb-3 text-body-sm font-medium transition-colors",
            active === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
          aria-current={active === tab.id ? "page" : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
