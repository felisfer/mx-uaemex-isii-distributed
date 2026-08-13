import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
      <section className="card">
        <h1>Sistema de Nómina UAEMex</h1>
        <p>
          Plataforma financiera para gestión de empleados, cálculo de nómina y consulta de historiales.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <Link className="button button-primary" href="/login">
            Iniciar sesión
          </Link>
          <Link className="button button-secondary" href="/register">
            Registrar empleado
          </Link>
        </div>
      </section>
    </main>
  );
}
