# Frontend Next.js - Sistema de Nómina

Migración del frontend legacy (HTML + JS) a Next.js con App Router y diseño minimalista financiero.

## Requisitos

- Node.js 20+
- Backend ejecutándose (por defecto en `http://localhost:3000`)

## Configuración

Crear archivo `.env.local`:

```env
BACKEND_API_URL=http://localhost:3000
```

## Ejecutar

```bash
npm install
npm run dev
```

Abrir: `http://localhost:3000` (o el puerto que asigne Next.js).

## Rutas principales

- `/login`
- `/register`
- `/dashboard`
- `/dashboard/empleados/[rfc]/calcular-nomina`
- `/dashboard/empleados/[rfc]/nominas`
