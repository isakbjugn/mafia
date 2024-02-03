import { create } from 'zustand';

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

const getUser = async (): Promise<User> => {
  const res = await fetch('http://localhost:3000/auth', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  if (!res.ok) {
    throw Error(res.status.toString() + ' ' + res.statusText);
  }
  return await res.json();
};
