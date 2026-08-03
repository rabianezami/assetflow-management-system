export { assetKeys, assetTypeKeys } from "@/features/assets/api/keys";
export {
  DEFAULT_LIST_ASSETS_QUERY,
  DEFAULT_LIST_ASSET_TYPES_QUERY,
  normalizeListAssetsQuery,
  normalizeListAssetTypesQuery,
} from "@/features/assets/api/list-query";
export {
  fetchAsset,
  fetchAssets,
  createAsset,
  updateAsset,
  archiveAsset,
  restoreAsset,
  type AssetListResult,
} from "@/features/assets/api/assets";
export {
  fetchAssetType,
  fetchAssetTypes,
  createAssetType,
  updateAssetType,
  deleteAssetType,
  type AssetTypeListResult,
} from "@/features/assets/api/asset-types";
export { useAsset, useAssets } from "@/features/assets/api/use-assets";
export {
  useAssetType,
  useAssetTypes,
} from "@/features/assets/api/use-asset-types";
export { useAssetMutations } from "@/features/assets/api/use-asset-mutations";
export { useAssetTypeMutations } from "@/features/assets/api/use-asset-type-mutations";
