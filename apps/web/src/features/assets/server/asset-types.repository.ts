import { getDb, assetTypes, assets, type AssetTypeRow } from "@repo/db";
import { count, desc, eq } from "drizzle-orm";

import type {
  CreateAssetTypeBody,
  ListAssetTypesQuery,
  UpdateAssetTypeBody,
} from "@/features/assets/contracts/asset-type.schemas";
import { conflict, notFound } from "@/lib/api/errors";

export async function listAssetTypes(query: ListAssetTypesQuery) {
  const db = getDb();
  const offset = (query.page - 1) * query.limit;

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(assetTypes)
      .orderBy(desc(assetTypes.createdAt))
      .limit(query.limit)
      .offset(offset),
    db.select({ total: count() }).from(assetTypes),
  ]);

  return {
    items: rows,
    total: totals[0]?.total ?? 0,
    page: query.page,
    limit: query.limit,
  };
}

export async function getAssetTypeById(
  id: string,
): Promise<AssetTypeRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(assetTypes)
    .where(eq(assetTypes.id, id))
    .limit(1);
  return row;
}

export async function createAssetType(
  input: CreateAssetTypeBody,
): Promise<AssetTypeRow> {
  const db = getDb();
  const [row] = await db
    .insert(assetTypes)
    .values({
      name: input.name.trim(),
      statusGroup: input.statusGroup?.trim() ?? "",
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create asset type");
  }
  return row;
}

export async function updateAssetType(
  id: string,
  input: UpdateAssetTypeBody,
): Promise<AssetTypeRow> {
  const existing = await getAssetTypeById(id);
  if (!existing) {
    throw notFound("Asset type not found");
  }

  const db = getDb();
  const [row] = await db
    .update(assetTypes)
    .set({
      name: input.name.trim(),
      statusGroup: input.statusGroup?.trim() ?? "",
    })
    .where(eq(assetTypes.id, id))
    .returning();

  if (!row) {
    throw notFound("Asset type not found");
  }
  return row;
}

export async function deleteAssetType(id: string): Promise<void> {
  const existing = await getAssetTypeById(id);
  if (!existing) {
    throw notFound("Asset type not found");
  }

  const db = getDb();
  const [usage] = await db
    .select({ total: count() })
    .from(assets)
    .where(eq(assets.typeId, id));

  if ((usage?.total ?? 0) > 0) {
    throw conflict(
      "Cannot delete an asset type that has assets assigned. Reassign or archive those assets first.",
      { assetCount: usage?.total ?? 0 },
    );
  }

  await db.delete(assetTypes).where(eq(assetTypes.id, id));
}
