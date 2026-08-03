import { ApiClientError, apiFetch, type PaginationMeta } from "@/lib/api/client";
import type {
  CreateAssetTypeBody,
  ListAssetTypesQuery,
  UpdateAssetTypeBody,
} from "@/features/assets/contracts/asset-type.schemas";
import type { AssetType } from "@/features/assets/types/asset.types";

const ASSET_TYPES_BASE = "/api/v1/asset-types";

function toSearchParams(query: ListAssetTypesQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  return params.toString();
}

export type AssetTypeListResult = {
  items: AssetType[];
  meta: PaginationMeta;
};

export async function fetchAssetTypes(
  query: ListAssetTypesQuery,
): Promise<AssetTypeListResult> {
  const { data, meta } = await apiFetch<AssetType[]>(
    `${ASSET_TYPES_BASE}?${toSearchParams(query)}`,
  );
  if (!meta) {
    throw new ApiClientError(
      "INTERNAL_ERROR",
      "List response missing pagination meta",
      500,
    );
  }
  return { items: data, meta };
}

export async function fetchAssetType(id: string): Promise<AssetType> {
  const { data } = await apiFetch<AssetType>(`${ASSET_TYPES_BASE}/${id}`);
  return data;
}

export async function createAssetType(
  body: CreateAssetTypeBody,
): Promise<AssetType> {
  const { data } = await apiFetch<AssetType>(ASSET_TYPES_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function updateAssetType(
  id: string,
  body: UpdateAssetTypeBody,
): Promise<AssetType> {
  const { data } = await apiFetch<AssetType>(`${ASSET_TYPES_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function deleteAssetType(id: string): Promise<{ id: string }> {
  const { data } = await apiFetch<{ id: string }>(`${ASSET_TYPES_BASE}/${id}`, {
    method: "DELETE",
  });
  return data;
}
