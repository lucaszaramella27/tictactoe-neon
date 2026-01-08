import type { Move, Mode, Result, RankingRow, User } from "../utils/types";


const baseUrl = import.meta.env.VITE_API_URL as string;

if (!baseUrl) {
  throw new Error("VITE_API_URL não definido. Confira frontend/.env");
}


function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, init);

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

if (!res.ok) {
  const detail =
    data?.detail ??
    data?.message ??
    `HTTP ${res.status}`;

  const msg = typeof detail === "string" ? detail : JSON.stringify(detail);
  throw new Error(msg);
}

  return data as T;
}

export async function register(
  email: string,
  display_name: string,
  password: string
): Promise<User> {
  return http<User>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, display_name, password }),
  });
}

// OAuth2 Password flow (x-www-form-urlencoded)
export async function login(
  email: string,
  password: string
): Promise<{ access_token: string; token_type: string }> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  return http<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

export async function me(token: string): Promise<User> {
  return http<User>("/users/me", { headers: authHeaders(token) });
}

export async function listUsers(token: string): Promise<User[]> {
  return http<User[]>("/users", { headers: authHeaders(token) });
}

export async function saveMatch(
  token: string,
  payload: {
    mode: Mode;
    your_symbol: "X" | "O";
    opponent_id?: string | null;
    moves: Move[];
    declared_result: Result;
  }
): Promise<unknown> {
  return http("/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(payload),
  });
}

export async function topRanking(): Promise<RankingRow[]> {
  return http<RankingRow[]>("/ranking/top");
}
