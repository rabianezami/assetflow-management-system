import { ApiClientError } from "@/lib/api/client";

export function isConflictError(error: unknown): boolean {
  return error instanceof ApiClientError && error.code === "CONFLICT";
}
