import { auth } from "@/auth";
import { unauthorized } from "@/lib/api/errors";

/**
 * Authenticated identity from the Auth.js session.
 * Organization comes from requireOrganizationContext() (memberships).
 */
export type SessionUser = {
  id: string;
};

/** Return the current session user id, or null if unauthenticated. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (typeof id !== "string" || id.length === 0) {
    return null;
  }
  return { id };
}

/** Require an authenticated user; throws ApiError 401 otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw unauthorized();
  }
  return user;
}
