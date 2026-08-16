import { getDb, memberships, type MembershipRow } from "@repo/db";
import { asc, eq } from "drizzle-orm";

import { requireUser } from "@/features/auth/server/session";
import { forbidden } from "@/lib/api/errors";

export type OrganizationContext = {
  userId: string;
  organizationId: string;
  role: MembershipRow["role"];
};

/**
 * Resolve the caller's organization from memberships.
 * MVP: oldest membership by createdAt (signup creates one).
 */
export async function requireOrganizationContext(): Promise<OrganizationContext> {
  const user = await requireUser();
  const db = getDb();

  const [membership] = await db
    .select({
      organizationId: memberships.organizationId,
      role: memberships.role,
    })
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .orderBy(asc(memberships.createdAt))
    .limit(1);

  if (!membership) {
    throw forbidden("No organization membership found for this account");
  }

  return {
    userId: user.id,
    organizationId: membership.organizationId,
    role: membership.role,
  };
}
