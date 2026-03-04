import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import { attachRequestStart, logError, logRequest, logResponse } from '@/shared/api/logger';
import { apiConfig } from '@/shared/config/api';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

const isQueryOperation = (query: string) => query.trimStart().toLowerCase().startsWith('query');

export const graphqlClient = axios.create({
  baseURL: apiConfig.graphqlUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

graphqlClient.interceptors.request.use((config) => {
  attachRequestStart(config);

  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  logRequest(config);
  return config;
});

graphqlClient.interceptors.response.use(
  (response) => {
    logResponse(response);
    return response;
  },
  (error) => {
    logError(error);
    return Promise.reject(error);
  }
);

export const gqlRequest = async <T>(query: string, variables?: Record<string, unknown>) => {
  let response;
  try {
    response = await graphqlClient.post<GraphQLResponse<T>>('', { query, variables });
  } catch (error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: { errors?: Array<{ message?: string }> };
      };
    };
    const graphQLErrors = axiosError.response?.data?.errors;
    if (graphQLErrors && graphQLErrors.length > 0) {
      const messages = graphQLErrors
        .map((err) => err.message)
        .filter((message): message is string => Boolean(message));
      if (messages.length > 0) {
        throw new Error(messages.join(', '));
      }
    }

    const shouldRetryAsGet = axiosError.response?.status === 405 && isQueryOperation(query);

    if (!shouldRetryAsGet) {
      throw error;
    }

    response = await graphqlClient.get<GraphQLResponse<T>>('', {
      params: {
        query,
        ...(variables ? { variables: JSON.stringify(variables) } : {})
      }
    });
  }

  if (response.data.errors && response.data.errors.length > 0) {
    throw new Error(response.data.errors.map((err) => err.message).join(', '));
  }
  if (!response.data.data) {
    throw new Error('GraphQL response missing data');
  }
  return response.data.data;
};
