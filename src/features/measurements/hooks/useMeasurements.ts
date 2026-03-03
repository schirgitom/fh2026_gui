import { useQuery } from '@tanstack/react-query';
import { measurementApi } from '@/features/measurements/api/measurementApi';

export const useLatestMeasurement = (aquariumId: string) => {
  return useQuery({
    queryKey: ['measurements', 'latest', aquariumId],
    queryFn: () => measurementApi.latest(aquariumId),
    enabled: Boolean(aquariumId),
    refetchInterval: 30_000
  });
};

export const useMeasurementsRange = (
  aquariumId: string,
  from: string,
  to: string,
  limit: number
) => {
  return useQuery({
    queryKey: ['measurements', 'range', aquariumId, from, to, limit],
    queryFn: () => measurementApi.range(aquariumId, from, to, limit),
    enabled: Boolean(aquariumId && from && to)
  });
};
