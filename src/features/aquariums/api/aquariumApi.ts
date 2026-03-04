import { http } from '@/shared/api/http';
import { Aquarium, AquariumType } from '@/shared/types';

export interface AquariumPayload {
  name: string;
  ownerId: string;
  depth: number;
  height: number;
  length: number;
  liters: number;
  type: AquariumType;
  hasFreshAir?: boolean;
  hasCo2System?: boolean;
  isReefTank?: boolean;
  hasWaveMachine?: boolean;
}

const endpoints = {
  freshwater: '/api/FreshWaterAquarium',
  seawater: '/api/SeaWaterAquarium'
} as const;

type FreshWaterAquariumDto = Omit<AquariumPayload, 'type' | 'isReefTank' | 'hasWaveMachine'> & {
  id?: string | null;
};

type SeaWaterAquariumDto = Omit<AquariumPayload, 'type' | 'hasFreshAir' | 'hasCo2System'> & {
  id?: string | null;
};

const mapFreshwater = (item: FreshWaterAquariumDto): Aquarium => ({
  id: item.id ?? '',
  name: item.name,
  ownerId: item.ownerId,
  depth: item.depth,
  height: item.height,
  length: item.length,
  liters: item.liters,
  hasFreshAir: item.hasFreshAir,
  hasCo2System: item.hasCo2System,
  type: 'freshwater'
});

const mapSeawater = (item: SeaWaterAquariumDto): Aquarium => ({
  id: item.id ?? '',
  name: item.name,
  ownerId: item.ownerId,
  depth: item.depth,
  height: item.height,
  length: item.length,
  liters: item.liters,
  isReefTank: item.isReefTank,
  hasWaveMachine: item.hasWaveMachine,
  type: 'seawater'
});

export const aquariumApi = {
  getByUser: async (userId: string) => {
    const [freshwater, seawater] = await Promise.all([
      http.get<FreshWaterAquariumDto[]>(`${endpoints.freshwater}/by-user/${userId}`),
      http.get<SeaWaterAquariumDto[]>(`${endpoints.seawater}/by-user/${userId}`)
    ]);
    return [
      ...freshwater.data.map(mapFreshwater),
      ...seawater.data.map(mapSeawater)
    ];
  },
  create: async (payload: AquariumPayload) => {
    const endpoint = endpoints[payload.type];
    if (payload.type === 'freshwater') {
      const { data } = await http.post<FreshWaterAquariumDto>(endpoint, {
        name: payload.name,
        ownerId: payload.ownerId,
        depth: payload.depth,
        height: payload.height,
        length: payload.length,
        liters: payload.liters,
        hasFreshAir: payload.hasFreshAir ?? false,
        hasCo2System: payload.hasCo2System ?? false
      });
      return mapFreshwater(data);
    }
    const { data } = await http.post<SeaWaterAquariumDto>(endpoint, {
      name: payload.name,
      ownerId: payload.ownerId,
      depth: payload.depth,
      height: payload.height,
      length: payload.length,
      liters: payload.liters,
      isReefTank: payload.isReefTank ?? false,
      hasWaveMachine: payload.hasWaveMachine ?? false
    });
    return mapSeawater(data);
  },
  update: async (id: string, payload: AquariumPayload) => {
    const endpoint = `${endpoints[payload.type]}/${id}`;
    if (payload.type === 'freshwater') {
      const { data } = await http.put<FreshWaterAquariumDto>(endpoint, {
        id,
        name: payload.name,
        ownerId: payload.ownerId,
        depth: payload.depth,
        height: payload.height,
        length: payload.length,
        liters: payload.liters,
        hasFreshAir: payload.hasFreshAir ?? false,
        hasCo2System: payload.hasCo2System ?? false
      });
      return mapFreshwater(data);
    }
    const { data } = await http.put<SeaWaterAquariumDto>(endpoint, {
      id,
      name: payload.name,
      ownerId: payload.ownerId,
      depth: payload.depth,
      height: payload.height,
      length: payload.length,
      liters: payload.liters,
      isReefTank: payload.isReefTank ?? false,
      hasWaveMachine: payload.hasWaveMachine ?? false
    });
    return mapSeawater(data);
  },
  remove: async (id: string, type: AquariumType) => {
    const endpoint = `${endpoints[type]}/${id}`;
    await http.delete(endpoint);
  }
};
