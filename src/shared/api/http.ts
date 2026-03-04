import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import { attachRequestStart, logError, logRequest, logResponse } from '@/shared/api/logger';
import { apiConfig } from '@/shared/config/api';

export const http = axios.create({
  baseURL: apiConfig.restBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  attachRequestStart(config);

  if (config.data instanceof FormData) {
    delete config.headers?.['Content-Type'];
  }

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  logRequest(config);
  return config;
});

http.interceptors.response.use(
  (response) => {
    logResponse(response);
    return response;
  },
  (error) => {
    logError(error);

    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);
