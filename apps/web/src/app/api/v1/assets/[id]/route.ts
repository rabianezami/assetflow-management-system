import {
  assetIdParamSchema,
  updateAssetSchema,
} from "@/features/assets/contracts/asset.schemas";
import {
  getAssetById,
  updateAsset,
} from "@/features/assets/server/assets.repository";
import { notFound } from "@/lib/api/errors";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";
import { getRequestOrganizationId } from "@/lib/api/tenant";

async function parseId(params: Promise<Record<string, string>>) {
  const resolved = await params;
  return assetIdParamSchema.parse(resolved).id;
}

export const GET = withApiHandler(async (_request, context) => {
  void getRequestOrganizationId();

  const id = await parseId(context.params);
  const row = await getAssetById(id);
  if (!row) {
    throw notFound("Asset not found");
  }
  return jsonOk(row);
});

export const PATCH = withApiHandler(async (request, context) => {
  void getRequestOrganizationId();

  const id = await parseId(context.params);
  const body = await parseJsonBody(request, updateAssetSchema);
  const updated = await updateAsset(id, body);
  return jsonOk(updated);
});
