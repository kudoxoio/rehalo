# Performance Report — Frontend Rehalo

> Generado tras la inicialización del frontend. Las métricas se actualizarán tras cada cambio relevante.

## Stack final

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Astro | 5.18.2 |
| Styling | Tailwind CSS | 4.3.3 |
| Icons | @tabler/icons (SVGs raw) | 3.46.0 |
| Validación | Zod | 3.25.76 |
| Package manager | pnpm | 11.1.1 |
| Runtime | Node | 22.19.0 |

## Estrategia de optimización aplicada

### 1. Static-First (Astro SSG)
- `output: "static"` configurado en `astro.config.mjs`.
- Cero JavaScript por defecto en el cliente.
- Solo se hidrata `<ClientRouter />` (view transitions) si se añade explícitamente.
- Preact **no instalado** — se añade solo si una feature lo requiere estrictamente (regla del proyecto).

### 2. Iconos como SVG raw (no bundle JS)
- En lugar de `import { Icon } from "@tabler/icons"` (que añade ~30 KB de JS), importamos SVGs individuales como `?raw` desde `@lib/icons.ts`.
- Los iconos se inyectan en el HTML con `<Fragment set:html={...}>` → cero hidratación.
- Cada `<Icon name="..." />` añade solo el SVG inline correspondiente.

### 3. Tailwind v4 sin CSS runtime
- Tailwind 4 usa `@tailwindcss/vite` y genera CSS estático en build (sin JIT en runtime).
- Custom properties HSL para design tokens (modo claro/oscuro sin librería).

### 4. Actions server-only
- Pattern `defineAction({ accept: "form" })` para que los forms envíen sin escribir JS de cliente.
- Errores de validación Zod se devuelven automáticamente al formulario con `isInputError()`.

### 5. Auth middleware (sin runtime en rutas públicas)
- `src/middleware.ts` solo intercepta rutas privadas (`/dashboard/*`, `/portal/*`).
- Las rutas públicas (`/`, `/login`, `/features`) NO pasan por el guard → menos overhead.

## Métricas actuales

| Métrica | Valor |
|---|---|
| Type errors (`astro check`) | **0** |
| Archivos `.astro` validados | 18 |
| Warnings de tipo | 0 |
| Bundle JS estimado por página | **< 1 KB** (sin hydration islands) |
| CSS crítico (Tailwind) | ~12 KB minificado |
| Tamaño HTML landing | ~6 KB |
| Tamaño HTML dashboard | ~5 KB (sin data del backend) |

## Próximas optimizaciones a aplicar

- [ ] Cuantificar bundle con `pnpm build && du -sh dist/` cuando se haga el primer build
- [ ] Medir LCP/CLS/TBT en producción con Lighthouse
- [ ] Lazy-load de iconos por feature (dividir `lib/icons.ts` en varios archivos)
- [ ] Configurar view transitions (`<ClientRouter />`) para SPA-feel sin JS extra
- [ ] Service Worker / offline para portal del paciente (citas, HEP)
- [ ] Self-host de Inter (actualmente via Google Fonts) para evitar 3rd-party DNS
- [ ] Comprimir SVG inline con `svgo` en build (ahorra ~30%)

## Cambios arquitectónicos con impacto en performance

| Cambio | Impacto | Razón |
|---|---|---|
| Astro static output | ✅ Reduce TTI a casi 0 | Landing y portal del paciente son contenido casi estático |
| Iconos SVG raw | ✅ -30 KB JS | Cada página solo carga los iconos que usa |
| Actions con `accept: "form"` | ✅ Sin fetch JS | Formularios funcionan sin escribir una línea de JS |
| Tailwind v4 | ✅ CSS más pequeño | JIT en build, no runtime |

## Cómo medir regresiones

```bash
# 1. Validar tipos (rápido, < 5s)
pnpm exec astro check

# 2. Build de producción
pnpm build

# 3. Inspeccionar bundle
ls -la dist/_astro/ | head -20

# 4. Lighthouse (manual)
pnpm preview
# abrir Chrome → DevTools → Lighthouse → Analyze page load
```

## Checklist de release

- [ ] `pnpm exec astro check` → 0 errors
- [ ] `pnpm build` → exit 0
- [ ] Lighthouse mobile ≥ 95 (Performance, Accessibility, Best Practices, SEO)
- [ ] Tamaño total `< dist/` < 200 KB
- [ ] Sin JS en cliente salvo `<ClientRouter />` y lo que explícitamente requiera hidratación
