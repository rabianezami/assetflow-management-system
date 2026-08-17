import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { updateOrganizationSchema } from "@/features/organization/contracts/organization.schemas";
import { assertCanManageOrganization } from "@/features/organization/server/organization-authz";
import {
  getOrganizationById,
  updateOrganization,
} from "@/features/organization/server/organization.repository";
import { notFound } from "@/lib/api/errors";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async () => {
  const { organizationId, role } = await requireOrganizationContext();
  const org = await getOrganizationById(organizationId);
  if (!org) {
    throw notFound("Organization not found");
  }

  return jsonOk({
    id: org.id,
    name: org.name,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    viewerRole: role,
  });
});

export const PATCH = withApiHandler(async (request) => {
  const { organizationId, role } = await requireOrganizationContext();
  assertCanManageOrganization(role);

  const body = await parseJsonBody(request, updateOrganizationSchema);
  const updated = await updateOrganization(organizationId, body);

  return jsonOk({
    id: updated.id,
    name: updated.name,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    viewerRole: role,
  });
});
