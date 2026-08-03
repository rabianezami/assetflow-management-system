"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAsset, fetchAssets } from "@/features/assets/api/assets";
import { assetKeys } from "@/features/assets/api/keys";
import { normalizeListAssetsQuery } from "@/features/assets/api/list-query";
import type { ListAssetsQuery } from "@/features/assets/contracts/asset.schemas";

export function useAssets(query: Partial<ListAssetsQuery> = {}) {
  const normalized = normalizeListAssetsQuery(query);

  return useQuery({
    queryKey: assetKeys.list(normalized),
    queryFn: () => fetchAssets(normalized),
  });
}

export function useAsset(id: string | undefined) {
  return useQuery({
    queryKey: assetKeys.detail(id ?? ""),
    queryFn: () => fetchAsset(id!),
    enabled: Boolean(id),
  });
}
