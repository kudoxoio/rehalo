/**
 * landing.action.ts
 *
 * Actions públicas del feature landing (formularios de contacto, suscripción).
 * Patrón: cada action recibe un input validado con Zod y devuelve un output tipado.
 *
 * Si la feature NO requiere http al backend (ej. páginas estáticas), este archivo
 * puede no existir.
 */
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { api } from "@lib/api-client";

export const landing = {
  /**
   * Contacto desde la landing pública.
   * El formulario valida con Zod Y muestra errores automáticamente.
   */
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(2, "Mínimo 2 caracteres"),
      email: z.string().email("Email inválido"),
      clinicName: z.string().optional(),
      message: z.string().min(10, "Cuéntanos un poco más"),
    }),
    handler: async (input, context) => {
      try {
        const result = await api.post<{ ok: true; id: string }>(
          "/public/contact",
          input,
          { cookies: context.cookies },
        );
        return result;
      } catch (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No pudimos enviar tu mensaje. Intentá de nuevo.",
        });
      }
    },
  }),
};
