import type { ApiErrorBody, ApiSuccessBody, PaginationMeta } from "@/lib/api/response";

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return false;
  }
  const error = (value as ApiErrorBody).error;
  return (
    typeof error === "object" &&
    error !== null &&
    typeof error.code === "string" &&
    typeof error.message === "string"
  );
}

/**
 * Browser/server fetch against `/api/v1/*` Route Handlers.
 * Unwraps `{ data, meta? }` and throws `ApiClientError` on `{ error }`.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccessBody<T>> {
  const headers = new Headers(init?.headers);
  if (init?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...init, headers });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiClientError(
      "INTERNAL_ERROR",
      "Response was not valid JSON",
      response.status,
    );
  }

  if (!response.ok || isApiErrorBody(payload)) {
    if (isApiErrorBody(payload)) {
      throw new ApiClientError(
        payload.error.code,
        payload.error.message,
        response.status,
        payload.error.details,
      );
    }
    throw new ApiClientError(
      "INTERNAL_ERROR",
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return payload as ApiSuccessBody<T>;
}

export type { PaginationMeta };
