export type AquariumType = 'freshwater' | 'seawater';
export type CoralTyp = 0 | 1;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
}

export interface Aquarium {
  id: string;
  name: string;
  ownerId: string;
  depth: number;
  height: number;
  length: number;
  liters: number;
  hasFreshAir?: boolean;
  hasCo2System?: boolean;
  isReefTank?: boolean;
  hasWaveMachine?: boolean;
  type: AquariumType;
}

export interface Fish {
  id: string;
  name: string;
  inserted?: string;
  amount: number;
  description?: string;
  deathDate?: string;
  aquariumId: string;
}

export interface Coral {
  id: string;
  name: string;
  inserted?: string;
  amount: number;
  description?: string;
  coralTyp: CoralTyp;
  aquariumId: string;
}

export interface AquariumImage {
  id: string;
  aquariumId: string;
  name?: string;
  description?: string;
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
