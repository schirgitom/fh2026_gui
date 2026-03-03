import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coralApi, CoralPayload } from '@/features/corals/api/coralApi';

export const useCorals = (aquariumId: string) => {
  return useQuery({
    queryKey: ['corals', aquariumId],
    queryFn: () => coralApi.getByAquarium(aquariumId),
    enabled: Boolean(aquariumId)
  });
};

export const useCoralMutations = (aquariumId: string) => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (payload: Omit<CoralPayload, 'aquariumId'>) =>
      coralApi.create({ ...payload, aquariumId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['corals', aquariumId] })
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<CoralPayload, 'aquariumId'> }) =>
      coralApi.update(id, { ...payload, aquariumId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['corals', aquariumId] })
  });

  const remove = useMutation({
    mutationFn: (id: string) => coralApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['corals', aquariumId] })
  });

  return { create, update, remove };
};
