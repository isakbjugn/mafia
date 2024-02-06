import { useUserStore } from "../store.ts";
import { Logout } from "./logout.tsx";
import { Messages } from "./messages.tsx";
import { Duel } from "./duel.tsx";
import { Targets } from "./targets/targets.tsx";
import {HealthStatus} from "./health-status.tsx";

export const Home = () => {
  const user = useUserStore(state => state.user);

  return (
    <div>
      {user && (<h2>Velkommen, {user.name}!</h2>)}
      <p>Du er nå logget inn.</p>
      <HealthStatus/>
      {user && user.lives !== 0 &&
          <>
            <Duel />
            <Targets />
          </>
      }
      <Messages />
      <Logout/>
    </div>
  );
};
