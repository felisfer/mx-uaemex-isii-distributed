import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { readBody, toApiError } from "@/lib/http-response";
import type { RegisterRequest } from "@/types/api";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as RegisterRequest;
  const isAdmin = Boolean(body.esAdministrador ?? body.esAdministrador);

  const normalizedBody = {
    rfc: body.rfc,
    nombre: body.nombre,
    apellidos: body.apellidos,
    correo: body.correo,
    esAdministrador: isAdmin,
    password: isAdmin ? body.password : null,
    confirmPassword: isAdmin ? body.confirmPassword : null
  };

  const response = await backendFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedBody)
  });

  const bodyPayload = await readBody(response);
  if (!response.ok) {
    return NextResponse.json(toApiError(bodyPayload, "No se pudo registrar el empleado."), {
      status: response.status
    });
  }

  return NextResponse.json(bodyPayload ?? {}, { status: response.status });
}
