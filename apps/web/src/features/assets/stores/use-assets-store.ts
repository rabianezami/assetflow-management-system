"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Asset,
  AssetStatus,
  AssetType,
  CreateAssetInput,
  CreateAssetTypeInput,
  UpdateAssetInput,
  UpdateAssetTypeInput,
} from "@/features/assets/types/asset.types";
import { normalizeAsset } from "@/features/assets/types/asset.types";

type AssetsState = {
  assetTypes: AssetType[];
  assets: Asset[];
  onboardingDismissed: boolean;
  addAssetType: (input: CreateAssetTypeInput) => AssetType;
  updateAssetType: (id: string, input: UpdateAssetTypeInput) => boolean;
  deleteAssetType: (id: string) => { ok: true } | { ok: false; reason: "in_use" };
  addAsset: (input: CreateAssetInput) => Asset;
  updateAsset: (id: string, input: UpdateAssetInput) => boolean;
  updateAssetStatus: (id: string, status: AssetStatus) => boolean;
  archiveAsset: (id: string) => boolean;
  restoreAsset: (id: string) => boolean;
  getAssetById: (id: string) => Asset | undefined;
  getTypeById: (id: string) => AssetType | undefined;
  getActiveAssets: () => Asset[];
  getArchivedAssets: () => Asset[];
  countAssetsByTypeId: (typeId: string) => number;
  dismissOnboarding: () => void;
};

function generateId() {
  return crypto.randomUUID();
}

function normalizeAssets(assets: Asset[]): Asset[] {
  return assets.map(normalizeAsset);
}

export const useAssetsStore = create<AssetsState>()(
  persist(
    (set, get) => ({
      assetTypes: [],
      assets: [],
      onboardingDismissed: false,

      addAssetType: (input) => {
        const type: AssetType = {
          id: generateId(),
          name: input.name.trim(),
          statusGroup: input.statusGroup?.trim() ?? "",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ assetTypes: [...state.assetTypes, type] }));
        return type;
      },

      updateAssetType: (id, input) => {
        const exists = get().assetTypes.some((t) => t.id === id);
        if (!exists) return false;
        set((state) => ({
          assetTypes: state.assetTypes.map((type) =>
            type.id === id
              ? {
                  ...type,
                  name: input.name.trim(),
                  statusGroup: input.statusGroup?.trim() ?? "",
                }
              : type,
          ),
        }));
        return true;
      },

      deleteAssetType: (id) => {
        const inUse = get().assets.some((a) => a.typeId === id);
        if (inUse) return { ok: false, reason: "in_use" };
        set((state) => ({
          assetTypes: state.assetTypes.filter((type) => type.id !== id),
        }));
        return { ok: true };
      },

      addAsset: (input) => {
        const now = new Date().toISOString();
        const asset: Asset = {
          id: generateId(),
          uniqueId: input.uniqueId.trim(),
          displayName: input.displayName?.trim() ?? "",
          typeId: input.typeId,
          status: input.status,
          site: input.site?.trim() ?? "",
          lifecycle: "active",
          archivedAt: null,
          lastInspectionAt: null,
          openActionsCount: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [...state.assets, asset] }));
        return asset;
      },

      updateAsset: (id, input) => {
        const asset = get().getAssetById(id);
        if (!asset || asset.lifecycle === "archived") return false;

        const trimmedId = input.uniqueId.trim();
        const duplicate = get().assets.some(
          (a) =>
            a.id !== id &&
            a.lifecycle === "active" &&
            a.uniqueId.toLowerCase() === trimmedId.toLowerCase(),
        );
        if (duplicate) return false;

        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? {
                  ...a,
                  uniqueId: trimmedId,
                  displayName: input.displayName?.trim() ?? "",
                  typeId: input.typeId,
                  status: input.status,
                  site: input.site?.trim() ?? "",
                  updatedAt: new Date().toISOString(),
                }
              : a,
          ),
        }));
        return true;
      },

      updateAssetStatus: (id, status) => {
        const asset = get().getAssetById(id);
        if (!asset || asset.lifecycle === "archived") return false;
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, status, updatedAt: new Date().toISOString() }
              : a,
          ),
        }));
        return true;
      },

      archiveAsset: (id) => {
        const asset = get().getAssetById(id);
        if (!asset || asset.lifecycle === "archived") return false;
        const now = new Date().toISOString();
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? { ...a, lifecycle: "archived", archivedAt: now, updatedAt: now }
              : a,
          ),
        }));
        return true;
      },

      restoreAsset: (id) => {
        const asset = get().getAssetById(id);
        if (!asset || asset.lifecycle !== "archived") return false;

        const duplicate = get().assets.some(
          (a) =>
            a.id !== id &&
            a.lifecycle === "active" &&
            a.uniqueId.toLowerCase() === asset.uniqueId.toLowerCase(),
        );
        if (duplicate) return false;

        const now = new Date().toISOString();
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id
              ? {
                  ...a,
                  lifecycle: "active",
                  archivedAt: null,
                  updatedAt: now,
                }
              : a,
          ),
        }));
        return true;
      },

      getAssetById: (id) => {
        const asset = get().assets.find((a) => a.id === id);
        return asset ? normalizeAsset(asset) : undefined;
      },

      getTypeById: (id) => get().assetTypes.find((t) => t.id === id),

      getActiveAssets: () =>
        normalizeAssets(get().assets).filter((a) => a.lifecycle === "active"),

      getArchivedAssets: () =>
        normalizeAssets(get().assets).filter((a) => a.lifecycle === "archived"),

      countAssetsByTypeId: (typeId) =>
        get().assets.filter((a) => a.typeId === typeId).length,

      dismissOnboarding: () => set({ onboardingDismissed: true }),
    }),
    {
      name: "assetflow-assets",
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as AssetsState;
        if (version < 1) {
          return {
            ...state,
            assets: normalizeAssets(state.assets ?? []),
          };
        }
        return state;
      },
    },
  ),
);
