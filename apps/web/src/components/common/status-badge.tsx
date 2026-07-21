import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-caption font-medium",
  {
    variants: {
      status: {
        active: "bg-status-active-bg text-status-active",
        assigned: "bg-status-assigned-bg text-status-assigned",
        maintenance: "bg-status-maintenance-bg text-status-maintenance",
        retired: "bg-status-retired-bg text-status-retired",
        error: "bg-status-error-bg text-status-error",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

type StatusBadgeProps = VariantProps<typeof statusBadgeVariants> & {
  label: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>{label}</span>
  );
}
