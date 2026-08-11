import { requireUser } from "@/features/auth/server/session";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

/** Temporary smoke check for session cookies — returns id only. */
export const GET = withApiHandler(async () => {
  const user = await requireUser();
  return jsonOk({ id: user.id });
});
