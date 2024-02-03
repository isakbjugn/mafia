import { useUserStore } from "../store.ts";

export const Logout = () => {
  const logoutUser = useUserStore(state => state.logoutUser);

  return (
    <button onClick={logoutUser}>Logg ut</button>
  );
};
