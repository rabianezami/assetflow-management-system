import { requireOrganizationContext } from "@/features/auth/server/organization-context";
import {
  memberIdParamSchema,
  updateMemberRoleSchema,
} from "@/features/organization/contracts/organization.schemas";
import {
  assertCanAssignRole,
  assertCanManageMember,
} from "@/features/organization/server/organization-authz";
import {
  getMemberById,
  removeMember,
  updateMemberRole,
} from "@/features/organization/server/members.repository";
import { notFound } from "@/lib/api/errors";
import { parseIdParam, parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const PATCH = withApiHandler(async (request, context) => {
  const { organizationId, role } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, memberIdParamSchema);
  const body = await parseJsonBody(request, updateMemberRoleSchema);

  const existing = await getMemberById(organizationId, id);
  if (!existing) {
    throw notFound("Member not found");
  }

  assertCanManageMember(role, existing.role);
  assertCanAssignRole(role, body.role);

  const updated = await updateMemberRole(organizationId, existing, body);
  return jsonOk(updated);
});

export const DELETE = withApiHandler(async (_request, context) => {
  const { organizationId, role } = await requireOrganizationContext();
  const id = await parseIdParam(context.params, memberIdParamSchema);

  const existing = await getMemberById(organizationId, id);
  if (!existing) {
    throw notFound("Member not found");
  }

  assertCanManageMember(role, existing.role);
  await removeMember(organizationId, existing);
  return jsonOk({ id });
});
