// В production (gh-pages) запросы идут через CORS-прокси, иначе браузер блокирует cross-origin
const API_BASE = import.meta.env.DEV
  ? "/api"
  : "https://corsproxy.io/?https://dummyjson.com";

export type RequestConfig = RequestInit & {
  token?: string | null;
};

export async function request<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { token, ...init } = config;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(res.status, data?.message ?? res.statusText, data);
  return data as T;
}

export function get<T>(path: string, config: RequestConfig = {}): Promise<T> {
  return request<T>(path, { ...config, method: "GET" });
}

export function post<T>(
  path: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: "POST",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

export function put<T>(
  path: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: "PUT",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

export function patch<T>(
  path: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  return request<T>(path, {
    ...config,
    method: "PATCH",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

export function del<T>(path: string, config: RequestConfig = {}): Promise<T> {
  return request<T>(path, { ...config, method: "DELETE" });
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
