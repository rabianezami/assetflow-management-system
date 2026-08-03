import { assetIdParamSchema } from "@/features/assets/contracts/asset.schemas";
import { restoreAsset } from "@/features/assets/server/assets.repository";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";
import { getRequestOrganizationId } from "@/lib/api/tenant";

export const POST = withApiHandler(async (_request, context) => {
  void getRequestOrganizationId();

  const { id } = assetIdParamSchema.parse(await context.params);
  const restored = await restoreAsset(id);
  return jsonOk(restored);
});
