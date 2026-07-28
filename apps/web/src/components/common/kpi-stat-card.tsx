import type { ReactNode } from "react";

import { DirectionalIcon } from "@/components/common/directional-icon";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type KpiStatCardProps = {
  label: string;
  value: number | string;
  icon?: ReactNode;
  showChevron?: boolean;
  compact?: boolean;
  className?: string;
};

export function KpiStatCard({
  label,
  value,
  icon,
  showChevron = false,
  compact = false,
  className,
}: KpiStatCardProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3",
          className,
        )}
      >
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-heading-sm font-heading tabular-nums text-foreground">
            {value}
          </span>
          <span className="text-caption text-muted-foreground">{label}</span>
        </div>
        {showChevron ? (
          <DirectionalIcon
            icon={ChevronRight}
            className="size-4 shrink-0 text-muted-foreground"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 shadow-sm",
        className,
      )}
    >
      {icon ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-2xl font-semibold leading-none tabular-nums text-foreground">
          {value}
        </span>
        <span className="mt-1.5 text-body-sm text-muted-foreground">{label}</span>
      </div>
      {showChevron ? (
        <DirectionalIcon
          icon={ChevronRight}
          className="size-4 shrink-0 text-muted-foreground"
        />
      ) : null}
    </div>
  );
}
