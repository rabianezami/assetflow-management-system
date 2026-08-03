import {
  getDb,
  assets,
  assetTypes,
  type AssetRow,
} from "@repo/db";
import { and, count, desc, eq, ilike, ne, or, sql, type SQL } from "drizzle-orm";

import type {
  CreateAssetBody,
  ListAssetsQuery,
  UpdateAssetBody,
} from "@/features/assets/contracts/asset.schemas";
import { conflict, notFound } from "@/lib/api/errors";

async function assertTypeExists(typeId: string) {
  const db = getDb();
  const [type] = await db
    .select({ id: assetTypes.id })
    .from(assetTypes)
    .where(eq(assetTypes.id, typeId))
    .limit(1);

  if (!type) {
    throw notFound("Asset type not found");
  }
}

async function assertNoDuplicateActiveUniqueId(
  uniqueId: string,
  excludeId?: string,
) {
  const db = getDb();
  const normalized = uniqueId.trim().toLowerCase();

  const conditions: SQL[] = [
    sql`lower(${assets.uniqueId}) = ${normalized}`,
    eq(assets.lifecycle, "active"),
  ];
  if (excludeId) {
    conditions.push(ne(assets.id, excludeId));
  }

  const [match] = await db
    .select({ id: assets.id })
    .from(assets)
    .where(and(...conditions))
    .limit(1);

  if (match) {
    throw conflict("Another active asset already uses this unique ID", {
      uniqueId: uniqueId.trim(),
    });
  }
}

export async function listAssets(query: ListAssetsQuery) {
  const db = getDb();
  const offset = (query.page - 1) * query.limit;
  const conditions: SQL[] = [];

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
    const term = `%${query.search}%`;
    conditions.push(
      or(ilike(assets.uniqueId, term), ilike(assets.displayName, term))!,
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

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
    total: totals[0]?.total ?? 0,
    page: query.page,
    limit: query.limit,
  };
}

export async function getAssetById(id: string): Promise<AssetRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(assets)
    .where(eq(assets.id, id))
    .limit(1);
  return row;
}

export async function createAsset(input: CreateAssetBody): Promise<AssetRow> {
  await assertTypeExists(input.typeId);
  await assertNoDuplicateActiveUniqueId(input.uniqueId);

  const db = getDb();
  try {
    const [row] = await db
      .insert(assets)
      .values({
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
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("Another active asset already uses this unique ID");
    }
    throw error;
  }
}

export async function updateAsset(
  id: string,
  input: UpdateAssetBody,
): Promise<AssetRow> {
  const existing = await getAssetById(id);
  if (!existing) {
    throw notFound("Asset not found");
  }
  if (existing.lifecycle === "archived") {
    throw conflict("Archived assets cannot be edited. Restore the asset first.");
  }

  await assertTypeExists(input.typeId);
  await assertNoDuplicateActiveUniqueId(input.uniqueId, id);

  const db = getDb();
  try {
    const [row] = await db
      .update(assets)
      .set({
        uniqueId: input.uniqueId.trim(),
        displayName: input.displayName?.trim() ?? "",
        typeId: input.typeId,
        status: input.status,
        site: input.site?.trim() ?? "",
      })
      .where(eq(assets.id, id))
      .returning();

    if (!row) {
      throw notFound("Asset not found");
    }
    return row;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("Another active asset already uses this unique ID");
    }
    throw error;
  }
}

export async function archiveAsset(id: string): Promise<AssetRow> {
  const existing = await getAssetById(id);
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
    .where(eq(assets.id, id))
    .returning();

  if (!row) {
    throw notFound("Asset not found");
  }
  return row;
}

export async function restoreAsset(id: string): Promise<AssetRow> {
  const existing = await getAssetById(id);
  if (!existing) {
    throw notFound("Asset not found");
  }
  if (existing.lifecycle !== "archived") {
    throw conflict("Only archived assets can be restored");
  }

  await assertNoDuplicateActiveUniqueId(existing.uniqueId, id);

  const db = getDb();
  try {
    const [row] = await db
      .update(assets)
      .set({
        lifecycle: "active",
        archivedAt: null,
      })
      .where(eq(assets.id, id))
      .returning();

    if (!row) {
      throw notFound("Asset not found");
    }
    return row;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("Another active asset already uses this unique ID");
    }
    throw error;
  }
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  // postgres.js / PostgreSQL unique_violation
  return code === "23505";
}
