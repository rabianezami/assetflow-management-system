import {
  createSiteSchema,
  listSitesQuerySchema,
} from "@/features/sites/contracts/site.schemas";
import {
  createSite,
  listSites,
} from "@/features/sites/server/sites.repository";
import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { parseJsonBody, parseSearchParams } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async (request) => {
  const { organizationId } = await requireOrganizationContext();
  const query = parseSearchParams(request, listSitesQuerySchema);
  const result = await listSites(organizationId, query);

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
  const body = await parseJsonBody(request, createSiteSchema);
  const created = await createSite(organizationId, body);
  return jsonOk(created, { status: 201 });
});
