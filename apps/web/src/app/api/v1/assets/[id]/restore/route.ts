import { assetIdParamSchema } from "@/features/assets/contracts/asset.schemas";
import { restoreAsset } from "@/features/assets/server/assets.repository";
import { parseIdParam } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const POST = withApiHandler(async (_request, context) => {
  const id = await parseIdParam(context.params, assetIdParamSchema);
  const restored = await restoreAsset(id);
  return jsonOk(restored);
});
