import type { Asset } from "@/features/assets/types/asset.types";

export function isActiveLifecycle(asset: Asset): boolean {
  return (asset.lifecycle ?? "active") === "active";
}

export function isArchivedLifecycle(asset: Asset): boolean {
  return asset.lifecycle === "archived";
}

/** Pure lookup — returns the store reference, safe for Zustand selectors. */
export function findAssetById(
  assets: Asset[],
  id: string,
): Asset | undefined {
  return assets.find((a) => a.id === id);
}

export function filterActiveAssets(assets: Asset[]): Asset[] {
  return assets.filter(isActiveLifecycle);
}

export function filterArchivedAssets(assets: Asset[]): Asset[] {
  return assets.filter(isArchivedLifecycle);
}

export function hasDuplicateActiveUniqueId(
  assets: Asset[],
  uniqueId: string,
  excludeId?: string,
): boolean {
  const normalized = uniqueId.trim().toLowerCase();
  return assets.some(
    (a) =>
      a.id !== excludeId &&
      isActiveLifecycle(a) &&
      a.uniqueId.toLowerCase() === normalized,
  );
}
