import { listAssetTypesQuerySchema, createAssetTypeSchema } from "@/features/assets/contracts/asset-type.schemas";
import {
  createAssetType,
  listAssetTypes,
} from "@/features/assets/server/asset-types.repository";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";
import { getRequestOrganizationId } from "@/lib/api/tenant";

export const GET = withApiHandler(async (request) => {
  // Single-tenant mock — reserved for Phase 3 org scoping.
  void getRequestOrganizationId();

  const query = parseSearchParams(request, listAssetTypesQuerySchema);
  const result = await listAssetTypes(query);

  return jsonOk(result.items, {
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
});

export const POST = withApiHandler(async (request) => {
  void getRequestOrganizationId();

  const body = await parseJsonBody(request, createAssetTypeSchema);
  const created = await createAssetType(body);
  return jsonOk(created, { status: 201 });
});
