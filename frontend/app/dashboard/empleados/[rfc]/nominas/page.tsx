"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type { ApiError, Nomina } from "@/types/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export default function NominasPage() {
  const params = useParams<{ rfc: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre") ?? "";
  const apellidos = searchParams.get("apellidos") ?? "";
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const fetchNominas = useCallback(async (): Promise<Nomina[]> => {
    const response = await fetch(`/api/nomina?rfc=${encodeURIComponent(params.rfc)}`);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return [];
      }
      const payload = (await response.json().catch(() => ({ message: "No se pudieron cargar las nóminas." }))) as ApiError;
      throw new Error(payload.message);
    }
    return (await response.json()) as Nomina[];
  }, [params.rfc, router]);

  const loadNominas = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchNominas();
      setNominas(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      try {
        const payload = await fetchNominas();
        if (cancelled) {
          return;
        }
        setNominas(payload);
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Error de conexión con el servidor.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, [fetchNominas]);

  const onDelete = async (id: number) => {
    const confirmed = window.confirm("¿Desea eliminar esta nómina?");
    if (!confirmed) {
      return;
    }

    setInfo(null);
    const response = await fetch(`/api/nomina/${id}`, { method: "DELETE" });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        router.replace("/login");
        return;
      }
      const payload = (await response.json().catch(() => ({ message: "No se pudo eliminar la nómina." }))) as ApiError;
      setError(payload.message);
      return;
    }

    setInfo("Nómina eliminada correctamente.");
    await loadNominas();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <strong>Consulta de nóminas</strong>
          <button className="button button-secondary" onClick={logout} type="button">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="container" style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h1>Nóminas por empleado</h1>
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
          {info ? <div className="alert alert-success">{info}</div> : null}
          {error ? <div className="alert alert-error">{error}</div> : null}
          {loading ? <p>Cargando nóminas...</p> : null}
          {!loading && !error && nominas.length === 0 ? <p>Este empleado no tiene nóminas registradas.</p> : null}

          {!loading && !error && nominas.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Salario</th>
                    <th>Excedente</th>
                    <th>Cuota fija</th>
                    <th>Porcentaje</th>
                    <th>Periodo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {nominas.map((nomina) => (
                    <tr key={nomina.id}>
                      <td>{nomina.id}</td>
                      <td>${formatCurrency(nomina.salario)}</td>
                      <td>${formatCurrency(nomina.excedente)}</td>
                      <td>${formatCurrency(nomina.cuotaFija)}</td>
                      <td>{(nomina.porcentaje * 100).toFixed(2)}%</td>
                      <td>
                        {nomina.fechaInicio ?? nomina.periodoInicio} - {nomina.fechaFin ?? nomina.periodoFin}
                      </td>
                      <td>
                        <button className="button button-danger" onClick={() => onDelete(nomina.id)} type="button">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
