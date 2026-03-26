import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/features/aquariums/api/eventsApi';

export const useAquariumEvents = (aquariumId: string, take = 100) =>
  useQuery({
    queryKey: ['aquarium-events', aquariumId, take],
    queryFn: () => eventsApi.getByAquarium(aquariumId, take),
    enabled: Boolean(aquariumId)
  });
