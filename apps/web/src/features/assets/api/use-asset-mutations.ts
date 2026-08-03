"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  archiveAsset,
  createAsset,
  restoreAsset,
  updateAsset,
} from "@/features/assets/api/assets";
import { assetKeys } from "@/features/assets/api/keys";
import type {
  CreateAssetBody,
  UpdateAssetBody,
} from "@/features/assets/contracts/asset.schemas";

export function useAssetMutations() {
  const queryClient = useQueryClient();

  const invalidateAssets = () =>
    queryClient.invalidateQueries({ queryKey: assetKeys.all });

  const create = useMutation({
    mutationFn: (body: CreateAssetBody) => createAsset(body),
    onSuccess: () => invalidateAssets(),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAssetBody }) =>
      updateAsset(id, body),
    onSuccess: (asset) => {
      void invalidateAssets();
      queryClient.setQueryData(assetKeys.detail(asset.id), asset);
    },
  });

  const archive = useMutation({
    mutationFn: (id: string) => archiveAsset(id),
    onSuccess: (asset) => {
      void invalidateAssets();
      queryClient.setQueryData(assetKeys.detail(asset.id), asset);
    },
  });

  const restore = useMutation({
    mutationFn: (id: string) => restoreAsset(id),
    onSuccess: (asset) => {
      void invalidateAssets();
      queryClient.setQueryData(assetKeys.detail(asset.id), asset);
    },
  });

  return {
    createAsset: create,
    updateAsset: update,
    archiveAsset: archive,
    restoreAsset: restore,
  };
}
