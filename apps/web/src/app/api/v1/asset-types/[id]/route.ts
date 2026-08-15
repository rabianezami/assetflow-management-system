import {
  assetTypeIdParamSchema,
  updateAssetTypeSchema,
} from "@/features/assets/contracts/asset-type.schemas";
import {
  deleteAssetType,
  getAssetTypeById,
  updateAssetType,
} from "@/features/assets/server/asset-types.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { notFound } from "@/lib/api/errors";
import { parseIdParam, parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetTypeIdParamSchema);
  const row = await getAssetTypeById(organizationId, id);
  if (!row) {
    throw notFound("Asset type not found");
  }
  return jsonOk(row);
});

export const PATCH = withApiHandler(async (request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetTypeIdParamSchema);
  const body = await parseJsonBody(request, updateAssetTypeSchema);
  const updated = await updateAssetType(organizationId, id, body);
  return jsonOk(updated);
});

export const DELETE = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetTypeIdParamSchema);
  await deleteAssetType(organizationId, id);
  return jsonOk({ id });
});
