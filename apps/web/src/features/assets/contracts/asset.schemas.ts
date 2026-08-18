import { z } from "zod";

/**
 * API request contracts for assets.
 * Response shapes come from `@repo/db` (`AssetRow`); wire them through Zod
 * only when response validation is needed.
 */

export const assetStatusSchema = z.enum([
  "active",
  "assigned",
  "maintenance",
  "retired",
  "error",
]);

export const assetLifecycleSchema = z.enum(["active", "archived"]);

export const createAssetSchema = z.object({
  uniqueId: z.string().trim().min(1, "uniqueId is required"),
  displayName: z.string().trim().optional(),
  typeId: z.string().uuid("typeId must be a valid UUID"),
  status: assetStatusSchema.default("active"),
  siteId: z.string().uuid("siteId must be a valid UUID").optional().nullable(),
});

/** Full-replace body (not JSON Merge Patch). Clients must send every field. */
export const updateAssetSchema = z.object({
  uniqueId: z.string().trim().min(1, "uniqueId is required"),
  displayName: z.string().trim().optional(),
  typeId: z.string().uuid("typeId must be a valid UUID"),
  status: assetStatusSchema,
  siteId: z.string().uuid("siteId must be a valid UUID").optional().nullable(),
});

export const assetIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export const listAssetsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  lifecycle: z.enum(["active", "archived", "all"]).default("active"),
  typeId: z.string().uuid().optional(),
  status: assetStatusSchema.optional(),
  search: z.string().trim().optional(),
});

export type CreateAssetBody = z.infer<typeof createAssetSchema>;
export type UpdateAssetBody = z.infer<typeof updateAssetSchema>;
export type ListAssetsQuery = z.infer<typeof listAssetsQuerySchema>;
