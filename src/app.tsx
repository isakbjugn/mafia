import './app.css'
import { Login } from "./components/login.tsx";
import Duel from "./components/duel.tsx";
import { UserInfo } from "./components/user-info.tsx";

function App() {
  /*const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);*/

  /*
  <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/opprett" element={<CreateUser />} />
        <Route path="/hjem" element={<Home />} />
      </Routes>
   */

  return (
    <div>
      <UserInfo />
      <Login />
      <h2>Duellresultat:</h2>
      <Duel />
    </div>
  );
}

export default App
