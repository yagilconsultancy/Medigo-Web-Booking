import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  handleLogout,
} from '../utils';

let apiClient: AxiosInstance | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const isLoginRoute = (route?: string) => route && route.includes('/login');
const isRefreshRoute = (route?: string) => route && route.includes('/refresh');
const isChangePasswordRoute = (route?: string) => route && route.includes('/change-password');

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

      if (error.response && error.response.status === 401) {
        // Don't intercept if the route is a login, refresh, or change-password route
        if (
          isLoginRoute(originalRequest?.url) ||
          isRefreshRoute(originalRequest?.url) ||
          isChangePasswordRoute(originalRequest?.url)
        ) {
          return Promise.reject(error);
        }

        // If this is a retry attempt that failed, logout
        // if (originalRequest._retry) {
          handleLogout();
          return Promise.reject(error);
        // }

        // If we're already refreshing, queue this request
        // if (isRefreshing) {
        //   return new Promise((resolve, reject) => {
        //     failedQueue.push({ resolve, reject });
        //   })
        //     .then(() => {
        //       // Retry the original request with new token
        //       const token = getAuthToken();
        //       if (token && originalRequest.headers) {
        //         originalRequest.headers.Authorization = `Bearer ${token}`;
        //       }
        //       return apiClient!(originalRequest);
        //     })
        //     .catch((err) => {
        //       return Promise.reject(err);
        //     });
        // }

        // // Mark that we're refreshing
        // originalRequest._retry = true;
        // isRefreshing = true;

        // const refreshToken = getRefreshToken();

        // if (!refreshToken) {
        //   // No refresh token available, logout
        //   isRefreshing = false;
        //   handleLogout();
        //   return Promise.reject(error);
        // }

        // try {
        //   // Attempt to refresh the token
        //   const response = await refreshTokenService({
        //     refresh_token: refreshToken,
        //   });

        //   if (response.data.success && response.data.data?.access_token) {
        //     const newToken = response.data.data.access_token;

        //     // Update the stored token
        //     setAuthToken(newToken);

        //     // Update the failed request with new token
        //     if (originalRequest.headers) {
        //       originalRequest.headers.Authorization = `Bearer ${newToken}`;
        //     }

        //     // Process the queue of failed requests
        //     processQueue(null);

        //     // Retry the original request
        //     return apiClient!(originalRequest);
        //   } else {
        //     // Refresh failed, logout
        //     processQueue(error);
        //     handleLogout();
        //     return Promise.reject(error);
        //   }
        // } catch (refreshError) {
        //   // Refresh request failed, logout
        //   processQueue(error);
        //   handleLogout();
        //   return Promise.reject(refreshError);
        // } finally {
        //   isRefreshing = false;
        // }
      }

      return Promise.reject(error);
    }
  );

  // Add interceptor to requests to set the bearer token
  apiClient.interceptors.request.use((config) => {
    // Don't intercept if the route is a login route
    if (isLoginRoute(config.url)) {
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
