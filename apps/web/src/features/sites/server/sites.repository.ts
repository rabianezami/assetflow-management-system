import { getDb, sites, assets, type SiteRow } from "@repo/db";
import { and, count, desc, eq } from "drizzle-orm";

import type {
  CreateSiteBody,
  ListSitesQuery,
  UpdateSiteBody,
} from "@/features/sites/contracts/site.schemas";
import { conflict, notFound } from "@/lib/api/errors";
import { isUniqueViolation } from "@/lib/db/is-unique-violation";

export async function listSites(
  organizationId: string,
  query: ListSitesQuery,
) {
  const db = getDb();
  const offset = (query.page - 1) * query.limit;
  const where = eq(sites.organizationId, organizationId);

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(sites)
      .where(where)
      .orderBy(desc(sites.createdAt))
      .limit(query.limit)
      .offset(offset),
    db.select({ total: count() }).from(sites).where(where),
  ]);

  return {
    items: rows,
    total: Number(totals[0]?.total ?? 0),
    page: query.page,
    limit: query.limit,
  };
}

export async function getSiteById(
  organizationId: string,
  id: string,
): Promise<SiteRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, id), eq(sites.organizationId, organizationId)))
    .limit(1);
  return row;
}

export async function createSite(
  organizationId: string,
  input: CreateSiteBody,
): Promise<SiteRow> {
  const db = getDb();
  try {
    const [row] = await db
      .insert(sites)
      .values({
        organizationId,
        name: input.name.trim(),
      })
      .returning();

    if (!row) {
      throw new Error("Failed to create site");
    }
    return row;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("A site with this name already exists in the organization");
    }
    throw error;
  }
}

export async function updateSite(
  organizationId: string,
  id: string,
  input: UpdateSiteBody,
): Promise<SiteRow> {
  const existing = await getSiteById(organizationId, id);
  if (!existing) {
    throw notFound("Site not found");
  }

  const name = input.name.trim();
  if (name === existing.name) {
    return existing;
  }

  const db = getDb();
  try {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .update(sites)
        .set({ name })
        .where(and(eq(sites.id, id), eq(sites.organizationId, organizationId)))
        .returning();

      if (!row) {
        throw notFound("Site not found");
      }

      // Keep denormalized asset.site in sync with the renamed site.
      await tx
        .update(assets)
        .set({ site: row.name })
        .where(
          and(eq(assets.siteId, id), eq(assets.organizationId, organizationId)),
        );

      return row;
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("A site with this name already exists in the organization");
    }
    throw error;
  }
}

export async function deleteSite(
  organizationId: string,
  id: string,
): Promise<void> {
  const existing = await getSiteById(organizationId, id);
  if (!existing) {
    throw notFound("Site not found");
  }

  const db = getDb();
  const [usage] = await db
    .select({ total: count() })
    .from(assets)
    .where(
      and(eq(assets.siteId, id), eq(assets.organizationId, organizationId)),
    );

  if ((usage?.total ?? 0) > 0) {
    throw conflict(
      "Cannot delete a site that has assets assigned. Reassign those assets first.",
      { assetCount: usage?.total ?? 0 },
    );
  }

  await db
    .delete(sites)
    .where(and(eq(sites.id, id), eq(sites.organizationId, organizationId)));
}
