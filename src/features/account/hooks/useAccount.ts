import { useMutation, useQuery } from '@tanstack/react-query';
import { accountApi, UpdateAccountPayload } from '@/features/account/api/accountApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import { User } from '@/shared/types';
import { useEffect } from 'react';

const getUserId = (user: User | null | undefined): string | undefined => {
  if (!user) return undefined;
  const userWithFallback = user as User & {
    userId?: string;
    UserId?: string;
    Id?: string;
  };
  return user.id || userWithFallback.userId || userWithFallback.UserId || userWithFallback.Id;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getUserIdFromToken = (token: string | null): string | undefined => {
  if (!token) return undefined;
  const payload = decodeJwtPayload(token);
  if (!payload) return undefined;

  const candidates = [
    payload.sub,
    payload.userId,
    payload.userid,
    payload.nameid,
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

export const useAccountProfile = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore(
    (state) => getUserId(state.user) ?? getUserIdFromToken(state.token)
  );
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery<User, Error>({
    queryKey: ['account', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('Konnte keine Benutzer-ID aus Login oder Token lesen.');
      }
      return accountApi.getById(userId);
    },
    enabled: Boolean(token && userId)
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};

export const useAccountUpdate = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => accountApi.update(payload),
    onSuccess: (user) => {
      setUser(user);
    }
  });
};
