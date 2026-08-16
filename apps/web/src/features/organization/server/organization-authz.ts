import type { MembershipRole } from "@/features/organization/contracts/organization.schemas";
import { forbidden } from "@/lib/api/errors";

export function assertCanManageOrganization(role: MembershipRole): void {
  if (role !== "owner" && role !== "admin") {
    throw forbidden("Only owners and admins can manage this organization");
  }
}

/** Owners can assign any role; admins cannot assign or target owner. */
export function assertCanAssignRole(
  actorRole: MembershipRole,
  targetRole: MembershipRole,
): void {
  assertCanManageOrganization(actorRole);
  if (actorRole === "owner") {
    return;
  }
  if (targetRole === "owner") {
    throw forbidden("Only owners can assign the owner role");
  }
}

export function assertCanManageMember(
  actorRole: MembershipRole,
  targetRole: MembershipRole,
): void {
  assertCanManageOrganization(actorRole);
  if (actorRole === "owner") {
    return;
  }
  if (targetRole === "owner") {
    throw forbidden("Only owners can manage owner memberships");
  }
}
