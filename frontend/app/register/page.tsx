"use client";

import { FormEvent, useState } from "react";
import type { ApiError } from "@/types/api";
import Link from "next/dist/client/link";

type RegisterForm = {
  rfc: string;
  nombre: string;
  apellidos: string;
  correo: string;
  esAdministrador: boolean;
  password: string;
  confirmPassword: string;
};

const EMPTY_FORM: RegisterForm = {
  rfc: "",
  nombre: "",
  apellidos: "",
  correo: "",
  esAdministrador: false,
  password: "",
  confirmPassword: ""
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const getFieldError = (fieldName: string): string | undefined => fieldErrors[fieldName];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    if (form.esAdministrador && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setFieldErrors({ confirmPassword: "Las contraseñas no coinciden." });
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({ message: "No se pudo registrar." }))) as ApiError;
      if (response.status === 400 && payload.errors && payload.errors.length > 0) {
        const nextFieldErrors = payload.errors.reduce<Record<string, string>>((acc, item) => {
          acc[item.field] = item.defaultMessage;
          return acc;
        }, {});
        setFieldErrors(nextFieldErrors);
        setError("Por favor, corrija los errores en el formulario.");
      } else {
        setError(payload.message || "No se pudo registrar.");
      }
      setLoading(false);
      return;
    }

    setSuccess("Empleado registrado exitosamente.");
    setForm(EMPTY_FORM);
    setLoading(false);
  };

  return (
    <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <section className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <Link href="/" style={{ display: "block", marginBottom: "1rem" }}>
          Volver a la página principal
        </Link>
        <h1>Registrar empleado</h1>
        {error ? <div className="alert alert-error">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}
        <form onSubmit={onSubmit}>
          <label className="field">
            RFC
            <input
              aria-invalid={Boolean(getFieldError("rfc"))}
              className={getFieldError("rfc") ? "input-invalid" : undefined}
              value={form.rfc}
              onChange={(event) => setForm((prev) => ({ ...prev, rfc: event.target.value.toUpperCase() }))}
              required
            />
            {getFieldError("rfc") ? <span className="field-error">{getFieldError("rfc")}</span> : null}
          </label>
          <label className="field">
            Nombre(s)
            <input
              aria-invalid={Boolean(getFieldError("nombre"))}
              className={getFieldError("nombre") ? "input-invalid" : undefined}
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value.toUpperCase() }))}
              required
            />
            {getFieldError("nombre") ? <span className="field-error">{getFieldError("nombre")}</span> : null}
          </label>
          <label className="field">
            Apellido(s)
            <input
              aria-invalid={Boolean(getFieldError("apellidos"))}
              className={getFieldError("apellidos") ? "input-invalid" : undefined}
              value={form.apellidos}
              onChange={(event) => setForm((prev) => ({ ...prev, apellidos: event.target.value.toUpperCase() }))}
              required
            />
            {getFieldError("apellidos") ? <span className="field-error">{getFieldError("apellidos")}</span> : null}
          </label>
          <label className="field">
            Correo electrónico
            <input
              aria-invalid={Boolean(getFieldError("correo"))}
              className={getFieldError("correo") ? "input-invalid" : undefined}
              value={form.correo}
              onChange={(event) => setForm((prev) => ({ ...prev, correo: event.target.value }))}
              required
              type="email"
            />
            {getFieldError("correo") ? <span className="field-error">{getFieldError("correo")}</span> : null}
          </label>
          <label style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <input
              checked={form.esAdministrador}
              onChange={(event) => setForm((prev) => ({ ...prev, esAdministrador: event.target.checked }))}
              type="checkbox"
            />
            Es administrador
          </label>
          {form.esAdministrador ? (
            <>
              <label className="field">
                Contraseña
                <input
                  aria-invalid={Boolean(getFieldError("password"))}
                  className={getFieldError("password") ? "input-invalid" : undefined}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  type="password"
                />
                {getFieldError("password") ? (
                  <span className="field-error">{getFieldError("password")}</span>
                ) : null}
              </label>
              <label className="field">
                Confirmar contraseña
                <input
                  aria-invalid={Boolean(getFieldError("confirmPassword"))}
                  className={getFieldError("confirmPassword") ? "input-invalid" : undefined}
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                  required
                  type="password"
                />
                {getFieldError("confirmPassword") ? (
                  <span className="field-error">{getFieldError("confirmPassword")}</span>
                ) : null}
              </label>
            </>
          ) : null}
          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
