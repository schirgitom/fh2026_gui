import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:5135/';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export const graphqlClient = axios.create({
  baseURL: graphqlUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

graphqlClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const gqlRequest = async <T>(query: string, variables?: Record<string, unknown>) => {
  const response = await graphqlClient.post<GraphQLResponse<T>>('', { query, variables });
  if (response.data.errors && response.data.errors.length > 0) {
    throw new Error(response.data.errors.map((err) => err.message).join(', '));
  }
  if (!response.data.data) {
    throw new Error('GraphQL response missing data');
  }
  return response.data.data;
};
