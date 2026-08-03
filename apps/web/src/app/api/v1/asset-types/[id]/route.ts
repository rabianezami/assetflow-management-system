import {
  assetTypeIdParamSchema,
  updateAssetTypeSchema,
} from "@/features/assets/contracts/asset-type.schemas";
import {
  deleteAssetType,
  getAssetTypeById,
  updateAssetType,
} from "@/features/assets/server/asset-types.repository";
import { notFound } from "@/lib/api/errors";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";
import { getRequestOrganizationId } from "@/lib/api/tenant";

async function parseId(params: Promise<Record<string, string>>) {
  const resolved = await params;
  return assetTypeIdParamSchema.parse(resolved).id;
}

export const GET = withApiHandler(async (_request, context) => {
  void getRequestOrganizationId();

  const id = await parseId(context.params);
  const row = await getAssetTypeById(id);
  if (!row) {
    throw notFound("Asset type not found");
  }
  return jsonOk(row);
});

export const PATCH = withApiHandler(async (request, context) => {
  void getRequestOrganizationId();

  const id = await parseId(context.params);
  const body = await parseJsonBody(request, updateAssetTypeSchema);
  const updated = await updateAssetType(id, body);
  return jsonOk(updated);
});

export const DELETE = withApiHandler(async (_request, context) => {
  void getRequestOrganizationId();

  const id = await parseId(context.params);
  await deleteAssetType(id);
  return jsonOk({ id });
});
