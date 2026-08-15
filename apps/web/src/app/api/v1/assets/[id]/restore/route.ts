import { assetIdParamSchema } from "@/features/assets/contracts/asset.schemas";
import { restoreAsset } from "@/features/assets/server/assets.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { parseIdParam } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const POST = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, assetIdParamSchema);
  const restored = await restoreAsset(organizationId, id);
  return jsonOk(restored);
});
