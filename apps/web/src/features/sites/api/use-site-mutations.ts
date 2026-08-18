"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assetKeys } from "@/features/assets/api/keys";
import {
  createSite,
  deleteSite,
  updateSite,
} from "@/features/sites/api/sites";
import { siteKeys } from "@/features/sites/api/keys";
import type {
  CreateSiteBody,
  UpdateSiteBody,
} from "@/features/sites/contracts/site.schemas";

export function useSiteMutations() {
  const queryClient = useQueryClient();

  const invalidateSites = () =>
    queryClient.invalidateQueries({ queryKey: siteKeys.all });

  const create = useMutation({
    mutationFn: (body: CreateSiteBody) => createSite(body),
    onSuccess: () => invalidateSites(),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSiteBody }) =>
      updateSite(id, body),
    onSuccess: (site) => {
      void invalidateSites();
      // Renaming a site syncs denormalized asset.site on the server.
      void queryClient.invalidateQueries({ queryKey: assetKeys.all });
      queryClient.setQueryData(siteKeys.detail(site.id), site);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: () => invalidateSites(),
  });

  return {
    createSite: create,
    updateSite: update,
    deleteSite: remove,
  };
}
