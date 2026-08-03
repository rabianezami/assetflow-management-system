import { apiFetch, type PaginationMeta } from "@/lib/api/client";
import type {
  CreateAssetBody,
  ListAssetsQuery,
  UpdateAssetBody,
} from "@/features/assets/contracts/asset.schemas";
import type { Asset } from "@/features/assets/types/asset.types";

const ASSETS_BASE = "/api/v1/assets";

function toSearchParams(query: ListAssetsQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  params.set("lifecycle", query.lifecycle);
  if (query.typeId) params.set("typeId", query.typeId);
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  return params.toString();
}

export type AssetListResult = {
  items: Asset[];
  meta: PaginationMeta;
};

export async function fetchAssets(
  query: ListAssetsQuery,
): Promise<AssetListResult> {
  const { data, meta } = await apiFetch<Asset[]>(
    `${ASSETS_BASE}?${toSearchParams(query)}`,
  );
  return {
    items: data,
    meta: meta ?? { page: query.page, limit: query.limit, total: data.length },
  };
}

export async function fetchAsset(id: string): Promise<Asset> {
  const { data } = await apiFetch<Asset>(`${ASSETS_BASE}/${id}`);
  return data;
}

export async function createAsset(body: CreateAssetBody): Promise<Asset> {
  const { data } = await apiFetch<Asset>(ASSETS_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function updateAsset(
  id: string,
  body: UpdateAssetBody,
): Promise<Asset> {
  const { data } = await apiFetch<Asset>(`${ASSETS_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function archiveAsset(id: string): Promise<Asset> {
  const { data } = await apiFetch<Asset>(`${ASSETS_BASE}/${id}/archive`, {
    method: "POST",
  });
  return data;
}

export async function restoreAsset(id: string): Promise<Asset> {
  const { data } = await apiFetch<Asset>(`${ASSETS_BASE}/${id}/restore`, {
    method: "POST",
  });
  return data;
}
