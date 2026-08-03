import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ApiError } from "@/lib/api/errors";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ApiSuccessBody<T> = {
  data: T;
  meta?: PaginationMeta;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function jsonOk<T>(
  data: T,
  init?: { status?: number; meta?: PaginationMeta },
) {
  const body: ApiSuccessBody<T> = { data };
  if (init?.meta) body.meta = init.meta;
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    const body: ApiErrorBody = {
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    };
    return NextResponse.json(body, { status: error.status });
  }

  if (error instanceof ZodError) {
    const body: ApiErrorBody = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten(),
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  console.error("[api]", error);
  const body: ApiErrorBody = {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  };
  return NextResponse.json(body, { status: 500 });
}
