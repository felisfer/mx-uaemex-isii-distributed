"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Empleado } from "@/types/api";

export default function DashboardPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/api/empleado");
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.replace("/login");
          return;
        }
        setError("No se pudo cargar la lista de empleados.");
        setLoading(false);
        return;
      }
      const payload = (await response.json()) as Empleado[];
      setEmpleados(payload);
      setLoading(false);
    };

    loadData().catch(() => {
      setError("Error de conexión con el servidor.");
      setLoading(false);
    });
  }, [router]);

  const totalAdmins = useMemo(() => empleados.filter((item) => item.esAdministrador).length, [empleados]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <strong>Sistema de Nómina</strong>
          <button className="button button-secondary" onClick={logout} type="button">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="container" style={{ paddingTop: "1.25rem", paddingBottom: "2rem" }}>
        <section className="card" style={{ marginBottom: "1rem" }}>
          <h1>Dashboard de empleados</h1>
          <p style={{ marginBottom: 0 }}>Total empleados: {empleados.length} | Administradores: {totalAdmins}</p>
        </section>

        <section className="card">
          <h2 style={{ fontSize: "1.25rem" }}>Listado</h2>
          {loading ? <p>Cargando empleados...</p> : null}
          {error ? <div className="alert alert-error">{error}</div> : null}

          {!loading && !error ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>RFC</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => (
                    <tr key={empleado.rfc}>
                      <td>{empleado.rfc}</td>
                      <td>{empleado.nombre}</td>
                      <td>{empleado.apellidos}</td>
                      <td>{empleado.correo}</td>
                      <td style={{ display: "flex", gap: "0.5rem" }}>
                        <Link
                          className="button button-primary"
                          href={`/dashboard/empleados/${empleado.rfc}/calcular-nomina?nombre=${encodeURIComponent(
                            empleado.nombre
                          )}&apellidos=${encodeURIComponent(empleado.apellidos)}`}
                        >
                          Calcular
                        </Link>
                        <Link
                          className="button button-secondary"
                          href={`/dashboard/empleados/${empleado.rfc}/nominas?nombre=${encodeURIComponent(
                            empleado.nombre
                          )}&apellidos=${encodeURIComponent(empleado.apellidos)}`}
                        >
                          Consultar
                        </Link>
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
