import { http } from '@/shared/api/http';
import { Aquarium, AquariumType } from '@/shared/types';

export interface AquariumPayload {
  name: string;
  volumeLiters: number;
  description?: string;
  type: AquariumType;
  userId: string;
}

const endpoints = {
  freshwater: '/api/FreshWaterAquarium',
  seawater: '/api/SeaWaterAquarium'
} as const;

export const aquariumApi = {
  getByUser: async (userId: string) => {
    const [freshwater, seawater] = await Promise.all([
      http.get<Aquarium[]>(`${endpoints.freshwater}/by-user/${userId}`),
      http.get<Aquarium[]>(`${endpoints.seawater}/by-user/${userId}`)
    ]);
    return [
      ...freshwater.data.map((item) => ({ ...item, type: 'freshwater' as const })),
      ...seawater.data.map((item) => ({ ...item, type: 'seawater' as const }))
    ];
  },
  create: async (payload: AquariumPayload) => {
    const endpoint = endpoints[payload.type];
    const { data } = await http.post<Aquarium>(endpoint, payload);
    return { ...data, type: payload.type };
  },
  update: async (id: string, payload: AquariumPayload) => {
    const endpoint = `${endpoints[payload.type]}/${id}`;
    const { data } = await http.put<Aquarium>(endpoint, payload);
    return { ...data, type: payload.type };
  },
  remove: async (id: string, type: AquariumType) => {
    const endpoint = `${endpoints[type]}/${id}`;
    await http.delete(endpoint);
  }
};
