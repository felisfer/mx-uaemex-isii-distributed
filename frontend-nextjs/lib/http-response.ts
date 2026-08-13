import type { ApiError } from "@/types/api";

type FieldError = { field: string; defaultMessage: string };

function isFieldError(value: unknown): value is FieldError {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.field === "string" && typeof candidate.defaultMessage === "string";
}

export async function readBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function toApiError(body: unknown, fallbackMessage: string): ApiError {
  if (typeof body === "string") {
    return { message: body || fallbackMessage };
  }

  if (!body || typeof body !== "object") {
    return { message: fallbackMessage };
  }

  const candidate = body as Record<string, unknown>;
  const message = typeof candidate.message === "string" && candidate.message.trim() ? candidate.message : fallbackMessage;
  const errors = Array.isArray(candidate.errors) ? candidate.errors.filter(isFieldError) : undefined;

  return { message, errors };
}
