import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
  handleLogout,
} from '../utils';
import { ROUTES_SPEC } from '../constants';
import type { ApiRefreshTokenResponse } from '../types';

let apiClient: AxiosInstance | null = null;

const isLoginRoute = (route?: string) => route && route.includes('/login');
const isRefreshRoute = (route?: string) => route && route.includes('/refresh');
const isLogoutRoute = (route?: string) => route && route.includes('/logout');
const isChangePasswordRoute = (route?: string) =>
  route && route.includes('/change-password');
/**
 * Endpoints under `/users/public/` are deliberately unauthenticated (the
 * account-deletion form is reachable straight off the Google Play listing).
 * A 401 from one means the gateway is missing the public path, not that the
 * caller's session expired — so don't attach a token to them and don't let
 * their 401 log a signed-in rider out.
 */
const isPublicRoute = (route?: string) => route && route.includes('/public/');

type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

/**
 * Exchanges the refresh token for a new access token.
 *
 * Uses a bare axios call so it never re-enters the interceptor below, which
 * would otherwise recurse when the refresh itself comes back 401.
 */
const requestNewAccessToken = async (baseURL: string, refreshToken: string) => {
  const { data } = await axios.post<ApiRefreshTokenResponse>(
    `${baseURL}${ROUTES_SPEC.refresh}`,
    { refresh_token: refreshToken },
    {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  if (!data?.success || !data?.data?.access_token) {
    return null;
  }

  return data.data;
};

export const getApiClient = () => {
  if (apiClient) {
    return apiClient;
  }

  const baseURL = process.env['NEXT_PUBLIC_BASE_API_URL'];

  if (!baseURL) {
    throw new Error(
      'NEXT_PUBLIC_BASE_API_URL is not defined in environment variables'
    );
  }

  apiClient = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    validateStatus: (status) => status >= 200 && status < 300,
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      // These endpoints carry their own credentials — a 401 from them is a
      // real answer for the caller to handle, not an expired access token.
      if (
        isLoginRoute(originalRequest?.url) ||
        isRefreshRoute(originalRequest?.url) ||
        isLogoutRoute(originalRequest?.url) ||
        isChangePasswordRoute(originalRequest?.url) ||
        isPublicRoute(originalRequest?.url)
      ) {
        return Promise.reject(error);
      }

      // The retried request came back 401 too: the fresh token isn't good
      // enough, so there is nothing left to try.
      if (originalRequest._retry) {
        handleLogout();
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // A refresh is already in flight — wait for it instead of racing it,
      // otherwise parallel 401s each burn a single-use refresh token.
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient!(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const tokens = await requestNewAccessToken(baseURL, refreshToken);

        if (!tokens) {
          processQueue(error);
          handleLogout();
          return Promise.reject(error);
        }

        setAuthToken(tokens.access_token);
        if (tokens.refresh_token) {
          setRefreshToken(tokens.refresh_token);
        }

        processQueue(null, tokens.access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
        }

        return apiClient!(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or revoked — the session is unrecoverable.
        processQueue(refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  // Add interceptor to requests to set the bearer token
  apiClient.interceptors.request.use((config) => {
    // Don't attach access tokens to auth endpoints that use their own credentials.
    if (
      isLoginRoute(config.url) ||
      isRefreshRoute(config.url) ||
      isLogoutRoute(config.url) ||
      isPublicRoute(config.url)
    ) {
      return config;
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiClient;
};
