import {
  getDb,
  memberships,
  users,
} from "@repo/db";
import { and, count, desc, eq } from "drizzle-orm";

import { hashPassword } from "@/features/auth/server/password";
import type {
  AddMemberBody,
  OrganizationMember,
  UpdateMemberRoleBody,
} from "@/features/organization/contracts/organization.schemas";
import { conflict, notFound } from "@/lib/api/errors";
import { isUniqueViolation } from "@/lib/db/is-unique-violation";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function countOwners(organizationId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ total: count() })
    .from(memberships)
    .where(
      and(
        eq(memberships.organizationId, organizationId),
        eq(memberships.role, "owner"),
      ),
    );
  return Number(row?.total ?? 0);
}

export async function listMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: memberships.id,
      userId: memberships.userId,
      email: users.email,
      name: users.name,
      role: memberships.role,
      createdAt: memberships.createdAt,
    })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(eq(memberships.organizationId, organizationId))
    .orderBy(desc(memberships.createdAt));

  return rows;
}

export async function getMemberById(
  organizationId: string,
  membershipId: string,
): Promise<OrganizationMember | undefined> {
  const db = getDb();
  const [row] = await db
    .select({
      id: memberships.id,
      userId: memberships.userId,
      email: users.email,
      name: users.name,
      role: memberships.role,
      createdAt: memberships.createdAt,
    })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .where(
      and(
        eq(memberships.id, membershipId),
        eq(memberships.organizationId, organizationId),
      ),
    )
    .limit(1);
  return row;
}

export async function addMember(
  organizationId: string,
  input: AddMemberBody,
): Promise<OrganizationMember> {
  const db = getDb();
  const email = normalizeEmail(input.email);
  const passwordHash = await hashPassword(input.password);

  try {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email,
          name: input.name.trim(),
          passwordHash,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
        });

      if (!user) {
        throw new Error("Failed to create user");
      }

      const [membership] = await tx
        .insert(memberships)
        .values({
          userId: user.id,
          organizationId,
          role: input.role,
        })
        .returning({
          id: memberships.id,
          userId: memberships.userId,
          role: memberships.role,
          createdAt: memberships.createdAt,
        });

      if (!membership) {
        throw new Error("Failed to create membership");
      }

      return {
        id: membership.id,
        userId: membership.userId,
        email: user.email,
        name: user.name,
        role: membership.role,
        createdAt: membership.createdAt,
      };
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("An account with this email already exists");
    }
    throw error;
  }
}

/** Caller must load `existing` once and run authz before calling. */
export async function updateMemberRole(
  organizationId: string,
  existing: OrganizationMember,
  input: UpdateMemberRoleBody,
): Promise<OrganizationMember> {
  if (existing.role === "owner" && input.role !== "owner") {
    const owners = await countOwners(organizationId);
    if (owners <= 1) {
      throw conflict("Cannot demote the last owner");
    }
  }

  const db = getDb();
  const [updated] = await db
    .update(memberships)
    .set({ role: input.role })
    .where(
      and(
        eq(memberships.id, existing.id),
        eq(memberships.organizationId, organizationId),
      ),
    )
    .returning({
      id: memberships.id,
      userId: memberships.userId,
      role: memberships.role,
      createdAt: memberships.createdAt,
    });

  if (!updated) {
    throw notFound("Member not found");
  }

  return {
    id: updated.id,
    userId: updated.userId,
    email: existing.email,
    name: existing.name,
    role: updated.role,
    createdAt: updated.createdAt,
  };
}

/** Caller must load `existing` once and run authz before calling. */
export async function removeMember(
  organizationId: string,
  existing: OrganizationMember,
): Promise<void> {
  if (existing.role === "owner") {
    const owners = await countOwners(organizationId);
    if (owners <= 1) {
      throw conflict("Cannot remove the last owner");
    }
  }

  const db = getDb();
  await db
    .delete(memberships)
    .where(
      and(
        eq(memberships.id, existing.id),
        eq(memberships.organizationId, organizationId),
      ),
    );
}
