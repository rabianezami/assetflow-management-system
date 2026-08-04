import type { Asset, AssetType } from "@/features/assets/types/asset.types";

export function isActiveLifecycle(asset: Asset): boolean {
  return (asset.lifecycle ?? "active") === "active";
}

export function isArchivedLifecycle(asset: Asset): boolean {
  return asset.lifecycle === "archived";
}

export function getTypeName(
  types: AssetType[],
  typeId: string,
): string {
  return types.find((type) => type.id === typeId)?.name ?? "—";
}

export function countAssetsByTypeId(
  assets: Asset[],
  typeId: string,
): number {
  return assets.filter((asset) => asset.typeId === typeId).length;
}
