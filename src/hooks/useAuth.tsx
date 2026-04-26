import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthTokens } from '../types/auth';
import type { LoginResponse } from '../types/auth';
import { getTokens, setTokens, clearTokens } from '../store/auth';
import { logout as apiLogout } from '../api/auth';

interface AuthContextType {
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<AuthTokens | null>(() => getTokens());

  // Sync from localStorage on mount
  useEffect(() => {
    const stored = getTokens();
    if (stored) {
      setTokensState(stored);
    }
  }, []);

  const handleLogin = useCallback((response: LoginResponse) => {
    const newTokens: AuthTokens = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
      refreshExpiresIn: response.refreshExpiresIn,
      userId: response.userId,
      tenantId: response.tenantId,
    };
    setTokens(newTokens);
    setTokensState(newTokens);
  }, []);

  const handleLogout = useCallback(async () => {
    const currentTokens = getTokens();
    if (currentTokens?.refreshToken) {
      try {
        await apiLogout({ refreshToken: currentTokens.refreshToken });
      } catch {
        // Ignore logout API errors — clear local state regardless
      }
    }
    clearTokens();
    setTokensState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isAuthenticated: tokens !== null,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
