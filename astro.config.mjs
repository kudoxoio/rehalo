// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

// Astro 7 — modo "server" con prerendering opt-in por página.
// Las páginas estáticas (landing) usan `export const prerender = true`.
// Los endpoints server-side (login, API) se renderizan bajo demanda como
// funciones serverless de Vercel.
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react()],
  site: "https://rehalo.app",
  server: {
    port: 4321,
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@actions": "/src/actions",
        "@features": "/src/features",
        "@layouts": "/src/layouts",
        "@lib": "/src/lib",
        "@ui": "/src/components/ui",
        "@islands": "/src/components/islands",
      },
    },
  },
});
