import { http } from '@/shared/api/http';
import { Coral } from '@/shared/types';

export interface CoralPayload {
  name: string;
  species: string;
  quantity: number;
  aquariumId: string;
}

export const coralApi = {
  getByAquarium: async (aquariumId: string) => {
    const { data } = await http.get<Coral[]>(`/api/Coral/by-aquarium/${aquariumId}`);
    return data;
  },
  create: async (payload: CoralPayload) => {
    const { data } = await http.post<Coral>('/api/Coral', payload);
    return data;
  },
  update: async (id: string, payload: CoralPayload) => {
    const { data } = await http.put<Coral>(`/api/Coral/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/Coral/${id}`);
  }
};
