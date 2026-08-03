"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAsset, fetchAssets } from "@/features/assets/api/assets";
import { assetKeys } from "@/features/assets/api/keys";
import {
  listAssetsQuerySchema,
  type ListAssetsQuery,
} from "@/features/assets/contracts/asset.schemas";

export function useAssets(query: Partial<ListAssetsQuery> = {}) {
  const parsed = listAssetsQuerySchema.parse(query);

  return useQuery({
    queryKey: assetKeys.list(parsed),
    queryFn: () => fetchAssets(parsed),
  });
}

export function useAsset(id: string | undefined) {
  return useQuery({
    queryKey: assetKeys.detail(id ?? ""),
    queryFn: () => fetchAsset(id!),
    enabled: Boolean(id),
  });
}
