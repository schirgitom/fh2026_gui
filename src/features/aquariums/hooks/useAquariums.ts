import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aquariumApi, AquariumPayload } from '@/features/aquariums/api/aquariumApi';
import { useAuthStore } from '@/features/auth/store/authStore';

const ensureUserId = (userId?: string) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return userId;
};

export const useAquariums = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['aquariums', userId],
    queryFn: () => aquariumApi.getByUser(userId ?? ''),
    enabled: Boolean(userId)
  });
};

export const useAquariumMutations = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  const create = useMutation({
    mutationFn: (payload: Omit<AquariumPayload, 'userId'>) =>
      aquariumApi.create({ ...payload, userId: ensureUserId(userId) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<AquariumPayload, 'userId'> }) =>
      aquariumApi.update(id, { ...payload, userId: ensureUserId(userId) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  const remove = useMutation({
    mutationFn: ({ id, type }: { id: string; type: AquariumPayload['type'] }) =>
      aquariumApi.remove(id, type),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aquariums', userId] })
  });

  return { create, update, remove };
};
