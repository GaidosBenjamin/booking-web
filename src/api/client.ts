import axios from 'axios';
import { getTokens, setTokens, clearTokens } from '../store/auth';
import type { LoginResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
apiClient.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Track whether we're currently refreshing to avoid infinite loops
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Response interceptor: handle 401 with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if it's a refresh request itself, or already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh') &&
      !originalRequest.url?.includes('/api/auth/login')
    ) {
      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = getTokens();
      if (!tokens?.refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<LoginResponse>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken: tokens.refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newTokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
          refreshExpiresIn: response.data.refreshExpiresIn,
          userId: response.data.userId,
          tenantId: response.data.tenantId,
        };

        setTokens(newTokens);
        processQueue(null, newTokens.accessToken);

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
