import Link from "next/link";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function HomePage() {
  const modules = [
    {
      title: "Administración de empleados",
      description: "Registra colaboradores y conserva su información fiscal y de contacto actualizada."
    },
    {
      title: "Cálculo de nómina",
      description: "Calcula percepciones y deducciones por RFC con validaciones para reducir errores operativos."
    },
    {
      title: "Historial y consulta",
      description: "Revisa nóminas previas por empleado para auditoría y seguimiento interno."
    }
  ];

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <strong>Sistema de Nómina UAEMex</strong>
          <Link className="button button-secondary" href="/login">
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <section className="card" style={{ marginBottom: "1rem" }}>
          <p style={{ color: "var(--color-secondary)", fontWeight: 700, marginBottom: "0.5rem" }}>
            Plataforma institucional
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", marginBottom: "0.75rem" }}>
            Control integral de nómina para la operación diaria
          </h1>
          <p style={{ maxWidth: 720, marginBottom: "1.25rem" }}>
            Gestiona el ciclo completo de empleados, desde el registro hasta el cálculo y consulta de nóminas,
            manteniendo un flujo claro para el equipo administrativo.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link className="button button-primary" href="/login">
              Acceder al sistema
            </Link>
            <Link className="button button-secondary" href="/register">
              Registrar empleado
            </Link>
          </div>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <article className="card">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "0.35rem" }}>+ Eficiencia operativa</h2>
            <p style={{ margin: 0 }}>Centraliza tareas de nómina para reducir tiempos administrativos.</p>
          </article>
          <article className="card">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "0.35rem" }}>+ Trazabilidad</h2>
            <p style={{ margin: 0 }}>Mantén historial de cálculos y movimientos por colaborador.</p>
          </article>
          <article className="card">
            <h2 style={{ fontSize: "1.15rem", marginBottom: "0.35rem" }}>+ Escalabilidad</h2>
            <p style={{ margin: 0 }}>Soporta crecimiento de personal con una estructura consistente.</p>
          </article>
        </section>

        <section className="card" style={{ marginTop: "1rem" }}>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.85rem" }}>Módulos principales</h2>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {modules.map((module) => (
              <article
                key={module.title}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "0.9rem 1rem",
                  backgroundColor: "#fff"
                }}
              >
                <h3 style={{ marginBottom: "0.35rem", fontSize: "1.1rem" }}>{module.title}</h3>
                <p style={{ margin: 0 }}>{module.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
