import { create } from 'zustand';
import { getTargets, getUser, logout } from "./api/api.ts";

export type User = {
  id: number;
  name: string;
  email: string;
  lives: number;
  level: number;
}

type UserState = {
  user: User | undefined,
  setUser: (userData: User) => void,
  fetchUser: () => Promise<void>,
  logoutUser: () => void,
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (userData: User) => set({ user: userData }),
  fetchUser: async () => {
    const userData = await getUser();
    set({ user: userData });
  },
  logoutUser: async () => {
    await logout();
    set({ user: undefined });
  }
}));

export type Target = {
  id: number,
  name: string,
  photoHref: string
}

type TargetState = {
  targets: Target[] | undefined,
  setTargets: (targets: Target[]) => void,
  fetchTargets: () => Promise<void>,
};

export const useTargetStore = create<TargetState>((set) => ({
  targets: undefined,
  setTargets: (targets: Target[]) => set({ targets }),
  fetchTargets: async () => {
    const targetData = await getTargets();
    set({ targets: targetData.targets });
  }
}));
