import { useUserStore } from "../store.ts";
import { Duel } from "./duel.tsx";
import { Logout } from "./logout.tsx";

export const Home = () => {
  const user = useUserStore(state => state.user);

  return (
    <div>
      {user && (<h2>Velkommen, {user.name}!</h2>)}
      <p>Du er nå logger inn.</p>
      <Duel/>
      <Logout/>
    </div>
  );
};
