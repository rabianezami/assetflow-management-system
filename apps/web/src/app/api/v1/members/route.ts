import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import { addMemberSchema } from "@/features/organization/contracts/organization.schemas";
import {
  assertCanAssignRole,
  assertCanManageOrganization,
} from "@/features/organization/server/organization-authz";
import {
  addMember,
  listMembers,
} from "@/features/organization/server/members.repository";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const GET = withApiHandler(async () => {
  const { organizationId } = await requireOrganizationContext();
  const items = await listMembers(organizationId);
  return jsonOk(items);
});

export const POST = withApiHandler(async (request) => {
  const { organizationId, role } = await requireOrganizationContext();
  assertCanManageOrganization(role);

  const body = await parseJsonBody(request, addMemberSchema);
  assertCanAssignRole(role, body.role);

  const created = await addMember(organizationId, body);
  return jsonOk(created, { status: 201 });
});
