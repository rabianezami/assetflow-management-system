"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchAssetType,
  fetchAssetTypes,
} from "@/features/assets/api/asset-types";
import { assetTypeKeys } from "@/features/assets/api/keys";
import {
  listAssetTypesQuerySchema,
  type ListAssetTypesQuery,
} from "@/features/assets/contracts/asset-type.schemas";

export function useAssetTypes(query: Partial<ListAssetTypesQuery> = {}) {
  const parsed = listAssetTypesQuerySchema.parse(query);

  return useQuery({
    queryKey: assetTypeKeys.list(parsed),
    queryFn: () => fetchAssetTypes(parsed),
  });
}

export function useAssetType(id: string | undefined) {
  return useQuery({
    queryKey: assetTypeKeys.detail(id ?? ""),
    queryFn: () => fetchAssetType(id!),
    enabled: Boolean(id),
  });
}
