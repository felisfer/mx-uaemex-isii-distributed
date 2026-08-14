"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiError, LoginRequest } from "@/types/api";
import Link from "next/dist/client/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ message: "Credenciales inválidas" }))) as ApiError;
      setError(payload.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="container" style={{ paddingTop: "3rem" }}>
      <section className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
        <Link href="/" style={{ display: "block", marginBottom: "1rem" }}>
          Volver a la página principal
        </Link>
        <h1>Iniciar sesión</h1>
        {error ? <div className="alert alert-error">{error}</div> : null}
        <form onSubmit={onSubmit}>
          <label className="field">
            Correo electrónico
            <input
              value={form.correo}
              onChange={(event) => setForm((prev) => ({ ...prev, correo: event.target.value }))}
              required
              type="email"
            />
          </label>
          <label className="field">
            Contraseña
            <input
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              type="password"
            />
          </label>
          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
