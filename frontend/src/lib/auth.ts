import Cookies from "js-cookie";
import { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY   = "shebash_access";
const REFRESH_KEY = "shebash_refresh";

// ── Token helpers ──────────────────────────────────────────────
export function getAccessToken(): string | null {
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function setTokens(access: string, refresh: string): void {
  // 1 day for access, 30 days for refresh
  Cookies.set(TOKEN_KEY,   access,  { expires: 1,  sameSite: "Lax" });
  Cookies.set(REFRESH_KEY, refresh, { expires: 30, sameSite: "Lax" });
}

export function clearTokens(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_KEY);
}

// ── API calls ──────────────────────────────────────────────────
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data; // throw validation errors as-is
  return data as AuthResponse;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as AuthResponse;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<AuthUser>;
}

export async function logoutUser(): Promise<void> {
  const token = getAccessToken();
  if (token) {
    await fetch(`${BASE_URL}/auth/logout/`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {}); // best-effort
  }
  clearTokens();
}