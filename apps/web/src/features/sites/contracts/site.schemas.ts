import { z } from "zod";

export const createSiteSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
});

export const updateSiteSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
});

export const siteIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid uuid"),
});

export const listSitesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateSiteBody = z.infer<typeof createSiteSchema>;
export type UpdateSiteBody = z.infer<typeof updateSiteSchema>;
export type ListSitesQuery = z.infer<typeof listSitesQuerySchema>;
