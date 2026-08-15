import {
  assetIdParamSchema,
  updateAssetSchema,
} from "@/features/assets/contracts/asset.schemas";
import {
  getAssetById,
  updateAsset,
} from "@/features/assets/server/assets.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { notFound } from "@/lib/api/errors";
import { parseIdParam, parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetIdParamSchema);
  const row = await getAssetById(organizationId, id);
  if (!row) {
    throw notFound("Asset not found");
  }
  return jsonOk(row);
});

export const PATCH = withApiHandler(async (request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetIdParamSchema);
  const body = await parseJsonBody(request, updateAssetSchema);
  const updated = await updateAsset(organizationId, id, body);
  return jsonOk(updated);
});
