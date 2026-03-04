import { http } from '@/shared/api/http';
import { Fish } from '@/shared/types';

export interface FishPayload {
  name: string;
  amount: number;
  description?: string;
  aquariumId: string;
  deathDate?: string;
}

interface FishDto {
  id?: string | null;
  name: string;
  inserted?: string;
  amount: number;
  description?: string | null;
  aquariumId: string;
  deathDate?: string;
}

const mapFish = (item: FishDto): Fish => ({
  id: item.id ?? '',
  name: item.name,
  inserted: item.inserted,
  amount: item.amount,
  description: item.description ?? undefined,
  aquariumId: item.aquariumId,
  deathDate: item.deathDate
});

export const fishApi = {
  getByAquarium: async (aquariumId: string) => {
    const { data } = await http.get<FishDto[]>(`/api/Fish/by-aquarium/${aquariumId}`);
    return data.map(mapFish);
  },
  create: async (payload: FishPayload) => {
    const { data } = await http.post<FishDto>('/api/Fish', payload);
    return mapFish(data);
  },
  update: async (id: string, payload: FishPayload) => {
    const { data } = await http.put<FishDto>(`/api/Fish/${id}`, { id, ...payload });
    return mapFish(data);
  },
  remove: async (id: string) => {
    await http.delete(`/api/Fish/${id}`);
  }
};
