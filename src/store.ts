import { create } from 'zustand';
import { getUser } from "./api/api.ts";

export type User = {
  id: number;
  name: string;
  email: string;
}

type UserState = {
  user: User | undefined,
  setUser: (userData: User) => void,
  fetchUser: () => Promise<void>,
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (userData: User) => set({ user: userData }),
  fetchUser: async () => {
    const userData = await getUser();
    set({ user: userData });
  },
}));

