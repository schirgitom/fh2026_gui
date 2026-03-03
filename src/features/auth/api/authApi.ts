import { http } from '@/shared/api/http';
import { User } from '@/shared/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await http.post<AuthResponse>('/api/Auth/login', payload);
    return data;
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await http.post<User>('/api/User', payload);
    return data;
  }
};
