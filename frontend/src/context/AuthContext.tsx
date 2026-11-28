"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AuthUser } from "@/lib/types";
import {
  fetchCurrentUser,
  setTokens,
  clearTokens,
  registerUser,
  loginUser,
  logoutUser,
} from "@/lib/auth";
import type { RegisterPayload, LoginPayload } from "@/lib/types";

interface AuthContextValue {
  user:     AuthUser | null;
  loading:  boolean;
  register: (payload: RegisterPayload) => Promise<void>;
  login:    (payload: LoginPayload)    => Promise<void>;
  logout:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from stored token on mount
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await registerUser(payload);
    const access  = data.tokens?.access  ?? data.access  ?? "";
    const refresh = data.tokens?.refresh ?? data.refresh ?? "";
    setTokens(access, refresh);
    setUser(data.user);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await loginUser(payload);
    const access  = data.access  ?? data.tokens?.access  ?? "";
    const refresh = data.refresh ?? data.tokens?.refresh ?? "";
    setTokens(access, refresh);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}