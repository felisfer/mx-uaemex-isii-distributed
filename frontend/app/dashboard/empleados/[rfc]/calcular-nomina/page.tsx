"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { ApiError, Nomina } from "@/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function CalcularNominaPage() {
  const params = useParams<{ rfc: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre") ?? "";
  const apellidos = searchParams.get("apellidos") ?? "";
  const [salario, setSalario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Nomina | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const getFieldError = (fieldName: string): string | undefined => fieldErrors[fieldName];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResultado(null);
    setFieldErrors({});

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
      setFieldErrors({ fechaInicio: "La fecha de inicio debe ser menor o igual a la fecha de fin." });
      return;
    }

    setLoading(true);
    const response = await fetch("/api/nomina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rfc: params.rfc,
        fechaInicio,
        fechaFin,
        salario: Number(salario)
      })
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      const payload = (await response.json().catch(() => ({ message: "No se pudo calcular la nómina." }))) as ApiError;
      if (response.status === 400 && payload.errors && payload.errors.length > 0) {
        const nextFieldErrors = payload.errors.reduce<Record<string, string>>((acc, item) => {
          acc[item.field] = item.defaultMessage;
          return acc;
        }, {});
        setFieldErrors(nextFieldErrors);
        setError("Por favor, corrija los errores en el formulario.");
      } else {
        setError(payload.message || "No se pudo calcular la nómina.");
      }
      setLoading(false);
      return;
    }

    const payload = (await response.json()) as Nomina;
    setResultado(payload);
    setLoading(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <strong>Cálculo de nómina</strong>
          <button className="button button-secondary" onClick={logout} type="button">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="container" style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h1>Calcular nómina</h1>
          <p>
            RFC: <strong>{params.rfc}</strong>
            <br />
            Empleado: {nombre} {apellidos}
          </p>
          <Link className="button button-secondary" href="/dashboard">
            Volver al dashboard
          </Link>
        </section>

        <section className="card">
          {error ? <div className="alert alert-error">{error}</div> : null}
          <form onSubmit={onSubmit}>
            <label className="field">
              Salario bruto
              <input
                aria-invalid={Boolean(getFieldError("salario"))}
                className={getFieldError("salario") ? "input-invalid" : undefined}
                min="0"
                onChange={(event) => setSalario(event.target.value)}
                required
                step="0.01"
                type="number"
                value={salario}
              />
              {getFieldError("salario") ? <span className="field-error">{getFieldError("salario")}</span> : null}
            </label>
            <label className="field">
              Fecha inicio
              <input
                aria-invalid={Boolean(getFieldError("fechaInicio"))}
                className={getFieldError("fechaInicio") ? "input-invalid" : undefined}
                onChange={(event) => setFechaInicio(event.target.value)}
                required
                type="date"
                value={fechaInicio}
              />
              {getFieldError("fechaInicio") ? (
                <span className="field-error">{getFieldError("fechaInicio")}</span>
              ) : null}
            </label>
            <label className="field">
              Fecha fin
              <input
                aria-invalid={Boolean(getFieldError("fechaFin"))}
                className={getFieldError("fechaFin") ? "input-invalid" : undefined}
                onChange={(event) => setFechaFin(event.target.value)}
                required
                type="date"
                value={fechaFin}
              />
              {getFieldError("fechaFin") ? <span className="field-error">{getFieldError("fechaFin")}</span> : null}
            </label>
            <button className="button button-primary" disabled={loading} type="submit">
              {loading ? "Calculando..." : "Calcular nómina"}
            </button>
          </form>
        </section>

        {resultado ? (
          <section className="card" style={{ marginTop: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem" }}>Resultado</h2>
            <p>Salario: ${formatCurrency(resultado.salario)}</p>
            <p>Excedente: ${formatCurrency(resultado.excedente)}</p>
            <p>Cuota fija: ${formatCurrency(resultado.cuotaFija)}</p>
            <p>Porcentaje: {(resultado.porcentaje * 100).toFixed(2)}%</p>
            <p>
              Periodo: {resultado.fechaInicio ?? resultado.periodoInicio} -{" "}
              {resultado.fechaFin ?? resultado.periodoFin}
            </p>
          </section>
        ) : null}
      </main>
    </>
  );
}
