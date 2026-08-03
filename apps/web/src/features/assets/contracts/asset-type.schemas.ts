import { z } from "zod";

/**
 * API request contracts for asset types.
 * Response shapes come from `@repo/db` (`AssetTypeRow`); wire them through Zod
 * only when response validation is needed.
 */

export const createAssetTypeSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  statusGroup: z.string().trim().optional(),
});

/** Full-replace body (not JSON Merge Patch). Clients must send every field. */
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
