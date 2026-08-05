# Rehalo — Design System

> Sistema visual para el EMR y agenda de clínicas de fisioterapia.
> Inspirado en dashboards modernos banking-style (ACRU) adaptado a healthcare.

**Fecha de creación:** 2026-08-05
**Stack:** Astro 7 + Tailwind CSS 4 + Starwind UI v2 + @tabler/icons

---

## 1. Filosofía

- **Claridad clínica:** la información médica debe leerse sin fricción. Cero decoraciones gratuitas.
- **Calma + confianza:** verdes suaves (no lima chillón) que evoquen rehabilitación y naturaleza, no urgencia.
- **Densidad inteligente:** densidad media — ni spreadsheet ni landing page. Cada dato respira.
- **Mobile-first pero desktop-primario:** el flujo clínico se hace en consultorio (desktop/tablet).
- **Accesibilidad WCAG AA:** contraste mínimo 4.5:1 en texto, 3:1 en UI.

---

## 2. Paleta de colores

### 2.1 Tokens primarios (HSL para Tailwind v4)

| Token | HSL | Uso |
|-------|-----|-----|
| `--background` | `220 20% 97%` | Fondo de la app (gris muy claro) |
| `--foreground` | `222 47% 11%` | Texto principal |
| `--card` | `0 0% 100%` | Fondo de cards |
| `--card-foreground` | `222 47% 11%` | Texto dentro de cards |
| `--primary` | `142 71% 45%` | Verde clínico (CTAs, acentos) |
| `--primary-foreground` | `0 0% 100%` | Texto sobre primary |
| `--accent` | `142 76% 95%` | Verde muy claro (chips, hover suave) |
| `--accent-foreground` | `142 71% 25%` | Texto sobre accent |
| `--muted` | `220 14% 96%` | Fondo de inputs deshabilitados |
| `--muted-foreground` | `220 9% 46%` | Texto secundario |
| `--border` | `220 13% 91%` | Bordes sutiles |
| `--input` | `220 13% 91%` | Borde de inputs |
| `--ring` | `142 71% 45%` | Focus ring |
| `--destructive` | `0 72% 51%` | Errores, alertas críticas |
| `--success` | `142 71% 45%` | Mismo que primary |
| `--warning` | `38 92% 50%` | No-show, atención |
| `--info` | `217 91% 60%` | Información neutral |

### 2.2 Semánticos para clínica

| Concepto | Color | Significado |
|----------|-------|-------------|
| KPI positivo | `--primary` | Sesiones completadas, adherencia |
| KPI neutro | `--info` | Métricas de actividad |
| KPI negativo | `--destructive` | No-shows, alertas críticas |
| KPI atención | `--warning` | Riesgo de abandono |
| Estado cita | verde | Confirmada |
| Estado cita | ámbar | Pendiente confirmación |
| Estado cita | rojo | Cancelada/no-show |
| Estado cita | gris | Borrador |

---

## 3. Tipografía

**Familia principal:** **Inter** (sans-serif geométrica, legible en UI médica).
**Mono (datos):** **JetBrains Mono** (códigos CIE-10, IDs, montos).

### 3.1 Escala tipográfica

| Nivel | Tamaño | Peso | Uso |
|-------|--------|------|-----|
| `display-2xl` | 48px / 1.05 | 700 | Hero, números de KPI gigantes |
| `display-xl` | 36px / 1.1 | 700 | Títulos de sección |
| `display-lg` | 30px / 1.15 | 600 | Títulos de página |
| `heading-xl` | 24px / 1.25 | 600 | H1 |
| `heading-lg` | 20px / 1.3 | 600 | H2 |
| `heading-md` | 18px / 1.4 | 600 | H3, cards |
| `heading-sm` | 16px / 1.5 | 600 | Labels grandes |
| `body-lg` | 16px / 1.6 | 400 | Texto principal |
| `body-md` | 14px / 1.55 | 400 | Texto secundario |
| `body-sm` | 13px / 1.5 | 400 | Metadata |
| `caption` | 12px / 1.4 | 500 | Tags, fechas |
| `overline` | 11px / 1.4 | 600 uppercase | Etiquetas |

### 3.2 Pesos
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## 4. Espaciado

Sistema base 4px. Escala:

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gaps mínimos |
| `space-2` | 8px | Entre label e input |
| `space-3` | 12px | Dentro de chips |
| `space-4` | 16px | Padding interno de cards chicos |
| `space-6` | 24px | Padding estándar de cards |
| `space-8` | 32px | Entre secciones |
| `space-12` | 48px | Entre bloques grandes |
| `space-16` | 64px | Hero / separadores |

---

## 5. Radios (border-radius)

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Inputs, botones pequeños |
| `radius-md` | 10px | Botones, badges |
| `radius-lg` | 16px | Cards estándar |
| `radius-xl` | 20px | Cards grandes, paneles |
| `radius-2xl` | 28px | Modales |
| `radius-full` | 9999px | Pills, avatares |

---

## 6. Sombras

Sombras **muy sutiles** — confiamos más en borders que en elevación.

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-xs` | `0 1px 2px rgba(15,23,42,0.04)` | Hover de inputs |
| `shadow-sm` | `0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)` | Cards en reposo |
| `shadow-md` | `0 4px 8px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)` | Cards hover, popovers |
| `shadow-lg` | `0 12px 24px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)` | Modales |

---

## 7. Iconografía

**Set:** @tabler/icons v3 (outline, stroke 1.75, 24px default).
**Reglas:**
- Tamaño: 16px (inline), 20px (nav), 24px (destacado), 32px (hero stats).
- Color: heredar del texto padre o `text-primary` para acentos.
- NUNCA rellenar — outline siempre.

### Iconos clave del sistema

| Concepto | Icono |
|----------|-------|
| Paciente | `users`, `user` |
| Cita | `calendar-event`, `calendar-plus`, `calendar-exclamation` |
| Sala/box | `door`, `building` |
| Terapia | `barbell`, `stethoscope`, `activity-heartbeat` |
| Documento | `clipboard-list`, `file-text`, `notes` |
| Alerta | `alert-triangle`, `alert-circle` |
| Adherencia | `chart-line`, `trending-up` |
| Facturación | `receipt`, `currency-dollar` |
| Auditoría | `history`, `shield-lock` |

---

## 8. Layout y grid

### 8.1 Sidebar
- Ancho fijo: **256px** (colapsable a 64px en desktop).
- Fondo `--card` (blanco) con border-r sutil.
- Items: altura 40px, padding-x 16px, radius-md cuando hover/active.
- Item activo: `--accent` background + texto `--accent-foreground`.

### 8.2 Topbar
- Altura: 64px.
- Sticky, fondo `--background/80` con backdrop-blur.
- Border-b sutil.

### 8.3 Main content
- Padding: 24px (mobile) / 32px (desktop).
- Max-width: 1440px centrado.

### 8.4 Grids de dashboard

| Patrón | Grid | Uso |
|--------|------|-----|
| KPI strip | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` | Métricas rápidas |
| Cards mixtas | `grid-cols-1 lg:grid-cols-3 gap-6` | Layout principal |
| Master-detail | `grid-cols-1 lg:grid-cols-[280px_1fr]` | Lista + detalle (pacientes, agenda) |
| 2-up grande | `grid-cols-1 lg:grid-cols-2 gap-6` | Comparativas |

---

## 9. Componentes base

### 9.1 Button

| Variante | Uso |
|----------|-----|
| `primary` | Acción principal (Guardar, Confirmar) |
| `secondary` | Acción secundaria (Cancelar) |
| `ghost` | Acción terciaria en card |
| `outline` | Borde, fondo transparente |
| `destructive` | Eliminar, rechazar |
| `link` | Inline |

Tamaños: `sm` (32px), `md` (40px), `lg` (48px).
Todos con radius-md y font-medium.

### 9.2 Card

```
┌─────────────────────────────────────────┐
│ HEADER (título + acción opcional)       │
├─────────────────────────────────────────┤
│ CONTENT (padding 24px)                  │
├─────────────────────────────────────────┤
│ FOOTER (opcional)                       │
└─────────────────────────────────────────┘
```

- Border 1px `--border`, radius-lg, shadow-sm.
- Hover (solo si es interactiva): shadow-md.

### 9.3 Badge / Chip

- Radius-full.
- Variantes: `default`, `success`, `warning`, `danger`, `info`, `neutral`.
- Tamaño: padding-x 10px, padding-y 2px, font-size caption.

### 9.4 Input

- Altura 40px (md) / 32px (sm).
- Background `--card`, border `--input`, radius-md.
- Focus: ring 2px `--ring` con offset.
- Error: border `--destructive`, ring `--destructive`.

### 9.5 Avatar

- Circular, radius-full.
- Tamaños: xs (24), sm (32), md (40), lg (56), xl (80).
- Fallback: iniciales sobre fondo `--accent`, texto `--accent-foreground`.

### 9.6 Progress bar (KPI / adherencia)

- Altura 8px.
- Track: `--muted`.
- Fill: `--primary` (puede ser `bg-warning`, `bg-destructive` según estado).
- Radius-full.

### 9.7 Timeline (historial clínico)

- Línea vertical 2px `--border`.
- Nodos circulares 12px, fondo `--primary`, borde 2px `--card` (efecto perforado).
- Conectores con espacio de 16px.
- Cada item: timestamp + título + descripción opcional.

### 9.8 Calendar / Agenda

- Vista semanal: 7 columnas × grid de 30min.
- Header con día + mes.
- Evento:
  - Altura según duración.
  - Border-l 3px color según tipo.
  - Background `--accent`.
  - Radius-md.
- Hora actual: línea horizontal roja 1px con dot.

---

## 10. Estados y feedback

| Estado | Patrón visual |
|--------|---------------|
| Loading | Skeleton con pulse (no spinners) |
| Empty | Ilustración + título + descripción + CTA |
| Error | Banner rojo arriba + mensaje claro |
| Success | Toast verde abajo a la derecha (3s) |
| Confirm | Modal con acción destructive en rojo |

---

## 11. Datos mock del MVP

Para que la UI se sienta viva sin backend:

- 8-12 pacientes de demo con nombres realistas, patologías variadas.
- 1 semana de citas pasadas + futuras.
- Datos de adherencia, dolor EVA, goniometría.
- Alertas clínicas pre-pobladas.

Todo desde `src/lib/mock/`.

---

## 12. Decisiones explícitas

- **Verde lima en healthcare funciona** porque comunica rehabilitación/mejoría. Lo usamos con moderación (no abusamos como warning).
- **Sin modo oscuro por ahora** — los consultorios tienen luz controlada y la fatiga visual en dark mode + datos clínicos es real.
- **Sin animaciones dramáticas** — solo transiciones de 150ms en hover/focus.
- **Charts simples** — donut, bar horizontal, line. Nada de 3D o gradientes estridentes.

---

## 13. Recursos

- Tailwind v4 docs: https://tailwindcss.com/docs
- Starwind UI: https://starwind.dev
- Tabler icons: https://tabler.io/icons
- Referencia visual: dashboards ACRU / banking-style