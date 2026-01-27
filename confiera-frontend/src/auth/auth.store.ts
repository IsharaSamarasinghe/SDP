import { create } from "zustand";
import type { AuthUser } from "./auth.types";

type AuthState = {
  user: AuthUser | null;
  isBootstrapping: boolean;
  setUser: (u: AuthUser | null) => void;
  setBootstrapping: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isBootstrapping: true,
  setUser: (user) => set({ user }),
  setBootstrapping: (v) => set({ isBootstrapping: v }),
}));
