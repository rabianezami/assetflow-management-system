export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown) {
  return new ApiError("BAD_REQUEST", message, 400, details);
}

export function validationError(message: string, details?: unknown) {
  return new ApiError("VALIDATION_ERROR", message, 400, details);
}

export function notFound(message: string) {
  return new ApiError("NOT_FOUND", message, 404);
}

export function conflict(message: string, details?: unknown) {
  return new ApiError("CONFLICT", message, 409, details);
}
