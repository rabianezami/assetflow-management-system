import { ApiClientError, apiFetch, type PaginationMeta } from "@/lib/api/client";
import type {
  CreateSiteBody,
  ListSitesQuery,
  UpdateSiteBody,
} from "@/features/sites/contracts/site.schemas";

export type Site = {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const SITES_BASE = "/api/v1/sites";

function toSearchParams(query: ListSitesQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  return params.toString();
}

export type SiteListResult = {
  items: Site[];
  meta: PaginationMeta;
};

export async function fetchSites(query: ListSitesQuery): Promise<SiteListResult> {
  const { data, meta } = await apiFetch<Site[]>(
    `${SITES_BASE}?${toSearchParams(query)}`,
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

export async function fetchSite(id: string): Promise<Site> {
  const { data } = await apiFetch<Site>(`${SITES_BASE}/${id}`);
  return data;
}

export async function createSite(body: CreateSiteBody): Promise<Site> {
  const { data } = await apiFetch<Site>(SITES_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function updateSite(
  id: string,
  body: UpdateSiteBody,
): Promise<Site> {
  const { data } = await apiFetch<Site>(`${SITES_BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return data;
}

export async function deleteSite(id: string): Promise<{ id: string }> {
  const { data } = await apiFetch<{ id: string }>(`${SITES_BASE}/${id}`, {
    method: "DELETE",
  });
  return data;
}
