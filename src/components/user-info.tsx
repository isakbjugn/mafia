import { useUserStore } from "../store.ts";

export const UserInfo = () => {
  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);

  return (
    <span>
      <h2>{user ? <span>{user.name}</span> : <span>⚠️ Ikke logget inn</span>}</h2>
      <button onClick={fetchUser}>Hent bruker</button>
    </span>
  )
}