# Rehalo — Frontend

Sistema de gestión para clínicas de fisioterapia. Frontend en **Astro 5+** con stack estático-first.

## Stack

- **Astro 5** (Static First)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Tabler Icons v3** (SVGs raw, sin JS en cliente)
- **Zod** (validación de schemas y respuestas de API)
- **Starwind** (componentes a integrar cuando se necesiten)
- **Preact**: NO instalado. Se añadirá SOLO si algún componente lo requiere estrictamente (regla del proyecto).
- **pnpm** como package manager (no usar npm)

## Estructura

```
frontend/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── public/
└── src/
    ├── actions/
    │   ├── index.ts            # Server object exportado (unión de features)
    │   └── landing.ts          # Actions del feature landing
    ├── components/
    │   ├── starwind/           # Componentes Starwind al agregarlos
    │   └── ui/
    │       ├── Icon.astro      # Wrapper sobre Tabler (SVGs raw)
    │       └── sidebar/
    │           └── Sidebar.astro
    ├── features/
    │   ├── landing/components/
    │   ├── dashboard/components/
    │   └── portal/components/
    ├── layouts/
    │   ├── BaseLayout.astro    # Layout raíz
    │   ├── AdminLayout.astro   # Extiende BaseLayout, agrega sidebar admin
    │   └── PortalLayout.astro  # Extiende BaseLayout, agrega sidebar paciente
    ├── lib/
    │   ├── api-client.ts       # Cliente HTTP tipado con Zod
    │   └── icons.ts            # Registro de iconos Tabler
    ├── pages/
    │   ├── index.astro         # Landing pública
    │   ├── login.astro         # Login público
    │   ├── dashboard/index.astro
    │   └── portal/index.astro
    ├── styles/
    │   └── global.css          # Tailwind v4 + design tokens Starwind
    ├── env.d.ts
    └── middleware.ts           # Auth guard de rutas privadas
```

## Aliases

Configurados en `tsconfig.json` y `astro.config.mjs`:

| Alias | Ruta |
|---|---|
| `@/*` | `src/*` |
| `@actions/*` | `src/actions/*` |
| `@features/*` | `src/features/*` |
| `@layouts/*` | `src/layouts/*` |
| `@lib/*` | `src/lib/*` |
| `@ui/*` | `src/components/ui/*` |

## Scripts

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción (NO usar por regla CLAUDE.md)
pnpm preview      # preview del build
pnpm exec astro check   # validación de tipos
```

## Variables de entorno

Crear `.env` con:

```bash
PUBLIC_API_URL=http://localhost:3000/api
```

## Módulos del sistema (MVP)

| # | Módulo | Ruta UI | Action |
|---|---|---|---|
| 2.1 | Expediente clínico (EMR) | `/dashboard/patients/*` | `@features/patients/patients.action.ts` |
| 2.2 | Agenda y citas | `/dashboard/appointments/*` | `@features/appointments/...` |
| 2.3 | Plan de tratamiento / HEP | `/dashboard/treatment/*`, `/portal/exercises/*` | `@features/treatment/...` |
| 2.4 | Notas SOAP | `/dashboard/soap/*` | `@features/soap/...` |
| 2.5 | Facturación | `/dashboard/billing/*`, `/portal/billing/*` | `@features/billing/...` |
| 2.6 | Personal | `/dashboard/staff/*` | `@features/staff/...` |
| 2.7 | Inventario | `/dashboard/inventory/*` | `@features/inventory/...` |
| 2.8 | Portal del paciente | `/portal/*` | `@features/portal/...` |
| 2.9 | Reportes | `/dashboard/reports/*` | `@features/reports/...` |
| 2.10 | Cumplimiento | `/dashboard/settings/*` | `@features/settings/...` |

## Patrón: cómo agregar un feature nuevo

1. Crear `src/features/<feature>/components/`
2. Si necesita HTTP al backend: crear `<feature>.action.ts` con `defineAction({ accept: "form", input: z.object({...}), handler })`
3. Registrar el action en `src/actions/index.ts` (importarlo y agregarlo al `server` object)
4. Si tiene tipos: crear `<feature>.types.ts`
5. Crear las páginas bajo `src/pages/<feature>/...` o usar el feature desde una página existente
6. Llamar al API desde los actions usando `api.get/post/...` de `@lib/api-client`

## Don'ts (reglas del proyecto)

- ❌ Don't duplicate data across modules
- ❌ Don't over-engineer — ship the minimum needed
- ❌ Don't use if/else — use early returns
- ❌ Do not use unnecessary JavaScript; use only the minimum required
- ❌ No usar npm — usar **pnpm**
- ❌ No usar Co-Authored-By ni atribuciones AI en commits
- ❌ No agregar Preact sin necesidad justificada
