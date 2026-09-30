// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking session

  // Fetch the current user from /auth/me on mount
  useEffect(() => {
    authService
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null)) // 401 = not logged in
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

