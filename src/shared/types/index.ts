export type AquariumType = 'freshwater' | 'seawater';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Aquarium {
  id: string;
  name: string;
  volumeLiters: number;
  description?: string;
  type: AquariumType;
}

export interface Fish {
  id: string;
  name: string;
  species: string;
  quantity: number;
  aquariumId: string;
}

export interface Coral {
  id: string;
  name: string;
  species: string;
  quantity: number;
  aquariumId: string;
}

export interface Measurement {
  aquariumId: string;
  timestamp: string;
  temperature: number;
  mg: number;
  kh: number;
  ca: number;
  ph: number;
  oxygen: number;
  pump: boolean;
}

export interface DateRange {
  from: string;
  to: string;
}
