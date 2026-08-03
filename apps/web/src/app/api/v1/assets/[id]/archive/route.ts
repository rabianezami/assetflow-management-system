import { assetIdParamSchema } from "@/features/assets/contracts/asset.schemas";
import { archiveAsset } from "@/features/assets/server/assets.repository";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";
import { getRequestOrganizationId } from "@/lib/api/tenant";

export const POST = withApiHandler(async (_request, context) => {
  void getRequestOrganizationId();

  const { id } = assetIdParamSchema.parse(await context.params);
  const archived = await archiveAsset(id);
  return jsonOk(archived);
});
