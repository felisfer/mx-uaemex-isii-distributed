import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { readBody, toApiError } from "@/lib/http-response";
import type { LoginRequest, LoginResponse } from "@/types/api";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as LoginRequest;

  const response = await backendFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const bodyPayload = await readBody(response);
    return NextResponse.json(toApiError(bodyPayload, "Credenciales inválidas."), { status: response.status });
  }

  const payload = (await response.json()) as LoginResponse;
  const result = NextResponse.json({ ok: true });
  result.cookies.set({
    name: "access_token",
    value: payload.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(payload.expiresInMs / 1000),
    path: "/"
  });
  return result;
}
