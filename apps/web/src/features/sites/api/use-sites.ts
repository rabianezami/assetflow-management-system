"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSite, fetchSites } from "@/features/sites/api/sites";
import { siteKeys } from "@/features/sites/api/keys";
import type { ListSitesQuery } from "@/features/sites/contracts/site.schemas";

const DEFAULT_LIST: ListSitesQuery = { page: 1, limit: 50 };

export function useSites(query: Partial<ListSitesQuery> = {}) {
  const normalized: ListSitesQuery = {
    page: query.page ?? DEFAULT_LIST.page,
    limit: query.limit ?? DEFAULT_LIST.limit,
  };

  return useQuery({
    queryKey: siteKeys.list(normalized),
    queryFn: () => fetchSites(normalized),
  });
}

export function useSite(id: string | undefined) {
  return useQuery({
    queryKey: siteKeys.detail(id ?? ""),
    queryFn: () => fetchSite(id!),
    enabled: Boolean(id),
  });
}
