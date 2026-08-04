import type { ListAssetsQuery } from "@/features/assets/contracts/asset.schemas";
import type { ListAssetTypesQuery } from "@/features/assets/contracts/asset-type.schemas";

export const DEFAULT_LIST_ASSETS_QUERY: ListAssetsQuery = {
  page: 1,
  limit: 50,
  lifecycle: "active",
};

export const DEFAULT_LIST_ASSET_TYPES_QUERY: ListAssetTypesQuery = {
  page: 1,
  limit: 50,
};

/** Merge partial client filters with defaults — no Zod throw in render. */
export function normalizeListAssetsQuery(
  query: Partial<ListAssetsQuery> = {},
): ListAssetsQuery {
  return {
    page: query.page ?? DEFAULT_LIST_ASSETS_QUERY.page,
    limit: query.limit ?? DEFAULT_LIST_ASSETS_QUERY.limit,
    lifecycle: query.lifecycle ?? DEFAULT_LIST_ASSETS_QUERY.lifecycle,
    typeId: query.typeId,
    status: query.status,
    search: query.search,
  };
}

export function normalizeListAssetTypesQuery(
  query: Partial<ListAssetTypesQuery> = {},
): ListAssetTypesQuery {
  return {
    page: query.page ?? DEFAULT_LIST_ASSET_TYPES_QUERY.page,
    limit: query.limit ?? DEFAULT_LIST_ASSET_TYPES_QUERY.limit,
  };
}

/** Map table filter UI state (`"all"` / empty search) to list API query fields. */
export function filtersToListQuery(
  filters: {
    search: string;
    typeId: string;
    status: NonNullable<ListAssetsQuery["status"]> | "all";
  },
  options: {
    lifecycle: ListAssetsQuery["lifecycle"];
    limit?: number;
  },
): Partial<ListAssetsQuery> {
  return {
    lifecycle: options.lifecycle,
    limit: options.limit ?? 100,
    typeId: filters.typeId === "all" ? undefined : filters.typeId,
    status: filters.status === "all" ? undefined : filters.status,
    search: filters.search.trim() || undefined,
  };
}
