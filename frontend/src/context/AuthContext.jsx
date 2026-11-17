import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { clearToken, getCurrentUser, login as loginRequest, register as registerRequest } from "../services/auth";
import { TOKEN_KEY } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setIsLoading(false);
      return;
    }
    try {
      setUser(await getCurrentUser());
    } catch {
      // An invalid or expired token is cleared by the interceptor.
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    restoreSession();
    window.addEventListener("auth:unauthorized", logout);
    return () => window.removeEventListener("auth:unauthorized", logout);
  }, [logout, restoreSession]);

  const authenticate = useCallback(async (request, values) => {
    const token = await request(values);
    // Confirm that the token is usable before making the protected UI available.
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return token;
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login: (credentials) => authenticate(loginRequest, credentials),
    register: (details) => authenticate(registerRequest, details),
    logout,
  }), [authenticate, isLoading, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
