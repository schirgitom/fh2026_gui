import { http } from '@/shared/api/http';
import { User } from '@/shared/types';

export interface UpdateAccountPayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface UserApiResponse {
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
}

const mapUser = (user?: UserApiResponse): User => ({
  id: user?.id ?? user?.userId ?? user?.Id ?? user?.UserId ?? '',
  email: user?.email ?? user?.Email ?? '',
  firstName: user?.firstname ?? user?.firstName ?? user?.FirstName ?? undefined,
  lastName: user?.lastname ?? user?.lastName ?? user?.LastName ?? undefined,
  active: user?.active ?? user?.Active
});

export const accountApi = {
  getById: async (id: string) => {
    const { data } = await http.get<UserApiResponse>(`/api/User/${id}`);
    return mapUser(data);
  },
  update: async (payload: UpdateAccountPayload) => {
    const { data } = await http.put<UserApiResponse>(`/api/User/${payload.id}`, {
      id: payload.id,
      email: payload.email,
      firstname: payload.firstName,
      lastname: payload.lastName
    });
    return mapUser(data);
  }
};
