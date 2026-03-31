'use strict';

// ─── src/services/api.ts ──────────────────────────────────────────────────────
function makeApiService(config) {
  const envBase = config.envConfig
    ? `process.env.REACT_APP_API_URL ?? 'http://localhost:4000/api'`
    : `'http://localhost:4000/api'`;

  const envTimeout = config.envConfig
    ? `Number(process.env.REACT_APP_API_TIMEOUT) || 10_000`
    : `10_000`;

  return `import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from './types';

/**
 * Pre-configured Axios instance.
 *
 * Base URL and timeout are read from environment variables (when available).
 * Add domain-specific request/response interceptors below.
 */
const api = axios.create({
  baseURL: ${envBase},
  timeout: ${envTimeout},
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token from localStorage / cookie / Redux if needed
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired — redirect to login or refresh
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    if (status === 403) {
      console.error('Access forbidden:', error.response?.data?.message);
    }

    if (status === 500) {
      console.error('Server error:', error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export default api;
`;
}

// ─── src/services/types.ts ────────────────────────────────────────────────────
function makeApiTypes() {
  return `/**
 * Shared API type definitions.
 */

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
`;
}

module.exports = { makeApiService, makeApiTypes };
