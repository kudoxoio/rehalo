import { defineMiddleware } from "astro:middleware";

/**
 * middleware.ts
 *
 * Maneja rutas públicas y privadas.
 *
 * IMPORTANTE:
 *  - Las llamadas a `/api/*` y los actions de Astro NO pasan por este middleware
 *    (Astro los rutea internamente antes del onRequest).
 *  - Esto evita que la lógica de auth interfiera con los fetches del api-client.
 */

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const PORTAL_PATHS = ["/portal"];
const DASHBOARD_PATHS = ["/dashboard", "/admin"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Páginas de auth: siempre permitidas
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return next();
  }

  const isPortal = PORTAL_PATHS.some((p) => pathname.startsWith(p));
  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.startsWith(p));

  // Si no es ruta privada, dejar pasar (landing, etc.)
  if (!isPortal && !isDashboard) return next();

  // Verificar sesión
  const token = context.cookies.get("rehalo_token")?.value;
  if (!token) {
    return context.redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  // Verificar role
  const role = context.cookies.get("rehalo_role")?.value;

  if (isDashboard && role !== "admin" && role !== "therapist") {
    return context.redirect("/portal");
  }
  if (isPortal && (role === "admin" || role === "therapist")) {
    return context.redirect("/dashboard");
  }

  return next();
});
