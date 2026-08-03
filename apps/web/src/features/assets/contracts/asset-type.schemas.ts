import { z } from "zod";

/** Aligned with apps/web/src/features/assets/types/asset.types.ts */
export const assetTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  statusGroup: z.string(),
  createdAt: z.string(),
});

export const createAssetTypeSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  statusGroup: z.string().trim().optional(),
});

export const updateAssetTypeSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  statusGroup: z.string().trim().optional(),
});

export const assetTypeIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export const listAssetTypesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateAssetTypeBody = z.infer<typeof createAssetTypeSchema>;
export type UpdateAssetTypeBody = z.infer<typeof updateAssetTypeSchema>;
export type ListAssetTypesQuery = z.infer<typeof listAssetTypesQuerySchema>;
