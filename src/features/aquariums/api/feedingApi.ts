import { http } from '@/shared/api/http';
import { apiConfig } from '@/shared/config/api';

export interface FeedingStatus {
  aquariumId: string;
  lastFeedingAt?: string | null;
  nextFeedingAt: string;
  remainingSeconds: number;
  isOverdue: boolean;
  message?: string | null;
}

export const feedingApi = {
  getFeedingInterval: async (aquariumId: string) => {
    const { data } = await http.get<number>(`${apiConfig.signalrBaseUrl}/api/feeding/${aquariumId}/interval`);
    return data;
  },
  getStatus: async (aquariumId: string) => {
    const { data } = await http.get<FeedingStatus>(`${apiConfig.signalrBaseUrl}/api/feeding/${aquariumId}/status`);
    return data;
  },
  feedNow: async (aquariumId: string) => {
    const { data } = await http.post<FeedingStatus>(`${apiConfig.signalrBaseUrl}/api/feeding/${aquariumId}`);
    return data;
  },
  setFeedingInterval: async (aquariumId: string, intervalMinutes: number) => {
    const { data } = await http.post<FeedingStatus | null>(`${apiConfig.signalrBaseUrl}/api/feeding/${aquariumId}/interval`, {
      intervalMinutes
    });
    return data ?? null;
  }
};
