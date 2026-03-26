import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { feedingApi, FeedingStatus } from '@/features/aquariums/api/feedingApi';

const getMutationErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unbekannter Fehler beim Futtervorgang.';
};

export const useAquariumFeeding = (
  aquariumId: string,
  options?: {
    onSuccess?: (status: FeedingStatus) => void;
  }
) => {
  return useMutation({
    mutationFn: async () => {
      try {
        return await feedingApi.feedNow(aquariumId);
      } catch (error) {
        throw new Error(getMutationErrorMessage(error));
      }
    },
    onSuccess: (status) => {
      options?.onSuccess?.(status);
    }
  });
};

export const useAquariumFeedingIntervalValue = (aquariumId: string) => {
  return useQuery({
    queryKey: ['feeding', 'interval', aquariumId],
    queryFn: () => feedingApi.getFeedingInterval(aquariumId),
    enabled: Boolean(aquariumId)
  });
};

export const useAquariumFeedingStatus = (aquariumId: string) => {
  return useQuery({
    queryKey: ['feeding', 'status', aquariumId],
    queryFn: () => feedingApi.getStatus(aquariumId),
    enabled: Boolean(aquariumId)
  });
};

export const useAquariumFeedingInterval = (
  aquariumId: string,
  options?: {
    onSuccess?: (status: FeedingStatus | null) => void;
  }
) => {
  return useMutation({
    mutationFn: async (intervalMinutes: number) => {
      try {
        return await feedingApi.setFeedingInterval(aquariumId, intervalMinutes);
      } catch (error) {
        throw new Error(getMutationErrorMessage(error));
      }
    },
    onSuccess: (status) => {
      options?.onSuccess?.(status);
    }
  });
};
