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

interface LoginApiResponse {
  token?: string;
  user?: {
    id?: string | null;
    userId?: string | null;
    Id?: string | null;
    UserId?: string | null;
    email?: string | null;
    Email?: string | null;
    firstname?: string | null;
    firstName?: string | null;
    FirstName?: string | null;
    lastname?: string | null;
    lastName?: string | null;
    LastName?: string | null;
    active?: boolean;
    Active?: boolean;
  };
}

const mapUser = (user?: LoginApiResponse['user']): User => ({
  id: user?.id ?? user?.userId ?? user?.Id ?? user?.UserId ?? '',
  email: user?.email ?? user?.Email ?? '',
  firstName: user?.firstname ?? user?.firstName ?? user?.FirstName ?? undefined,
  lastName: user?.lastname ?? user?.lastName ?? user?.LastName ?? undefined,
  active: user?.active ?? user?.Active
});

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await http.post<LoginApiResponse>('/api/Auth/login', payload);
    if (!data.token) {
      throw new Error('Login response does not include a token.');
    }
    return {
      token: data.token,
      user: mapUser(data.user)
    } satisfies AuthResponse;
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await http.post('/api/User', {
      email: payload.email,
      firstname: payload.firstName,
      lastname: payload.lastName
    });
    return data as User;
  }
};
