import {
  getDb,
  assets,
  assetTypes,
  type AssetRow,
} from "@repo/db";
import { and, count, desc, eq, sql, type SQL } from "drizzle-orm";

import type {
  CreateAssetBody,
  ListAssetsQuery,
  UpdateAssetBody,
} from "@/features/assets/contracts/asset.schemas";
import { badRequest, conflict, notFound } from "@/lib/api/errors";
import { isUniqueViolation } from "@/lib/db/is-unique-violation";

function escapeIlikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

async function assertTypeExists(organizationId: string, typeId: string) {
  const db = getDb();
  const [type] = await db
    .select({ id: assetTypes.id })
    .from(assetTypes)
    .where(
      and(
        eq(assetTypes.id, typeId),
        eq(assetTypes.organizationId, organizationId),
      ),
    )
    .limit(1);

  if (!type) {
    throw badRequest("typeId does not reference an existing asset type", {
      typeId,
    });
  }
}

/** Rely on the DB partial unique index; map PG 23505 → API conflict. */
async function withUniqueIdConflict<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("Another active asset already uses this unique ID");
    }
    throw error;
  }
}

export async function listAssets(
  organizationId: string,
  query: ListAssetsQuery,
) {
  const db = getDb();
  const offset = (query.page - 1) * query.limit;
  const conditions: SQL[] = [eq(assets.organizationId, organizationId)];

  if (query.lifecycle !== "all") {
    conditions.push(eq(assets.lifecycle, query.lifecycle));
  }
  if (query.typeId) {
    conditions.push(eq(assets.typeId, query.typeId));
  }
  if (query.status) {
    conditions.push(eq(assets.status, query.status));
  }
  if (query.search) {
    const term = `%${escapeIlikePattern(query.search)}%`;
    // ESCAPE required so \% / \_ are literals (PG has no default LIKE escape).
    conditions.push(
      sql`(${assets.uniqueId} ILIKE ${term} ESCAPE '\\' OR ${assets.displayName} ILIKE ${term} ESCAPE '\\')`,
    );
  }

  const where = and(...conditions);

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(assets)
      .where(where)
      .orderBy(desc(assets.createdAt))
      .limit(query.limit)
      .offset(offset),
    db.select({ total: count() }).from(assets).where(where),
  ]);

  return {
    items: rows,
    total: Number(totals[0]?.total ?? 0),
    page: query.page,
    limit: query.limit,
  };
}

export async function getAssetById(
  organizationId: string,
  id: string,
): Promise<AssetRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(assets)
    .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
    .limit(1);
  return row;
}

export async function createAsset(
  organizationId: string,
  input: CreateAssetBody,
): Promise<AssetRow> {
  await assertTypeExists(organizationId, input.typeId);

  return withUniqueIdConflict(async () => {
    const db = getDb();
    const [row] = await db
      .insert(assets)
      .values({
        organizationId,
        uniqueId: input.uniqueId.trim(),
        displayName: input.displayName?.trim() ?? "",
        typeId: input.typeId,
        status: input.status,
        site: input.site?.trim() ?? "",
        lifecycle: "active",
        archivedAt: null,
        lastInspectionAt: null,
        openActionsCount: 0,
      })
      .returning();

    if (!row) {
      throw new Error("Failed to create asset");
    }
    return row;
  });
}

export async function updateAsset(
  organizationId: string,
  id: string,
  input: UpdateAssetBody,
): Promise<AssetRow> {
  const existing = await getAssetById(organizationId, id);
  if (!existing) {
    throw notFound("Asset not found");
  }
  if (existing.lifecycle === "archived") {
    throw conflict("Archived assets cannot be edited. Restore the asset first.");
  }

  await assertTypeExists(organizationId, input.typeId);

  return withUniqueIdConflict(async () => {
    const db = getDb();
    const [row] = await db
      .update(assets)
      .set({
        uniqueId: input.uniqueId.trim(),
        displayName: input.displayName?.trim() ?? "",
        typeId: input.typeId,
        status: input.status,
        site: input.site?.trim() ?? "",
      })
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
      .returning();

    if (!row) {
      throw notFound("Asset not found");
    }
    return row;
  });
}

export async function archiveAsset(
  organizationId: string,
  id: string,
): Promise<AssetRow> {
  const existing = await getAssetById(organizationId, id);
  if (!existing) {
    throw notFound("Asset not found");
  }
  if (existing.lifecycle === "archived") {
    throw conflict("Asset is already archived");
  }

  const db = getDb();
  const now = new Date().toISOString();
  const [row] = await db
    .update(assets)
    .set({
      lifecycle: "archived",
      archivedAt: now,
    })
    .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
    .returning();

  if (!row) {
    throw notFound("Asset not found");
  }
  return row;
}

export async function restoreAsset(
  organizationId: string,
  id: string,
): Promise<AssetRow> {
  const existing = await getAssetById(organizationId, id);
  if (!existing) {
    throw notFound("Asset not found");
  }
  if (existing.lifecycle !== "archived") {
    throw conflict("Only archived assets can be restored");
  }

  return withUniqueIdConflict(async () => {
    const db = getDb();
    const [row] = await db
      .update(assets)
      .set({
        lifecycle: "active",
        archivedAt: null,
      })
      .where(and(eq(assets.id, id), eq(assets.organizationId, organizationId)))
      .returning();

    if (!row) {
      throw notFound("Asset not found");
    }
    return row;
  });
}
