import {
  getDb,
  memberships,
  organizations,
  users,
} from "@repo/db";
import { sql } from "drizzle-orm";

import type { SignupBody } from "@/features/auth/contracts/auth.schemas";
import { hashPassword } from "@/features/auth/server/password";
import { conflict } from "@/lib/api/errors";
import { isUniqueViolation } from "@/lib/db/is-unique-violation";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type UserCredentials = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

/** Lookup for Credentials authorize only — includes passwordHash. */
export async function findCredentialsByEmail(
  email: string,
): Promise<UserCredentials | undefined> {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(sql`lower(${users.email}) = ${normalized}`)
    .limit(1);
  return user;
}

export type SignupResult = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
  };
};

/** Create user + organization + owner membership in one transaction. */
export async function signupUser(body: SignupBody): Promise<SignupResult> {
  const db = getDb();
  const email = normalizeEmail(body.email);
  const passwordHash = await hashPassword(body.password);

  try {
    return await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email,
          name: body.name.trim(),
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

      const [organization] = await tx
        .insert(organizations)
        .values({ name: body.organizationName.trim() })
        .returning({
          id: organizations.id,
          name: organizations.name,
        });

      if (!organization) {
        throw new Error("Failed to create organization");
      }

      await tx.insert(memberships).values({
        userId: user.id,
        organizationId: organization.id,
        role: "owner",
      });

      return { user, organization };
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw conflict("An account with this email already exists");
    }
    throw error;
  }
}
