import { z } from "zod";

/** Aligned with apps/web/src/features/assets/types/asset.types.ts */
export const assetStatusSchema = z.enum([
  "active",
  "assigned",
  "maintenance",
  "retired",
  "error",
]);

export const assetLifecycleSchema = z.enum(["active", "archived"]);

export const assetSchema = z.object({
  id: z.string().uuid(),
  uniqueId: z.string(),
  displayName: z.string(),
  typeId: z.string().uuid(),
  status: assetStatusSchema,
  site: z.string(),
  lifecycle: assetLifecycleSchema,
  archivedAt: z.string().nullable(),
  lastInspectionAt: z.string().nullable(),
  openActionsCount: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createAssetSchema = z.object({
  uniqueId: z.string().trim().min(1, "uniqueId is required"),
  displayName: z.string().trim().optional(),
  typeId: z.string().uuid("typeId must be a valid UUID"),
  status: assetStatusSchema.default("active"),
  site: z.string().trim().optional(),
});

export const updateAssetSchema = z.object({
  uniqueId: z.string().trim().min(1, "uniqueId is required"),
  displayName: z.string().trim().optional(),
  typeId: z.string().uuid("typeId must be a valid UUID"),
  status: assetStatusSchema,
  site: z.string().trim().optional(),
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
