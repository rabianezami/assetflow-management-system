import type { ListAssetsQuery } from "@/features/assets/contracts/asset.schemas";
import type { ListAssetTypesQuery } from "@/features/assets/contracts/asset-type.schemas";

export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: (query: ListAssetsQuery) => [...assetKeys.lists(), query] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const,
};

export const assetTypeKeys = {
  all: ["asset-types"] as const,
  lists: () => [...assetTypeKeys.all, "list"] as const,
  list: (query: ListAssetTypesQuery) =>
    [...assetTypeKeys.lists(), query] as const,
  details: () => [...assetTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...assetTypeKeys.details(), id] as const,
};
