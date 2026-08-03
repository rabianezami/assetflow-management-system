import type { ZodType } from "zod";

import { badRequest, validationError } from "@/lib/api/errors";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw badRequest("Request body must be valid JSON");
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    throw validationError("Request validation failed", result.error.flatten());
  }
  return result.data;
}

export function parseSearchParams<T>(
  request: Request,
  schema: ZodType<T>,
): T {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw validationError("Query validation failed", result.error.flatten());
  }
  return result.data;
}

/** Parse a route `[id]` (or similar) param object against a Zod schema that exposes `id`. */
export async function parseIdParam(
  params: Promise<Record<string, string>>,
  schema: ZodType<{ id: string }>,
): Promise<string> {
  const resolved = await params;
  const result = schema.safeParse(resolved);
  if (!result.success) {
    throw validationError("Path validation failed", result.error.flatten());
  }
  return result.data.id;
}
