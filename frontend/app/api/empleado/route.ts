import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { readBody, toApiError } from "@/lib/http-response";

export async function GET(): Promise<NextResponse> {
  const response = await backendFetch("/empleado/", { method: "GET" }, true);
  const bodyPayload = await readBody(response);

  if (!response.ok) {
    return NextResponse.json(toApiError(bodyPayload, "No se pudieron obtener los empleados."), {
      status: response.status
    });
  }

  return NextResponse.json(bodyPayload ?? [], { status: response.status });
}
