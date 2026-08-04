import type { Asset, AssetType } from "@/features/assets/types/asset.types";

export function isArchivedLifecycle(asset: Asset): boolean {
  return asset.lifecycle === "archived";
}

export function getTypeName(types: AssetType[], typeId: string): string {
  return types.find((type) => type.id === typeId)?.name ?? "—";
}

export function formatLastInspection(
  iso: string | null | undefined,
  locale: string,
): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function countRecentInspections(
  assets: { lastInspectionAt?: string | null }[],
): number {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return assets.filter((asset) => {
    if (!asset.lastInspectionAt) return false;
    return new Date(asset.lastInspectionAt).getTime() >= cutoff;
  }).length;
}
