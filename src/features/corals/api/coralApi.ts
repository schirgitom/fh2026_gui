import { http } from '@/shared/api/http';
import { Coral } from '@/shared/types';

export interface CoralPayload {
  name: string;
  amount: number;
  description?: string;
  coralTyp: 0 | 1;
  aquariumId: string;
}

interface CoralDto {
  id?: string | null;
  name: string;
  inserted?: string;
  amount: number;
  description?: string | null;
  coralTyp: 0 | 1;
  aquariumId: string;
}

const mapCoral = (item: CoralDto): Coral => ({
  id: item.id ?? '',
  name: item.name,
  inserted: item.inserted,
  amount: item.amount,
  description: item.description ?? undefined,
  coralTyp: item.coralTyp,
  aquariumId: item.aquariumId
});

export const coralApi = {
  getByAquarium: async (aquariumId: string) => {
    const { data } = await http.get<CoralDto[]>(`/api/Coral/by-aquarium/${aquariumId}`);
    return data.map(mapCoral);
  },
  create: async (payload: CoralPayload) => {
    const { data } = await http.post<CoralDto>('/api/Coral', payload);
    return mapCoral(data);
  },
  update: async (id: string, payload: CoralPayload) => {
    const { data } = await http.put<CoralDto>(`/api/Coral/${id}`, { id, ...payload });
    return mapCoral(data);
  },
  remove: async (id: string) => {
    await http.delete(`/api/Coral/${id}`);
  }
};
