/**
 * actions/index.ts
 *
 * Punto único de exportación del `server` object de Astro Actions.
 * Cada feature expone sus actions en `src/actions/<feature>.ts`.
 *
 * Para usar desde un componente:
 *   const { data, error } = await actions.auth.login(formData);
 *   const { data, error } = await actions.landing.contact(formData);
 */
import { landing } from "@actions/landing";
import { auth } from "@actions/auth";
import { patients } from "@actions/patients";
import { appointments } from "@actions/appointments";

export const server = {
  landing,
  auth,
  patients,
  appointments,
};

export default server;