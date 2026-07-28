import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SummaryCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SummaryCard({ title, action, children, className }: SummaryCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
