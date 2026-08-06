/**
 * auth.action.ts
 *
 * Login mock para MVP. En producción esto se conecta al backend.
 *
 * Roles soportados:
 *   - admin      → redirige a /dashboard
 *   - therapist  → redirige a /dashboard
 *   - patient    → redirige a /portal
 *
 * Flujo:
 *   1. Valida input con Zod
 *   2. (mock) acepta cualquier email/password y setea cookies con el rol elegido
 *   3. Redirige a la ruta correcta
 */
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const auth = {
  login: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Email inválido"),
      password: z.string().min(4, "Mínimo 4 caracteres"),
      role: z.enum(["admin", "therapist", "patient"]),
      next: z.string().optional(),
    }),
    handler: async ({ email, password, role, next }, context) => {
      // ─── MOCK: cualquier credencial pasa ────────────────────────────────
      // En producción: await api.post('/auth/login', { email, password }, { cookies: context.cookies })
      if (password.length < 4) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Credenciales inválidas",
        });
      }

      const userName = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const isStaff = role === "admin" || role === "therapist";
      const targetPath = next && next.startsWith("/") ? next : isStaff ? "/dashboard" : "/portal";

      // Setear cookies de sesión (httpOnly para no exponer al JS del cliente)
      context.cookies.set("rehalo_token", `mock-${role}-${Date.now()}`, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
      context.cookies.set("rehalo_role", role, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      context.cookies.set("rehalo_user_name", userName, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { ok: true as const, role, redirect: targetPath, userName };
    },
  }),
};
