import {
  siteIdParamSchema,
  updateSiteSchema,
} from "@/features/sites/contracts/site.schemas";
import {
  deleteSite,
  getSiteById,
  updateSite,
} from "@/features/sites/server/sites.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { notFound } from "@/lib/api/errors";
import { parseIdParam, parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, siteIdParamSchema);
  const row = await getSiteById(organizationId, id);
  if (!row) {
    throw notFound("Site not found");
  }
  return jsonOk(row);
});

export const PATCH = withApiHandler(async (request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, siteIdParamSchema);
  const body = await parseJsonBody(request, updateSiteSchema);
  const updated = await updateSite(organizationId, id, body);
  return jsonOk(updated);
});

export const DELETE = withApiHandler(async (_request, context) => {
  const { organizationId } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, siteIdParamSchema);
  await deleteSite(organizationId, id);
  return jsonOk({ id });
});
