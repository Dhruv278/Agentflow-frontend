import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const isServer = typeof window === 'undefined';
const baseURL = isServer
  ? (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001')
  : '/api/backend';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/set-password',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/reset-password',
];

let refreshInFlight: Promise<void> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;

// Proactively refresh the access token every 13 minutes (before 15-min expiry)
function startProactiveRefresh() {
  if (refreshTimer) return;
  refreshTimer = setInterval(() => {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      doRefresh().catch(() => {});
    }
  }, 13 * 60 * 1000);
}

if (typeof window !== 'undefined') {
  startProactiveRefresh();
}

function isAuthRequest(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? '';
  return AUTH_PATHS.some((path) => url.includes(path));
}

function shouldRedirect(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return (
    !path.startsWith('/login') &&
    !path.startsWith('/register') &&
    !path.startsWith('/auth/')
  );
}

function redirectToLogin(): void {
  if (shouldRedirect()) {
    window.location.href = '/login';
  }
}

function doRefresh(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post('/auth/refresh')
      .then(() => {
        // Refresh succeeded — access_token cookie renewed by backend
      })
      .catch((err) => {
        // Refresh failed — likely session expired or refresh token invalid
        if (refreshTimer) {
          clearInterval(refreshTimer);
          refreshTimer = null;
        }
        redirectToLogin();
        return Promise.reject(err);
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isAuthRequest(originalRequest) ||
      originalRequest._retried
    ) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      await doRefresh();
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default api;
