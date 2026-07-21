import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type DirectionalIconProps = {
  icon: LucideIcon;
  className?: string;
  mirror?: boolean;
};

export function DirectionalIcon({
  icon: Icon,
  className,
  mirror = true,
}: DirectionalIconProps) {
  return <Icon className={cn(mirror && "rtl:rotate-180", className)} />;
}
