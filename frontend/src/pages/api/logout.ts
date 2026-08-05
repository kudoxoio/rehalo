import type { APIRoute } from "astro";

/**
 * GET /api/logout
 *
 * Borra las cookies de sesión y redirige a la landing.
 */
export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("rehalo_token", { path: "/" });
  cookies.delete("rehalo_role", { path: "/" });
  cookies.delete("rehalo_user_name", { path: "/" });
  return redirect("/");
};
