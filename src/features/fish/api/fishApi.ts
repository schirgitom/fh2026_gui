import { http } from '@/shared/api/http';
import { Fish } from '@/shared/types';

export interface FishPayload {
  name: string;
  species: string;
  quantity: number;
  aquariumId: string;
}

export const fishApi = {
  getByAquarium: async (aquariumId: string) => {
    const { data } = await http.get<Fish[]>(`/api/Fish/by-aquarium/${aquariumId}`);
    return data;
  },
  create: async (payload: FishPayload) => {
    const { data } = await http.post<Fish>('/api/Fish', payload);
    return data;
  },
  update: async (id: string, payload: FishPayload) => {
    const { data } = await http.put<Fish>(`/api/Fish/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/Fish/${id}`);
  }
};
