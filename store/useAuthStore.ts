// store/useAuthStore.ts
import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user"; // add role
} | null;

type AuthState = {
  user: User;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null, 

  login: (user) => set({ user }),

  logout: () => set({ user: null }),
}));
