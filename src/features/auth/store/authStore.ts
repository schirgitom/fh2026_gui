import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/shared/types';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set((state) => ({ ...state, user })),
      clearAuth: () => set({ token: null, user: null })
    }),
    { name: 'ams-auth' }
  )
);
