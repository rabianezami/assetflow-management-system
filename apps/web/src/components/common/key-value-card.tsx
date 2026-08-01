import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type KeyValueCardProps = {
  title: string;
  action?: ReactNode;
  rows: { label: string; value: ReactNode }[];
  className?: string;
};

export function KeyValueCard({ title, action, rows, className }: KeyValueCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-4 py-3 sm:grid-cols-2 sm:gap-4"
          >
            <dt className="text-body-sm text-muted-foreground">{row.label}</dt>
            <dd className="text-body-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
