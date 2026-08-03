"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  archiveAsset,
  createAsset,
  restoreAsset,
  updateAsset,
} from "@/features/assets/api/assets";
import {
  createAssetType,
  deleteAssetType,
  updateAssetType,
} from "@/features/assets/api/asset-types";
import { assetKeys, assetTypeKeys } from "@/features/assets/api/keys";
import type {
  CreateAssetBody,
  UpdateAssetBody,
} from "@/features/assets/contracts/asset.schemas";
import type {
  CreateAssetTypeBody,
  UpdateAssetTypeBody,
} from "@/features/assets/contracts/asset-type.schemas";

export function useAssetMutations() {
  const queryClient = useQueryClient();

  const invalidateAssets = () =>
    queryClient.invalidateQueries({ queryKey: assetKeys.all });

  const invalidateAssetTypes = () =>
    queryClient.invalidateQueries({ queryKey: assetTypeKeys.all });

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

  const createType = useMutation({
    mutationFn: (body: CreateAssetTypeBody) => createAssetType(body),
    onSuccess: () => invalidateAssetTypes(),
  });

  const updateType = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAssetTypeBody }) =>
      updateAssetType(id, body),
    onSuccess: (assetType) => {
      void invalidateAssetTypes();
      queryClient.setQueryData(assetTypeKeys.detail(assetType.id), assetType);
    },
  });

  const removeType = useMutation({
    mutationFn: (id: string) => deleteAssetType(id),
    onSuccess: () => {
      void invalidateAssetTypes();
      // Deleting a type can change asset list join labels; refresh assets too.
      void invalidateAssets();
    },
  });

  return {
    createAsset: create,
    updateAsset: update,
    archiveAsset: archive,
    restoreAsset: restore,
    createAssetType: createType,
    updateAssetType: updateType,
    deleteAssetType: removeType,
  };
}
