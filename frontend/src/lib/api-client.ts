/**
 * api-client.ts
 *
 * Cliente HTTP tipado para consumir el backend de Rehalo.
 *
 * - Base URL configurable vía `PUBLIC_API_URL` (definida en .env)
 * - Schemas Zod opcionales para validar respuestas en runtime
 * - Inyecta credenciales desde cookies en server-side
 * - Errores tipados para que los actions los manejen
 *
 * Usar SIEMPRE desde actions o endpoints de servidor. NO en el cliente.
 */
import { z, type ZodTypeAny } from "zod";

const DEFAULT_API_URL = "http://localhost:3000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions<_TResponse = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  schema?: ZodTypeAny;
  headers?: Record<string, string>;
  cookies?: AstroCookies;
  signal?: AbortSignal;
}

function resolveBaseUrl(): string {
  const fromEnv = import.meta.env.PUBLIC_API_URL;
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_API_URL;
}

function buildUrl(path: string, query?: RequestOptions<unknown>["query"]): string {
  const base = resolveBaseUrl();
  const url = new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : `${base}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function buildHeaders(
  extra: Record<string, string> | undefined,
  cookies: AstroCookies | undefined,
  hasBody: boolean,
): Headers {
  const headers = new Headers();

  if (hasBody && !extra?.["Content-Type"]) {
    headers.set("Content-Type", "application/json");
  }

  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      headers.set(key, value);
    }
  }

  if (cookies) {
    const token = cookies.get("rehalo_token")?.value;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/**
 * request — helper principal. Valida la respuesta con Zod si se pasa `schema`.
 * Si la respuesta no cumple, lanza ApiError con status 502 (Bad Gateway).
 */
export async function request<TResponse = unknown>(
  path: string,
  options: RequestOptions<TResponse> = {},
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    query,
    schema,
    headers,
    cookies,
    signal,
  } = options;

  const url = buildUrl(path, query);
  const hasBody = body !== undefined && body !== null;
  const builtHeaders = buildHeaders(headers, cookies, hasBody);

  const response = await fetch(url, {
    method,
    headers: builtHeaders,
    body: hasBody ? JSON.stringify(body) : null,
    signal,
  });

  const contentType = response.headers.get("Content-Type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload: unknown = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      isJson && payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new ApiError(message, response.status, payload);
  }

  if (!schema) return payload as TResponse;

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(
      "Respuesta del backend no cumple el esquema esperado",
      502,
      parsed.error.flatten(),
    );
  }

  return parsed.data as TResponse;
}

/* Helpers ergonómicos */
export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions<T>, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions<T>, "method">) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions<T>, "method">) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions<T>, "method">) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions<T>, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};

/* Type helper para AstroCookies (sin importar tipos de Astro en runtime) */
interface AstroCookies {
  get: (name: string) => { value: string } | undefined;
}

export { z };
