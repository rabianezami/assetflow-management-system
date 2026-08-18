import type { ListSitesQuery } from "@/features/sites/contracts/site.schemas";

export const siteKeys = {
  all: ["sites"] as const,
  lists: () => [...siteKeys.all, "list"] as const,
  list: (query: ListSitesQuery) => [...siteKeys.lists(), query] as const,
  details: () => [...siteKeys.all, "detail"] as const,
  detail: (id: string) => [...siteKeys.details(), id] as const,
};
