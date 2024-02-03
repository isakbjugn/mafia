import { useUserStore } from "../store.ts";
import Duel from "./duel.tsx";

export const Home = () => {
  const user = useUserStore(state => state.user);

  if (!user) return (
    <div>
      <h1>Du må opprette bruker for å vise denne siden</h1>
      <a href={'/opprett'}>
        <button>Opprett bruker</button>
      </a>
    </div>
  )

  return (
    <div>
      <h1>Velkommen, du er logget inn!</h1>
      {user && (
        <div>
          <p>Username: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <h2>Duellresultater:</h2>
      <Duel />
    </div>
  );
};
