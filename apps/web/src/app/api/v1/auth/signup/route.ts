import { signupBodySchema } from "@/features/auth/contracts/auth.schemas";
import { signupUser } from "@/features/auth/server/users.repository";
import { parseJsonBody } from "@/lib/api/parse";
import { jsonOk } from "@/lib/api/response";
import { withApiHandler } from "@/lib/api/route-handler";

export const POST = withApiHandler(async (request) => {
  const body = await parseJsonBody(request, signupBodySchema);
  const result = await signupUser(body);
  return jsonOk(result, { status: 201 });
});
