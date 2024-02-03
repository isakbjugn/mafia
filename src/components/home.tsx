import { useUserStore } from "../store.ts";
import Duel from "./duel.tsx";

export const Home = () => {
  const user = useUserStore(state => state.user);

  return (
    <div>
      <h2>Velkommen, du er logget inn!</h2>
      {user && (
        <div>
          <p>Username: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <Duel />
    </div>
  );
};
