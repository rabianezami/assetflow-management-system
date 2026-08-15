import {
  listAssetTypesQuerySchema,
  createAssetTypeSchema,
} from "@/features/assets/contracts/asset-type.schemas";
import {
  createAssetType,
  listAssetTypes,
} from "@/features/assets/server/asset-types.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (request) => {
  const { organizationId } = await requireOrganizationContext();
  const query = parseSearchParams(request, listAssetTypesQuerySchema);
  const result = await listAssetTypes(organizationId, query);

  return jsonOk(result.items, {
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
});

export const POST = withApiHandler(async (request) => {
  const { organizationId } = await requireOrganizationContext();
  const body = await parseJsonBody(request, createAssetTypeSchema);
  const created = await createAssetType(organizationId, body);
  return jsonOk(created, { status: 201 });
});
