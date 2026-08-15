import { getDb, assetTypes, assets, type AssetTypeRow } from "@repo/db";
import { and, count, desc, eq } from "drizzle-orm";

import type {
  CreateAssetTypeBody,
  ListAssetTypesQuery,
  UpdateAssetTypeBody,
} from "@/features/assets/contracts/asset-type.schemas";
import { conflict, notFound } from "@/lib/api/errors";

export async function listAssetTypes(
  organizationId: string,
  query: ListAssetTypesQuery,
) {
  const db = getDb();
  const offset = (query.page - 1) * query.limit;
  const where = eq(assetTypes.organizationId, organizationId);

  const [rows, totals] = await Promise.all([
    db
      .select()
      .from(assetTypes)
      .where(where)
      .orderBy(desc(assetTypes.createdAt))
      .limit(query.limit)
      .offset(offset),
    db.select({ total: count() }).from(assetTypes).where(where),
  ]);

  return {
    items: rows,
    total: Number(totals[0]?.total ?? 0),
    page: query.page,
    limit: query.limit,
  };
}

export async function getAssetTypeById(
  organizationId: string,
  id: string,
): Promise<AssetTypeRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(assetTypes)
    .where(
      and(eq(assetTypes.id, id), eq(assetTypes.organizationId, organizationId)),
    )
    .limit(1);
  return row;
}

export async function createAssetType(
  organizationId: string,
  input: CreateAssetTypeBody,
): Promise<AssetTypeRow> {
  const db = getDb();
  const [row] = await db
    .insert(assetTypes)
    .values({
      organizationId,
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
  organizationId: string,
  id: string,
  input: UpdateAssetTypeBody,
): Promise<AssetTypeRow> {
  const existing = await getAssetTypeById(organizationId, id);
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
    .where(
      and(eq(assetTypes.id, id), eq(assetTypes.organizationId, organizationId)),
    )
    .returning();

  if (!row) {
    throw notFound("Asset type not found");
  }
  return row;
}

export async function deleteAssetType(
  organizationId: string,
  id: string,
): Promise<void> {
  const existing = await getAssetTypeById(organizationId, id);
  if (!existing) {
    throw notFound("Asset type not found");
  }

  const db = getDb();
  const [usage] = await db
    .select({ total: count() })
    .from(assets)
    .where(
      and(eq(assets.typeId, id), eq(assets.organizationId, organizationId)),
    );

  if ((usage?.total ?? 0) > 0) {
    throw conflict(
      "Cannot delete an asset type that has assets assigned. Reassign or archive those assets first.",
      { assetCount: usage?.total ?? 0 },
    );
  }

  await db
    .delete(assetTypes)
    .where(
      and(eq(assetTypes.id, id), eq(assetTypes.organizationId, organizationId)),
    );
}
