"use client";

import type { ReactNode } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { cn } from "@/lib/utils";

type TableEmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function TableEmptyState({
  title,
  description,
  action,
  icon,
  className,
}: TableEmptyStateProps) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={action}
      className={cn("py-12", className)}
    />
  );
}
