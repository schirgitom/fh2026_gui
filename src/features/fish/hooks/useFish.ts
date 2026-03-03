import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fishApi, FishPayload } from '@/features/fish/api/fishApi';

export const useFish = (aquariumId: string) => {
  return useQuery({
    queryKey: ['fish', aquariumId],
    queryFn: () => fishApi.getByAquarium(aquariumId),
    enabled: Boolean(aquariumId)
  });
};

export const useFishMutations = (aquariumId: string) => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Omit<FishPayload, 'aquariumId'>) =>
      fishApi.create({ ...payload, aquariumId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fish', aquariumId] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<FishPayload, 'aquariumId'> }) =>
      fishApi.update(id, { ...payload, aquariumId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fish', aquariumId] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => fishApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fish', aquariumId] })
  });

  return { create, update, remove };
};
