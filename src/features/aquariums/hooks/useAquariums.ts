import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aquariumApi, AquariumPayload } from '@/features/aquariums/api/aquariumApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import { User } from '@/shared/types';

const ensureUserId = (userId?: string) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
};

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

export const useAquariums = () => {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore(
    (state) => getUserId(state.user) ?? getUserIdFromToken(state.token)
  );

  return useQuery({
    queryKey: ['aquariums', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('Konnte keine Benutzer-ID aus Login oder Token lesen.');
      }
      return aquariumApi.getByUser(userId);
    },
    enabled: Boolean(token)
  });
};

export const useAquariumMutations = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore(
    (state) => getUserId(state.user) ?? getUserIdFromToken(state.token)
  );

  const create = useMutation({
    mutationFn: (payload: Omit<AquariumPayload, 'ownerId'>) =>
      aquariumApi.create({ ...payload, ownerId: ensureUserId(userId) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<AquariumPayload, 'ownerId'> }) =>
      aquariumApi.update(id, { ...payload, ownerId: ensureUserId(userId) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  const remove = useMutation({
    mutationFn: ({ id, type }: { id: string; type: AquariumPayload['type'] }) =>
      aquariumApi.remove(id, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  return { create, update, remove };
};
