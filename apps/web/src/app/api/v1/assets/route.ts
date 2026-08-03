import {
  createAssetSchema,
  listAssetsQuerySchema,
} from "@/features/assets/contracts/asset.schemas";
import {
  createAsset,
  listAssets,
} from "@/features/assets/server/assets.repository";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (request) => {
  const query = parseSearchParams(request, listAssetsQuerySchema);
  const result = await listAssets(query);

  return jsonOk(result.items, {
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
    },
  });
});

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody(request, createAssetSchema);
  const created = await createAsset(body);
  return jsonOk(created, { status: 201 });
});
