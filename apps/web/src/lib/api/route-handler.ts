import { jsonError } from "@/lib/api/response";

type RouteContext = {
  params: Promise<Record<string, string>>;
};

type Handler = (
  request: Request,
  context: RouteContext,
) => Promise<Response> | Response;

/** Wraps a route handler so thrown ApiError/ZodError become JSON responses. */
export function withApiHandler(handler: Handler): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return jsonError(error);
    }
  };
}
