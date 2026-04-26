import type { AuthTokens } from '../types/auth';

const TOKEN_KEY = 'bbso_auth_tokens';

let inMemoryTokens: AuthTokens | null = null;

export function getTokens(): AuthTokens | null {
  if (inMemoryTokens) return inMemoryTokens;

  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryTokens = JSON.parse(stored);
      return inMemoryTokens;
    }
  } catch {
    // localStorage might be unavailable
  }

  return null;
}

export function setTokens(tokens: AuthTokens): void {
  inMemoryTokens = tokens;
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } catch {
    // localStorage might be unavailable
  }
}

export function clearTokens(): void {
  inMemoryTokens = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage might be unavailable
  }
}

export function isAuthenticated(): boolean {
  return getTokens() !== null;
}
