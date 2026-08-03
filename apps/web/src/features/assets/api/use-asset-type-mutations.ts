"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAssetType,
  deleteAssetType,
  updateAssetType,
} from "@/features/assets/api/asset-types";
import { assetTypeKeys } from "@/features/assets/api/keys";
import type {
  CreateAssetTypeBody,
  UpdateAssetTypeBody,
} from "@/features/assets/contracts/asset-type.schemas";

export function useAssetTypeMutations() {
  const queryClient = useQueryClient();

  const invalidateAssetTypes = () =>
    queryClient.invalidateQueries({ queryKey: assetTypeKeys.all });

  const create = useMutation({
    mutationFn: (body: CreateAssetTypeBody) => createAssetType(body),
    onSuccess: () => invalidateAssetTypes(),
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAssetTypeBody }) =>
      updateAssetType(id, body),
    onSuccess: (assetType) => {
      void invalidateAssetTypes();
      queryClient.setQueryData(assetTypeKeys.detail(assetType.id), assetType);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAssetType(id),
    onSuccess: () => invalidateAssetTypes(),
  });

  return {
    createAssetType: create,
    updateAssetType: update,
    deleteAssetType: remove,
  };
}
