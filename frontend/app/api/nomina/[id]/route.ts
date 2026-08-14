import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { readBody, toApiError } from "@/lib/http-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  const response = await backendFetch(`/nomina/${id}`, { method: "DELETE" }, true);
  const bodyPayload = await readBody(response);

  if (!response.ok) {
    return NextResponse.json(toApiError(bodyPayload, "No se pudo eliminar la nómina."), {
      status: response.status
    });
  }

  return NextResponse.json({ ok: true });
}
