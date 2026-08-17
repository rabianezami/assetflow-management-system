import { getDb, organizations, type OrganizationRow } from "@repo/db";
import { eq } from "drizzle-orm";

import type { UpdateOrganizationBody } from "@/features/organization/contracts/organization.schemas";
import { notFound } from "@/lib/api/errors";

export async function getOrganizationById(
  organizationId: string,
): Promise<OrganizationRow | undefined> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);
  return row;
}

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationBody,
): Promise<OrganizationRow> {
  const db = getDb();
  const [row] = await db
    .update(organizations)
    .set({ name: input.name.trim() })
    .where(eq(organizations.id, organizationId))
    .returning();

  if (!row) {
    throw notFound("Organization not found");
  }
  return row;
}
