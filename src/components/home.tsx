import { useUserStore } from "../store.ts";
import { Logout } from "./logout.tsx";
import { Messages } from "./messages.tsx";
import { Duel } from "./duel.tsx";

export const Home = () => {
  const user = useUserStore(state => state.user);

  return (
    <div>
      {user && (<h2>Velkommen, {user.name}!</h2>)}
      <p>Du er nå logger inn.</p>
      <Duel />
      <Messages />
      <Logout/>
    </div>
  );
};
