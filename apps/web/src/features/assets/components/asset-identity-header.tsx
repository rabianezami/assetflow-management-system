"use client";

import type { AssetStatus } from "@/features/assets/types/asset.types";
import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/common/status-badge";
import type { Asset } from "@/features/assets/types/asset.types";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

type AssetIdentityHeaderProps = {
  asset: Asset;
  typeName: string;
  onStatusChange: (status: AssetStatus) => void;
  statusDisabled?: boolean;
};

export function AssetIdentityHeader({
  asset,
  typeName,
  onStatusChange,
  statusDisabled = false,
}: AssetIdentityHeaderProps) {
  const tStatus = useTranslations("Status");
  const t = useTranslations("Assets.detail");
  const displayTitle = asset.displayName || asset.uniqueId;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Package className="size-10" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h1 className="text-heading-lg font-heading text-foreground">{displayTitle}</h1>
        <p className="text-body-sm text-muted-foreground">
          {asset.uniqueId} · {typeName}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={asset.status} label={tStatus(asset.status)} />
          {!statusDisabled ? (
            <>
              <label className="sr-only" htmlFor="asset-status-select">
                {t("changeStatus")}
              </label>
              <select
                id="asset-status-select"
                value={asset.status}
                onChange={(e) => onStatusChange(e.target.value as AssetStatus)}
                className={cn(
                  "h-8 rounded-lg border border-input bg-background px-2 text-caption outline-none focus-visible:border-ring",
                )}
              >
                {(
                  ["active", "assigned", "maintenance", "retired", "error"] as AssetStatus[]
                ).map((s) => (
                  <option key={s} value={s}>
                    {tStatus(s)}
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
