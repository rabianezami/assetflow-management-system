export type AssetStatus =
  | "active"
  | "assigned"
  | "maintenance"
  | "retired"
  | "error";

export type AssetLifecycle = "active" | "archived";

export type Asset = {
  id: string;
  uniqueId: string;
  displayName: string;
  typeId: string;
  status: AssetStatus;
  siteId: string | null;
  site: string;
  lifecycle: AssetLifecycle;
  archivedAt: string | null;
  lastInspectionAt: string | null;
  openActionsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AssetType = {
  id: string;
  name: string;
  statusGroup: string;
  createdAt: string;
};

export type CreateAssetInput = {
  uniqueId: string;
  displayName?: string;
  typeId: string;
  status: AssetStatus;
  siteId?: string | null;
};

export type UpdateAssetInput = {
  uniqueId: string;
  displayName?: string;
  typeId: string;
  status: AssetStatus;
  siteId?: string | null;
};

export type CreateAssetTypeInput = {
  name: string;
  statusGroup?: string;
};

export type UpdateAssetTypeInput = {
  name: string;
  statusGroup?: string;
};

/** Defaults lifecycle fields for assets persisted before Phase 1. */
export function normalizeAsset(asset: Asset): Asset {
  return {
    ...asset,
    lifecycle: asset.lifecycle ?? "active",
    archivedAt: asset.archivedAt ?? null,
  };
}

export function isActiveAsset(asset: Asset): boolean {
  return normalizeAsset(asset).lifecycle === "active";
}
