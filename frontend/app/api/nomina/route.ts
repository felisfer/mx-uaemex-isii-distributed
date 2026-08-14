import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { readBody, toApiError } from "@/lib/http-response";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const rfc = request.nextUrl.searchParams.get("rfc");
  if (!rfc) {
    return NextResponse.json({ message: "RFC requerido." }, { status: 400 });
  }

  const response = await backendFetch(`/nomina/?rfc=${encodeURIComponent(rfc)}`, { method: "GET" }, true);
  const bodyPayload = await readBody(response);

  if (!response.ok) {
    return NextResponse.json(toApiError(bodyPayload, "No se pudieron obtener las nóminas."), {
      status: response.status
    });
  }

  return NextResponse.json(bodyPayload ?? [], { status: response.status });
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.text();
  const response = await backendFetch(
    "/nomina/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    },
    true
  );
  const bodyPayload = await readBody(response);

  if (!response.ok) {
    return NextResponse.json(toApiError(bodyPayload, "No se pudo calcular la nómina."), {
      status: response.status
    });
  }

  return NextResponse.json(bodyPayload ?? {}, { status: response.status });
}
